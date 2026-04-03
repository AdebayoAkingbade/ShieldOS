import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

// Force all pages to render dynamically — the app uses Redux + localStorage
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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
