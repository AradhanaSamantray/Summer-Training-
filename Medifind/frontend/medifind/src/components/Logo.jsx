import React from 'react';

// Reusable SVG Icon representing the location pin, cross, and pill capsule
export const LogoIcon = ({ className = "w-12 h-12" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Outer Pin Gradient (Cyan-Green to Blue) */}
        <linearGradient id="logo-pin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d2ff" />
          <stop offset="100%" stopColor="#0066eb" />
        </linearGradient>
        
        {/* Inner Medical Cross Gradient */}
        <linearGradient id="logo-cross-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>

      {/* Teardrop map pin shape */}
      <path 
        d="M50 93 C50 93 84 62 84 46 A 34 34 0 1 0 16 46 C16 63 50 93 50 93 Z" 
        fill="url(#logo-pin-grad)" 
      />

      {/* White circular core */}
      <circle cx="50" cy="46" r="23" fill="white" />

      {/* Medical Cross (Teal / Cyan) */}
      <g>
        <rect x="46" y="30" width="8" height="32" rx="3.5" fill="url(#logo-cross-grad)" />
        <rect x="34" y="42" width="32" height="8" rx="3.5" fill="url(#logo-cross-grad)" />
      </g>

      {/* Tilted Capsule Pill (overlapping at 45deg) */}
      <g transform="rotate(45 50 46)">
        {/* White capsule backing for overlap clipping */}
        <rect x="44.5" y="27.5" width="11" height="37" rx="5.5" fill="white" />
        
        {/* Capsule outlines */}
        <rect x="44.5" y="27.5" width="11" height="37" rx="5.5" stroke="#0f3057" strokeWidth="2.5" fill="none" />
        
        {/* Top Half (White) */}
        <path d="M44.5 46 V33 A5.5 5.5 0 0 1 55.5 33 V46 Z" fill="white" />
        
        {/* Bottom Half (Dark Blue) */}
        <path d="M44.5 46 H55.5 V59 A5.5 5.5 0 0 1 44.5 59 Z" fill="#0f3057" />
        
        {/* Capsule dividing stripe */}
        <line x1="44.5" y1="46" x2="55.5" y2="46" stroke="#0f3057" strokeWidth="1.5" />
      </g>
    </svg>
  );
};

// Complete Logo combination (Icon + Text + Tagline)
export const Logo = ({ className = "flex items-center gap-3 group shrink-0", showTagline = false }) => {
  return (
    <div className={className}>
      <div className="w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-300">
        <LogoIcon className="w-full h-full" />
      </div>
      <div className="flex flex-col items-start select-none text-left">
        <span className="text-2xl font-black tracking-tight leading-none flex items-center gap-0.5">
          <span className="text-blue-950 dark:text-slate-100 transition-colors duration-300">Medi</span>
          <span className="text-cyan-500">Find</span>
        </span>
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-[1px] bg-slate-300 dark:bg-slate-700"></span>
            <span className="text-[8px] font-extrabold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
              Find. Choose. Heal.
            </span>
            <span className="w-2.5 h-[1px] bg-slate-300 dark:bg-slate-700"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
