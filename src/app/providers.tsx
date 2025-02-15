'use client';

import { ThemeProvider } from 'next-themes';
import { useGameStore } from '@/lib/store/gameStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const { settings } = useGameStore();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={settings.darkMode ? 'dark' : 'light'}
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
} 