import React from 'react';

interface StudentIllustrationProps {
  variant?: 'hero' | 'empty';
  className?: string;
}

export const StudentIllustration: React.FC<StudentIllustrationProps> = ({
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[260px] mx-auto ${className}`}
      aria-label="Edvora academic motif: Book, Bookmark, and Gold Spark"
    >
      <defs>
        {/* Soft warm halo gradient */}
        <radialGradient id="motifHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5EFE6" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#FAF8F5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="bookCoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#065F46" />
          <stop offset="100%" stopColor="#043E2F" />
        </linearGradient>

        <linearGradient id="pageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8F6F0" />
        </linearGradient>

        <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* 1. Background Halo & Ground Shadow */}
      <circle cx="160" cy="120" r="105" fill="url(#motifHalo)" />
      <ellipse cx="160" cy="195" rx="80" ry="10" fill="#E8E2D7" fillOpacity="0.5" />

      {/* 2. Soft Orbit Ring */}
      <circle
        cx="160"
        cy="120"
        r="95"
        stroke="#065F46"
        strokeWidth="1"
        strokeDasharray="4 6"
        strokeOpacity="0.15"
      />

      {/* 3. Open Book Motif */}
      <g id="openBook" transform="translate(0, 5)">
        {/* Book Outer Cover / Binding */}
        <path
          d="M80 155 C120 142 155 147 160 158 C165 147 200 142 240 155 L242 165 C200 152 165 157 160 168 C155 157 120 152 78 165 Z"
          fill="url(#bookCoverGrad)"
        />

        {/* Left Page Base */}
        <path
          d="M82 150 C118 138 152 142 158 154 L158 122 C152 110 118 106 82 118 Z"
          fill="url(#pageGrad)"
          stroke="#E2DACB"
          strokeWidth="1.2"
        />
        {/* Left Page Top Layer */}
        <path
          d="M85 146 C120 135 152 139 158 151 L158 119 C152 107 120 103 85 114 Z"
          fill="#FFFFFF"
          stroke="#EDE6D8"
          strokeWidth="1"
        />

        {/* Right Page Base */}
        <path
          d="M238 150 C202 138 168 142 162 154 L162 122 C168 110 202 106 238 118 Z"
          fill="url(#pageGrad)"
          stroke="#E2DACB"
          strokeWidth="1.2"
        />
        {/* Right Page Top Layer */}
        <path
          d="M235 146 C200 135 168 139 162 151 L162 119 C168 107 200 103 235 114 Z"
          fill="#FFFFFF"
          stroke="#EDE6D8"
          strokeWidth="1"
        />

        {/* Book Center Spine Line */}
        <line x1="160" y1="118" x2="160" y2="162" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" />

        {/* Decorative Editorial Lines on Left Page */}
        <line x1="98" y1="126" x2="145" y2="123" stroke="#D1C7B7" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="98" y1="133" x2="145" y2="130" stroke="#D1C7B7" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="98" y1="140" x2="130" y2="138" stroke="#D1C7B7" strokeWidth="1.5" strokeLinecap="round" />

        {/* Decorative Editorial Lines on Right Page */}
        <line x1="175" y1="123" x2="222" y2="126" stroke="#D1C7B7" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="175" y1="130" x2="222" y2="133" stroke="#D1C7B7" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="175" y1="138" x2="208" y2="140" stroke="#D1C7B7" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* 4. Bookmark Ribbon in Center */}
      <path
        d="M158 92 C158 92 155 125 158 140 L160 137 L162 140 C165 125 162 92 162 92 Z"
        fill="url(#goldRibbon)"
        filter="drop-shadow(0 2px 3px rgba(217, 119, 6, 0.3))"
      />

      {/* 5. Floating Bookmark Card Badge */}
      <g transform="translate(138, 48)">
        <rect
          x="0"
          y="0"
          width="44"
          height="52"
          rx="10"
          fill="#064E3B"
          stroke="#0B5441"
          strokeWidth="1.5"
          filter="drop-shadow(0 4px 6px rgba(6, 78, 59, 0.2))"
        />
        {/* Inner Bookmark Icon */}
        <path
          d="M14 14 H30 V38 L22 32 L14 38 Z"
          fill="#F59E0B"
        />
      </g>

      {/* 6. Gold 4-Point Spark at Top Right */}
      <g transform="translate(210, 48)">
        <path
          d="M14 0 C14 7.7 20.3 14 28 14 C20.3 14 14 20.3 14 28 C14 20.3 7.7 14 0 14 C7.7 14 14 7.7 14 0 Z"
          fill="#D97706"
        />
        <circle cx="14" cy="14" r="2.5" fill="#FEF3C7" />
      </g>

      {/* 7. Subtle Micro Spark at Left */}
      <g transform="translate(86, 76)">
        <path
          d="M8 0 C8 4.4 11.6 8 16 8 C11.6 8 8 11.6 8 16 C8 11.6 4.4 8 0 8 C4.4 8 8 4.4 8 0 Z"
          fill="#065F46"
          fillOpacity="0.4"
        />
      </g>

      {/* 8. Delicate Botanical Leaf Sprig on Left */}
      <path
        d="M74 150 C70 135 80 125 90 120 C85 130 84 142 74 150 Z"
        fill="#059669"
        fillOpacity="0.35"
      />
      <path
        d="M68 156 C62 145 68 135 76 132 C74 140 73 148 68 156 Z"
        fill="#047857"
        fillOpacity="0.25"
      />
    </svg>
  );
};
