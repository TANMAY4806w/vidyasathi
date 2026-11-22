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
        // Universal educational colors
        edu: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          primary: "#4F46E5",
          primaryHover: "#4338CA",
          primaryLight: "#EEF2FF",
          amber: "#F59E0B",
          amberLight: "#FEF3C7",
          sky: "#0284C7",
          skyLight: "#E0F2FE",
          emerald: "#059669",
          emeraldLight: "#ECFDF5",
          rose: "#E11D48",
          roseLight: "#FFE4E6",
        },
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#4F46E5",
          600: "#4338CA",
          700: "#3730A3",
          800: "#312E81",
          900: "#1E1B4B",
        },
        warn: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
        success: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        danger: {
          50: "#FFF1F2",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
        },
        surface: "#F8FAFC",
        canvas: "#FFFFFF",
        ink: "#0F172A",
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: [
          "Inter Variable",
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 2px 8px -1px rgba(15, 23, 42, 0.06), 0 1px 3px -1px rgba(15, 23, 42, 0.04)",
        card: "0 4px 16px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)",
        elevated: "0 10px 25px -3px rgba(79, 70, 229, 0.15), 0 4px 6px -2px rgba(79, 70, 229, 0.08)",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "bounce-once": {
          "0%, 100%": { transform: "translateY(0)" },
          "40%":      { transform: "translateY(-8px)" },
          "60%":      { transform: "translateY(-3px)" },
        },
        "pulse-ring": {
          "0%":        { transform: "scale(1)", opacity: "1" },
          "75%, 100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "progress-grow": {
          "0%":   { width: "0%" },
          "100%": { width: "var(--tw-progress-w, 100%)" },
        },
      },
      animation: {
        "fade-up":        "fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-1":      "fade-up 0.4s 0.07s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-2":      "fade-up 0.4s 0.14s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-3":      "fade-up 0.4s 0.21s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":        "fade-in 0.25s ease both",
        "scale-in":       "scale-in 0.3s cubic-bezier(0.16,1,0.3,1) both",
        "bounce-once":    "bounce-once 0.5s ease both",
        "pulse-ring":     "pulse-ring 1.4s cubic-bezier(0,0,0.2,1) infinite",
        "progress-grow":  "progress-grow 0.7s 0.1s cubic-bezier(0.4,0,0.2,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
