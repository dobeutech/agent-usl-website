import { createClient } from '@supabase/supabase-js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        process.env[trimmed.substring(0, eqIndex).trim()] = trimmed.substring(eqIndex + 1).trim();
      }
    }
  }
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

console.log('='.repeat(50));
console.log('SUPABASE CONFIGURATION STATUS');
console.log('='.repeat(50));

// List storage buckets
console.log('\n1. Storage Buckets:');
const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
if (bucketsError) {
  console.log('   Error:', bucketsError.message);
} else if (buckets.length === 0) {
  console.log('   No buckets found - need to create "resumes" bucket');
} else {
  buckets.forEach(b => console.log('   -', b.name));
}

// Check RLS policies by attempting operations
console.log('\n2. Applicants Table RLS:');
// Test select (for anon role)
const { count: selectCount, error: selectError } = await supabase
  .from('applicants')
  .select('*', { count: 'exact', head: true });

if (selectError) {
  console.log('   SELECT:', '❌', selectError.message);
} else {
  console.log('   SELECT:', '✅ Works (count:', selectCount, ')');
}

// Test insert (for anon role)
const { error: insertError } = await supabase
  .from('applicants')
  .insert({
    full_name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    position_interested: 'Test',
    experience_years: 1
  });

if (insertError) {
  console.log('   INSERT:', '❌ Blocked by RLS -', insertError.message);
} else {
  console.log('   INSERT:', '✅ Allowed');
}

console.log('\n3. Auth Status:');
const { data: authData, error: authError } = await supabase.auth.getSession();
if (authError) {
  console.log('   Session check:', '❌', authError.message);
} else {
  console.log('   Session check:', '✅ Auth system responding');
  console.log('   Current session:', authData.session ? 'Active' : 'None (anonymous)');
}

console.log('\n' + '='.repeat(50));
console.log('REQUIRED FIXES:');
console.log('='.repeat(50));

if (bucketsError || buckets?.length === 0) {
  console.log('1. Create "resumes" storage bucket in Supabase Dashboard');
  console.log('   - Go to Storage > Create Bucket');
  console.log('   - Name: resumes');
  console.log('   - Enable: Public bucket');
}

if (insertError) {
  console.log('2. Add RLS policy for anonymous inserts:');
  console.log('   -- Run in Supabase SQL Editor:');
  console.log('   CREATE POLICY "Anyone can submit applications"');
  console.log('     ON applicants FOR INSERT TO anon WITH CHECK (true);');
}

console.log('\n' + '='.repeat(50));
