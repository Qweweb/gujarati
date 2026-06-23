const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ndivxbhhuahsspnxdtqd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaXZ4YmhodWFoc3NwbnhkdHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1OTUyNzgsImV4cCI6MjA5NTE3MTI3OH0.NIam-eAOcjDDFsBjEFHss4fwU8VqOkgqdHI7Pflrvz8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  try {
    // 1. Get total user count
    const { count, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error fetching user count:', countError);
      return;
    }
    console.log(`Total users in 'users' table: ${count}`);

    // 2. Get first 3 rows to inspect columns
    const { data: users, error: selectError } = await supabase
      .from('users')
      .select('*')
      .limit(3);

    if (selectError) {
      console.error('Error fetching users:', selectError);
      return;
    }

    if (users && users.length > 0) {
      console.log('Sample user record structure:');
      console.log(JSON.stringify(users[0], null, 2));
      console.log('Columns:', Object.keys(users[0]));
    } else {
      console.log('No users found in table.');
    }
  } catch (e) {
    console.error('Exception:', e);
  }
}

run();
