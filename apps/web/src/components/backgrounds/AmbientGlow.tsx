import React from 'react';
import { clsx } from 'clsx';

interface AmbientGlowProps {
  position?: 'top' | 'center' | 'bottom' | 'hero' | 'card' | 'custom';
  color?: 'violet' | 'purple' | 'blue' | 'dual';
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
}

export const AmbientGlow: React.FC<AmbientGlowProps> = ({
  position = 'top',
  color = 'purple',
  className,
  intensity = 'medium',
}) => {
  const getGradient = () => {
    switch (color) {
      case 'violet':
        return 'radial-gradient(circle, rgba(113, 59, 255, 0.22) 0%, rgba(11, 11, 24, 0) 70%)';
      case 'blue':
        return 'radial-gradient(circle, rgba(83, 108, 255, 0.20) 0%, rgba(11, 11, 24, 0) 70%)';
      case 'dual':
        return 'radial-gradient(circle at 40% 40%, rgba(150, 63, 255, 0.25) 0%, rgba(83, 108, 255, 0.15) 50%, transparent 75%)';
      case 'purple':
      default:
        return 'radial-gradient(circle, rgba(150, 63, 255, 0.25) 0%, rgba(113, 59, 255, 0.08) 45%, transparent 70%)';
    }
  };

  const opacity =
    intensity === 'subtle' ? 'opacity-40' : intensity === 'strong' ? 'opacity-90' : 'opacity-65';

  const positionClasses = {
    top: 'top-[-150px] left-1/2 -translate-x-1/2 w-[900px] h-[500px]',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px]',
    bottom: 'bottom-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[600px]',
    hero: 'top-[-100px] right-[-100px] md:right-[5%] w-[800px] h-[800px]',
    card: 'inset-0 w-full h-full',
    custom: '',
  };

  return (
    <div
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute -z-10 rounded-full blur-[90px] select-none transition-all duration-1000',
        positionClasses[position],
        opacity,
        className
      )}
      style={{
        background: getGradient(),
      }}
    />
  );
};

