import Image from 'next/image';

import { auth } from '@/auth';
import SignIn from '@/components/auth/signin-button';
import Profile from '@/components/profile';
import Chat from '@/components/chat';

export default async function Home() {
  const session = await auth();
  console.log(session, 'session');

  return (
    <main className="flex h-screen">
      {!session ? <SignIn /> : <Chat session={session} />}
    </main>
  );
}
