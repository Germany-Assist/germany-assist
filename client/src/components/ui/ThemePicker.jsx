import React from "react";
import { useTheme, ACCENT_THEMES } from "../../contexts/ThemeContext";

/**
 * Small palette of accent swatches shown in the navigation bar.
 * Lets users pick their own accent theme; the choice is persisted
 * by ThemeContext (localStorage) and applied app-wide via CSS variables.
 */
const swatchStyle = (rgb) => ({ backgroundColor: `rgb(${rgb})` });

function ThemePicker() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div
      className="flex items-center gap-1.5 p-1.5 rounded-xl bg-light-900/60 dark:bg-white/5 border border-light-700 dark:border-white/10"
      role="group"
      aria-label="Accent theme picker"
    >
      {Object.entries(themes).map(([key, t]) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={
            theme === key
              ? "w-5 h-5 rounded-full ring-2 ring-offset-1 ring-light-text dark:ring-white ring-offset-light-900 dark:ring-offset-dark-900 transition-transform scale-110"
              : "w-5 h-5 rounded-full opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-200"
          }
          style={swatchStyle(t.dark)}
          title={t.label}
          aria-label={`${t.label} accent theme`}
          aria-pressed={theme === key}
        />
      ))}
    </div>
  );
}

export default ThemePicker;
