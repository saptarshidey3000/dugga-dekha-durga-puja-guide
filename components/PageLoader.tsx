'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstMount = useRef(true);
  const prevPathnameRef = useRef<string | null>(null);

  // Helper to trigger loading animation (1 second for page transitions)
  const showLoader = (durationMs = 1000) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(true);
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, durationMs);
  };

  // 1. Initial startup animation (2 seconds ONLY when website first starts)
  useEffect(() => {
    setIsVisible(true);
    const initialTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => {
      clearTimeout(initialTimer);
    };
  }, []);

  // 2. Route change animation (1 second whenever navigating between different pages)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    const prevPath = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    // Do NOT trigger loader when navigating within /metro (e.g. /metro <-> /metro?region=...)
    if (prevPath === '/metro' && pathname === '/metro') {
      return;
    }

    showLoader(1000);
  }, [pathname]);

  // 3. Link click interceptor (triggers 1 second load on navigation, excluding /metro <-> /metro?region=...)
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href) return;

      // Only handle internal navigation links (not external, hash anchors, or downloads)
      if (
        (href.startsWith('/') || href.startsWith(window.location.origin)) &&
        !href.startsWith('#') &&
        !target.hasAttribute('download') &&
        target.getAttribute('target') !== '_blank'
      ) {
        try {
          const url = new URL(href, window.location.origin);
          const currentPath = window.location.pathname;
          const targetPath = url.pathname;

          // Do NOT show loader when navigating between /metro and /metro?region=...
          if (currentPath === '/metro' && targetPath === '/metro') {
            return;
          }

          // If navigating to a different page route
          if (currentPath !== targetPath) {
            showLoader(1000);
          }
        } catch {
          // Ignore invalid URLs
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div
      aria-hidden={!isVisible}
      onClick={() => setIsVisible(false)}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#120E0C]/90 backdrop-blur-2xl transition-all duration-500 ease-out select-none cursor-pointer ${
        isVisible
          ? 'opacity-100 pointer-events-auto scale-100'
          : 'opacity-0 pointer-events-none scale-105'
      }`}
    >
      {/* Ambient Radial Festive Glow (2s cycle) */}
      <div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#8F1D18]/30 via-[#C9973E]/25 to-transparent blur-3xl animate-pulse pointer-events-none"
        style={{ animationDuration: '2s' }}
      />

      {/* Main Loader Medallion */}
      <div className="relative flex flex-col items-center z-10 space-y-5">
        {/* Animated Medallion Container */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
          {/* Outer Rotating Golden Ring (2s duration) */}
          <div
            className="absolute -inset-2 rounded-full border-2 border-transparent border-t-[#E1BE68] border-r-[#C9973E] animate-spin"
            style={{ animationDuration: '2s' }}
          />

          {/* Secondary Counter-rotating Dashed Ring (2s duration) */}
          <div
            className="absolute -inset-3.5 rounded-full border border-dashed border-[#C9973E]/40 animate-spin"
            style={{ animationDuration: '2s', animationDirection: 'reverse' }}
          />

          {/* Pulse Glow Behind Circular Art (2s duration) */}
          <div
            className="absolute inset-0 rounded-full bg-[#8F1D18]/40 blur-md animate-ping"
            style={{ animationDuration: '2s' }}
          />

          {/* User's Circular Loader Image */}
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-2 border-[#C9973E] bg-[#120E0C]">
            <Image
              src="/loader.png"
              alt="Dugga Dekha Loading"
              fill
              sizes="(max-width: 640px) 112px, 144px"
              className="object-cover transform hover:scale-105 transition-transform"
              priority
            />
          </div>
        </div>

        {/* Brand Text & Status */}
        <div className="text-center space-y-1">
          <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F7F0E2] tracking-wider drop-shadow-md">
            DUGGA DEKHA
          </h2>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#E1BE68]">
            Kolkata Durga Puja 2026
          </p>
        </div>

        {/* Modern Shimmer Progress Line */}
        <div className="w-32 sm:w-44 h-1 bg-[#241714] rounded-full overflow-hidden border border-[#C9973E]/30 relative">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-[#E1BE68] to-transparent animate-loader-progress" />
        </div>
      </div>
    </div>
  );
}
