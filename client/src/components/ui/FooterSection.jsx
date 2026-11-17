import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Facebook, Instagram } from "lucide-react";
import Logo from "./logo";

//FOOTER LINKS
const FOOTER_LINKS = {
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Jobs", href: "/jobs" },
  ],
  Legal: [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
  ],
};

//SOCIAL LINKS

const SOCIAL_LINKS = [
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Instagram", href: "#", icon: Instagram },
];

function FooterSection() {
  return (
    <footer className="bg-white text-slate-700 py-14 px-6 md:px-16 border-t border-slate-200 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Logo Column */}
          <div className="col-span-1 flex justify-center md:justify-start">
            <Logo />
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="col-span-1 text-center md:text-left">
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-900">
                {title}
              </h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="hover:text-sky-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 rounded-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Column */}
          <div className="col-span-1">
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-900 text-center md:text-left">
              Connect
            </h4>
            <div className="flex gap-3 justify-center md:justify-start">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-sky-700 text-white transition-all duration-300 hover:bg-sky-800 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon
                      className="w-5 h-5"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} Germany Assist
          </p>
          <p className="text-slate-400 text-xs">
            Relocation services for Germany, handled end to end.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
