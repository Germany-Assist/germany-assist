import React, { useState } from "react";
import {
  Mail,
  Phone,
  Lock,
  Building2,
  Info,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { createServiceProvider } from "../../../../../api/adminApis";
import StatusModal from "../../../../../components/ui/StatusModal";
import { getErrorMessage } from "../../../../../api/errorMessages";

const CreateNewSP = () => {
  const [statusCon, setStatusCon] = useState(null);
  const [formData, setFormData] = useState({
    name: "King Technology",
    about: "We build scalable enterprise solutions...",
    description:
      "We build scalable enterprise solutions with cutting-edge technology, serving clients globally since 2015.",
    email: "sample@provider.com",
    phone_number: "+1 (555) 123-4567",
    password: "Aa@123456",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createServiceProvider(formData);
      if (res)
        setStatusCon({
          isOpen: true,
          message: "Successfully created Service Provider",
          onClose() {
            setStatusCon(null);
          },
        });
    } catch (error) {
      setStatusCon({
        isOpen: true,
        type: "error",
        message: getErrorMessage(error),
        onClose() {
          setStatusCon(null);
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 text-slate-900 dark:text-white transition-colors duration-500">
      <StatusModal {...statusCon} />
      {/* Top Navigation Bar */}
      <nav className="border-b border-light-700 dark:border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-dark-950/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-light-900 dark:hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-sm font-black uppercase tracking-widest">
            New Provider
          </h2>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white transition-all active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none"
        >
          Save Profile
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-8 py-12">
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tight uppercase mb-4">
            Company Profile
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-light max-w-2xl">
            This information will be displayed publicly to users. Ensure the
            details reflect the professional identity of the organization.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-16"
        >
          {/* Left Column: Basic Identity */}
          <div className="lg:col-span-2 space-y-10">
            {/* Identity Group */}
            <section className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-tighter text-accent border-b border-accent/20 pb-2 w-fit">
                General Identity
              </h3>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Organization Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-3xl font-bold bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-200 dark:placeholder:text-white/10 p-0"
                  placeholder="Enter Name..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Short Tagline
                </label>
                <input
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  className="w-full text-xl font-light bg-transparent border-none outline-none focus:ring-0 text-slate-600 dark:text-slate-300 p-0"
                  placeholder="Briefly describe the mission..."
                />
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Full Description
                </label>
                <textarea
                  name="description"
                  rows="8"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full text-lg font-light bg-light-900/30 dark:bg-white/5 rounded-3xl p-6 border border-light-700 dark:border-white/10 focus:border-accent outline-none transition-all resize-none leading-relaxed"
                  placeholder="Tell the story of the company..."
                />
              </div>
            </section>
          </div>

          {/* Right Column: Contact & Security */}
          <div className="lg:col-span-1 space-y-10">
            <section className="space-y-8 bg-light-900/20 dark:bg-white/5 p-8 rounded-[2.5rem] border border-light-700 dark:border-white/10">
              <h3 className="text-xs font-black uppercase tracking-tighter text-accent">
                Contact Details
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Mail size={12} /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-light-700 dark:border-white/10 py-2 outline-none focus:border-accent transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Phone size={12} /> Phone
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-light-700 dark:border-white/10 py-2 outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>

              <div className="pt-6">
                <h3 className="text-xs font-black uppercase tracking-tighter text-red-500 mb-6">
                  Security
                </h3>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Lock size={12} /> Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-light-700 dark:border-white/10 py-2 outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>
            </section>

            <div className="px-4">
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                By saving this profile, you grant the organization access to the
                service provider dashboard. Ensure all credentials are secure.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateNewSP;
