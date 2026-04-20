module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          950: "#04080f", // Deepest background
          900: "#3f3f3fff", // Section background
          800: "#313131ff", // Card background
          700: "#1f1f1f", // Borders / Hover states
        },
        light: {
          950: "#efeee5", // The Page Background (Matches across all pages)
          900: "#e5e4da", // HUD/Section backgrounds
          800: "#f5f4f0", // Card surfaces
          700: "#d6d3c4", // Borders
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
      },
      transitionTimingFunction: {
        elegant: "cubic-bezier(0.23, 1, 0.32, 1)", // For smooth HUD interactions
      },
    },
  },
  plugins: [],
};
