import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Facebook, Instagram } from 'lucide-react';
import Logo from './logo';

//FOOTER LINKS
const FOOTER_LINKS = {
  Company: [
    { name: 'About Us', href: '#' },
    { name: 'Services', href: '#' },
    { name: 'Job', href: '#' },
  ],
  Legal: [
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ],
};

//SOCIAL LINKS


const SOCIAL_LINKS = [
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Instagram", href: "#", icon: Instagram },
];

function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light-800/80 dark:bg-dark-800/80 text-black dark:text-white py-12 px-6 md:px-16 border-t border-zinc-200 dark:border-zinc-800 w-full transition-colors">
  <div className="max-w-7xl mx-auto">

    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

      {/* Logo Column */}
      <div className="col-span-1 flex justify-center md:justify-start">
        <Logo />
      </div>

      {/* Link Columns */}
      {Object.entries(FOOTER_LINKS).map(([title, links]) => (
        <div key={title} className="col-span-1">
          <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">{title}</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            {links.map(link => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="hover:text-[#22D3EE] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Social Column */}
      <div className="col-span-1 md:text-right text-center">
        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider flex justify-center">Connect</h4>
        <div className="flex gap-4 justify-center md:justify-center">
          {SOCIAL_LINKS.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-[#22D3EE] text-black transition-transform duration-300 ease-in-out hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>

    </div>

    {/* Bottom Bar */}
    <div className="pt-10 border-t border-zinc-500 dark:border-gray-400 flex justify-center items-center">
      <p className="text-gray-500 text-xs uppercase tracking-widest">
        © {new Date().getFullYear()} Germany Assist
      </p>
    </div>

  </div>
</footer>
  );
}

export default FooterSection;
