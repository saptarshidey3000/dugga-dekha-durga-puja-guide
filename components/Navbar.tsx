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
      <header className="sticky top-0 z-40 w-full glass-nav-red px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B52B20] via-[#D6A13A] to-[#35120F] p-[1.5px] flex items-center justify-center shadow-md shadow-[#35120F]/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#7E1815] flex items-center justify-center">
                {/* Durga Eye / Alpana Motif SVG */}
                <svg className="w-6 h-6 text-[#E7C46A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" fill="#B52B20" stroke="#E7C46A" />
                  <path d="M12 2v2" stroke="#E7C46A" strokeWidth="1.5" />
                  <path d="M12 20v2" stroke="#E7C46A" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-editorial text-xl sm:text-2xl font-bold tracking-wider text-[#F8F0DF] group-hover:text-[#E7C46A] transition-colors leading-none">
                DUGGA <span className="text-[#E7C46A] font-sans text-xs tracking-normal font-bold ml-0.5">2026</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#F8F0DF]/80 font-medium">
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
                      ? 'bg-[#B52B20] text-[#F8F0DF] border border-[#D6A13A]/60 shadow-md'
                      : link.highlight
                      ? 'bg-[#D6A13A]/20 text-[#E7C46A] border border-[#D6A13A]/50 hover:bg-[#D6A13A]/30'
                      : 'text-[#F8F0DF]/90 hover:text-[#F8F0DF] hover:bg-[#35120F]/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#E7C46A]" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#D6A13A] text-[#35120F] font-bold">
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#35120F]/70 border border-[#D6A13A]/40 text-xs text-[#F8F0DF] hover:text-[#F8F0DF] hover:border-[#D6A13A] transition-colors shadow-sm"
            >
              <Search className="w-4 h-4 text-[#E7C46A]" />
              <span className="hidden sm:inline text-[#F8F0DF]/90">Search Puja or Metro...</span>
            </button>

            <Link
              href="/saved"
              className="relative p-2 rounded-full bg-[#35120F]/70 border border-[#D6A13A]/40 text-[#F8F0DF] hover:text-[#E7C46A] md:hidden transition-colors"
              aria-label="Saved Plans"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B52B20] text-[#F8F0DF] text-[9px] font-bold flex items-center justify-center border border-[#D6A13A]">
                  {savedCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="p-2 rounded-full bg-[#35120F]/70 border border-[#D6A13A]/40 text-[#F8F0DF] md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#E7C46A]" /> : <Menu className="w-5 h-5 text-[#E7C46A]" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#D6A13A]/30 flex flex-col gap-1.5 animate-fadeIn">
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
                      ? 'bg-[#B52B20] text-[#F8F0DF] border border-[#D6A13A]/50'
                      : 'text-[#F8F0DF]/90 hover:bg-[#35120F]/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#E7C46A]" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#D6A13A] text-[#35120F] font-bold">
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
