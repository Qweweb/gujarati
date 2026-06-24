-- ========================================================
-- SECURITY MIGRATION: ENABLE ROW LEVEL SECURITY (RLS)
-- Run this in your Supabase SQL Editor to secure all tables.
-- ========================================================

-- Disable warnings for policy creation if they already exist
SET client_min_messages = warning;

-- 1. USERS TABLE
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on users" ON public.users;
DROP POLICY IF EXISTS "Allow public insert on users" ON public.users;
DROP POLICY IF EXISTS "Allow updates on users" ON public.users;

CREATE POLICY "Allow public read access on users" ON public.users
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert on users" ON public.users
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow updates on users" ON public.users
    FOR UPDATE USING (true);


-- 2. LOCATIONS TABLE
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on locations" ON public.locations;

CREATE POLICY "Allow public read access on locations" ON public.locations
    FOR SELECT USING (true);


-- 3. POSTS TABLE (બેઠક / ઓટલો)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public insert on posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public update on posts" ON public.posts;
DROP POLICY IF EXISTS "Allow delete on posts" ON public.posts;

CREATE POLICY "Allow public read access on posts" ON public.posts
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert on posts" ON public.posts
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on posts" ON public.posts
    FOR UPDATE USING (true);
CREATE POLICY "Allow delete on posts" ON public.posts
    FOR DELETE USING (true);


-- 4. POST COMMENTS TABLE
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on post_comments" ON public.post_comments;
DROP POLICY IF EXISTS "Allow public insert on post_comments" ON public.post_comments;
DROP POLICY IF EXISTS "Allow public update on post_comments" ON public.post_comments;
DROP POLICY IF EXISTS "Allow public delete on post_comments" ON public.post_comments;

CREATE POLICY "Allow public read access on post_comments" ON public.post_comments
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert on post_comments" ON public.post_comments
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on post_comments" ON public.post_comments
    FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on post_comments" ON public.post_comments
    FOR DELETE USING (true);


-- 5. POST REACTIONS TABLE
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Reactions are viewable by everyone" ON public.post_reactions;
DROP POLICY IF EXISTS "Anyone can insert reactions" ON public.post_reactions;
DROP POLICY IF EXISTS "Anyone can update reactions" ON public.post_reactions;
DROP POLICY IF EXISTS "Anyone can delete reactions" ON public.post_reactions;

CREATE POLICY "Reactions are viewable by everyone" ON public.post_reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reactions" ON public.post_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update reactions" ON public.post_reactions FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete reactions" ON public.post_reactions FOR DELETE USING (true);


-- 6. BUSINESSES TABLE
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on businesses" ON public.businesses;
DROP POLICY IF EXISTS "Allow public insert on businesses" ON public.businesses;
DROP POLICY IF EXISTS "Allow public update on businesses" ON public.businesses;

CREATE POLICY "Allow public read access on businesses" ON public.businesses
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert on businesses" ON public.businesses
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on businesses" ON public.businesses
    FOR UPDATE USING (true);


-- 7. OFFERS TABLE
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on offers" ON public.offers;
DROP POLICY IF EXISTS "Allow public insert on offers" ON public.offers;
DROP POLICY IF EXISTS "Allow public update on offers" ON public.offers;

CREATE POLICY "Allow public read access on offers" ON public.offers
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert on offers" ON public.offers
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on offers" ON public.offers
    FOR UPDATE USING (true);


-- 8. REDEMPTIONS TABLE
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on redemptions" ON public.redemptions;
DROP POLICY IF EXISTS "Allow public insert on redemptions" ON public.redemptions;

CREATE POLICY "Allow public read access on redemptions" ON public.redemptions
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert on redemptions" ON public.redemptions
    FOR INSERT WITH CHECK (true);


-- 9. QUIZ QUESTIONS TABLE
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on quiz_questions" ON public.quiz_questions;

CREATE POLICY "Allow public read access on quiz_questions" ON public.quiz_questions
    FOR SELECT USING (true);


-- 10. USER QUIZ ATTEMPTS TABLE
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on user_quiz_attempts" ON public.user_quiz_attempts;
DROP POLICY IF EXISTS "Allow public insert on user_quiz_attempts" ON public.user_quiz_attempts;

CREATE POLICY "Allow public read access on user_quiz_attempts" ON public.user_quiz_attempts
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert on user_quiz_attempts" ON public.user_quiz_attempts
    FOR INSERT WITH CHECK (true);


-- 11. REFERRALS TABLE
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on referrals" ON public.referrals;
DROP POLICY IF EXISTS "Allow public insert on referrals" ON public.referrals;

CREATE POLICY "Allow public read access on referrals" ON public.referrals
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert on referrals" ON public.referrals
    FOR INSERT WITH CHECK (true);


-- 12. TRAFFIC TOD SCORES TABLE
ALTER TABLE public.traffic_tod_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on traffic_tod_scores" ON public.traffic_tod_scores;
DROP POLICY IF EXISTS "Allow public insert on traffic_tod_scores" ON public.traffic_tod_scores;
DROP POLICY IF EXISTS "Allow public update on traffic_tod_scores" ON public.traffic_tod_scores;

CREATE POLICY "Allow public read access on traffic_tod_scores" ON public.traffic_tod_scores
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert on traffic_tod_scores" ON public.traffic_tod_scores
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on traffic_tod_scores" ON public.traffic_tod_scores
    FOR UPDATE USING (true);


-- 13. FARASAN SCORES TABLE
ALTER TABLE public.farasan_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on farasan_scores" ON public.farasan_scores;
DROP POLICY IF EXISTS "Allow public insert on farasan_scores" ON public.farasan_scores;
DROP POLICY IF EXISTS "Allow public update on farasan_scores" ON public.farasan_scores;

CREATE POLICY "Allow public read access on farasan_scores" ON public.farasan_scores
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert on farasan_scores" ON public.farasan_scores
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on farasan_scores" ON public.farasan_scores
    FOR UPDATE USING (true);


-- 14. KITE SCORES TABLE
ALTER TABLE public.kite_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on kite_scores" ON public.kite_scores;
DROP POLICY IF EXISTS "Allow public insert on kite_scores" ON public.kite_scores;
DROP POLICY IF EXISTS "Allow public update on kite_scores" ON public.kite_scores;

CREATE POLICY "Allow public read access on kite_scores" ON public.kite_scores
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert on kite_scores" ON public.kite_scores
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on kite_scores" ON public.kite_scores
    FOR UPDATE USING (true);


-- 15. GAME PROGRESS TABLE
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on game_progress" ON public.game_progress;
DROP POLICY IF EXISTS "Allow public insert on game_progress" ON public.game_progress;
DROP POLICY IF EXISTS "Allow public update on game_progress" ON public.game_progress;

CREATE POLICY "Allow public read access on game_progress" ON public.game_progress
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert on game_progress" ON public.game_progress
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on game_progress" ON public.game_progress
    FOR UPDATE USING (true);


-- 16. APP SETTINGS TABLE
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow public insert on app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow public update on app_settings" ON public.app_settings;

CREATE POLICY "Allow public read access on app_settings" ON public.app_settings
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert on app_settings" ON public.app_settings
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on app_settings" ON public.app_settings
    FOR UPDATE USING (true);
