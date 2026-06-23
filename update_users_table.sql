-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- This script adds the missing profile columns to the public.users table

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS dob TEXT;

-- Index for faster search on email and mobile
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_mobile_idx ON public.users(mobile);
