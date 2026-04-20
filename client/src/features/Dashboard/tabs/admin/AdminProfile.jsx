import React, { useState } from "react";
import { useProfile } from "../../../../contexts/ProfileContext";
import { uploadProfileImage } from "../../../../api/profile";

const AdminProfile = () => {
  const { profile: userProfile } = useProfile();
  const [profile, setProfile] = useState(userProfile);
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadProfileImage(formData);
      if (res) setProfile({ ...profile, image: res.publicUrls[0].url });
    }
  };

  return (
    <div className="flex-1 flex  h-full justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl min-w-full p-8 flex flex-col md:flex-row gap-8">
        {/* Left: Avatar & Info */}
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="relative w-64 h-64">
            <div className="w-full h-full rounded-full overflow-hidden shadow-lg border-4 border-white hover:scale-105 transition-transform">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-3xl font-bold">
                  {profile.firstName[0].toUpperCase()}
                  {profile.lastName[0].toUpperCase()}
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-600 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              ✏️
            </label>
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-gray-500">{profile.role}</p>
          <p
            className={`mt-1 font-medium ${
              profile.isVerified ? "text-green-500" : "text-red-500"
            }`}
          >
            {profile.isVerified ? "Verified" : "Not Verified"}
          </p>
        </div>

        {/* Right: Read-only Info */}
        <div className="md:w-2/3 flex flex-col justify-start">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">
            Profile Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm mb-1">First Name</span>
              <span className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                {profile.firstName}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-500 text-sm mb-1">Last Name</span>
              <span className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                {profile.lastName}
              </span>
            </div>

            <div className="flex flex-col md:col-span-2">
              <span className="text-gray-500 text-sm mb-1">Email</span>
              <span className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                {profile.email}
              </span>
            </div>

            <div className="flex flex-col md:col-span-2">
              <span className="text-gray-500 text-sm mb-1">Date of Birth</span>
              <span className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                {profile.dob || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
