import { Link, useLocation } from "react-router-dom";
import { useProfile } from "../../contexts/ProfileContext";
import ProfileAvatar from "./ProfileAvatar";
import logo from "../../assets/brand/logo.png";
import ThemeSwitch from "./ThemeSwitch";
import NotificationBell from "./NotificationBell";

const NavigationBar = () => {
  const { profile } = useProfile();
  const location = useLocation();
  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const getLinkStyles = (path) => {
    const baseStyles =
      "relative font-medium transition-all duration-300 px-4 py-2 rounded-full text-sm tracking-wide";
    if (isActivePath(path)) {
      return `${baseStyles} text-accent bg-accent/10 dark:bg-white/5 border border-accent/20 dark:border-white/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]`;
    }
    return `${baseStyles} text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5`;
  };

  //testing
  return (
    <header className="pt-7 z-50 w-full px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-light-800/80 dark:bg-dark-800/80 backdrop-blur-md border border-light-700 dark:border-dark-700 shadow-2xl rounded-2xl px-6 py-3 transition-all duration-500">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="max-w-[120px] dark:brightness-110 transition-all"
              />
            </Link>

            {/* Desktop Nav - Centered */}
            <nav className="hidden lg:flex items-center space-x-1 p-1 bg-light-900/50 dark:bg-black/20 rounded-full border border-light-700 dark:border-white/5">
              <Link to="/" className={getLinkStyles("/")}>
                Home
              </Link>
              <Link to="/services" className={getLinkStyles("/services")}>
                Services
              </Link>
              <Link to="/jobs" className={getLinkStyles("/jobs")}>
                Jobs
                <span className="ml-2 bg-accent/10 text-accent text-[10px] px-2 py-0.5 rounded-full border border-accent/20 uppercase font-bold">
                  Soon
                </span>
              </Link>
              <Link to="/about" className={getLinkStyles("/about")}>
                About
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Elegant Integrated Theme Toggle */}
              <ThemeSwitch />
              <div className="h-6 w-[1px] bg-light-700 dark:bg-white/10 mx-1" />

              {/* Auth Section */}
              {profile ? (
                <div className="flex items-center gap-4">
                  <NotificationBell />
                  <ProfileAvatar
                    navDir={"/dashboard"}
                    className={"relative w-14 h-14 max-w-14"}
                  />
                </div>
              ) : (
                <>
                  <Link to="/signup">
                    <button className="bg-accent text-black text-sm font-bold px-6 py-2 rounded-full transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-95">
                      sign up
                    </button>
                  </Link>
                  <Link to="/signin">
                    <button className="bg-accent text-black text-sm font-bold px-6 py-2 rounded-full transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-95">
                      Log In
                    </button>
                  </Link>
                </>
              )}

              {/* Mobile Menu */}
              <button className="lg:hidden p-2 text-slate-500 dark:text-gray-400 bg-light-900 dark:bg-white/5 rounded-xl border border-light-700 dark:border-white/10">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
// testing if the bar is ok 123
export default NavigationBar;
