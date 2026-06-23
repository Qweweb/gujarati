-- ========================================================
-- MARKETING SCRATCH OFFERS & ANALYTICS SCHEMA
-- ========================================================

-- 1. Create scratch_offers table
CREATE TABLE IF NOT EXISTS scratch_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  desc_text TEXT NOT NULL,
  code TEXT NOT NULL,
  target_type TEXT NOT NULL, -- 'all_gujarat', 'district', 'taluka', 'city_village'
  target_district TEXT,      -- e.g., 'jamnagar'
  target_taluka TEXT,        -- e.g., 'dhrol'
  target_city_village TEXT,  -- e.g., 'Jamnagar'
  image_url TEXT,            -- optional marketing banner image URL
  sponsored_by TEXT,         -- Brand sponsor name
  sponsor_logo_url TEXT,     -- optional brand sponsor logo image URL
  reward_stage INT DEFAULT 0, -- 0: Normal, 10: 10-day, 20: 20-day, 30: 30-day
  how_to_redeem TEXT,        -- instructions on how to claim the reward
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create scratch_analytics table
CREATE TABLE IF NOT EXISTS scratch_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES scratch_offers(id) ON DELETE CASCADE,
  gender TEXT,               -- 'male', 'female', 'other', or 'unknown'
  district TEXT,             -- e.g., 'jamnagar'
  taluka TEXT,               -- e.g., 'dhrol'
  city_village TEXT,         -- e.g. profile city text or villageNameGu
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS Policies (Optional, adjust as needed in your environment)
ALTER TABLE scratch_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE scratch_analytics ENABLE ROW LEVEL SECURITY;

-- Allow public reads on active offers
CREATE POLICY "Allow public read scratch_offers" ON scratch_offers
  FOR SELECT USING (is_active = true);

-- Allow public inserts on scratch analytics events
CREATE POLICY "Allow public insert scratch_analytics" ON scratch_analytics
  FOR INSERT WITH CHECK (true);

-- Allow admins all privileges on both tables
CREATE POLICY "Allow admin all scratch_offers" ON scratch_offers
  FOR ALL USING (true);

CREATE POLICY "Allow admin all scratch_analytics" ON scratch_analytics
  FOR ALL USING (true);

-- 3. Migration Alter Statements (for existing tables)
ALTER TABLE scratch_offers ADD COLUMN IF NOT EXISTS sponsored_by TEXT DEFAULT NULL;
ALTER TABLE scratch_offers ADD COLUMN IF NOT EXISTS reward_stage INT DEFAULT 0;
ALTER TABLE scratch_offers ADD COLUMN IF NOT EXISTS how_to_redeem TEXT DEFAULT NULL;
ALTER TABLE scratch_offers ADD COLUMN IF NOT EXISTS sponsor_logo_url TEXT DEFAULT NULL;
