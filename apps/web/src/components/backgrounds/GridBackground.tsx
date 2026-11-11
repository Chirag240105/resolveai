import React from 'react';
import { clsx } from 'clsx';

interface GridBackgroundProps {
  variant?: 'marketing' | 'hero' | 'dashboard';
  className?: string;
  showFloor?: boolean;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  variant = 'marketing',
  className,
  showFloor = false,
}) => {
  // Line opacity and grid spacing based on variant
  const isDashboard = variant === 'dashboard';
  const isHero = variant === 'hero';

  const gridLineColor = isDashboard
    ? 'rgba(145, 105, 255, 0.035)'
    : isHero
    ? 'rgba(150, 63, 255, 0.08)'
    : 'rgba(145, 105, 255, 0.05)';

  const gridSize = isDashboard ? '80px' : isHero ? '56px' : '64px';

  return (
    <div
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute inset-0 overflow-hidden select-none -z-10',
        className
      )}
    >
      {/* Base Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridLineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridLineColor} 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize} ${gridSize}`,
          maskImage: isDashboard
            ? 'radial-gradient(ellipse 90% 80% at 50% 20%, black 40%, transparent 100%)'
            : isHero
            ? 'radial-gradient(ellipse 85% 70% at 50% 30%, black 30%, transparent 100%)'
            : 'radial-gradient(ellipse 95% 85% at 50% 50%, black 40%, transparent 95%)',
          WebkitMaskImage: isDashboard
            ? 'radial-gradient(ellipse 90% 80% at 50% 20%, black 40%, transparent 100%)'
            : isHero
            ? 'radial-gradient(ellipse 85% 70% at 50% 30%, black 30%, transparent 100%)'
            : 'radial-gradient(ellipse 95% 85% at 50% 50%, black 40%, transparent 95%)',
        }}
      />

      {/* Perspective Floor Effect for Hero if enabled */}
      {showFloor && (
        <div
          className="absolute bottom-0 inset-x-0 h-[380px]"
          style={{
            perspective: '600px',
            transformStyle: 'preserve-3d',
            maskImage: 'linear-gradient(to top, black 20%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 100%)',
          }}
        >
          <div
            className="w-full h-full origin-bottom"
            style={{
              transform: 'rotateX(68deg) translateY(40px)',
              backgroundImage: `
                linear-gradient(to right, rgba(113, 59, 255, 0.12) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(113, 59, 255, 0.12) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
            }}
          />
        </div>
      )}
    </div>
  );
};

