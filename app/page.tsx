import { redirect } from 'next/navigation';

// Prevent static prerendering — redirect() requires dynamic (request) context
export const dynamic = 'force-dynamic';

export default function RootPage() {
  redirect('/login');
}
