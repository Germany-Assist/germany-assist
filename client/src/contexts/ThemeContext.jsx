import { createContext, useContext, useEffect, useState, useCallback } from "react";

/**
 * Available accent themes.
 * Each theme defines an RGB triplet for dark mode and light mode accents.
 * The values are applied as CSS variables on <html> so every Tailwind
 * "accent" utility (bg-accent, text-accent, border-accent/20, ...) updates instantly.
 */
export const ACCENT_THEMES = {
  cyan: { label: "Electric Cyan", dark: "34 211 238", light: "10 142 204" },
  violet: { label: "Violet Pulse", dark: "167 139 250", light: "124 92 250" },
  emerald: { label: "Emerald Grid", dark: "16 185 129", light: "5 150 105" },
  amber: { label: "Amber Signal", dark: "245 158 11", light: "217 119 6" },
  rose: { label: "Rose Beacon", dark: "244 63 94", light: "225 29 72" },
  sky: { label: "Sky Halo", dark: "56 189 248", light: "2 132 199" },
};

const DEFAULT_THEME = "cyan";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      !("theme" in localStorage)
    );
  });
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem("accentTheme");
    return stored && ACCENT_THEMES[stored] ? stored : DEFAULT_THEME;
  });

  // Apply dark/light mode (same behaviour as the old ThemeSwitch)
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Apply the accent theme CSS variables
  useEffect(() => {
    const palette = ACCENT_THEMES[theme] || ACCENT_THEMES[DEFAULT_THEME];
    const root = document.documentElement;
    root.style.setProperty("--accent-rgb", palette.dark);
    root.style.setProperty("--accent-soft-rgb", palette.light);
    root.setAttribute("data-accent-theme", theme);
    localStorage.setItem("accentTheme", theme);
  }, [theme]);

  const toggleMode = useCallback(() => setIsDark((v) => !v), []);
  const setTheme = useCallback((t) => {
    if (ACCENT_THEMES[t]) setThemeState(t);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleMode, theme, setTheme, themes: ACCENT_THEMES }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
