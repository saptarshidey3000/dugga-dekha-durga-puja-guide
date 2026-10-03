'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface DuggaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export default function DuggaLogo({
  className = '',
  size = 'md',
  showSubtitle = true,
}: DuggaLogoProps) {
  const [imgError, setImgError] = useState(false);

  // Size dimensions
  const dims = {
    sm: { img: 28, text: 'text-lg', year: 'text-[10px]', sub: 'text-[9px]' },
    md: { img: 36, text: 'text-xl sm:text-2xl', year: 'text-xs', sub: 'text-[10px]' },
    lg: { img: 48, text: 'text-2xl sm:text-3xl', year: 'text-sm', sub: 'text-xs' },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Brand Mark Icon / Provided Logo Asset */}
      {!imgError ? (
        <div className="relative shrink-0 overflow-hidden rounded-xl">
          <Image
            src="/logo.png"
            alt="Dugga Dekha Logo"
            width={dims.img}
            height={dims.img}
            className="object-contain"
            onError={() => setImgError(true)}
            priority
          />
        </div>
      ) : (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#B52A22] via-[#8F1D18] to-[#241714] border-2 border-[#C9973E] flex items-center justify-center shadow-md shrink-0">
          <span className="font-editorial text-sm font-black text-[#E1BE68]">DD</span>
        </div>
      )}

      {/* Typography Brand Name */}
      <div className="flex flex-col">
        <span className={`font-editorial font-black tracking-wider text-[#F7F0E2] leading-none ${dims.text}`}>
          DUGGA DEKHA{' '}
          <span className={`text-[#E1BE68] font-sans font-extrabold ml-0.5 tracking-normal ${dims.year}`}>
            2026
          </span>
        </span>
        {showSubtitle && (
          <span className={`tracking-widest uppercase text-[#E1BE68]/90 font-semibold mt-0.5 ${dims.sub}`}>
            Kolkata Durga Puja Guide
          </span>
        )}
      </div>
    </div>
  );
}
