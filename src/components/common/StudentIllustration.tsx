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
        {/* Soft background glow */}
        <ellipse cx="200" cy="230" rx="140" ry="25" fill="#E7E2D9" className="dark:fill-[#142420]" />
        <circle cx="200" cy="140" r="95" fill="#ECFDF5" className="dark:fill-[#132A24]" />
        <circle cx="275" cy="85" r="16" fill="#FEF3C7" className="dark:fill-[#2B2714]" />

        {/* Elegant Book */}
        <path d="M140 190L200 208L260 190L200 172Z" fill="#065F46" />
        <path d="M140 190V204L200 222V208Z" fill="#044734" />
        <path d="M260 190V204L200 222V208Z" fill="#064E3B" />
        {/* Gold bookmark ribbon */}
        <path d="M196 173L200 195L204 173" stroke="#F59E0B" strokeWidth="2.5" />

        {/* Student character */}
        <path
          d="M172 175C172 154 186 138 205 138C224 138 238 154 238 175V195H172V175Z"
          fill="#064E3B"
          className="dark:fill-[#0F766E]"
        />
        <path d="M196 138L205 152L214 138" stroke="#FAF8F5" strokeWidth="2" strokeLinecap="round" />
        <circle cx="205" cy="114" r="22" fill="#FBBF24" fillOpacity="0.8" />
        <path
          d="M188 114C188 98 196 90 210 90C224 90 228 100 228 110C222 106 214 105 205 105C196 105 191 110 188 114Z"
          fill="#1E293B"
        />
        {/* Glasses */}
        <rect x="195" y="111" width="9" height="7" rx="2" stroke="#1E293B" strokeWidth="1.8" fill="none" />
        <rect x="207" y="111" width="9" height="7" rx="2" stroke="#1E293B" strokeWidth="1.8" fill="none" />
        <line x1="204" y1="114" x2="207" y2="114" stroke="#1E293B" strokeWidth="1.8" />
        {/* Smile */}
        <path d="M202 124C204 126 207 126 209 124" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />

        {/* Magnifying Glass with golden rim */}
        <circle cx="244" cy="112" r="22" stroke="#D97706" strokeWidth="4.5" fill="#FEF3C7" fillOpacity="0.4" />
        <line x1="259" y1="128" x2="278" y2="147" stroke="#92400E" strokeWidth="5.5" strokeLinecap="round" />

        {/* Sparkle of discovery */}
        <path d="M244 100V105M244 119V124M232 112H237M251 112H256" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="140" cy="115" r="4" fill="#059669" />
        <circle cx="270" cy="180" r="4" fill="#F59E0B" />
      </svg>
    );
  }

  // Hero variant: Modern confident student with laptop, subtle educational aura
  return (
    <svg
      viewBox="0 0 520 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-md lg:max-w-lg mx-auto ${className}`}
      aria-label="Student holding laptop exploring scholarships on Edvora"
    >
      <defs>
        <linearGradient id="heroHalo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#065F46" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="laptopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>
      </defs>

      {/* Subtle Arch / Jali educational geometric backdrop */}
      <circle cx="260" cy="220" r="180" fill="url(#heroHalo)" />
      {/* Decorative architectural path ring */}
      <circle cx="260" cy="220" r="160" stroke="#047857" strokeOpacity="0.15" strokeWidth="1.5" strokeDasharray="6 6" />

      {/* Ground shadow */}
      <ellipse cx="260" cy="405" rx="180" ry="20" fill="#E7E2D9" className="dark:fill-[#142420]" />

      {/* Backpack behind student */}
      <rect x="175" y="180" width="45" height="90" rx="15" fill="#044734" />

      {/* Legs & Trousers */}
      <path d="M225 310V395H248V310H225Z" fill="#1E293B" />
      <path d="M265 310V395H288V310H265Z" fill="#1E293B" />
      {/* Clean Shoes */}
      <path d="M220 390C220 385 240 385 252 388L255 400H215C215 395 217 390 220 390Z" fill="#FAF8F5" stroke="#D1D5DB" strokeWidth="2" />
      <path d="M260 390C260 385 280 385 292 388L295 400H255C255 395 257 390 260 390Z" fill="#FAF8F5" stroke="#D1D5DB" strokeWidth="2" />

      {/* Modern Deep Green Kurta / Jacket */}
      <path
        d="M210 185C210 165 235 160 255 160C275 160 300 165 300 185V315H210V185Z"
        fill="url(#jacketGrad)"
      />
      {/* Inner Collar & Placket */}
      <path d="M242 160L255 185L268 160Z" fill="#FFFDF9" />
      <line x1="255" y1="185" x2="255" y2="315" stroke="#032E23" strokeWidth="2.5" />
      <circle cx="255" cy="205" r="2" fill="#F59E0B" />
      <circle cx="255" cy="225" r="2" fill="#F59E0B" />
      <circle cx="255" cy="245" r="2" fill="#F59E0B" />

      {/* Head and Neck */}
      <rect x="246" y="142" width="18" height="22" rx="4" fill="#FDBA74" />
      <circle cx="255" cy="120" r="30" fill="#FDBA74" />

      {/* Modern Haircut */}
      <path
        d="M230 118C230 92 245 80 265 80C285 80 290 95 290 115C282 110 270 108 255 108C242 108 235 114 230 118Z"
        fill="#0F172A"
      />

      {/* Spectacles */}
      <rect x="238" y="115" width="14" height="10" rx="3" stroke="#0F172A" strokeWidth="2.5" fill="#FFFFFF" fillOpacity="0.3" />
      <rect x="258" y="115" width="14" height="10" rx="3" stroke="#0F172A" strokeWidth="2.5" fill="#FFFFFF" fillOpacity="0.3" />
      <line x1="252" y1="119" x2="258" y2="119" stroke="#0F172A" strokeWidth="2.5" />
      {/* Eyes */}
      <circle cx="245" cy="119" r="1.5" fill="#0F172A" />
      <circle cx="265" cy="119" r="1.5" fill="#0F172A" />
      {/* Warm Smile */}
      <path d="M250 134C253 137 257 137 260 134" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />

      {/* Right Arm holding Laptop */}
      <path d="M210 190L190 240L230 255L245 210" fill="#044734" />

      {/* Left Arm gesturing towards opportunities */}
      <path
        d="M300 190L345 220L380 205"
        stroke="#064E3B"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="385" cy="202" r="11" fill="#FDBA74" />
      <path d="M388 200L404 195" stroke="#FDBA74" strokeWidth="5" strokeLinecap="round" />

      {/* Sleek Laptop */}
      <polygon points="180,265 260,265 270,275 170,275" fill="#94A3B8" />
      <polygon points="190,205 265,200 260,265 180,265" fill="url(#laptopGrad)" />
      <line x1="198" y1="216" x2="235" y2="214" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="196" y1="226" x2="245" y2="223" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
      <circle cx="230" cy="265" r="9" fill="#FDBA74" />

      {/* Floating Interactive Live Match Preview Card */}
      <g className="transform transition-transform hover:-translate-y-1">
        <rect
          x="320"
          y="68"
          width="185"
          height="115"
          rx="14"
          fill="#FFFFFF"
          className="dark:fill-[#142420]"
          stroke="#E5E0D6"
          strokeWidth="1.5"
          filter="drop-shadow(0 10px 20px rgba(6, 78, 59, 0.08))"
        />
        {/* Match Pill */}
        <rect x="334" y="82" width="102" height="19" rx="9.5" fill="#DCFCE7" className="dark:fill-[#043326]" />
        <circle cx="343" cy="91.5" r="3.5" fill="#16A34A" />
        <text x="352" y="95" fill="#15803D" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">
          STRONG MATCH
        </text>

        <text x="334" y="120" fill="#0F172A" className="dark:fill-white" fontSize="11.5" fontWeight="700" fontFamily="sans-serif">
          Mukhyamantri Yuva Yojana
        </text>
        <text x="334" y="135" fill="#64748B" className="dark:text-stone-400" fontSize="9.5" fontWeight="500" fontFamily="sans-serif">
          Education Dept · ₹2,00,000/yr
        </text>

        <line x1="334" y1="147" x2="490" y2="147" stroke="#F1EFE9" className="dark:stroke-[#1C3630]" strokeWidth="1" />
        <text x="334" y="165" fill="#065F46" className="dark:fill-emerald-400" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">
          ✓ Verified Eligibility Criteria
        </text>
      </g>

      {/* Small golden sparkles */}
      <path d="M120 140L124 148L132 152L124 156L120 164L116 156L108 152L116 148Z" fill="#F59E0B" />
      <path d="M435 245L438 251L444 254L438 257L435 263L432 257L426 254L432 251Z" fill="#D97706" />
      <circle cx="160" cy="85" r="5" fill="#059669" />
    </svg>
  );
};
