import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

console.log('Testing database INSERT with anon key...');

const testData = {
  full_name: 'Test Applicant',
  email: 'test@example.com',
  phone: '+15551234567',
  position_interested: 'Software Engineer',
  experience_years: 5,
  status: 'new'
};

const { data, error } = await supabase
  .from('applicants')
  .insert([testData])
  .select();

if (error) {
  console.error('❌ INSERT FAILED:', error.message);
  process.exit(1);
} else {
  console.log('✅ INSERT SUCCESSFUL!');
  console.log('Inserted record:', data);
  
  // Clean up test record
  await supabase.from('applicants').delete().eq('email', 'test@example.com');
  console.log('✅ Test record cleaned up');
}
