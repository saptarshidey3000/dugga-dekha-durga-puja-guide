'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bookmark, Train, Landmark, Compass, Menu, X, Download } from 'lucide-react';
import { getSavedPandals } from '@/lib/storage';
import { usePWA } from './PWAInstallProvider';

import DuggaLogo from './DuggaLogo';

interface NavbarProps {
  onOpenSearch: () => void;
}

export default function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isInstallable, isStandalone, installApp } = usePWA();
  const shouldShowInstall = isInstallable && !isStandalone;

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
      <header className="sticky top-0 z-40 w-full glassmorphic-header px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo - Unified DuggaLogo for mobile & desktop */}
          <Link href="/" className="flex items-center group">
            <DuggaLogo size="md" />
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
                      ? 'bg-[#241714]/85 text-[#E1BE68] border border-[#C9973E]/70 shadow-md backdrop-blur-md'
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

            {/* Desktop Install Button: Subtle, matching Dugga Dekha branding */}
            {shouldShowInstall && (
              <button
                onClick={installApp}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#8F1D18]/85 hover:bg-[#8F1D18] text-[#E1BE68] hover:text-[#F7F0E2] border border-[#C9973E]/70 shadow-sm transition-all backdrop-blur-md cursor-pointer tracking-wider uppercase ml-1"
                title="Install Dugga Dekha on your device"
              >
                <Download className="w-3.5 h-3.5 text-[#E1BE68]" />
                <span>INSTALL DUGGA DEKHA</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons: Search & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#241714]/70 hover:bg-[#241714] text-[#F7F0E2] text-xs font-semibold border border-[#C9973E]/40 shadow-sm transition-all backdrop-blur-md"
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
              className="md:hidden p-2 rounded-xl bg-[#241714]/70 text-[#F7F0E2] border border-[#C9973E]/40 hover:text-[#E1BE68] backdrop-blur-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Glassmorphism) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-2 rounded-2xl border border-[#C9973E]/30 space-y-1.5 bg-[#180E0C]/90 backdrop-blur-2xl shadow-2xl animate-fadeIn">
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

            {/* Mobile Install Button inside drawer */}
            {shouldShowInstall && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  installApp();
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold bg-[#8F1D18]/40 text-[#E1BE68] border border-[#C9973E]/50 hover:bg-[#8F1D18] hover:text-[#F7F0E2] transition-all cursor-pointer text-left mt-2"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-[#E1BE68]" />
                  <span>INSTALL DUGGA DEKHA</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8F1D18] text-[#F7F0E2] border border-[#C9973E]/40 font-bold uppercase tracking-wider">
                  App
                </span>
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
}
