'use client';

import React from 'react';

interface MegaMendungPatternProps {
  className?: string;
  opacity?: string;
  size?: number;
  variant?: 'green' | 'white';
}

export default function MegaMendungPattern({
  className = '',
  opacity,
  size = 460,
  variant = 'green',
}: MegaMendungPatternProps) {
  const defaultOpacity = variant === 'white' ? 'opacity-[0.18]' : 'opacity-[0.13]';
  const finalOpacity = opacity || defaultOpacity;
  const imageSrc =
    variant === 'white'
      ? '/assets/batik-mega-mendung-white.png'
      : '/assets/batik-mega-mendung.png';

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none z-0 bg-repeat ${finalOpacity} ${className}`}
      style={{
        backgroundImage: `url('${imageSrc}')`,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: 'center top',
      }}
      aria-hidden="true"
    />
  );
}
