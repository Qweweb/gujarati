import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ndivxbhhuahsspnxdtqd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaXZ4YmhodWFoc3NwbnhkdHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1OTUyNzgsImV4cCI6MjA5NTE3MTI3OH0.NIam-eAOcjDDFsBjEFHss4fwU8VqOkgqdHI7Pflrvz8';

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function listAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, mobile, photo_url, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("ERROR: ", error.message)
  } else {
    console.log(`Total users: ${data.length}`)
    console.log(JSON.stringify(data, null, 2))
  }
}

listAllUsers()
