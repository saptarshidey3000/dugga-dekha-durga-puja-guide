'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ArrowRight, Search, Check } from 'lucide-react';

export interface DropdownItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  href: string;
  group?: string;
  icon?: string;
  highlight?: string;
}

interface QuickJumpDropdownProps {
  items: DropdownItem[];
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  variant?: 'metro' | 'bonedi' | 'gold';
  className?: string;
}

export default function QuickJumpDropdown({
  items,
  placeholder = 'Select a destination to jump...',
  label = 'Quick Station / Hub Jump:',
  icon,
  variant = 'metro',
  className = '',
}: QuickJumpDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      setSearchFilter('');
    }
  }, [isOpen]);

  const filteredItems = items.filter((item) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      (item.badge && item.badge.toLowerCase().includes(q)) ||
      (item.group && item.group.toLowerCase().includes(q))
    );
  });

  const handleSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  // Group items if any have groups
  const hasGroups = items.some((i) => !!i.group);
  const groupedItems: Record<string, DropdownItem[]> = {};
  if (hasGroups) {
    filteredItems.forEach((i) => {
      const g = i.group || 'Other';
      if (!groupedItems[g]) groupedItems[g] = [];
      groupedItems[g].push(i);
    });
  }

  // Variant accent styling
  const accentStyles =
    variant === 'bonedi'
      ? {
          badgeBg: 'bg-[#8F1D18]',
          badgeText: 'text-[#E1BE68]',
          borderHover: 'hover:border-[#E1BE68]',
          accentGlow: 'focus:border-[#E1BE68] shadow-amber-900/30',
        }
      : {
          badgeBg: 'bg-[#8F1D18]',
          badgeText: 'text-[#E1BE68]',
          borderHover: 'hover:border-[#E1BE68]',
          accentGlow: 'focus:border-[#E1BE68] shadow-red-900/30',
        };

  return (
    <div ref={dropdownRef} className={`relative w-full ${isOpen ? 'z-[90]' : 'z-10'} ${className}`}>
      {label && (
        <div className="flex items-center justify-between gap-2 mb-2 bg-[#120E0C]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#C9973E]/40 shadow-sm">
          <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#E1BE68] flex items-center gap-1.5">
            {icon}
            <span>{label}</span>
          </label>
          <span className="text-[10px] text-[#F7F0E2]/75 font-semibold hidden sm:inline">
            Tap to open route immediately
          </span>
        </div>
      )}

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full py-3 px-4 rounded-2xl bg-[#120E0C] text-[#F7F0E2] border-2 border-[#C9973E]/50 hover:border-[#E1BE68] shadow-lg flex items-center justify-between gap-3 text-left transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#E1BE68]/50`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <span className="text-base shrink-0 group-hover:scale-110 transition-transform">
            {icon || '🚇'}
          </span>
          <div className="truncate">
            <span className="text-xs sm:text-sm font-bold text-[#F7F0E2] group-hover:text-[#E1BE68] transition-colors block truncate">
              {placeholder}
            </span>
            <span className="text-[10px] text-[#E1BE68]/70 block truncate">
              {items.length} Hubs Available • Instant Redirect
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#8F1D18] text-[#E1BE68] border border-[#C9973E]/50">
            {items.length} Options
          </span>
          <div
            className={`w-7 h-7 rounded-xl bg-[#241714] border border-[#C9973E]/40 flex items-center justify-center text-[#E1BE68] transition-transform duration-200 ${
              isOpen ? 'rotate-180 bg-[#8F1D18]' : 'group-hover:bg-[#35120F]'
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {/* Dropdown Popover List */}
      {isOpen && (
        <div className="absolute z-[100] left-0 right-0 mt-2 bg-[#120E0C]/98 backdrop-blur-2xl border-2 border-[#C9973E] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[380px] flex flex-col">
          {/* Quick Filter Search if items > 4 */}
          {items.length > 4 && (
            <div className="p-2.5 border-b border-[#C9973E]/30 bg-[#241714]/80">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#E1BE68]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Type to filter stations..."
                  className="w-full bg-[#120E0C] text-xs text-[#F7F0E2] placeholder-[#F7F0E2]/40 rounded-xl pl-8 pr-3 py-1.5 border border-[#C9973E]/40 focus:outline-none focus:border-[#E1BE68]"
                />
              </div>
            </div>
          )}

          {/* List of Destinations */}
          <div className="overflow-y-auto p-1.5 space-y-1 divide-y divide-[#C9973E]/15">
            {filteredItems.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#F7F0E2]/60 font-medium">
                No matching destination found for &quot;{searchFilter}&quot;
              </div>
            ) : hasGroups ? (
              Object.entries(groupedItems).map(([groupName, groupList]) => (
                <div key={groupName} className="pt-2 first:pt-0">
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#E1BE68]/80 bg-[#241714]/60 rounded-md mb-1">
                    {groupName}
                  </div>
                  {groupList.map((item) => renderOptionItem(item))}
                </div>
              ))
            ) : (
              filteredItems.map((item) => renderOptionItem(item))
            )}
          </div>
        </div>
      )}
    </div>
  );

  function renderOptionItem(item: DropdownItem) {
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleSelect(item.href)}
        className="w-full p-2.5 rounded-xl hover:bg-[#8F1D18]/40 active:bg-[#8F1D18]/70 border border-transparent hover:border-[#E1BE68]/50 text-left transition-all flex items-center justify-between gap-3 group/item cursor-pointer"
      >
        <div className="flex items-center gap-2.5 truncate">
          <span className="text-base shrink-0 group-hover/item:scale-110 transition-transform">
            {item.icon || '🚇'}
          </span>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-[#F7F0E2] group-hover/item:text-[#E1BE68] transition-colors truncate">
                {item.title}
              </span>
              {item.subtitle && (
                <span className="text-[11px] text-[#E1BE68] font-serif shrink-0">
                  ({item.subtitle})
                </span>
              )}
            </div>
            {item.highlight && (
              <p className="text-[10px] text-[#F7F0E2]/70 truncate mt-0.5">
                {item.highlight}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {item.badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#8F1D18] text-[#E1BE68] border border-[#C9973E]/50 shadow-xs">
              {item.badge}
            </span>
          )}
          <div className="w-6 h-6 rounded-lg bg-[#241714] border border-[#C9973E]/40 flex items-center justify-center text-[#E1BE68] group-hover/item:translate-x-0.5 group-hover/item:bg-[#8F1D18] transition-all">
            <ArrowRight className="w-3 h-3 text-[#E1BE68]" />
          </div>
        </div>
      </button>
    );
  }
}
