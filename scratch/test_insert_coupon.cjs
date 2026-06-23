const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ndivxbhhuahsspnxdtqd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaXZ4YmhodWFoc3NwbnhkdHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1OTUyNzgsImV4cCI6MjA5NTE3MTI3OH0.NIam-eAOcjDDFsBjEFHss4fwU8VqOkgqdHI7Pflrvz8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  try {
    console.log('Attempting to insert a test coupon into scratch_offers...');
    const testCoupon = {
      name: 'ટેસ્ટ કૂપન ડીલ',
      desc_text: 'ટેસ્ટ વર્ણન',
      code: 'TESTCOUPON123',
      target_type: 'all_gujarat',
      is_active: true,
      reward_stage: 0
    };
    
    const { data, error } = await supabase
      .from('scratch_offers')
      .insert([testCoupon])
      .select();
      
    if (error) {
      console.error('Error inserting coupon:', error);
    } else {
      console.log('Successfully inserted coupon:', data);
      
      // Now delete the test coupon to keep database clean
      const insertedId = data[0].id;
      console.log(`Deleting test coupon with ID: ${insertedId}...`);
      const deleteResult = await supabase
        .from('scratch_offers')
        .delete()
        .eq('id', insertedId);
        
      if (deleteResult.error) {
        console.error('Error deleting test coupon:', deleteResult.error);
      } else {
        console.log('Successfully deleted test coupon.');
      }
    }
  } catch (e) {
    console.error('Exception:', e);
  }
}

run();
