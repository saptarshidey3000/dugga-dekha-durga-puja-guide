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
  title: 'DUGGA Dekha — Kolkata Durga Puja Guide 2026',
  description:
    'Find the Puja. Follow the route. Experience more. Curated Kolkata pandal walking routes, Metro exits, Bonedi Bari heritage, and AI Puja Planner for Durga Puja 2026.',
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
  themeColor: '#7E1815',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8F0DF] text-[#171311] selection:bg-[#B52B20] selection:text-[#F8F0DF]">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
