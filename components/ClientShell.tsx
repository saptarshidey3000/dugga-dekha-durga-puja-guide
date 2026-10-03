'use client';

import React, { useState } from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import SearchModal from './SearchModal';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#071A2F] text-[#FFF8EC]">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <BottomNav />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
