import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import ClientShell from '@/components/ClientShell';

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DUGGA DEKHA — Kolkata Durga Puja 2026 Metro & Bonedi Bari Guide',
  description:
    'Dugga Dekha tells you where to start and where to go next. Curated Kolkata pandal walking routes, Metro exits, and Bonedi Bari heritage for Durga Puja 2026.',
  keywords: [
    'Durga Puja 2026',
    'Kolkata Durga Puja Guide',
    'Dugga Dekha',
    'Kolkata Metro Puja Route',
    'South Kolkata Pandals',
    'North Kolkata Pandals',
    'Bonedi Bari Kolkata',
    'Kalighat Metro Pandals',
    'Kumartuli Puja',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#8F1D18',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F7F0E2] text-[#120E0C] selection:bg-[#8F1D18] selection:text-[#F7F0E2]">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
