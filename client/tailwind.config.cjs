module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        outfit: ["Outfit", "sans-serif"],
      },
      colors: {
        dark: {
          // Dark mode removed: dark-* tokens mirror the light scale so any
          // legacy `bg-dark-*` usage renders as the light surface.
          950: "#ffffff",
          900: "#f1f5f9",
          800: "#f8fafc",
          700: "#e2e8f0",
        },
        light: {
          950: "#ffffff", // The Page Background (white, light mode only)
          900: "#f1f5f9", // HUD/Section backgrounds
          800: "#f8fafc", // Card surfaces
          700: "#e2e8f0", // Borders
          text: "#1e293b", // Slate 800 for elegant readability
        },
        // --- Common Accents ---
        accent: {
          DEFAULT: "#22d3ee", // Electric Cyan (Dark Mode)
          soft: "#0a8eccff", // Azure/Sky (Light Mode)
        },
      },
      animation: {
        float: "floating 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        marquee: "marquee 20s linear infinite",
        "pulse-ring": "pulseRing 2.5s ease-out infinite",
        "loading-bar": "loading-bar 1.5s infinite ease-in-out", // Added for HUD
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(200%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        floating: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "loading-bar": {
          // Added for HUD
          "0%": { width: "0%", left: "0%" },
          "50%": { width: "100%", left: "0%" },
          "100%": { width: "0%", left: "100%" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.33)", opacity: "0.7" },
          "80%, 100%": { transform: "scale(4)", opacity: "0" },
        },
      },
      transitionTimingFunction: {
        elegant: "cubic-bezier(0.23, 1, 0.32, 1)", // For smooth HUD interactions
      },
    },
  },
  plugins: [],
};
