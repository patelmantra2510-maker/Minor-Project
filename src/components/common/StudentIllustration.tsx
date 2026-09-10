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
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full max-w-xs mx-auto ${className}`}
        aria-label="No scholarships saved illustration"
      >
        <defs>
          <radialGradient id="emptyHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5EFE6" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#FAF8F5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft warm halo */}
        <circle cx="200" cy="150" r="120" fill="url(#emptyHalo)" />
        <ellipse cx="200" cy="240" rx="90" ry="12" fill="#E8E2D7" fillOpacity="0.6" />

        {/* Minimalist open book */}
        <path
          d="M130 200C130 185 165 190 198 198V230C165 220 130 220 130 200Z"
          fill="#FFFFFF"
          stroke="#D8CFBF"
          strokeWidth="1.5"
        />
        <path
          d="M270 200C270 185 235 190 202 198V230C235 220 270 220 270 200Z"
          fill="#FFFFFF"
          stroke="#D8CFBF"
          strokeWidth="1.5"
        />
        <line x1="200" y1="195" x2="200" y2="230" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />

        {/* Bookmark ribbon */}
        <path d="M198 175L200 202L202 175" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />

        {/* Bookmark icon in center */}
        <rect x="175" y="105" width="50" height="60" rx="8" fill="#064E3B" />
        <path d="M190 120H210V152L200 144L190 152V120Z" fill="#F59E0B" />
        <circle cx="200" cy="85" r="3" fill="#D97706" />
      </svg>
    );
  }

  // Hero: Highly polished editorial education illustration
  // Proportions: Sophisticated, realistic, dignified student figure
  // Surrounded by soft warm organic halo & subtle discovery pathway
  return (
    <svg
      viewBox="0 0 520 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-md lg:max-w-lg mx-auto ${className}`}
      aria-label="Editorial illustration of an Indian student discovering scholarship opportunities on Edvora"
    >
      <defs>
        {/* Soft, warm organic halo (NO giant dark glow) */}
        <radialGradient id="editorialHalo" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#F5EFE6" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#F9F5EE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
        </radialGradient>

        {/* Subtle warm gold aura */}
        <radialGradient id="goldAura" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#FAF8F5" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="nehruJacket" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#065F46" />
          <stop offset="70%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#043E2F" />
        </linearGradient>

        <linearGradient id="skinToneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>

        <linearGradient id="bookCoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="tabletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* 1. Warm Organic Background Shapes (Subtle, light, atmospheric) */}
      <path
        d="M260 40C370 40 450 120 450 240C450 360 360 430 250 430C140 430 80 340 80 230C80 120 150 40 260 40Z"
        fill="url(#editorialHalo)"
      />
      <circle cx="260" cy="220" r="170" fill="url(#goldAura)" />

      {/* Delicate Architectural Arches / Compass Orbit lines */}
      <circle
        cx="260"
        cy="230"
        r="185"
        stroke="#065F46"
        strokeWidth="1"
        strokeDasharray="4 6"
        strokeOpacity="0.2"
      />
      <circle
        cx="260"
        cy="230"
        r="150"
        stroke="#D97706"
        strokeWidth="0.8"
        strokeDasharray="3 5"
        strokeOpacity="0.25"
      />

      {/* 2. Visual Metaphor Pathway: STUDENT → DISCOVERY → SCHOLARSHIP → FUTURE */}
      {/* Dynamic upward curved vector pathway */}
      <path
        d="M60 410 C140 410, 170 340, 260 340 C350 340, 390 260, 460 210"
        stroke="#065F46"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
      <path
        d="M60 410 C140 410, 170 340, 260 340 C350 340, 390 260, 460 210"
        stroke="#D97706"
        strokeWidth="1.2"
        strokeDasharray="5 7"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />

      {/* Pathway Milestones */}
      {/* Node 1: Student Origin */}
      <circle cx="95" cy="406" r="4.5" fill="#065F46" />
      <circle cx="95" cy="406" r="2" fill="#FAF8F5" />
      <text x="95" y="425" textAnchor="middle" fontSize="9" fontWeight="700" fill="#065F46" letterSpacing="0.05em" opacity="0.85">STUDENT</text>

      {/* Node 2: Discovery */}
      <circle cx="215" cy="355" r="4" fill="#D97706" />
      <circle cx="215" cy="355" r="1.5" fill="#FAF8F5" />
      <text x="215" y="375" textAnchor="middle" fontSize="9" fontWeight="700" fill="#B45309" letterSpacing="0.05em" opacity="0.85">DISCOVERY</text>

      {/* Node 3: Scholarship */}
      <circle cx="335" cy="300" r="4" fill="#065F46" />
      <circle cx="335" cy="300" r="1.5" fill="#FAF8F5" />
      <text x="335" y="320" textAnchor="middle" fontSize="9" fontWeight="700" fill="#065F46" letterSpacing="0.05em" opacity="0.85">SCHOLARSHIP</text>

      {/* Node 4: Future */}
      <circle cx="445" cy="222" r="5" fill="#F59E0B" />
      <circle cx="445" cy="222" r="2.5" fill="#FAF8F5" />
      <text x="445" y="242" textAnchor="middle" fontSize="9" fontWeight="800" fill="#B45309" letterSpacing="0.05em">FUTURE</text>

      {/* Ground soft shadow */}
      <ellipse cx="260" cy="425" rx="110" ry="10" fill="#E4DCD0" fillOpacity="0.6" />

      {/* 3. The Editorial Student Figure */}
      {/* Dignified, mature Indian student standing naturally, looking toward opportunity */}
      <g id="studentFigure">
        {/* Trousers (Deep charcoal tailored pants) */}
        <path d="M236 315 L232 415 H252 L256 315 Z" fill="#1E293B" />
        <path d="M264 315 L268 415 H288 L284 315 Z" fill="#1E293B" />

        {/* Refined classic leather oxford shoes */}
        <path
          d="M226 414 C226 410 240 409 252 410 L254 418 H222 C222 414 224 414 226 414 Z"
          fill="#334155"
        />
        <path
          d="M266 414 C266 410 280 409 292 410 L294 418 H262 C262 414 264 414 266 414 Z"
          fill="#334155"
        />

        {/* Crisp Ivory Kurta Hem extending below jacket */}
        <path
          d="M228 300 H292 V322 C292 325 288 327 285 327 H235 C232 327 228 325 228 322 V300 Z"
          fill="#FAF8F5"
          stroke="#E8E2D7"
          strokeWidth="1"
        />

        {/* Tailored Deep Forest Green Nehru / Bandhgala Waistcoat */}
        <path
          d="M224 175 C224 165 244 160 260 160 C276 160 296 165 296 175 V312 H224 V175 Z"
          fill="url(#nehruJacket)"
        />

        {/* Bandhgala Mandarin Collar */}
        <path
          d="M246 156 H274 V165 H246 V156 Z"
          fill="#043E2F"
          stroke="#D97706"
          strokeWidth="0.8"
        />

        {/* Clean Central Button Placket */}
        <line x1="260" y1="165" x2="260" y2="310" stroke="#043E2F" strokeWidth="2" />
        {/* Subtle Muted Gold Buttons */}
        <circle cx="260" cy="180" r="2.2" fill="#F59E0B" />
        <circle cx="260" cy="200" r="2.2" fill="#F59E0B" />
        <circle cx="260" cy="220" r="2.2" fill="#F59E0B" />
        <circle cx="260" cy="240" r="2.2" fill="#F59E0B" />
        <circle cx="260" cy="260" r="2.2" fill="#F59E0B" />
        <circle cx="260" cy="280" r="2.2" fill="#F59E0B" />

        {/* Pocket Square in Warm Saffron */}
        <path d="M236 195 L242 190 L248 195 Z" fill="#D97706" />

        {/* Neck */}
        <rect x="253" y="142" width="14" height="18" rx="3" fill="url(#skinToneGradient)" />

        {/* Head */}
        <ellipse cx="260" cy="120" rx="21" ry="24" fill="url(#skinToneGradient)" />

        {/* Modern styled hair */}
        <path
          d="M239 116 C238 95 250 86 266 86 C282 86 286 96 284 114 C278 108 268 106 256 107 C248 108 242 112 239 116 Z"
          fill="#0F172A"
        />

        {/* Sleek wire-frame spectacles */}
        <rect x="247" y="115" width="10" height="7.5" rx="2" stroke="#0F172A" strokeWidth="1.6" fill="#FFFFFF" fillOpacity="0.2" />
        <rect x="263" y="115" width="10" height="7.5" rx="2" stroke="#0F172A" strokeWidth="1.6" fill="#FFFFFF" fillOpacity="0.2" />
        <line x1="257" y1="118" x2="263" y2="118" stroke="#0F172A" strokeWidth="1.6" />

        {/* Thoughtful, confident gaze directed toward the right (future & opportunities) */}
        <circle cx="253" cy="118" r="1.3" fill="#0F172A" />
        <circle cx="269" cy="118" r="1.3" fill="#0F172A" />

        {/* Subtle smile */}
        <path d="M255 131 C258 134 264 134 267 131" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" />

        {/* Arms & Folio / Books / Laptop holding */}
        {/* Left arm holding academic book */}
        <path d="M296 180 L318 218 L296 248 L285 220" fill="#043E2F" />
        {/* Right arm cradling notebook and slim tablet */}
        <path d="M224 180 L202 222 L228 250 L240 216" fill="#043E2F" />

        {/* Held Objects: Bound Scholarship Folio & Tablet */}
        {/* Academic Folio (Warm Amber/Gold) */}
        <g id="studentFolio">
          <rect
            x="215"
            y="226"
            width="58"
            height="46"
            rx="4"
            fill="url(#bookCoverGrad)"
            stroke="#FEF3C7"
            strokeWidth="1.2"
          />
          <line x1="222" y1="226" x2="222" y2="272" stroke="#FEF3C7" strokeWidth="2" strokeOpacity="0.8" />
          {/* Subtle gold ribbon bookmark */}
          <path d="M236 226 V246 L240 242 L244 246 V226" fill="#FEF3C7" />
        </g>

        {/* Modern Slim Slate Tablet / Folio */}
        <g id="studentTablet">
          <rect
            x="248"
            y="238"
            width="46"
            height="38"
            rx="4"
            fill="url(#tabletGrad)"
            stroke="#CBD5E1"
            strokeWidth="1"
          />
          <rect x="252" y="242" width="38" height="30" rx="2" fill="#064E3B" fillOpacity="0.6" />
          <line x1="256" y1="248" x2="276" y2="248" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="256" y1="254" x2="270" y2="254" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Hands holding the folio */}
        <circle cx="218" cy="248" r="7" fill="url(#skinToneGradient)" />
        <circle cx="294" cy="254" r="7" fill="url(#skinToneGradient)" />
      </g>
    </svg>
  );
};
