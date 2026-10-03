'use client';

import React from 'react';
import Image from 'next/image';

interface DuggaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export default function DuggaLogo({
  className = '',
  size = 'md',
  showSubtitle = false,
}: DuggaLogoProps) {
  // Size dimensions (exact 2:1 aspect ratio: 1774 x 887)
  const sizeStyles = {
    sm: 'h-8 sm:h-9 w-auto',
    md: 'h-10 sm:h-12 w-auto',
    lg: 'h-16 sm:h-20 w-auto',
    xl: 'h-24 sm:h-28 w-auto',
  }[size];

  const imgDimensions = {
    sm: { width: 72, height: 36 },
    md: { width: 104, height: 52 },
    lg: { width: 160, height: 80 },
    xl: { width: 220, height: 110 },
  }[size];

  return (
    <div className={`flex flex-col items-center sm:items-start ${className}`}>
      <div className="relative group flex items-center">
        <Image
          src="/logo-dd.png"
          alt="Dugga Dekha Logo"
          width={imgDimensions.width * 2}
          height={imgDimensions.height * 2}
          className={`${sizeStyles} object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-md`}
          priority
        />
      </div>
      {showSubtitle && (
        <span className="text-[10px] tracking-widest uppercase text-[#E1BE68]/90 font-semibold mt-1">
          Kolkata Durga Puja Guide 2026
        </span>
      )}
    </div>
  );
}
