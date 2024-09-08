import Image from 'next/image';

import { auth } from '@/auth';
import SignIn from '@/components/auth/signin-button';
import Profile from '@/components/profile';

export default async function Home() {
  const session = await auth();
  console.log(session, 'session');

  return (
    <main className="flex flex-col items-center justify-between p-24 h-screen">
      {!session ? <SignIn /> : <Profile session={session} />}
    </main>
  );
}
