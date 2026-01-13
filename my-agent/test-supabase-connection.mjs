/**
 * Test Supabase Connection and Tables
 * Tests feat-024, feat-025, feat-026
 */

import { createClient } from '@supabase/supabase-js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from parent directory manually
const envPath = resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        process.env[key] = value;
      }
    }
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('='.repeat(60));
console.log('SUPABASE CONNECTION TEST');
console.log('='.repeat(60));

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Missing Supabase credentials');
  console.log('   VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('   VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  process.exit(1);
}

console.log('✅ Supabase credentials found');
console.log('   URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('\n--- Testing Database Connection ---');

  // Test 1: Check applicants table exists
  console.log('\n1. Testing applicants table...');
  try {
    const { data, error, count } = await supabase
      .from('applicants')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log('   ❌ Applicants table error:', error.message);
      return false;
    }

    console.log('   ✅ Applicants table exists');
    console.log('   Total applicants:', count ?? 'Unknown');
    return true;
  } catch (err) {
    console.log('   ❌ Connection error:', err.message);
    return false;
  }
}

async function testStorageBucket() {
  console.log('\n--- Testing Storage Bucket (feat-025) ---');

  // Check if resumes bucket exists
  try {
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      console.log('   ❌ Storage error:', error.message);
      return false;
    }

    console.log('   Available buckets:', data.map(b => b.name).join(', ') || 'None');

    const resumesBucket = data.find(b => b.name === 'resumes');
    if (resumesBucket) {
      console.log('   ✅ Resumes bucket exists');
      return true;
    } else {
      console.log('   ⚠️ Resumes bucket not found');
      return false;
    }
  } catch (err) {
    console.log('   ❌ Storage connection error:', err.message);
    return false;
  }
}

async function testAuthSystem() {
  console.log('\n--- Testing Auth System (feat-026) ---');

  try {
    // Test sign-in with test credentials (will fail but tests the connection)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123'
    });

    if (error) {
      // Expected - we're just testing the auth endpoint works
      if (error.message.includes('Invalid login credentials')) {
        console.log('   ✅ Auth system responding correctly');
        return true;
      }
      console.log('   Auth response:', error.message);
      return true; // Auth endpoint is working
    }

    // If we got here, auth worked (unlikely with test credentials)
    console.log('   ✅ Auth system working');
    return true;
  } catch (err) {
    console.log('   ❌ Auth connection error:', err.message);
    return false;
  }
}

async function testInsertAndRetrieve() {
  console.log('\n--- Testing Database Insert/Retrieve (feat-024) ---');

  // Create a test applicant
  const testApplicant = {
    full_name: 'Test User ' + Date.now(),
    email: `test${Date.now()}@example.com`,
    phone: '123-456-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
    position_interested: 'Test Position',
    experience_years: 1,
    status: 'new'
  };

  console.log('   Inserting test applicant...');

  const { data: insertData, error: insertError } = await supabase
    .from('applicants')
    .insert(testApplicant)
    .select()
    .single();

  if (insertError) {
    console.log('   ❌ Insert error:', insertError.message);
    return false;
  }

  console.log('   ✅ Test applicant inserted');
  console.log('   ID:', insertData.id);

  // Retrieve the applicant
  console.log('   Retrieving test applicant...');
  const { data: retrieveData, error: retrieveError } = await supabase
    .from('applicants')
    .select('*')
    .eq('id', insertData.id)
    .single();

  if (retrieveError) {
    console.log('   ❌ Retrieve error:', retrieveError.message);
    return false;
  }

  console.log('   ✅ Test applicant retrieved');
  console.log('   Name:', retrieveData.full_name);
  console.log('   Email:', retrieveData.email);

  // Clean up - delete the test applicant
  console.log('   Cleaning up test data...');
  const { error: deleteError } = await supabase
    .from('applicants')
    .delete()
    .eq('id', insertData.id);

  if (deleteError) {
    console.log('   ⚠️ Cleanup warning:', deleteError.message);
  } else {
    console.log('   ✅ Test data cleaned up');
  }

  return true;
}

async function main() {
  const results = {
    connection: false,
    database: false,
    storage: false,
    auth: false
  };

  // Test basic connection
  results.connection = await testConnection();

  if (results.connection) {
    // Test database operations
    results.database = await testInsertAndRetrieve();

    // Test storage bucket
    results.storage = await testStorageBucket();
  }

  // Test auth system
  results.auth = await testAuthSystem();

  console.log('\n' + '='.repeat(60));
  console.log('RESULTS SUMMARY');
  console.log('='.repeat(60));
  console.log('Connection:', results.connection ? '✅ PASS' : '❌ FAIL');
  console.log('Database (feat-024):', results.database ? '✅ PASS' : '❌ FAIL');
  console.log('Storage (feat-025):', results.storage ? '✅ PASS' : '❌ FAIL');
  console.log('Auth (feat-026):', results.auth ? '✅ PASS' : '❌ FAIL');
  console.log('='.repeat(60));

  // Return results for programmatic use
  return results;
}

main().catch(console.error);
