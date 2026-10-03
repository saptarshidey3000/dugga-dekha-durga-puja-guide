'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Map, Sparkles, Bookmark } from 'lucide-react';
import { getSavedPandals, getSavedPlans } from '@/lib/storage';

export default function BottomNav() {
  const pathname = usePathname();
  const [badgeCount, setBadgeCount] = useState(0);

  const syncCount = () => {
    const p = getSavedPandals();
    const pl = getSavedPlans();
    setBadgeCount(p.length + pl.length);
  };

  useEffect(() => {
    syncCount();
    const onPandalsUpdated = () => syncCount();
    const onPlansUpdated = () => syncCount();

    window.addEventListener('dugga-saved-pandals-updated', onPandalsUpdated);
    window.addEventListener('dugga-puja-plans-updated', onPlansUpdated);
    return () => {
      window.removeEventListener('dugga-saved-pandals-updated', onPandalsUpdated);
      window.removeEventListener('dugga-puja-plans-updated', onPlansUpdated);
    };
  }, []);

  const items = [
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Routes', href: '/routes', icon: Map },
    { label: 'AI Planner', href: '/planner', icon: Sparkles, highlight: true },
    { label: 'Saved', href: '/saved', icon: Bookmark, badge: badgeCount > 0 ? badgeCount : null },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#071A2F]/95 backdrop-blur-lg border-t border-[#D99A3D]/25 px-2 py-2 safe-area-pb shadow-2xl">
      <div className="grid grid-cols-4 items-center">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#FFF8EC]'
                  : item.highlight
                  ? 'text-[#D99A3D]'
                  : 'text-[#D8CEBE]/70 hover:text-[#FFF8EC]'
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-all ${
                  isActive
                    ? 'bg-[#B93624] text-[#FFF8EC] shadow-sm'
                    : item.highlight
                    ? 'bg-[#D99A3D]/20 text-[#D99A3D]'
                    : ''
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B93624] text-[#FFF8EC] text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium tracking-tight ${isActive ? 'font-semibold text-[#FFF8EC]' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
