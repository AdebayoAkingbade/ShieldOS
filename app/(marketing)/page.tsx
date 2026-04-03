// SERVER COMPONENT — no 'use client' so route segment configs are respected
import { LandingPageClient } from './ClientWrapper';

// This tells Next.js to NEVER statically prerender this route.
// Required because the client component uses GSAP + browser-only APIs.
export const dynamic = 'force-dynamic';

export default function LandingPage() {
  return <LandingPageClient />;
}
