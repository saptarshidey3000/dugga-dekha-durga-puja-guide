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
  // Background blur rules according to user specifications:
  // - Home ('/'): No blur
  // - Bonedi Bari main listing ('/bonedi'): DO NOT BLUR
  // - Individual Bonedi Baris ('/bonedi/[id]'): REDUCED BLUR (blur-[2px])
  // - Metro ('/metro', '/metro?region=...'), Routes ('/route/...', '/routes'): REDUCED BLUR (blur-[2px])
  // - Saved ('/saved'), Explore ('/explore'), Pandal ('/pandal'): BLUR (blur-[4px])
  const getBlurClass = () => {
    if (!pathname || pathname === '/') {
      return 'blur-none';
    }
    // Main Bonedi Bari listing page: DO NOT BLUR
    if (pathname === '/bonedi') {
      return 'blur-none';
    }
    // Individual Bonedi Bari detail pages and Metro & Route pages: REDUCED BLUR
    if (
      pathname.startsWith('/bonedi/') ||
      pathname.startsWith('/metro') ||
      pathname.startsWith('/route') ||
      pathname.startsWith('/routes')
    ) {
      return 'blur-[2px]';
    }
    // Saved, Explore, Pandal: FULL BLUR
    if (
      pathname.startsWith('/saved') ||
      pathname.startsWith('/explore') ||
      pathname.startsWith('/pandal')
    ) {
      return 'blur-[4px]';
    }
    return 'blur-none';
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
          GLOBAL FIXED BACKGROUND LAYER (Completely locked to viewport, 0 glitch/motion on scroll)
          - Hardware-accelerated GPU layer
          - contain: strict prevents layout/scroll re-renders
          - Fixed viewport dimensions prevent jitter on mobile & desktop
      ============================================================ */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#120E0C]"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100dvh',
          minHeight: '-webkit-fill-available',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          contain: 'strict',
        }}
        aria-hidden="true"
      >
        <picture
          className={`absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] block ${getBlurClass()}`}
          style={{
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <source media="(min-width: 768px)" srcSet={desktopBg} />
          <img
            src={mobileBg}
            alt="Dugga Dekha Kolkata Durga Puja Background"
            className="w-full h-full object-cover object-center pointer-events-none select-none"
            style={{
              transform: 'translate3d(0, 0, 0)',
              WebkitTransform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
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
