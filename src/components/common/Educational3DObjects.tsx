import React from 'react';

interface Object3DProps {
  className?: string;
  size?: number;
}

// Soft 3D Graduation Cap with Golden Tassel
export const Cap3D: React.FC<Object3DProps> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-lg ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="capTop" x1="15" y1="20" x2="85" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0D5C46" />
        <stop offset="100%" stopColor="#064E3B" />
      </linearGradient>
      <linearGradient id="capBase" x1="30" y1="50" x2="70" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#064E3B" />
        <stop offset="100%" stopColor="#032E23" />
      </linearGradient>
      <linearGradient id="goldTassel" x1="70" y1="35" x2="85" y2="70" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2" floodColor="#064E3B" />
      </filter>
    </defs>

    {/* Skull cap lower part */}
    <path
      d="M32 50C32 64 40 74 50 74C60 74 68 64 68 50C68 49 60 52 50 52C40 52 32 49 32 50Z"
      fill="url(#capBase)"
    />

    {/* Diamond mortarboard top */}
    <path
      d="M50 20L88 38L50 56L12 38L50 20Z"
      fill="url(#capTop)"
      filter="url(#softShadow)"
      stroke="#10B981"
      strokeWidth="0.8"
      strokeOpacity="0.4"
    />

    {/* Center button */}
    <ellipse cx="50" cy="38" rx="4" ry="2.5" fill="#F59E0B" />

    {/* Golden Tassel hanging */}
    <path
      d="M50 38C62 38 74 44 76 54L78 68"
      stroke="url(#goldTassel)"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M74 68C74 66 82 66 82 68L80 78C80 80 76 80 76 78L74 68Z"
      fill="url(#goldTassel)"
    />
  </svg>
);

// Soft 3D Stack of Academic Books
export const Books3D: React.FC<Object3DProps> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-md ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bookBottom" x1="15" y1="65" x2="85" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#065F46" />
        <stop offset="100%" stopColor="#044734" />
      </linearGradient>
      <linearGradient id="bookMid" x1="20" y1="45" x2="80" y2="65" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="bookTop" x1="25" y1="25" x2="75" y2="45" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0D9488" />
        <stop offset="100%" stopColor="#0F766E" />
      </linearGradient>
      <linearGradient id="pageColor" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FAF8F5" />
        <stop offset="100%" stopColor="#E7E2D9" />
      </linearGradient>
    </defs>

    {/* Bottom Book (Deep Green) */}
    <rect x="18" y="66" width="64" height="15" rx="3" fill="url(#bookBottom)" />
    <path d="M22 68H78V78H22Z" fill="url(#pageColor)" />
    <rect x="16" y="65" width="10" height="16" rx="2" fill="#044734" />

    {/* Middle Book (Warm Saffron / Amber) */}
    <rect x="22" y="48" width="58" height="14" rx="3" fill="url(#bookMid)" />
    <path d="M26 50H76V58H26Z" fill="url(#pageColor)" />
    <rect x="20" y="47" width="9" height="15" rx="2" fill="#92400E" />

    {/* Top Book (Teal / Sage) */}
    <rect x="26" y="30" width="52" height="14" rx="3" fill="url(#bookTop)" />
    <path d="M30 32H74V40H30Z" fill="url(#pageColor)" />
    <rect x="24" y="29" width="9" height="15" rx="2" fill="#115E59" />

    {/* Golden Bookmark ribbon on top */}
    <path d="M48 29V44L52 40L56 44V29H48Z" fill="#F59E0B" />
  </svg>
);

