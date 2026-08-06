import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndivxbhhuahsspnxdtqd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaXZ4YmhodWFoc3NwbnhkdHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1OTUyNzgsImV4cCI6MjA5NTE3MTI3OH0.NIam-eAOcjDDFsBjEFHss4fwU8VqOkgqdHI7Pflrvz8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const candidateBuckets = ['posts', 'media', 'avatars', 'shradhanjali', 'otlo', 'public', 'uploads', 'audio', 'files', 'gujarati', 'user-uploads', 'biodata', 'status'];

async function testBuckets() {
  for (const b of candidateBuckets) {
    const { data, error } = await supabase.storage.from(b).upload('test.txt', Buffer.from('hello'), { upsert: true });
    if (!error) {
      console.log(`FOUND WORKING PUBLIC BUCKET: '${b}'`);
      const { data: pData } = supabase.storage.from(b).getPublicUrl('test.txt');
      console.log(`Public URL: ${pData.publicUrl}`);
    } else {
      console.log(`Bucket '${b}': ${error.message}`);
    }
  }
}

testBuckets();
