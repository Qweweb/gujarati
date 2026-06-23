import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const DEFAULT_FEATURE_FLAGS = {
  devotional: 'live',
  health: 'live',
  community: 'live',
  tools: 'live',
  panchang: 'live',
  kundali: 'live',
  kuldevi: 'live',
  vastu: 'live',
  interest_calculator: 'live',
  namkaran: 'live',
  card: 'live',
  biodata: 'live',
  shradhanjali: 'live',
  devotional_cards: 'live',
  swipe_cards: 'live',
  gujarat_safari: 'live',
  passport: 'live',
  mysteries: 'live',
  rewards: 'live',
  society: 'live',
  english: 'live',
  games: 'live',
  daily_challenge: 'live',
};

async function seed() {
  const { data, error } = await supabase
    .from('app_settings')
    .upsert({
      key: 'feature_control',
      value: JSON.stringify(DEFAULT_FEATURE_FLAGS)
    }, { onConflict: 'key' })
  
  if (error) {
    console.error("Error seeding app_settings:", error)
  } else {
    console.log("Seeding successful! Saved default feature flags.")
  }
}

seed()
