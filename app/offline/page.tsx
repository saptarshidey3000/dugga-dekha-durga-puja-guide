'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WifiOff, RotateCcw, Home } from 'lucide-react';

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#180E0C]/95 border-2 border-[#C9973E]/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 backdrop-blur-xl">
        {/* Brand Medallion */}
        <div className="flex justify-center">
          <div className="relative w-20 h-20 rounded-full border-2 border-[#C9973E] bg-[#241714] flex items-center justify-center p-3 shadow-xl">
            <Image
              src="/logo-dd.png"
              alt="Dugga Dekha"
              width={100}
              height={50}
              className="object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E1BE68] flex items-center justify-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5 text-[#E1BE68]" />
            <span>CONNECTION PAUSED</span>
          </span>
          <h1 className="font-editorial text-3xl font-extrabold text-[#F7F0E2] tracking-wide">
            DUGGA DEKHA
          </h1>
          <p className="text-sm font-semibold text-[#E1BE68]">
            You&apos;re currently offline.
          </p>
        </div>

        {/* Message */}
        <p className="text-xs text-[#F7F0E2]/80 leading-relaxed max-w-sm mx-auto">
          Some previously loaded information and saved pandals may still be available. Live crowd updates and interactive maps require an active internet connection.
        </p>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleReload}
            className="w-full py-3 px-4 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] font-black text-xs uppercase tracking-wider transition-all border border-[#C9973E]/50 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#E1BE68]" />
            <span>TRY AGAIN</span>
          </button>

          <Link
            href="/"
            className="w-full py-2.5 px-4 rounded-xl bg-[#241714] hover:bg-[#35120F] text-[#E1BE68] hover:text-[#F7F0E2] font-bold text-xs uppercase tracking-wider transition-all border border-[#C9973E]/40 flex items-center justify-center gap-2 block"
          >
            <Home className="w-3.5 h-3.5" />
            <span>BACK TO HOME</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
