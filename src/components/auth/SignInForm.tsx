'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

export function SignInForm() {
  const { signIn, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserMessage(null);
    try {
      setLoading(true);
      await signIn(email, password);
      router.push('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.message === 'Invalid login credentials') {
        setUserMessage('Please check your email for a confirmation link before signing in. If you have already confirmed your email, check your credentials and try again.');
      } else {
        setUserMessage(error.message || 'An error occurred during sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>

      {(error || userMessage) && (
        <div className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
          {userMessage || error?.message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="text-sm text-center text-gray-600 dark:text-gray-400">
        <p>
          Need to confirm your email?{' '}
          <button
            type="button"
            onClick={() => setUserMessage('Please check your email for the confirmation link. If you haven\'t received it, try signing up again.')}
            className="text-primary hover:underline focus:outline-none"
          >
            Click here for help
          </button>
        </p>
      </div>
    </form>
  );
} 