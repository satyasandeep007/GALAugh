import { motion } from 'framer-motion';
import Image from 'next/image';

import SignOut from '@/components/auth/signout-button';

export default function Header({ session, balance, isLoading }: any) {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-purple-600">GALAugh</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Image
            src={session.user.image}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-sm">{session.user.name}</span>
          <span className="text-xs text-gray-500">
            {parseFloat(balance).toFixed(2)} ETH
          </span>
        </div>
        <div className="ml-4">
          <SignOut />
        </div>
      </div>
    </header>
  );
}
