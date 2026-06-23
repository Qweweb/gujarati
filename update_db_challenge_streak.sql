-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- This adds the challenge_streak column to the users table for the Daily Challenge
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS challenge_streak INT DEFAULT 0;
