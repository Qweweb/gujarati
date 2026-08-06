import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://ndivxbhhuahsspnxdtqd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaXZ4YmhodWFoc3NwbnhkdHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1OTUyNzgsImV4cCI6MjA5NTE3MTI3OH0.NIam-eAOcjDDFsBjEFHss4fwU8VqOkgqdHI7Pflrvz8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Attempting bucket creation via REST API...');
  
  try {
    const res = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({
        id: 'mantra-audio',
        name: 'mantra-audio',
        public: true,
        file_size_limit: 15728640,
        allowed_mime_types: ['audio/mpeg', 'audio/mp3', 'audio/x-mp3']
      })
    });
    
    const resText = await res.text();
    console.log('Bucket Creation Response:', res.status, resText);
  } catch (e) {
    console.error('Bucket creation fetch error:', e);
  }
}

run();
