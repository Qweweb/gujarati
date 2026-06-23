import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function check() {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .eq('key', 'feature_control')
  
  if (error) {
    console.error("Error reading app_settings:", error)
  } else {
    console.log("Data in app_settings for key 'feature_control':", JSON.stringify(data, null, 2))
  }
}

check()
