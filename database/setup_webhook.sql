-- ==============================================================
-- DATABASE WEBHOOK TRIGGER FOR AUTOMATIC PUSH NOTIFICATIONS
-- ==============================================================
--
-- This script sets up a PostgreSQL trigger on the 'posts' table.
-- Whenever a new row is inserted, it calls the 'send-post-notification' 
-- Edge Function asynchronously.
--
-- RUN THIS IN THE SUPABASE SQL EDITOR, OR USE THE DASHBOARD UI:
-- (Supabase Dashboard -> Database -> Webhooks -> Create Webhook)
-- ==============================================================

-- 1. Enable pg_net extension if not enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Create helper function to trigger the webhook
CREATE OR REPLACE FUNCTION public.handle_new_post_notification()
RETURNS TRIGGER AS $$
DECLARE
  project_url TEXT := 'https://ndivxbhhuahsspnxdtqd.supabase.co'; -- Your Supabase project URL
  anon_key TEXT;
BEGIN
  -- We fetch the anon key or service key for auth (can also be passed manually)
  anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaXZ4YmhodWFoc3NwbnhkdHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1OTUyNzgsImV4cCI6MjA5NTE3MTI3OH0.NIam-eAOcjDDFsBjEFHss4fwU8VqOkgqdHI7Pflrvz8';

  PERFORM net.http_post(
    url := project_url || '/functions/v1/send-post-notification',
    body := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA,
      'record', row_to_json(NEW),
      'old_record', NULL
    ),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', anon_key,
      'Authorization', 'Bearer ' || anon_key
    ),
    timeout_milliseconds := 5000
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Drop trigger if already exists
DROP TRIGGER IF EXISTS on_new_post_inserted ON public.posts;

-- 4. Set trigger to run AFTER INSERT on 'posts'
CREATE TRIGGER on_new_post_inserted
  AFTER INSERT ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_post_notification();

-- ==============================================================
-- OPTIONAL: INSTRUCTIONS FOR DASHBOARD UI SETUP (Alternative)
-- ==============================================================
-- 1. Go to Supabase Dashboard -> Database -> Webhooks.
-- 2. Click "Create Webhook".
-- 3. Enter Name: "send_post_notification".
-- 4. Select Table: "posts".
-- 5. Under "Events", check only: "Insert".
-- 6. Under "Webhook Action", select: "Supabase Edge Function".
-- 7. Select HTTP Method: "POST".
-- 8. Select Edge Function: "send-post-notification".
-- 9. Click "Create Webhook" to save.
-- ==============================================================
