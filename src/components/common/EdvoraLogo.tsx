import React from 'react';

interface EdvoraLogoProps {
  variant?: 'navbar' | 'mobile' | 'full' | 'emblem-only';
  className?: string;
  showTagline?: boolean;
}

export const EdvoraLogo: React.FC<EdvoraLogoProps> = ({
  variant = 'navbar',
  className = '',
  showTagline = true,
}) => {
  // Emblem combining the letter 'E', open pages of an educational book, a leaf of growth, and an academic cap
  const Emblem = ({ size = 40 }: { size?: number }) => (
    <div
      className="relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#064E3B] to-[#043E2F] shadow-sm border border-[#E2DACB] dark:border-[#1E3A33] overflow-hidden"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1.5"
        aria-hidden="true"
      >
        {/* Soft radial glow */}
        <circle cx="32" cy="32" r="28" fill="#043E2F" />

        {/* Outer subtle gold laurel / circular ring */}
        <circle
          cx="32"
          cy="32"
          r="26"
          stroke="#D97706"
          strokeWidth="1.2"
          strokeDasharray="2 2"
          strokeOpacity="0.4"
        />

        {/* Academic Graduation Cap Crest (Top) */}
        <path
          d="M32 12L46 18L32 24L18 18L32 12Z"
          fill="#F59E0B"
        />
        {/* Cap tassel */}
        <path d="M42 20V27" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="42" cy="28" r="1.5" fill="#D97706" />

        {/* Open Book forming stylized 'E' branches */}
        {/* Left Book Page */}
        <path
          d="M30 28C24 26 19 28 17 29V46C20 44 25 43 30 45V28Z"
          fill="#FAF8F5"
        />
        {/* Right Book Page with triple shelves forming letter 'E' */}
        <path
          d="M34 28C40 26 45 28 47 29V46C44 44 39 43 34 45V28Z"
          fill="#FFFFFF"
        />
        {/* Central Book Spine */}
        <line x1="32" y1="27" x2="32" y2="47" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />

        {/* Stylized 'E' horizontal ribs in deep green on the right page */}
        <path d="M37 32H44" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
        <path d="M37 37H42" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M37 42H44" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />

        {/* Sprouting Growth Leaf at bottom */}
        <path
          d="M32 47C32 52 35 54 39 52C39 48 36 47 32 47Z"
          fill="#34D399"
        />
        <path
          d="M32 47C32 52 29 54 25 52C25 48 28 47 32 47Z"
          fill="#10B981"
        />
      </svg>
    </div>
  );

  if (variant === 'emblem-only') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Emblem size={36} />
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <Emblem size={34} />
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-[#064E3B] dark:text-emerald-400 font-editorial leading-none">
            Edvora
          </span>
          <span className="text-[9px] font-semibold text-amber-700 dark:text-amber-400 tracking-wider uppercase mt-0.5">
            Scholarships
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-start gap-2 ${className}`}>
        <div className="flex items-center gap-3">
          <Emblem size={44} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-[#064E3B] dark:text-emerald-400 font-editorial tracking-tight">
                Edvora
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block mb-1" />
            </div>
            <p className="text-[11px] font-bold text-amber-800 dark:text-amber-400 tracking-widest uppercase">
              LEARN · EXPLORE · GROW
            </p>
          </div>
        </div>
        {showTagline && (
          <p className="text-xs text-stone-600 dark:text-stone-400 font-medium max-w-sm">
            Find Scholarships That Fit You. Modern, verified scholarship discovery for students across India.
          </p>
        )}
      </div>
    );
  }

  // Default 'navbar' variant
  return (
    <div className={`inline-flex items-center gap-3 group ${className}`}>
      <Emblem size={38} />
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1 leading-none">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-[#064E3B] dark:text-emerald-400 font-editorial group-hover:text-[#043E2F] dark:group-hover:text-emerald-300 transition-colors">
            Edvora
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0" />
        </div>
        {showTagline && (
          <span className="text-[9.5px] text-stone-500 dark:text-stone-400 font-medium tracking-wide hidden sm:block mt-0.5">
            Find Scholarships That Fit You
          </span>
        )}
      </div>
    </div>
  );
};
