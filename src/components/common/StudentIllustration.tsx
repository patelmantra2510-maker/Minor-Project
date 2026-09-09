import React from 'react';

interface StudentIllustrationProps {
  variant?: 'hero' | 'empty';
  className?: string;
}

export const StudentIllustration: React.FC<StudentIllustrationProps> = ({
  variant = 'hero',
  className = '',
}) => {
  if (variant === 'empty') {
    return (
      <svg
        viewBox="0 0 400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full max-w-xs mx-auto drop-shadow-sm ${className}`}
        aria-label="Student exploring scholarships illustration"
      >
        <defs>
          <radialGradient id="emptyGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E2ECE9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="emptyFolderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#065F46" />
            <stop offset="100%" stopColor="#043E2F" />
          </linearGradient>
        </defs>

        {/* Soft background glow */}
        <ellipse cx="200" cy="240" rx="150" ry="30" fill="url(#emptyGlow)" />
        <ellipse cx="200" cy="245" rx="110" ry="14" fill="#E8E2D7" className="dark:fill-[#142420]" />

        {/* Open Academic Binder / Notebook */}
        <path d="M120 220C120 200 160 205 198 215V245C160 235 120 235 120 220Z" fill="#FAF8F5" stroke="#E2DACB" strokeWidth="1.5" />
        <path d="M280 220C280 200 240 205 202 215V245C240 235 280 235 280 220Z" fill="#FFFFFF" stroke="#E2DACB" strokeWidth="1.5" />
        <line x1="200" y1="210" x2="200" y2="245" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />

        {/* Floating Bookmark Ribbon */}
        <path d="M197 195L200 218L203 195" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />

        {/* Student studying warmly */}
        <circle cx="200" cy="115" r="28" fill="#FBBF24" fillOpacity="0.25" />
        {/* Head */}
        <rect x="193" y="132" width="14" height="16" rx="4" fill="#FDBA74" />
        <circle cx="200" cy="116" r="22" fill="#FDBA74" />
        {/* Hair */}
        <path d="M182 114C182 96 192 90 204 90C218 90 222 100 220 112C214 107 205 106 198 107C190 108 185 111 182 114Z" fill="#1E293B" />
        {/* Spectacles */}
        <rect x="190" y="112" width="10" height="8" rx="2.5" stroke="#0F172A" strokeWidth="1.6" fill="none" />
        <rect x="202" y="112" width="10" height="8" rx="2.5" stroke="#0F172A" strokeWidth="1.6" fill="none" />
        <line x1="200" y1="115" x2="202" y2="115" stroke="#0F172A" strokeWidth="1.6" />
        <path d="M197 126C199 128 202 128 204 126" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" />

        {/* Torso in soft emerald */}
        <path d="M172 152C172 142 186 138 200 138C214 138 228 142 228 152V205H172V152Z" fill="url(#emptyFolderGrad)" />
        <line x1="200" y1="138" x2="200" y2="205" stroke="#043E2F" strokeWidth="2" />
        <circle cx="200" cy="155" r="2" fill="#F59E0B" />
        <circle cx="200" cy="172" r="2" fill="#F59E0B" />

        {/* Magnifying Glass with Golden Rim */}
        <g className="transform transition-transform hover:scale-105">
          <circle cx="248" cy="140" r="22" stroke="#D97706" strokeWidth="4" fill="#FEF3C7" fillOpacity="0.45" />
          <line x1="264" y1="156" x2="286" y2="178" stroke="#92400E" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M248 128V133M248 147V152M236 140H241M255 140H260" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Subtle decorative gold sparkle */}
        <circle cx="140" cy="130" r="4" fill="#059669" fillOpacity="0.8" />
        <circle cx="265" cy="95" r="3.5" fill="#D97706" />
      </svg>
    );
  }

  // Hero variant: Polished, editorial, dimensional student illustration
  return (
    <svg
      viewBox="0 0 480 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto ${className}`}
      aria-label="Student exploring scholarships on Edvora"
    >
      <defs>
        {/* Soft atmospheric gradient */}
        <radialGradient id="portalArch" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#E2ECE9" stopOpacity="0.75" />
          <stop offset="65%" stopColor="#FAF8F5" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="jacketGradient" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#065F46" />
          <stop offset="60%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#043E2F" />
        </linearGradient>

        <linearGradient id="saffronAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient id="bookCover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>

        <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>

        <filter id="softDepth" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.12" floodColor="#064E3B" />
        </filter>
      </defs>

      {/* 1. Subtle Architectural Academic Arch Backdrop */}
      <path
        d="M100 420V190C100 110 160 50 240 50C320 50 380 110 380 190V420H100Z"
        fill="url(#portalArch)"
      />
      {/* Delicate concentric arch line with subtle dash */}
      <path
        d="M120 420V195C120 125 170 75 240 75C310 75 360 125 360 195V420"
        stroke="#065F46"
        strokeWidth="1.2"
        strokeDasharray="4 5"
        strokeOpacity="0.25"
      />

      {/* Subtle gold constellation / academic stars */}
      <circle cx="150" cy="110" r="2" fill="#D97706" fillOpacity="0.6" />
      <circle cx="330" cy="100" r="2.5" fill="#D97706" fillOpacity="0.7" />
      <circle cx="130" cy="220" r="1.5" fill="#065F46" fillOpacity="0.4" />
      <circle cx="355" cy="210" r="2" fill="#065F46" fillOpacity="0.4" />

      {/* Ground soft shadow */}
      <ellipse cx="240" cy="425" rx="140" ry="14" fill="#E2DACB" className="dark:fill-[#142420]" />

      {/* 2. Character Model */}

      {/* Legs / Trousers */}
      <path d="M210 330V418H234V330H210Z" fill="#1E293B" />
      <path d="M246 330V418H270V330H246Z" fill="#1E293B" />
      {/* Clean classic shoes */}
      <path d="M204 414C204 410 220 410 236 412L238 422H198C198 418 200 414 204 414Z" fill="#FAF8F5" stroke="#CBD5E1" strokeWidth="1.5" />
      <path d="M242 414C242 410 258 410 274 412L276 422H236C236 418 238 414 242 414Z" fill="#FAF8F5" stroke="#CBD5E1" strokeWidth="1.5" />

      {/* Backpack behind shoulder */}
      <rect x="172" y="200" width="35" height="85" rx="12" fill="#043E2F" />

      {/* Smart Forest Green Jacket with Warm Ivory Inner Kurta */}
      <path
        d="M195 200C195 178 220 172 240 172C260 172 285 178 285 200V335H195V200Z"
        fill="url(#jacketGradient)"
        filter="url(#softDepth)"
      />
      {/* Inner White V-Collar */}
      <path d="M228 172L240 196L252 172Z" fill="#FFFDF9" />
      {/* Jacket Central Placket */}
      <line x1="240" y1="196" x2="240" y2="335" stroke="#043E2F" strokeWidth="2.5" />
      {/* Subtle Saffron/Gold Buttons */}
      <circle cx="240" cy="216" r="2.2" fill="url(#saffronAccent)" />
      <circle cx="240" cy="238" r="2.2" fill="url(#saffronAccent)" />
      <circle cx="240" cy="260" r="2.2" fill="url(#saffronAccent)" />
      <circle cx="240" cy="282" r="2.2" fill="url(#saffronAccent)" />

      {/* Neck */}
      <rect x="232" y="154" width="16" height="22" rx="4" fill="url(#skinTone)" />

      {/* Friendly Head */}
      <circle cx="240" cy="130" r="28" fill="url(#skinTone)" />

      {/* Hair (Refined, Modern) */}
      <path
        d="M214 126C214 98 228 88 248 88C268 88 274 100 272 122C264 116 254 114 240 114C228 114 220 120 214 126Z"
        fill="#0F172A"
      />

      {/* Sleek Glasses */}
      <rect x="224" y="124" width="13" height="9" rx="2.8" stroke="#0F172A" strokeWidth="2.2" fill="#FFFFFF" fillOpacity="0.3" />
      <rect x="243" y="124" width="13" height="9" rx="2.8" stroke="#0F172A" strokeWidth="2.2" fill="#FFFFFF" fillOpacity="0.3" />
      <line x1="237" y1="128" x2="243" y2="128" stroke="#0F172A" strokeWidth="2.2" />

      {/* Warm eyes */}
      <circle cx="230" cy="128" r="1.5" fill="#0F172A" />
      <circle cx="249" cy="128" r="1.5" fill="#0F172A" />

      {/* Genuine friendly smile */}
      <path d="M234 143C237 146 243 146 246 143" stroke="#B45309" strokeWidth="2.2" strokeLinecap="round" />

      {/* Left Arm holding Academic Binder / Notebook */}
      <path
        d="M285 205L315 250L295 270L275 235"
        fill="#043E2F"
      />
      {/* Right Arm across with notebook */}
      <path
        d="M195 205L170 250L205 275L225 230"
        fill="#043E2F"
      />

      {/* Academic Folio / Notebook held securely */}
      <g className="transform hover:-translate-y-1 transition-transform">
        <rect
          x="190"
          y="245"
          width="80"
          height="65"
          rx="6"
          fill="url(#bookCover)"
          stroke="#FAF8F5"
          strokeWidth="1.5"
          filter="url(#softDepth)"
        />
        {/* Folio Golden Spine Accent */}
        <line x1="198" y1="245" x2="198" y2="310" stroke="#F59E0B" strokeWidth="2.5" />
        {/* Folio Emblem */}
        <circle cx="235" cy="275" r="8" fill="#FBBF24" fillOpacity="0.2" stroke="#D97706" strokeWidth="1" />
        <path d="M232 277L235 273L238 277" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
        {/* Left hand holding notebook */}
        <rect x="252" y="270" width="16" height="18" rx="6" fill="url(#skinTone)" />
        {/* Right hand holding notebook */}
        <rect x="182" y="270" width="16" height="18" rx="6" fill="url(#skinTone)" />
      </g>
    </svg>
  );
};
