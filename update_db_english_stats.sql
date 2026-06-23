-- Run this in your Supabase SQL Editor to add English tracking columns to the users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS english_xp INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS english_streak INT DEFAULT 0;
