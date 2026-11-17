import { Link } from "react-router-dom";
import {
  Plane,
  FileCheck2,
  Home as HomeIcon,
  Briefcase,
  BadgeCheck,
} from "lucide-react";

const CHECKLIST = [
  { icon: BadgeCheck, label: "Visa & Blue Card approval" },
  { icon: Plane, label: "Relocation logistics handled" },
  { icon: HomeIcon, label: "Housing secured before landing" },
  { icon: Briefcase, label: "Employer introductions" },
  { icon: FileCheck2, label: "City registration support" },
];

export default function Hero() {
  return (
    <section
      className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden"
      aria-label="Hero section - Introduction and main call to action"
    >
      {/* soft background wash */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-white pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 lg:gap-12 items-center">
        <div className="z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 mb-6"
            aria-live="polite"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600" />
            </span>
            <span className="text-sky-800 text-xs font-semibold tracking-wide uppercase">
              Trusted by 2,400+ professionals
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.08] tracking-tight">
            Relocate to Germany{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
              without the maze
            </span>
          </h1>

          <p className="mt-6 text-slate-600 text-lg max-w-md leading-relaxed">
            Visa support, housing, and employer connections — verified
            specialists handle every step, from application to your first
            day at work.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/services"
              className="px-7 py-3.5 bg-sky-700 text-white font-semibold rounded-xl hover:bg-sky-800 hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              Explore services
            </Link>
            <Link
              to="/signup"
              className="px-7 py-3.5 border border-slate-300 text-slate-700 font-semibold rounded-xl bg-white hover:bg-slate-50 hover:border-slate-400 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              Get started free
            </Link>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4" aria-label="Platform statistics">
            {[
              { value: "2,400+", label: "Relocations completed" },
              { value: "98%", label: "Visa approval rate" },
              { value: "120+", label: "Verified specialists" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-bold text-slate-900 tabular-nums">
                    {stat.value}
                  </span>
                  <span className="block text-xs uppercase tracking-widest text-slate-500 mt-1">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Relocation progress card */}
        <div className="relative z-10 hidden lg:block" aria-hidden="true">
          <div className="relative max-w-md ml-auto">
            <div className="absolute -top-6 -left-6 w-56 bg-white rounded-2xl border border-slate-200 shadow-[0_16px_40px_rgba(15,23,42,0.10)] p-5 rotate-[-3deg]">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                New offer
              </p>
              <p className="text-slate-900 font-bold text-sm mb-2">
                Senior Software Engineer
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sky-700 font-bold text-sm">
                  €85k - €105k
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
                  Berlin
                </span>
              </div>
            </div>

            <div className="relative bg-white rounded-2xl border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-7">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-bold text-slate-900">
                  Your relocation plan
                </p>
                <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-2.5 py-1 rounded-full uppercase tracking-wide">
                  In progress
                </span>
              </div>
              <ul className="space-y-3.5" role="progressbar" aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} aria-label="Relocation progress">
                {CHECKLIST.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="flex items-center gap-3">
                      <span
                        className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                          index < 4
                            ? "bg-sky-700 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2.2} />
                      </span>
                      <span
                        className={`text-sm ${
                          index < 4 ? "text-slate-700" : "text-slate-400"
                        }`}
                      >
                        {item.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 w-[80%]" />
                </div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-widest mt-2">
                  4 of 5 steps complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
