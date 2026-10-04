'use client';

import React, { useState, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import SearchModal from './SearchModal';
import PageLoader from './PageLoader';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Route condition checks
  const isBonedi = pathname?.startsWith('/bonedi');

  // Background blur rules according to user specifications:
  // - Home ('/'): No blur
  // - Bonedi Bari main listing ('/bonedi'): DO NOT BLUR
  // - Individual Bonedi Baris ('/bonedi/[id]'): REDUCED BLUR (blur-[2px])
  // - Metro ('/metro', '/metro?region=...'), Routes ('/route/...', '/routes'): REDUCED BLUR (blur-[2px])
  // - Saved ('/saved'), Explore ('/explore'), Pandal ('/pandal'): BLUR (blur-[5px])
  const getBlurClass = () => {
    if (!pathname || pathname === '/') {
      return 'blur-none scale-100';
    }
    // Main Bonedi Bari listing page: DO NOT BLUR
    if (pathname === '/bonedi') {
      return 'blur-none scale-100';
    }
    // Individual Bonedi Bari detail pages and Metro & Route pages: REDUCED BLUR
    if (
      pathname.startsWith('/bonedi/') ||
      pathname.startsWith('/metro') ||
      pathname.startsWith('/route') ||
      pathname.startsWith('/routes')
    ) {
      return 'blur-[2px] scale-[1.02]';
    }
    // Saved, Explore, Pandal: FULL BLUR
    if (
      pathname.startsWith('/saved') ||
      pathname.startsWith('/explore') ||
      pathname.startsWith('/pandal')
    ) {
      return 'blur-[5px] scale-105';
    }
    return 'blur-none scale-100';
  };

  // Background artwork selection:
  // - Bonedi Bari: /bonedi-mobile.png (mobile) & /bonedi bari image.png (desktop)
  // - Everything else: /003a00d2-6b35-4474-9e8a-69eebd551cca.png (mobile) & /hopping-laptop-tab.png (desktop)
  const mobileBg = isBonedi ? '/bonedi-mobile.png' : '/003a00d2-6b35-4474-9e8a-69eebd551cca.png';
  const desktopBg = isBonedi ? '/bonedi%20bari%20image.png' : '/hopping-laptop-tab.png';

  return (
    <div className="min-h-screen flex flex-col relative text-[#F7F0E2]">
      {/* Modern Page Transition & Startup Loader */}
      <Suspense fallback={null}>
        <PageLoader />
      </Suspense>

      {/* ============================================================
          GLOBAL FIXED BACKGROUND LAYER
          - Mobile: /003a00d2-6b35-4474-9e8a-69eebd551cca.png (or /bonedi-mobile.png for Bonedi Bari)
          - Desktop / Laptop: /hopping-laptop-tab.png (or /bonedi bari image.png for Bonedi Bari)
          - Blur effect: tuned per page (no blur on /bonedi, reduced blur on /bonedi/[id], blur on /saved & /metro)
      ============================================================ */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none -z-20 overflow-hidden"
        aria-hidden="true"
      >
        <picture
          className={`block w-full h-full transition-[filter,transform] duration-500 ease-out ${getBlurClass()}`}
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
