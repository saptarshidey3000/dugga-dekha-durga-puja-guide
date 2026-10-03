'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import SearchModal from './SearchModal';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Route condition checks
  const isBonedi = pathname?.startsWith('/bonedi');

  // Blur background a little bit in every metro route, metro hub, pandal, and bonedi bari URL
  const shouldBlur =
    pathname?.startsWith('/metro') ||
    pathname?.startsWith('/route') ||
    pathname?.startsWith('/bonedi') ||
    pathname?.startsWith('/pandal') ||
    pathname?.startsWith('/routes') ||
    pathname?.startsWith('/explore');

  // Background artwork selection:
  // - Bonedi Bari: /bonedi-mobile.png (mobile) & /bonedi bari image.png (desktop)
  // - Everything else: /003a00d2-6b35-4474-9e8a-69eebd551cca.png (mobile) & /hopping-laptop-tab.png (desktop)
  const mobileBg = isBonedi ? '/bonedi-mobile.png' : '/003a00d2-6b35-4474-9e8a-69eebd551cca.png';
  const desktopBg = isBonedi ? '/bonedi%20bari%20image.png' : '/hopping-laptop-tab.png';

  return (
    <div className="min-h-screen flex flex-col relative text-[#F7F0E2]">
      {/* ============================================================
          GLOBAL FIXED BACKGROUND LAYER
          - Mobile: /003a00d2-6b35-4474-9e8a-69eebd551cca.png (or /bonedi-mobile.png for Bonedi Bari)
          - Desktop / Laptop: /hopping-laptop-tab.png (or /bonedi bari image.png for Bonedi Bari)
          - Blur effect: applied gently in every metro or bonedi bari URL
      ============================================================ */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none -z-20 overflow-hidden"
        aria-hidden="true"
      >
        <picture
          className={`block w-full h-full transition-[filter,transform] duration-500 ease-out ${
            shouldBlur ? 'blur-[5px] scale-105' : 'blur-none scale-100'
          }`}
        >
          <source media="(min-width: 768px)" srcSet={desktopBg} />
          <img
            src={mobileBg}
            alt="Dugga Dekha Kolkata Durga Puja Background"
            className="w-full h-full object-cover object-center"
          />
        </picture>
      </div>

      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <main className="flex-1 pb-16 md:pb-0 relative z-10">{children}</main>
      <BottomNav />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
