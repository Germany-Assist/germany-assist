import React, { useEffect, useState } from "react";

function ThemeSwitch() {
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" || !("theme" in localStorage)
    );
  });
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);
  return (
    <div>
      <button
        onClick={() => setIsDark(!isDark)}
        className="p-2.5 rounded-xl bg-light-900 dark:bg-white/5 border border-light-700 dark:border-white/10 text-lg hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Toggle Theme"
      >
        {isDark ? "🌙" : "☀️"}
      </button>
    </div>
  );
}

export default ThemeSwitch;