// Soft 3D Certificate / Scroll with Gold Seal
export const Certificate3D: React.FC<Object3DProps> = ({ className = '', size = 52 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-md ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="parchment" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFDF9" />
        <stop offset="100%" stopColor="#F5EFE6" />
      </linearGradient>
      <linearGradient id="goldSeal" x1="40" y1="58" x2="60" y2="78" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>

    {/* Parchment sheet */}
    <rect
      x="22"
      y="18"
      width="56"
      height="64"
      rx="6"
      fill="url(#parchment)"
      stroke="#D8CFBF"
      strokeWidth="1.5"
    />

    {/* Decorative inner border line */}
    <rect
      x="27"
      y="23"
      width="46"
      height="54"
      rx="3"
      stroke="#065F46"
      strokeWidth="0.8"
      strokeOpacity="0.4"
      fill="none"
    />

    {/* Text lines */}
    <line x1="33" y1="32" x2="67" y2="32" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="33" y1="40" x2="62" y2="40" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    <line x1="33" y1="47" x2="58" y2="47" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

    {/* Golden Wax Seal */}
    <circle cx="50" cy="62" r="9" fill="url(#goldSeal)" />
    <circle cx="50" cy="62" r="6" stroke="#FEF3C7" strokeWidth="1" fill="none" />
    {/* Ribbon tails */}
    <path d="M46 68L44 76L49 73L51 76L50 68" fill="#B45309" />
  </svg>
);

// Soft 3D Golden Academic Medal
export const Medal3D: React.FC<Object3DProps> = ({ className = '', size = 52 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-md ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="goldMedal" x1="30" y1="40" x2="70" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="40%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="greenRibbon" x1="20" y1="15" x2="80" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#065F46" />
        <stop offset="100%" stopColor="#044734" />
      </linearGradient>
    </defs>

    {/* Ribbons */}
    <path d="M38 18L50 48L32 54L22 18H38Z" fill="url(#greenRibbon)" />
    <path d="M62 18L50 48L68 54L78 18H62Z" fill="#033527" />

    {/* Circular Medal */}
    <circle cx="50" cy="60" r="22" fill="url(#goldMedal)" />
    <circle cx="50" cy="60" r="18" stroke="#FEF3C7" strokeWidth="1.5" strokeOpacity="0.7" fill="none" />

    {/* Center Star inside Medal */}
    <path
      d="M50 48L53 55H60L54 59L56 66L50 62L44 66L46 59L40 55H47L50 48Z"
      fill="#FFFBEB"
    />
  </svg>
);

// Soft 3D Academic Star
export const Star3D: React.FC<Object3DProps> = ({ className = '', size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-sm ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="starGrad" x1="10" y1="10" x2="50" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <path
      d="M30 6L37 21L53 23L41 34L45 50L30 42L15 50L19 34L7 23L23 21L30 6Z"
      fill="url(#starGrad)"
      stroke="#FEF3C7"
      strokeWidth="0.8"
    />
  </svg>
);

// Soft 3D Pencil
export const Pencil3D: React.FC<Object3DProps> = ({ className = '', size = 44 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-sm ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="pencilWood" x1="15" y1="15" x2="45" y2="45" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <g transform="rotate(45 30 30)">
      <rect x="25" y="10" width="10" height="32" rx="1" fill="url(#pencilWood)" />
      <rect x="25" y="6" width="10" height="6" rx="2" fill="#047857" />
      <polygon points="25,42 35,42 30,52" fill="#FDE68A" />
      <polygon points="28,48 32,48 30,52" fill="#1E293B" />
    </g>
  </svg>
);

// Soft 3D Notebook / Folio
export const Notebook3D: React.FC<Object3DProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-sm ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="notebookGrad" x1="15" y1="10" x2="65" y2="70" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0D5C46" />
        <stop offset="100%" stopColor="#043E2F" />
      </linearGradient>
    </defs>
    <rect x="18" y="14" width="48" height="56" rx="4" fill="url(#notebookGrad)" stroke="#10B981" strokeWidth="0.8" strokeOpacity="0.4" />
    <line x1="26" y1="14" x2="26" y2="70" stroke="#D97706" strokeWidth="2" />
    <circle cx="26" cy="24" r="1.5" fill="#FEF3C7" />
    <circle cx="26" cy="34" r="1.5" fill="#FEF3C7" />
    <circle cx="26" cy="44" r="1.5" fill="#FEF3C7" />
    <circle cx="26" cy="54" r="1.5" fill="#FEF3C7" />
    <circle cx="26" cy="64" r="1.5" fill="#FEF3C7" />
    <line x1="34" y1="28" x2="56" y2="28" stroke="#FAF8F5" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
    <line x1="34" y1="38" x2="52" y2="38" stroke="#FAF8F5" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="34" y1="48" x2="48" y2="48" stroke="#FAF8F5" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
  </svg>
);

// Soft 3D Laptop
export const Laptop3D: React.FC<Object3DProps> = ({ className = '', size = 52 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-sm ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="laptopScreen" x1="20" y1="15" x2="60" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    {/* Screen */}
    <rect x="18" y="16" width="44" height="32" rx="3" fill="url(#laptopScreen)" stroke="#94A3B8" strokeWidth="1.5" />
    {/* Display Glow */}
    <rect x="22" y="20" width="36" height="24" rx="1.5" fill="#042F2E" />
    <line x1="26" y1="26" x2="46" y2="26" stroke="#34D399" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="26" y1="32" x2="40" y2="32" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
    {/* Base */}
    <polygon points="12,52 68,52 62,58 18,58" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
  </svg>
);
