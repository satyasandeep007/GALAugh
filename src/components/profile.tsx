'use client';

import Image from 'next/image';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';

import SignOut from '@/components/auth/signout-button';
import Loading from '@/components/loading';
import {
  formatEther,
  getPublicClient,
  getWalletClient,
  initClients,
  parseEther,
} from '@/lib/client';
import { decodeToken, web3auth } from '@/lib/web3auth';

type UserInfoProps = {
  session: Session | null;
};

export default function UserInfo({ session }: UserInfoProps) {
  const [provider, setProvider] = useState<any>(null);
  const [publicAddress, setPublicAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [signature, setSignature] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const fetchAddressAndBalance = async () => {
    const walletClient = getWalletClient();
    const publicClient = getPublicClient();

    if (walletClient && publicClient) {
      try {
        const addresses = await walletClient.getAddresses();
        if (addresses && addresses.length > 0) {
          setPublicAddress(addresses[0]);
          const amount = await publicClient.getBalance({
            address: addresses[0],
          });
          setBalance(formatEther(amount || BigInt(0)));
        }
      } catch (error) {
        console.error('Error fetching address and balance:', error);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (web3auth.status === 'not_ready') {
          await web3auth.init();
        }
        if (web3auth.status === 'connected') {
          setProvider(web3auth.provider);
        } else if (session?.idToken) {
          console.log(session, 'session');

          const { payload } = decodeToken(session.idToken);
          console.log(payload, 'payload');

          const w3aProvider = await web3auth.connect({
            verifier: 'next-auth-w3a', // Use your verifier name
            verifierId: (payload as any).email,
            idToken: session.idToken,
          });
          console.log(w3aProvider, 'w3aProvider');
          setProvider(w3aProvider);
          initClients();
        }
      } catch (error) {
        console.error('Error initializing & connecting to web3auth:', error);
        setProvider(null);
        setPublicAddress(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      init();
    }
  }, [session]);

  useEffect(() => {
    if (provider) {
      fetchAddressAndBalance();
      const interval = setInterval(fetchAddressAndBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [provider]);

  const signMessage = async () => {
    const walletClient = getWalletClient();
    if (walletClient) {
      const sig = await walletClient.signMessage({
        account: publicAddress as `0x${string}`,
        message: 'Hello, world!',
      });
      console.log('Signature:', sig);
      setSignature(sig);
    }
  };

  const sendTransaction = async () => {
    const walletClient = getWalletClient();
    const publicClient = getPublicClient();
    const destination = '0xeaA8Af602b2eDE45922818AE5f9f7FdE50cFa1A8';
    const amount = parseEther('0.0001');
    if (walletClient && publicClient) {
      const hash = await walletClient.sendTransaction({
        account: publicAddress as `0x${string}`,
        to: destination as `0x${string}`,
        value: amount,
        chain: walletClient.chain,
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Transaction receipt:', receipt);
      setTransactionHash(hash);
    }
  };

  if (!session) return null;

  return (
    <div className="bg-white dark:bg-zinc-800/30 shadow-lg rounded-lg p-8 max-w-md w-full mx-auto mt-10">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : (
        publicAddress && (
          <>
            <div className="flex flex-col items-center space-y-4">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt="Profile picture"
                  width={140}
                  height={140}
                  className="rounded-full border-4 border-blue-500"
                  priority
                />
              )}
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {session.user?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {session.user?.email}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {publicAddress}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {balance} ETH
              </p>
              <SignOut />
            </div>

            <div className="bg-white dark:bg-zinc-800/30 shadow-lg rounded-lg p-8 max-w-md w-full mx-auto mt-10">
              <h2 className="text-l font-bold text-gray-800 dark:text-white">
                SignMessage & SendTransaction
              </h2>
              <button
                onClick={signMessage}
                className="bg-amber-600 text-white px-3 py-1 mt-4 mr-4 rounded-md"
              >
                Sign Message
              </button>
              <button
                onClick={sendTransaction}
                className="bg-amber-600 text-white px-3 py-1 mt-4 rounded-md"
              >
                Send Transaction
              </button>
            </div>

            {transactionHash && (
              <div className="mt-4 p-2 bg-gray-100 dark:bg-zinc-700 rounded">
                <p className="text-sm break-all">
                  Transaction Hash:{' '}
                  <a
                    className="text-blue-500"
                    href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {transactionHash}
                  </a>
                </p>
              </div>
            )}
            {signature && (
              <div className="mt-4 p-2 bg-gray-100 dark:bg-zinc-700 rounded">
                <p className="text-sm break-all">Signature: {signature}</p>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
