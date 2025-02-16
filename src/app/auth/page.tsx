'use client';

import { useState } from 'react';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useAuth } from '@/lib/auth/AuthContext';
import { redirect } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const { user } = useAuth();

  // Redirect to home if already authenticated
  if (user) {
    redirect('/');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Compound Word Game</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {mode === 'signin' ? 'Sign in to continue' : 'Create an account to get started'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors
                ${mode === 'signin'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors
                ${mode === 'signup'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              Sign Up
            </button>
          </div>

          {mode === 'signin' ? <SignInForm /> : <SignUpForm />}
        </div>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-primary hover:underline focus:outline-none"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-primary hover:underline focus:outline-none"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
} 