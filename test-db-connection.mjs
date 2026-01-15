import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)[1].trim();
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].trim();

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

const { data, error, count } = await supabase
  .from('applicants')
  .select('*', { count: 'exact', head: true });

if (error) {
  console.log('Error:', error.message);
} else {
  console.log('Success! Table exists with', count, 'records');
}
