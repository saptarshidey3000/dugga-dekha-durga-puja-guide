'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Map, Sparkles, Bookmark } from 'lucide-react';
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
    { label: 'Home', href: '/', icon: Home, exact: true },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Routes', href: '/routes', icon: Map },
    { label: 'Plan', href: '/planner', icon: Sparkles },
    { label: 'Saved', href: '/saved', icon: Bookmark, badge: badgeCount > 0 ? badgeCount : null },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#35120F]/95 backdrop-blur-xl border-t border-[#D6A13A]/30 px-1 py-1.5 safe-area-pb shadow-[0_-8px_25px_rgba(23,19,17,0.3)]">
      <div className="grid grid-cols-5 items-center">
        {items.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#F8F0DF]'
                  : 'text-[#F8F0DF]/60 hover:text-[#E7C46A]'
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-11 h-7 rounded-full transition-all ${
                  isActive
                    ? 'bg-[#B52B20] text-[#E7C46A] border border-[#D6A13A] shadow-sm'
                    : ''
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B52B20] text-[#F8F0DF] text-[9px] font-bold flex items-center justify-center border border-[#D6A13A]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-[#E7C46A]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
