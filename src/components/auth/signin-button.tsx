'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn('google', {
        callbackUrl: '/',
        redirect: false,
      });
      if (result?.error) {
        setError(result.error);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col items-center justify-center p-4 w-full">
      <div className="text-center mb-8">
        <Image
          src="/logo.png"
          alt="Galaugh Logo"
          width={150}
          height={150}
          className="mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome to Galaugh
        </h1>
        <p className="text-xl text-white opacity-80">
          Where laughter meets the cosmos!
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Join the Galactic Humor
        </h2>
        <button
          onClick={handleSignIn}
          className="w-full bg-blue-500 text-white p-3 rounded-md text-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            <>
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              Sign in with Google
            </>
          )}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      <footer className="mt-8 text-white text-sm opacity-70">
        &copy; 2023 Galaugh. All rights reserved.
      </footer>
    </div>
  );
}
