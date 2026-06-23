import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ndivxbhhuahsspnxdtqd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaXZ4YmhodWFoc3NwbnhkdHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1OTUyNzgsImV4cCI6MjA5NTE3MTI3OH0.NIam-eAOcjDDFsBjEFHss4fwU8VqOkgqdHI7Pflrvz8';

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTable() {
  const { data, error } = await supabase
    .from('traffic_tod_scores')
    .select('user_id, player_name, high_score, total_coins, level_reached')
    .limit(1)

  if (error) {
    console.error("ERROR: ", error.message)
  } else {
    console.log("SUCCESS! Table 'traffic_tod_scores' exists and all columns are present!")
  }
}

checkTable()
