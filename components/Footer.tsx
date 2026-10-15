'use client';

import React from 'react';
import DuggaLogo from './DuggaLogo';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#C9973E]/40 pt-12 pb-24 md:pb-12 px-4 sm:px-8 bg-[#120E0C]/95 backdrop-blur-xl text-[#F7F0E2] text-center text-xs relative z-10">
      <div className="max-w-4xl mx-auto space-y-4 flex flex-col items-center">
        <DuggaLogo size="lg" className="justify-center" />
        <p className="text-xs text-[#E1BE68] font-bold">
          &quot;Dugga Dekha tells you where to start and where to go next.&quot;
        </p>
        <p className="text-[11px] text-[#F7F0E2]/70 max-w-md leading-relaxed">
          Curated Kolkata Metro &amp; Bonedi Bari walking guide. Leaflet + OpenStreetMap navigation.
        </p>

        {/* Made by attribution */}
        <div className="pt-3 border-t border-[#C9973E]/30 flex items-center justify-center gap-1.5 text-xs text-[#F7F0E2]/85">
          <span>Made by</span>
          <a
            href="https://saptarshidey700.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E1BE68] hover:text-[#F7F0E2] font-bold underline underline-offset-4 decoration-[#C9973E]/70 hover:decoration-[#E1BE68] transition-all inline-flex items-center gap-1"
          >
            <span>Saptarshi Dey</span>
            <ExternalLink className="w-3 h-3 text-[#E1BE68]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
