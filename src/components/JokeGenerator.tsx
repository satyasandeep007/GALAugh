'use client';

import React, { useState, useEffect } from 'react';
import { web3auth } from '@/lib/web3auth';
import { contractABI } from '@/config/abi';
import Loading from '@/components/loading';
import { getWalletClient, getPublicClient, initClients } from '@/lib/client';
import { galadriel } from '@/config/chainConfig';

export default function JokeGenerator() {
  const [keyword, setKeyword] = useState('');
  const [joke, setJoke] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (web3auth.status === 'not_ready') {
          await web3auth.init();
        }
        if (web3auth.status === 'connected') {
          await initClients();
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing:', error);
        setError(
          'Failed to initialize. Please check your connection and try again.'
        );
      }
    };

    init();
  }, []);

  const generateJoke = async () => {
    setError(null);
    const walletClient = getWalletClient();
    const publicClient = getPublicClient();
    if (!walletClient || !publicClient) {
      setError(
        'Wallet or public client not initialized. Please connect your wallet.'
      );
      return;
    }

    setIsGenerating(true);
    try {
      const contractAddress = '0x13C081cfec90B538dc8334D405Df2F24a41b76B2';
      // Check if the address is a contract
      const code = await publicClient.getBytecode({ address: contractAddress });
      if (!code) {
        throw new Error('The provided address is not a contract');
      }

      const [address] = await walletClient.getAddresses();

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract({
        account: address,
        address: contractAddress,
        abi: contractABI,
        functionName: 'sendMessage',
        args: ['Tell Me a joke on ' + keyword],
        chain: galadriel,
      });

      setTransactionHash(hash);

      // Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Transaction receipt:', receipt);

      // Poll for response
      const checkResponse = async () => {
        const response = await publicClient.readContract({
          address: contractAddress,
          abi: contractABI,
          functionName: 'response',
        });
        if (response) {
          setJoke(response as string);
          setIsGenerating(false);
        } else {
          setTimeout(checkResponse, 2000);
        }
      };
      checkResponse();
    } catch (error) {
      console.error('Error generating joke:', error);
      setError(`Failed to generate joke: ${(error as Error).message}`);
      setIsGenerating(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-800/30 shadow-lg rounded-lg p-8 max-w-md w-full mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Joke Generator
      </h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="mb-4">
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Enter a keyword for the joke"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>
      <button
        onClick={generateJoke}
        disabled={isGenerating || !isInitialized}
        className="bg-purple-600 text-white px-4 py-2 rounded-md w-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:bg-purple-400"
      >
        {isGenerating ? 'Generating...' : 'Generate Joke'}
      </button>
      {joke && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-zinc-700 rounded-md">
          <p className="text-gray-800 dark:text-white">{joke}</p>
        </div>
      )}
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
    </div>
  );
}
