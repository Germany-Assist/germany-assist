import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

function ThemeSwitch() {
  const { isDark, toggleMode } = useTheme();

  return (
    <div>
      <button
        onClick={toggleMode}
        className="p-2.5 rounded-xl bg-light-900 dark:bg-white/5 border border-light-700 dark:border-white/10 text-lg hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Toggle Theme"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? "🌙" : "☀️"}
      </button>
    </div>
  );
}

export default ThemeSwitch;
