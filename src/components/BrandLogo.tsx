import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'header';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  size = 'md',
  showTagline = true,
}) => {
  const isDark = variant === 'dark';

  // Height sizing for the official logo
  const logoHeights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-14 sm:h-16',
  };

  const taglineSizes = {
    sm: 'text-[9px] tracking-[0.22em]',
    md: 'text-[11px] tracking-[0.26em]',
    lg: 'text-[13px] tracking-[0.3em]',
  };

  return (
    <div className="inline-flex items-center gap-3 select-none shrink-0 group">
      {/* Official E-HOMES Logo Image */}
      <div className="relative flex flex-col justify-center">
        <div className="relative flex items-center">
          <img
            src="/assets/aistudio/E-HOMES_NEW_LOG_64937e34.png"
            alt="E-HOMES – BUILDING VALUE"
            className={`${logoHeights[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-105 ${
              isDark
                ? 'mix-blend-screen brightness-125'
                : 'filter invert contrast-125 mix-blend-multiply'
            }`}
          />
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`font-black uppercase ${taglineSizes[size]} ${
                isDark ? 'text-cyan-400' : 'text-cyan-700'
              }`}
            >
              BUILDING VALUE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0"></span>
          </div>
        )}
      </div>
    </div>
  );
};
