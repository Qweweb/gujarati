const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ndivxbhhuahsspnxdtqd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaXZ4YmhodWFoc3NwbnhkdHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1OTUyNzgsImV4cCI6MjA5NTE3MTI3OH0.NIam-eAOcjDDFsBjEFHss4fwU8VqOkgqdHI7Pflrvz8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  try {
    const { data: offers, error } = await supabase
      .from('scratch_offers')
      .select('*');

    if (error) {
      console.error('Error fetching offers:', error);
      return;
    }

    console.log(`Total coupons in database: ${offers.length}`);
    offers.forEach(o => {
      console.log(`\n- ID: ${o.id}`);
      console.log(`  Name: ${o.name}`);
      console.log(`  Code: ${o.code}`);
      console.log(`  Active: ${o.is_active}`);
      console.log(`  Reward Stage: ${o.reward_stage}`);
      console.log(`  Target Type: ${o.target_type}`);
      console.log(`  Target District: ${o.target_district}`);
      console.log(`  Target Taluka: ${o.target_taluka}`);
      console.log(`  Target City/Village: ${o.target_city_village}`);
    });
  } catch (e) {
    console.error('Exception:', e);
  }
}

run();
