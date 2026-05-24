-- ==========================================
-- GUJARATI APP — SUPABASE POSTGRESQL SCHEMA
-- ==========================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT UNIQUE NOT NULL,
  photo_url TEXT,
  district_id INT,
  taluka_id INT,
  village_id INT,
  ward TEXT,
  referrer_id UUID,
  rep_score INT DEFAULT 0,
  is_representative BOOLEAN DEFAULT FALSE,
  rep_level TEXT, -- 'village', 'taluka', 'district'
  verified_badge TEXT,
  streak_count INT DEFAULT 0,
  last_active DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  village_name_gu TEXT NOT NULL,
  village_name_en TEXT NOT NULL,
  taluka_id INT NOT NULL,
  district_id INT NOT NULL,
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  pincode TEXT,
  population INT
);

-- Index for fast location lookups
CREATE INDEX IF NOT EXISTS idx_locations_taluka_district ON locations(district_id, taluka_id);

-- 3. POSTS TABLE (બેઠક / ઓટલો)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL, -- 'news', 'event', 'alert', 'religious', 'job', 'health', 'help'
  visibility TEXT NOT NULL, -- 'village', 'taluka', 'district', 'state'
  village_id INT,
  taluka_id INT,
  district_id INT,
  media_urls TEXT[] DEFAULT '{}',
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active', -- 'active', 'flagged', 'deleted'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for location-based feed filtering
CREATE INDEX IF NOT EXISTS idx_posts_location ON posts(village_id, taluka_id, district_id);

-- 4. BUSINESSES TABLE (વ્યવસાય ડિરેક્ટરી)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name_gu TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category TEXT NOT NULL,
  gst_number TEXT,
  address TEXT NOT NULL,
  village_id INT,
  taluka_id INT,
  district_id INT,
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  logo_url TEXT,
  photos TEXT[] DEFAULT '{}',
  hours TEXT,
  phone TEXT,
  website TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_type TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for category and location filter
CREATE INDEX IF NOT EXISTS idx_businesses_filter ON businesses(category, district_id, taluka_id);

-- 5. OFFERS TABLE (વ્યાપારી ઓફર્સ)
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  offer_type TEXT NOT NULL, -- 'percentage', 'flat_discount', 'buy_one_get_one', 'freebie'
  offer_value TEXT NOT NULL,
  target_level TEXT NOT NULL, -- 'village', 'taluka', 'district', 'state'
  target_village_id INT,
  target_taluka_id INT,
  target_district_id INT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_redemptions INT,
  current_redemptions INT DEFAULT 0,
  qr_code_data TEXT,
  qr_image_url TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'expired', 'paused'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. REDEMPTIONS TABLE (ઓફર ક્લેમ હિસ્ટ્રી)
CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  masked_name TEXT, -- Masked profile name for business owner view
  masked_number TEXT, -- Masked phone number (e.g. "98** **21")
  status TEXT DEFAULT 'success' -- 'success', 'refunded', 'cancelled'
);

-- 7. QUIZ QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_index INT NOT NULL,
  explanation TEXT,
  category TEXT,
  difficulty TEXT, -- 'easy', 'medium', 'hard'
  age_group TEXT[] DEFAULT '{"adult"}', -- array containing 'kids', 'youth', 'adult', 'elder'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. USER QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quiz_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  score INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  total_questions INT NOT NULL,
  time_taken INT, -- in seconds
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. REFERRALS TABLE (રેફરલ ટ્રેકિંગ)
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
  install_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  points_awarded BOOLEAN DEFAULT FALSE
);

-- 10. POST COMMENTS TABLE (for Bethak Community Comments)
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast comment lookups per post
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);

