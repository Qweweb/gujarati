const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ndivxbhhuahsspnxdtqd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaXZ4YmhodWFoc3NwbnhkdHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1OTUyNzgsImV4cCI6MjA5NTE3MTI3OH0.NIam-eAOcjDDFsBjEFHss4fwU8VqOkgqdHI7Pflrvz8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*');

    if (error) {
      console.error('Error fetching app settings:', error);
      return;
    }

    console.log("=== All App Settings Records ===");
    data.forEach(r => {
      console.log(`\nKey: ${r.key}`);
      try {
        console.log("Value:", JSON.stringify(JSON.parse(r.value), null, 2));
      } catch (e) {
        console.log("Value:", r.value);
      }
    });
  } catch (e) {
    console.error('Exception:', e);
  }
}

run();
