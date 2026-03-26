import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B4332",
        secondary: "#2D6A4F",
        accent: "#D97706",
        "accent-hover": "#B45309",
        light: "#D8F3DC",
        cream: "#FFF8E7",
        navy: "#0F172A",
        "navy-dark": "#080D19",
        "navy-light": "#1E293B",
        slate: {
          850: "#172033",
          950: "#0B1121",
        },
      },
      fontFamily: {
        display: ["Lora", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.7s ease-out forwards",
        "fade-in-up-delay": "fadeInUp 0.7s ease-out 0.15s forwards",
        "fade-in-up-delay-2": "fadeInUp 0.7s ease-out 0.3s forwards",
        "slide-in-right": "slideInRight 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
