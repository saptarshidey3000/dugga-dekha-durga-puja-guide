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
  themeColor: '#071A2F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col selection:bg-[#B93624] selection:text-[#FFF8EC]">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
