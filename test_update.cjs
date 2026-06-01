const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ndivxbhhuahsspnxdtqd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaXZ4YmhodWFoc3NwbnhkdHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1OTUyNzgsImV4cCI6MjA5NTE3MTI3OH0.NIam-eAOcjDDFsBjEFHss4fwU8VqOkgqdHI7Pflrvz8');

async function test() {
    const { error } = await supabase.from('digital_cards').update({ slug: 'okfine' }).eq('slug', 'ekselns-globl-knsltnsi');
    console.log("Update error:", error);
}

test();
