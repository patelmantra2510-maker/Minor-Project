import React from 'react';

interface DiscoveryDeskCompositionProps {
  onFindScholarships?: () => void;
}

export const DiscoveryDeskComposition: React.FC<DiscoveryDeskCompositionProps> = ({
  onFindScholarships,
}) => {
  return (
    <div className="relative w-full max-w-[500px] lg:max-w-[560px] mx-auto select-none py-2 px-2 sm:px-4 flex items-center justify-center">
      {/* ========================================================================= */}
      {/* 1. SUBTLE AMBIENT CREAM GLOW (Blends visual into warm cream background)   */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-80 sm:w-[420px] h-72 sm:h-80 rounded-full bg-gradient-to-tr from-[#FAF8F5] via-[#F3EDE2]/60 to-[#E8E2D7]/30 blur-3xl dark:from-[#0C1513] dark:via-[#142420]/40 dark:to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* 2. OFFICIAL TRANSPARENT EDVORA HERO SCENE (Laptop, Books, Cap, Card)      */}
      {/* No rectangular container, no card wrapper, pure transparent asset         */}
      {/* ========================================================================= */}
      <div
        onClick={onFindScholarships}
        className="relative z-10 w-full group cursor-pointer transition-transform duration-500 ease-out hover:scale-[1.015]"
        title="Find Scholarships on Edvora"
      >
        <img
          src="/edvora-hero-visual.png"
          alt="Edvora Scholarship Discovery Platform — Find Scholarships That Fit You"
          className="w-full h-auto object-contain filter drop-shadow-xl dark:drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)] select-none pointer-events-none"
          loading="eager"
        />

        {/* Soft Ambient Ground Contact Shadow */}
        <div className="h-4 sm:h-5 w-[86%] mx-auto bg-gradient-to-r from-emerald-950/10 via-slate-900/18 to-emerald-950/12 dark:from-black/40 dark:via-black/60 dark:to-black/35 blur-xl rounded-full -mt-2 sm:-mt-3 pointer-events-none" />
      </div>
    </div>
  );
};
