'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bookmark, Compass, MapPin, Sparkles, Menu, X, Landmark } from 'lucide-react';
import { getSavedPandals, getSavedPlans } from '@/lib/storage';

interface NavbarProps {
  onOpenSearch: () => void;
}

export default function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const updateCounts = () => {
    const pandals = getSavedPandals();
    const plans = getSavedPlans();
    setSavedCount(pandals.length + plans.length);
  };

  useEffect(() => {
    updateCounts();
    const handlePandalsUpdate = () => updateCounts();
    const handlePlansUpdate = () => updateCounts();

    window.addEventListener('dugga-saved-pandals-updated', handlePandalsUpdate);
    window.addEventListener('dugga-puja-plans-updated', handlePlansUpdate);
    window.addEventListener('storage', updateCounts);

    return () => {
      window.removeEventListener('dugga-saved-pandals-updated', handlePandalsUpdate);
      window.removeEventListener('dugga-puja-plans-updated', handlePlansUpdate);
      window.removeEventListener('storage', updateCounts);
    };
  }, []);

  const navLinks = [
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Metro Guide', href: '/metro', icon: MapPin },
    { label: 'Routes', href: '/routes', icon: MapPin },
    { label: 'Bonedi Bari', href: '/bonedi', icon: Landmark },
    { label: 'AI Planner', href: '/planner', icon: Sparkles, highlight: true },
    { label: 'Saved', href: '/saved', icon: Bookmark, badge: savedCount > 0 ? savedCount : undefined },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B93624] via-[#D99A3D] to-[#071A2F] p-[1.5px] flex items-center justify-center shadow-md shadow-[#B93624]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#071A2F] flex items-center justify-center">
                {/* Durga Eye / Alpana Motif SVG */}
                <svg className="w-6 h-6 text-[#D99A3D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" fill="#B93624" stroke="#D99A3D" />
                  <path d="M12 2v2" stroke="#D99A3D" strokeWidth="1.5" />
                  <path d="M12 20v2" stroke="#D99A3D" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-editorial text-xl sm:text-2xl font-bold tracking-wider text-[#FFF8EC] group-hover:text-[#D99A3D] transition-colors leading-none">
                DUGGA <span className="text-[#B93624] font-sans text-xs tracking-normal font-semibold ml-0.5">2026</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#D99A3D]/90 font-medium">
                Kolkata Durga Puja Guide
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#B93624] text-[#FFF8EC] shadow-md shadow-[#B93624]/30'
                      : link.highlight
                      ? 'bg-[#D99A3D]/15 text-[#D99A3D] border border-[#D99A3D]/40 hover:bg-[#D99A3D]/25'
                      : 'text-[#FFF8EC]/80 hover:text-[#FFF8EC] hover:bg-[#0B223D]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#D99A3D] text-[#071A2F] font-bold">
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
              aria-label="Search Pandals and Metro"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B223D] border border-[#D99A3D]/30 text-xs text-[#FFF8EC]/80 hover:text-[#FFF8EC] hover:border-[#D99A3D] transition-colors shadow-sm"
            >
              <Search className="w-4 h-4 text-[#D99A3D]" />
              <span className="hidden sm:inline">Search Puja or Metro...</span>
            </button>

            <Link
              href="/saved"
              className="relative p-2 rounded-full bg-[#0B223D] border border-[#D99A3D]/25 text-[#FFF8EC]/80 hover:text-[#D99A3D] md:hidden transition-colors"
              aria-label="Saved Plans"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B93624] text-[#FFF8EC] text-[9px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="p-2 rounded-full bg-[#0B223D] border border-[#D99A3D]/25 text-[#FFF8EC] md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#D99A3D]/20 flex flex-col gap-1.5 animate-fadeIn">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#B93624] text-[#FFF8EC]'
                      : 'text-[#FFF8EC]/90 hover:bg-[#0B223D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#D99A3D]" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#D99A3D] text-[#071A2F] font-bold">
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
