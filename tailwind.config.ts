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
        // ── Primary Brand (Duolingo-strength cobalt for trust & action) ──
        brand: {
          50:  "#EEF1FF",
          100: "#E0E5FF",
          200: "#C3CCFE",
          300: "#9BA8FC",
          400: "#7080F9",
          500: "#4353FF", // primary CTA
          600: "#3340E0",
          700: "#2730BF",
          800: "#1E269A",
          900: "#171E7A",
        },
        // ── Neutral canvas (Notion-inspired warm off-white) ──
        surface: "#F7F7F5",
        canvas: "#FFFFFF",
        ink: "#1A1A2E",         // rich navy-black, not pure #000
        "ink-2": "#3D3D56",     // secondary text
        "ink-3": "#7E7E9A",     // muted / captions
        border: "#E8E8EF",
        "border-strong": "#C8C8D8",
        // ── Semantic accent palette ──
        success: {
          50:  "#ECFDF5",
          500: "#10B981",        // Emerald – typical / pass
          700: "#047857",
        },
        warn: {
          50:  "#FFFBEB",
          500: "#F59E0B",        // Marigold amber – watchlist
          700: "#B45309",
        },
        danger: {
          50:  "#FFF1F3",
          500: "#F43F5E",        // Rose – high attention (compassionate, not alarming red)
          700: "#BE123C",
        },
        sky: {
          50:  "#F0F9FF",
          500: "#0EA5E9",        // Sky – active / dysgraphia
          700: "#0369A1",
        },
        // Keep legacy edu.* keys for existing components
        edu: {
          50:  "#F7F7F5",
          100: "#EFEFED",
          200: "#E8E8EF",
          300: "#C8C8D8",
          400: "#9898B0",
          500: "#7E7E9A",
          600: "#3D3D56",
          700: "#2D2D48",
          800: "#1E1E38",
          900: "#1A1A2E",
          primary:      "#4353FF",
          primaryHover: "#3340E0",
          primaryLight: "#EEF1FF",
          amber:        "#F59E0B",
          amberLight:   "#FFFBEB",
          sky:          "#0EA5E9",
          skyLight:     "#F0F9FF",
          emerald:      "#10B981",
          emeraldLight: "#ECFDF5",
          rose:         "#F43F5E",
          roseLight:    "#FFF1F3",
        },
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
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter:  "-0.03em",
        tight:    "-0.02em",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        // Paper-floating — no heavy drop shadows
        xs:       "0 1px 2px 0 rgba(26,26,46,0.04)",
        soft:     "0 2px 8px -1px rgba(26,26,46,0.06), 0 1px 3px -1px rgba(26,26,46,0.04)",
        card:     "0 4px 16px -2px rgba(26,26,46,0.07), 0 2px 6px -1px rgba(26,26,46,0.04)",
        elevated: "0 8px 24px -4px rgba(67,83,255,0.14), 0 2px 8px -2px rgba(67,83,255,0.08)",
        "brand-glow": "0 0 0 3px rgba(67,83,255,0.18)",
        "success-glow": "0 0 0 3px rgba(16,185,129,0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "progress-fill": {
          "0%":   { width: "0%" },
          "100%": { width: "var(--progress-w)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "bounce-once": {
          "0%, 100%": { transform: "translateY(0)" },
          "40%":      { transform: "translateY(-8px)" },
          "60%":      { transform: "translateY(-4px)" },
        },
        "ping-soft": {
          "0%":   { transform: "scale(1)", opacity: "1" },
          "75%, 100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        "fade-up":          "fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-delay-1":  "fade-up 0.4s 0.08s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-delay-2":  "fade-up 0.4s 0.16s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-delay-3":  "fade-up 0.4s 0.24s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":          "fade-in 0.3s ease both",
        "slide-right":      "slide-in-right 0.35s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in":         "scale-in 0.25s cubic-bezier(0.16,1,0.3,1) both",
        "progress-fill":    "progress-fill 0.8s 0.1s cubic-bezier(0.4,0,0.2,1) both",
        "shimmer":          "shimmer 2s linear infinite",
        "bounce-once":      "bounce-once 0.5s ease both",
        "ping-soft":        "ping-soft 1.5s cubic-bezier(0,0,0.2,1) infinite",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16,1,0.3,1)",
      },
    },
  },
  plugins: [],
};

export default config;
