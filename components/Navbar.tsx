'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bookmark, Train, Landmark, Compass, Menu, X } from 'lucide-react';
import { getSavedPandals } from '@/lib/storage';

interface NavbarProps {
  onOpenSearch: () => void;
}

export default function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const updateCounts = () => {
    const pandals = getSavedPandals();
    setSavedCount(pandals.length);
  };

  useEffect(() => {
    updateCounts();
    const handlePandalsUpdate = () => updateCounts();

    window.addEventListener('dugga-saved-pandals-updated', handlePandalsUpdate);
    window.addEventListener('storage', updateCounts);

    return () => {
      window.removeEventListener('dugga-saved-pandals-updated', handlePandalsUpdate);
      window.removeEventListener('storage', updateCounts);
    };
  }, []);

  const navLinks = [
    { label: 'Metro Guide', href: '/metro', icon: Train },
    { label: 'Bonedi Bari', href: '/bonedi', icon: Landmark },
    { label: 'All Pandals', href: '/explore', icon: Compass },
    { label: 'Saved', href: '/saved', icon: Bookmark, badge: savedCount > 0 ? savedCount : undefined },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav-red px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo - DUGGA DEKHA */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B52A22] via-[#C9973E] to-[#241714] p-[1.5px] flex items-center justify-center shadow-md shadow-[#241714]/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#8F1D18] flex items-center justify-center">
                {/* Durga Eye / Alpana Motif SVG */}
                <svg className="w-6 h-6 text-[#E1BE68]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" fill="#B52A22" stroke="#E1BE68" />
                  <path d="M12 2v2" stroke="#E1BE68" strokeWidth="1.5" />
                  <path d="M12 20v2" stroke="#E1BE68" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-editorial text-xl sm:text-2xl font-bold tracking-wider text-[#F7F0E2] group-hover:text-[#E1BE68] transition-colors leading-none">
                DUGGA DEKHA <span className="text-[#E1BE68] font-sans text-xs tracking-normal font-bold ml-0.5">2026</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#F7F0E2]/80 font-medium">
                Kolkata Durga Puja Guide
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#241714] text-[#E1BE68] border border-[#C9973E]/70 shadow-md'
                      : 'text-[#F7F0E2]/90 hover:text-[#F7F0E2] hover:bg-[#241714]/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#E1BE68]" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#C9973E] text-[#241714] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#241714]/70 hover:bg-[#241714] text-[#F7F0E2] text-xs font-semibold border border-[#C9973E]/40 shadow-sm transition-all"
              aria-label="Search Pandals, Metro or Bonedi Bari"
            >
              <Search className="w-3.5 h-3.5 text-[#E1BE68]" />
              <span className="hidden sm:inline text-xs text-[#F7F0E2]/90">Search Puja...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#120E0C]/60 text-[#E1BE68] rounded border border-[#C9973E]/30">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#241714]/70 text-[#F7F0E2] border border-[#C9973E]/40 hover:text-[#E1BE68]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#C9973E]/30 space-y-1.5 bg-[#8F1D18] pb-2 animate-fadeIn">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#241714] text-[#E1BE68] border border-[#C9973E]/40'
                      : 'text-[#F7F0E2] hover:bg-[#241714]/40 hover:text-[#E1BE68]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#E1BE68]" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#C9973E] text-[#241714]">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
}
