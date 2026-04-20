import React, { useState } from "react";
import { useProfile } from "../../../../contexts/ProfileContext";
import { uploadProfileImage } from "../../../../api/profile";
import {
  Camera,
  Heart,
  ShoppingBag,
  CheckCircle2,
  Inbox,
  User,
  Plus,
} from "lucide-react";
import StatusModal from "../../../../components/ui/StatusModal";

const UserProfile = () => {
  const { profile: contextProfile } = useProfile();
  const [profile, setProfile] = useState(contextProfile);

  const [modal, setModal] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await uploadProfileImage(formData);
      if (res) {
        setProfile({ ...profile, image: res.publicUrls[0].url });
        setModal({ isOpen: true, type: "success", message: "Photo updated!" });
      }
    } catch (err) {
      setModal({ isOpen: true, type: "error", message: "Upload failed." });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] dark:bg-zinc-950 p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HERO SECTION */}
        <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-48 h-48 rounded-[3rem] bg-slate-100 dark:bg-zinc-800 overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800 transition-all duration-500 group-hover:scale-[1.03]">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-slate-300">
                  {profile?.firstName?.[0]}
                  {profile?.lastName?.[0]}
                </div>
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={32} />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            {profile?.isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-2xl border-4 border-white dark:border-zinc-900">
                <CheckCircle2 size={20} />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              {profile?.role || "Guest"}
            </span>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white mt-4 mb-2 tracking-tight">
              {profile?.firstName || "Welcome"}{" "}
              <span className="text-blue-600">
                {profile?.lastName || "User"}
              </span>
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 font-medium text-lg">
              {profile?.email || "No email provided"}
            </p>
          </div>
        </section>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details Column */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-zinc-800">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              Details
            </h3>
            <div className="space-y-6">
              <DetailItem
                label="Full Name"
                value={
                  `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
                  "N/A"
                }
              />
              <DetailItem
                label="Account Type"
                value={profile?.relatedType || "Standard"}
              />
              <DetailItem label="Member ID" value={profile?.id || "---"} />
              <DetailItem
                label="Birth Date"
                value={profile?.dob || "Not specified"}
              />
            </div>
          </div>

          {/* Favorites Column */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-zinc-800">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              Favorites
            </h3>
            <div className="space-y-4">
              {profile?.favorites?.length > 0 ? (
                profile.favorites.map((fav, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 transition-all"
                  >
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {fav?.service?.title}
                    </h4>
                    <p className="text-sm text-slate-500 line-clamp-1">
                      {fav?.service?.description}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<Heart size={24} />}
                  text="Nothing saved yet"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <StatusModal
        isOpen={modal.isOpen}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  );
};

/* --- SHARED COMPONENTS --- */

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">
      {label}
    </p>
    <p className="text-lg font-bold text-slate-800 dark:text-white">{value}</p>
  </div>
);

const EmptyState = ({ icon, text }) => (
  <div className="flex flex-col items-center justify-center py-12 text-slate-300 dark:text-zinc-700">
    <div className="mb-3">{icon}</div>
    <p className="text-sm font-bold uppercase tracking-widest">{text}</p>
  </div>
);

export default UserProfile;
