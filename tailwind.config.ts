import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "18": "repeat(18, minmax(0, 1fr))",
      },
      colors: {
        background: "#07090e",
        surface: {
          DEFAULT: "#0c1017",
          elevated: "#121824",
          overlay: "#182232",
          subtle: "#0e131d",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.06)",
          medium: "rgba(255, 255, 255, 0.12)",
          highlight: "rgba(255, 255, 255, 0.22)",
        },
        category: {
          alkali: "#DC4C4C",
          alkaline: "#D97736",
          transition: "#3B82C4",
          postTransition: "#2DA599",
          metalloid: "#2CA779",
          nonmetal: "#8461D4",
          noble: "#D24792",
          lanthanide: "#646DC7",
          actinide: "#CC3E67",
          unknown: "#758398",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)",
        "card-hover": "0 12px 32px -4px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.12)",
        modal: "0 24px 64px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "liquid-shimmer": "shimmer 2.5s ease-in-out infinite",
        "gas-float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
