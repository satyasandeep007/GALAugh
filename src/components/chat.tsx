'use client';

import { useEffect, useState, useRef } from 'react';
import JokeGenerator from '@/components/JokeGenerator';
import {
  formatEther,
  getPublicClient,
  getWalletClient,
  initClients,
  parseEther,
} from '@/lib/client';
import { decodeToken, web3auth } from '@/lib/web3auth';
import Header from '@/components/layout/Header';

export default function Chat({ session }: any) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { type: 'user' | 'bot'; content: string }[]
  >([]);
  const [provider, setProvider] = useState<any>(null);
  const [publicAddress, setPublicAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>('0');
  const [isLoading, setIsLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (web3auth.status === 'not_ready') {
          await web3auth.init();
        }
        if (web3auth.status === 'connected') {
          setProvider(web3auth.provider);
        } else if (session?.idToken) {
          const { payload } = decodeToken(session.idToken);
          const w3aProvider = await web3auth.connect({
            verifier: 'next-auth-w3a',
            verifierId: (payload as any).email,
            idToken: session.idToken,
          });
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
    if (provider) {
      fetchAddressAndBalance();
      const interval = setInterval(fetchAddressAndBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [provider]);

  const generateJoke = async () => {
    setIsLoading(true);
    try {
      // Replace this with your actual AI joke generation API call
      const response = await fetch('/api/generate-joke');
      const data = await response.json();
      setMessages(prev => [...prev, { type: 'bot', content: data.joke }]);
    } catch (error) {
      console.error('Error generating joke:', error);
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          content: "Sorry, I couldn't think of a joke right now.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setInput('');
    generateJoke();
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-400 w-full">
      <Header session={session} balance={balance} isLoading={isLoading} />

      <JokeGenerator />
    </div>
  );
}
