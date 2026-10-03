'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Train, Landmark, Bookmark } from 'lucide-react';
import { getSavedPandals } from '@/lib/storage';

export default function BottomNav() {
  const pathname = usePathname();
  const [badgeCount, setBadgeCount] = useState(0);

  const syncCount = () => {
    const p = getSavedPandals();
    setBadgeCount(p.length);
  };

  useEffect(() => {
    syncCount();
    const onPandalsUpdated = () => syncCount();
    window.addEventListener('dugga-saved-pandals-updated', onPandalsUpdated);
    return () => {
      window.removeEventListener('dugga-saved-pandals-updated', onPandalsUpdated);
    };
  }, []);

  const items = [
    { label: 'Home', href: '/', icon: Home, exact: true },
    { label: 'Metro', href: '/metro', icon: Train },
    { label: 'Bonedi', href: '/bonedi', icon: Landmark },
    { label: 'Saved', href: '/saved', icon: Bookmark, badge: badgeCount > 0 ? badgeCount : null },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#241714]/95 backdrop-blur-xl border-t border-[#C9973E]/30 px-3 py-2 safe-area-pb shadow-[0_-8px_25px_rgba(18,14,12,0.4)]">
      <div className="grid grid-cols-4 items-center">
        {items.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#F7F0E2]'
                  : 'text-[#F7F0E2]/60 hover:text-[#E1BE68]'
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-12 h-7 rounded-full transition-all ${
                  isActive
                    ? 'bg-[#8F1D18] text-[#E1BE68] border border-[#C9973E] shadow-sm'
                    : ''
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C9973E] text-[#120E0C] text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
