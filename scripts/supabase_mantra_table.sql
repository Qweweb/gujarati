-- Supabase SQL Table Setup for Mantra Jaap Sadhana Leaderboard
-- Run this script in Supabase SQL Editor (https://supabase.com/dashboard/project/ndivxbhhuahsspnxdtqd/sql/new)

CREATE TABLE IF NOT EXISTS public.mantra_jaap_scores (
    user_id TEXT PRIMARY KEY,
    player_name TEXT NOT NULL,
    city TEXT DEFAULT 'અમદાવાદ',
    mantra_name TEXT NOT NULL,
    target_count INT DEFAULT 108,
    total_jaaps INT DEFAULT 0,
    last_jaap_date TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Allow Public Access
ALTER TABLE public.mantra_jaap_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select mantra_jaap_scores" ON public.mantra_jaap_scores;
CREATE POLICY "Allow public select mantra_jaap_scores" ON public.mantra_jaap_scores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public upsert mantra_jaap_scores" ON public.mantra_jaap_scores;
CREATE POLICY "Allow public upsert mantra_jaap_scores" ON public.mantra_jaap_scores FOR ALL USING (true);
