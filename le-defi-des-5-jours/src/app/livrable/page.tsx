import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import LivrableAuth from '@/components/LivrableAuth';

type Props = {
  searchParams: Promise<{ company?: string; auth?: string }>;
};

export default async function LivrablePage({ searchParams }: Props) {
  const params = await searchParams;
  const company = params.company ?? '';

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('defi-session');
  const session = sessionCookie ? getSession(sessionCookie.value) : null;

  return (
    <LivrableAuth
      company={company}
      initialAuthenticated={!!session}
      sessionCompany={session?.company ?? company}
    />
  );
}
