import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Briefcase,
  Home as HomeIcon,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const SERVICES = [
  {
    icon: ShieldCheck,
    title: "Visa & Blue Card",
    description:
      "Full legal support for work visas and EU Blue Cards — paperwork, appointments, and approvals handled end to end.",
    featured: true,
  },
  {
    icon: Briefcase,
    title: "Executive Job Matching",
    description:
      "We connect you with Germany's hidden champions and DAX-listed employers.",
  },
  {
    icon: HomeIcon,
    title: "Housing Search",
    description: "Personalized apartment search before you even land.",
  },
  {
    icon: GraduationCap,
    title: "Language & Integration",
    description: "Cultural coaching and German classes that actually stick.",
  },
];

export default function ServiceGrid() {
  return (
    <section
      className="py-20 max-w-7xl mx-auto px-6"
      aria-labelledby="services-title"
    >
      <div className="max-w-2xl mb-12">
        <h2
          className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
          id="services-title"
        >
          Everything you need to land well
        </h2>
        <p className="mt-4 text-slate-600 text-lg leading-relaxed">
          One platform for the entire move. Every service is delivered by a
          verified specialist and covered by our satisfaction guarantee.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <Link
              key={service.title}
              to="/services"
              className={`group bg-white border border-slate-200 rounded-2xl p-8 transition-all duration-300 ease-elegant hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)] hover:border-sky-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
                service.featured ? "md:row-span-2 flex flex-col" : ""
              }`}
            >
              <div
                className="w-12 h-12 bg-sky-100 rounded-xl mb-6 flex items-center justify-center text-sky-700 group-hover:bg-sky-700 group-hover:text-white transition-colors duration-300"
                aria-hidden="true"
              >
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {service.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                Learn more <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
