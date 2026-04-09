import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const roboto = Roboto({ weight: ['300', '400', '500', '700'], subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

// Force all pages to render dynamically - the app uses Redux + localStorage
// which cannot be serialized during static generation.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ostec | Unified Cybersecurity Platform',
  description: 'Enterprise cybersecurity intelligence platform for unified visibility and response.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
