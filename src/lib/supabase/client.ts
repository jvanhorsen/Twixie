import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          username: string | null;
          streak: number;
          highest_streak: number;
          total_score: number;
          games_played: number;
        };
        Insert: {
          id: string;
          created_at?: string;
          username?: string | null;
          streak?: number;
          highest_streak?: number;
          total_score?: number;
          games_played?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          username?: string | null;
          streak?: number;
          highest_streak?: number;
          total_score?: number;
          games_played?: number;
        };
      };
      daily_puzzles: {
        Row: {
          id: string;
          date: string;
          word: string;
          difficulty: 'easy' | 'medium' | 'hard';
          first_segment: string;
        };
        Insert: {
          id?: string;
          date: string;
          word: string;
          difficulty: 'easy' | 'medium' | 'hard';
          first_segment: string;
        };
        Update: {
          id?: string;
          date?: string;
          word?: string;
          difficulty?: 'easy' | 'medium' | 'hard';
          first_segment?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          puzzle_id: string;
          completed: boolean;
          score: number;
          attempts: number;
          time_taken: number;
          hints_used: number;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          puzzle_id: string;
          completed?: boolean;
          score?: number;
          attempts?: number;
          time_taken?: number;
          hints_used?: number;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          puzzle_id?: string;
          completed?: boolean;
          score?: number;
          attempts?: number;
          time_taken?: number;
          hints_used?: number;
          completed_at?: string | null;
        };
      };
    };
  };
}; 