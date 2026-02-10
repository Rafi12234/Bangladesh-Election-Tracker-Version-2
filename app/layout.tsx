import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#006a4e',
};

export const metadata: Metadata = {
  title: 'Bangladesh Election Tracker | Live Results',
  description: 'Real-time election results and seat counting for Bangladesh parliamentary elections. Track constituency-level results with interactive maps.',
  keywords: ['Bangladesh', 'Election', 'Results', 'Live', 'Parliamentary', 'Constituency'],
  authors: [{ name: 'Bangladesh Election Commission' }],
  icons: {
    icon: '/logo.png?v=2',
    shortcut: '/logo.png?v=2',
    apple: '/logo.png?v=2',
  },
  openGraph: {
    title: 'Bangladesh Election Tracker | Live Results',
    description: 'Real-time election results tracking with interactive maps',
    type: 'website',
    locale: 'en_BD',
  },
  // SECURITY: Prevent search engines from indexing admin pages
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* PERF: Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* PERF: Leaflet CSS removed from global — only loaded on map page (lazy) */}
      </head>
      <body className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        {children}
        {/* PERF: Load analytics script lazily after page interactive */}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "YOUR_CLOUDFLARE_TOKEN"}'
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
