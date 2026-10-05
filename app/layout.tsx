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
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/app-icon.png', sizes: '1254x1254', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Dugga Dekha',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#8F1D18',
};

import PWAInstallProvider from '@/components/PWAInstallProvider';
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#120E0C] text-[#F7F0E2] selection:bg-[#8F1D18] selection:text-[#E1BE68]">
        <PWAInstallProvider>
          <ClientShell>{children}</ClientShell>
        </PWAInstallProvider>
        <Analytics />
      </body>
    </html>
  );
}
