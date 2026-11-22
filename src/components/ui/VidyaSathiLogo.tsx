import React from "react";

interface VidyaSathiLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  subtitle?: string;
}

export function VidyaSathiLogo({
  size = "md",
  showText = true,
  subtitle,
}: VidyaSathiLogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center gap-3">
      {/* Brand Icon SVG */}
      <div
        className={`${iconSizes[size]} rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white flex items-center justify-center shadow-md shrink-0 relative overflow-hidden group`}
      >
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent pointer-events-none" />

        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 transform transition-transform group-hover:scale-105 duration-200"
        >
          {/* Open Book Wings (Vidya - Knowledge & Support) */}
          <path
            d="M 6 24 C 11 21 15 22 18 25 C 21 22 25 21 30 24 C 29 26 25 27 18 29 C 11 27 7 26 6 24 Z"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />
          <path
            d="M 7 20 C 11 17 15 18 18 21 C 21 18 25 17 29 20 C 27 22 23 23 18 24.5 C 13 23 9 22 7 20 Z"
            fill="#E0E7FF"
            fillOpacity="0.7"
          />

          {/* Compassionate Central Heart/Companion Core (Sathi) */}
          <circle cx="18" cy="17" r="3.2" fill="#F59E0B" />

          {/* Radiant Star of Potential / Intelligence Rising */}
          <path
            d="M 18 6 L 19.4 10.2 L 23.6 11.6 L 19.4 13 L 18 17.2 L 16.6 13 L 12.4 11.6 L 16.6 10.2 Z"
            fill="#FBBF24"
          />

          {/* Sparkle micro-accents */}
          <circle cx="8" cy="11" r="1" fill="#FCD34D" fillOpacity="0.9" />
          <circle cx="28" cy="9" r="1.2" fill="#FCD34D" fillOpacity="0.9" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div>
          <div className="flex items-center gap-2 leading-none">
            <span className="text-[18px] font-black tracking-tight text-slate-900">
              VidyaSathi
            </span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              विद्यासाथी
            </span>
          </div>
          {subtitle !== undefined ? (
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">{subtitle}</p>
          ) : (
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Inclusive Education OS • Built by Dynamic Duo
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default VidyaSathiLogo;
