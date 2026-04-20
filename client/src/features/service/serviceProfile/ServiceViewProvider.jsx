import React, { useEffect, useState } from "react";
import { ChevronRight, Loader2, ShieldCheck, Mail, Globe } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import adminApis from "../../../api/adminApis";
import ImageGallery from "../../../components/ui/ImageGallery";
import NavigationBar from "../../../components/ui/NavigationBar";
import StatusModal from "../../../components/ui/StatusModal";
import { providerPrivateView } from "../../../api/serviceProviderApis";

const ServiceViewProvider = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await providerPrivateView(id);
        setData(res);
      } catch (err) {
        console.error("Admin Fetch Error:", err);
        setError(err.response?.data?.message || "Internal server error.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light-950 dark:bg-dark-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <StatusModal
        isOpen={true}
        onClose={() => navigate(-1)}
        type={"error"}
        message={error}
      />
    );
  }

  /* -------------------- Data Normalization -------------------- */
  // Handle both lowercase 'assets' and uppercase 'Assets' from Sequelize aliases
  const galleryAssets =
    (data.assets || data.Assets || []).length > 0
      ? data.assets || data.Assets
      : [
          {
            url: "https://via.placeholder.com/1200x600?text=No+Media+Uploaded",
            mediaType: "image",
          },
        ];

  const options =
    data.type === "oneTime"
      ? data.variants || data.Variants || []
      : data.timelines || data.Timelines || [];

  return (
    <div className="min-h-screen bg-light-950 dark:bg-dark-950 text-slate-900 dark:text-slate-100 pb-20 relative transition-colors duration-500">
      <NavigationBar />

      {/* Breadcrumb Header - Read Only */}
      <nav className="border-b border-light-700 dark:border-white/5 bg-light-900/50 dark:bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              Admin Console
            </span>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-slate-900 dark:text-white font-bold tracking-tight">
              Reviewing: {data.category?.label || "Service"}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <ShieldCheck size={14} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase text-amber-500 tracking-tighter">
              Audit Mode
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Title & Provider */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter capitalize mb-4">
            {data.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
                {data.ServiceProvider?.name?.charAt(0)}
              </div>
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                By{" "}
                <span className="text-slate-900 dark:text-white">
                  {data.ServiceProvider?.name}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 border-l border-slate-200 dark:border-white/10 pl-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                <Mail size={12} /> {data.ServiceProvider?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Media Section - The Gallery works here now */}
        <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-light-700 dark:border-white/5 mb-16 aspect-video lg:aspect-auto">
          <ImageGallery assets={galleryAssets} />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-8 flex items-center gap-2">
                Description Detail
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xl md:text-2xl font-light leading-relaxed whitespace-pre-line break-words">
                {data.description}
              </p>
            </section>

            <section className="pt-10 border-t border-light-700 dark:border-white/5">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">
                Service Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <p className="text-4xl font-black">{data.views || 0}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Platform Views
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-black text-amber-500">
                    {data.rating || 0}★
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Avg Rating
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-black">
                    {data.totalReviews || 0}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Total Reviews
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Sidebar - Simplified for Admin */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-white/5 border border-light-700 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl">
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2">
                  Price Configurations
                </p>
                <h2 className="text-2xl font-black uppercase">
                  {data.type === "oneTime"
                    ? "Fixed Variants"
                    : "Timeline Based"}
                </h2>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {options.map((option) => (
                  <div
                    key={option.id}
                    className="p-5 rounded-2xl border border-light-700 dark:border-white/10 bg-light-50 dark:bg-black/20"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-bold tracking-tight leading-tight">
                        {option.label}
                      </span>
                      <span className="text-lg font-black text-emerald-500">
                        ${option.price}
                      </span>
                    </div>

                    {data.type === "timeline" && (
                      <div className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-2">
                        {new Date(option.startDate).toLocaleDateString()} —{" "}
                        {new Date(option.endDate).toLocaleDateString()}
                      </div>
                    )}

                    {option.isArchived && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-red-500/10 text-red-500 text-[8px] font-black uppercase rounded-md">
                        Archived
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-light-700 dark:border-white/5">
                <div className="flex items-center gap-3 text-slate-400">
                  <Globe size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Public Service Profile
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ServiceViewProvider;
