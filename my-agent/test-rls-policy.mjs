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

console.log('Testing minimal insert...');

// Try a minimal insert
const { data, error } = await supabase
  .from('applicants')
  .insert({
    full_name: 'Test User',
    email: 'test@test.com',
    phone: '1234567890',
    position_interested: 'Test Position',
    experience_years: 1
  })
  .select()
  .single();

if (error) {
  console.log('Error:', error.message);
  console.log('Error code:', error.code);
  console.log('Details:', error.details);
} else {
  console.log('Success! Inserted:', data.id);
  
  // Clean up test record
  const { error: deleteError } = await supabase
    .from('applicants')
    .delete()
    .eq('id', data.id);
  
  if (deleteError) {
    console.log('Note: Could not delete test record:', deleteError.message);
  } else {
    console.log('Test record cleaned up.');
  }
}
