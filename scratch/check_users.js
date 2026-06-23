import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndivxbhhuahsspnxdtqd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaXZ4YmhodWFoc3NwbnhkdHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1OTUyNzgsImV4cCI6MjA5NTE3MTI3OH0.NIam-eAOcjDDFsBjEFHss4fwU8VqOkgqdHI7Pflrvz8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, user_id, content');

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    console.log(`Total posts: ${posts.length}`);
    const userIds = [...new Set(posts.map(p => p.user_id))];
    console.log(`Unique user IDs in posts:`, userIds);
  } catch (e) {
    console.error('Exception:', e);
  }
}

run();
