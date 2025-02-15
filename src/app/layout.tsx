import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Compound Word Game',
  description: 'A Wordle-style game where players guess compound words in stages.',
  keywords: ['word game', 'puzzle', 'compound words', 'wordle', 'daily challenge'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Compound Word Game',
    description: 'A Wordle-style game where players guess compound words in stages.',
    url: 'https://your-domain.com',
    siteName: 'Compound Word Game',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compound Word Game',
    description: 'A Wordle-style game where players guess compound words in stages.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
