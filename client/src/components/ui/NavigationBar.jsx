import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProfile } from "../../contexts/ProfileContext";
import ProfileAvatar from "./ProfileAvatar";
import logo from "../../assets/brand/logo.png";
import NotificationBell from "./NotificationBell";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Jobs", path: "/jobs", badge: "Soon" },
  { label: "About", path: "/about" },
];

const LINK_BASE =
  "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

const NavigationBar = () => {
  const { profile } = useProfile();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = NAV_LINKS.filter(
    (link) => !profile || link.path !== "/about",
  );

  const isActivePath = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const getLinkStyles = (path) =>
    isActivePath(path)
      ? `${LINK_BASE} text-sky-800 bg-sky-100`
      : `${LINK_BASE} text-slate-600 hover:text-slate-900 hover:bg-slate-100`;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 rounded-sm"
            aria-label="Germany Assist home"
          >
            <img src={logo} alt="Germany Assist" className="max-w-[110px]" />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {links.map((link) => (
              <Link key={link.path} to={link.path} className={getLinkStyles(link.path)}>
                {link.label}
                {link.badge && (
                  <span className="ml-2 bg-sky-100 text-sky-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {profile ? (
              <div className="flex items-center gap-4">
                <NotificationBell />
                <ProfileAvatar
                  navDir={"/dashboard"}
                  className={"relative w-14 h-14 max-w-14"}
                />
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  to="/signin"
                  className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-semibold text-white bg-sky-700 rounded-full hover:bg-sky-800 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="lg:hidden p-2.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-700"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={menuOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-slate-200 bg-white"
        >
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActivePath(link.path)
                    ? "text-sky-800 bg-sky-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="ml-2 bg-sky-100 text-sky-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            {!profile && (
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-slate-200">
                <Link
                  to="/signin"
                  onClick={closeMenu}
                  className="px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="px-4 py-3 text-center text-sm font-semibold text-white bg-sky-700 rounded-xl hover:bg-sky-800 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavigationBar;
