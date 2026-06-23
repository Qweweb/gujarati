-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/ndivxbhhuahsspnxdtqd/sql/new)
-- This script adds the missing 'views' column to the 'posts' table and sets up the views increment RPC.

-- 1. Add views column to public.posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- 2. Create the increment_post_view RPC function
CREATE OR REPLACE FUNCTION public.increment_post_view(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.posts
    SET views = COALESCE(views, 0) + 1
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant execute permissions to public/anonymous users
GRANT EXECUTE ON FUNCTION public.increment_post_view(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_post_view(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_post_view(UUID) TO service_role;
