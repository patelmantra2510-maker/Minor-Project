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
        className={`w-full max-w-xs mx-auto drop-shadow-sm ${className}`}
        aria-label="Student exploring scholarships illustration"
      >
        {/* Soft background blob */}
        <ellipse cx="200" cy="220" rx="140" ry="30" fill="#E2E8F0" className="dark:fill-slate-800/60" />
        <circle cx="200" cy="140" r="100" fill="#EEF2FF" className="dark:fill-indigo-950/30" />
        <circle cx="270" cy="90" r="18" fill="#FEF3C7" className="dark:fill-amber-950/40" />

        {/* Floating Book / Folder */}
        <path
          d="M130 190L195 210L260 190L195 170Z"
          fill="#3B82F6"
          className="dark:fill-blue-600"
        />
        <path
          d="M130 190V205L195 225V210Z"
          fill="#1D4ED8"
          className="dark:fill-blue-700"
        />
        <path
          d="M260 190V205L195 225V210Z"
          fill="#2563EB"
          className="dark:fill-blue-800"
        />

        {/* Student character sitting / looking with magnifier */}
        {/* Body */}
        <path
          d="M170 175C170 155 185 140 205 140C225 140 240 155 240 175V195H170V175Z"
          fill="#312E81"
          className="dark:fill-indigo-400"
        />
        {/* Shirt collar */}
        <path d="M195 140L205 155L215 140" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        {/* Head */}
        <circle cx="205" cy="115" r="22" fill="#FDBA74" />
        {/* Hair */}
        <path
          d="M188 115C188 100 195 92 210 92C225 92 228 102 228 112C223 108 215 107 205 107C196 107 191 112 188 115Z"
          fill="#1E1B4B"
        />
        {/* Glasses */}
        <rect x="194" y="112" width="10" height="7" rx="2" stroke="#1E1B4B" strokeWidth="2" fill="none" />
        <rect x="208" y="112" width="10" height="7" rx="2" stroke="#1E1B4B" strokeWidth="2" fill="none" />
        <path d="M204 115H208" stroke="#1E1B4B" strokeWidth="2" />
        {/* Smile */}
        <path d="M202 126C204 128 208 128 210 126" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />

        {/* Magnifying Glass */}
        <circle cx="245" cy="110" r="24" stroke="#4F46E5" strokeWidth="5" fill="#E0E7FF" fillOpacity="0.4" />
        <line x1="262" y1="127" x2="282" y2="147" stroke="#312E81" strokeWidth="6" strokeLinecap="round" />

        {/* Little spark of discovery */}
        <path d="M245 95V102M245 118V125M232 110H239M251 110H258" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="140" cy="110" r="4" fill="#60A5FA" />
        <circle cx="280" cy="180" r="5" fill="#34D399" />
      </svg>
    );
  }

  // Hero variant: Modern confident student with laptop pointing towards discovery
  return (
    <svg
      viewBox="0 0 520 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-md lg:max-w-lg mx-auto ${className}`}
      aria-label="Student holding laptop exploring scholarships"
    >
      <defs>
        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="laptopScreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>
      </defs>

      {/* Decorative backdrop shapes */}
      <circle cx="260" cy="220" r="180" fill="url(#heroGradient)" />
      <circle cx="410" cy="100" r="16" fill="#10B981" fillOpacity="0.2" />
      <circle cx="90" cy="280" r="12" fill="#F59E0B" fillOpacity="0.2" />

      {/* Ground shadow */}
      <ellipse cx="260" cy="405" rx="190" ry="22" fill="#E2E8F0" className="dark:fill-slate-800/70" />

      {/* Backpack behind */}
      <rect x="175" y="180" width="45" height="90" rx="15" fill="#0284C7" />

      {/* Student Body */}
      {/* Legs & Jeans */}
      <path d="M225 310V395H248V310H225Z" fill="#1E293B" />
      <path d="M265 310V395H288V310H265Z" fill="#1E293B" />
      {/* Shoes */}
      <path d="M220 390C220 385 240 385 252 388L255 400H215C215 395 217 390 220 390Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
      <path d="M260 390C260 385 280 385 292 388L295 400H255C255 395 257 390 260 390Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />

      {/* Torso / Modern Jacket & Hoodie */}
      <path
        d="M210 185C210 165 235 160 255 160C275 160 300 165 300 185V315H210V185Z"
        fill="#2563EB"
        className="dark:fill-blue-600"
      />
      {/* Inner T-shirt */}
      <path d="M242 160L255 185L268 160Z" fill="#FFFFFF" />
      {/* Jacket collar and zipper */}
      <line x1="255" y1="185" x2="255" y2="315" stroke="#1D4ED8" strokeWidth="3" />

      {/* Head and Neck */}
      <rect x="246" y="142" width="18" height="22" rx="4" fill="#FDBA74" />
      <circle cx="255" cy="120" r="30" fill="#FDBA74" />

      {/* Modern Hair */}
      <path
        d="M230 118C230 92 245 80 265 80C285 80 290 95 290 115C282 110 270 108 255 108C242 108 235 114 230 118Z"
        fill="#0F172A"
      />

      {/* Face features: confident smile & smart glasses */}
      {/* Glasses */}
      <rect x="238" y="115" width="14" height="10" rx="3" stroke="#0F172A" strokeWidth="2.5" fill="#FFFFFF" fillOpacity="0.3" />
      <rect x="258" y="115" width="14" height="10" rx="3" stroke="#0F172A" strokeWidth="2.5" fill="#FFFFFF" fillOpacity="0.3" />
      <line x1="252" y1="119" x2="258" y2="119" stroke="#0F172A" strokeWidth="2.5" />
      {/* Eyes */}
      <circle cx="245" cy="119" r="1.5" fill="#0F172A" />
      <circle cx="265" cy="119" r="1.5" fill="#0F172A" />
      {/* Friendly Smile */}
      <path d="M250 134C253 137 257 137 260 134" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" />

      {/* Over-ear headphones on neck */}
      <path d="M228 128C228 152 282 152 282 128" stroke="#10B981" strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="224" y="122" width="8" height="14" rx="4" fill="#059669" />
      <rect x="278" y="122" width="8" height="14" rx="4" fill="#059669" />

      {/* Right Arm holding Laptop */}
      <path
        d="M210 190L190 240L230 255L245 210"
        fill="#1D4ED8"
        className="dark:fill-blue-700"
      />
      {/* Left Arm gesturing towards the scholarships */}
      <path
        d="M300 190L345 220L380 205"
        stroke="#2563EB"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="dark:stroke-blue-600"
      />
      {/* Left Hand pointing */}
      <circle cx="385" cy="202" r="11" fill="#FDBA74" />
      <path d="M388 200L404 195" stroke="#FDBA74" strokeWidth="5" strokeLinecap="round" />

      {/* Modern Slim Laptop */}
      {/* Laptop Base */}
      <polygon points="180,265 260,265 270,275 170,275" fill="#94A3B8" />
      {/* Laptop Screen */}
      <polygon points="190,205 265,200 260,265 180,265" fill="url(#laptopScreen)" />
      {/* Screen Glowing Code / Stats Lines */}
      <line x1="198" y1="216" x2="235" y2="214" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="196" y1="226" x2="245" y2="223" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
      <line x1="194" y1="236" x2="228" y2="233" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
      {/* Right Hand supporting laptop */}
      <circle cx="230" cy="265" r="9" fill="#FDBA74" />

      {/* Floating Interactive Match Preview Card near student's pointing hand */}
      <g className="transform transition-transform hover:-translate-y-1">
        <rect
          x="330"
          y="75"
          width="170"
          height="110"
          rx="12"
          fill="#FFFFFF"
          className="dark:fill-slate-900"
          stroke="#E2E8F0"
          strokeWidth="1.5"
          filter="drop-shadow(0 10px 15px rgba(0, 0, 0, 0.08))"
        />
        {/* Match Pill */}
        <rect x="342" y="88" width="82" height="18" rx="9" fill="#DCFCE7" className="dark:fill-emerald-950/80" />
        <circle cx="350" cy="97" r="3.5" fill="#16A34A" />
        <text x="358" y="101" fill="#15803D" fontSize="9" fontWeight="700" fontFamily="sans-serif">
          STRONG MATCH
        </text>

        <text x="342" y="124" fill="#0F172A" className="dark:fill-white" fontSize="11" fontWeight="700" fontFamily="sans-serif">
          MYSY Gujarat
        </text>
        <text x="342" y="138" fill="#64748B" fontSize="9" fontWeight="500" fontFamily="sans-serif">
          Govt of Gujarat · ₹2,00,000/yr
        </text>

        <line x1="342" y1="150" x2="488" y2="150" stroke="#F1F5F9" className="dark:stroke-slate-800" strokeWidth="1" />
        <text x="342" y="166" fill="#2563EB" fontSize="9" fontWeight="600" fontFamily="sans-serif">
          ✓ 100% Eligible to apply
        </text>
      </g>

      {/* Sparkles / Discovery Accents */}
      <path d="M120 140L124 148L132 152L124 156L120 164L116 156L108 152L116 148Z" fill="#F59E0B" />
      <path d="M430 250L433 256L439 259L433 262L430 268L427 262L421 259L427 256Z" fill="#3B82F6" />
      <circle cx="160" cy="90" r="5" fill="#10B981" />
    </svg>
  );
};
