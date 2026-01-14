import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ynedsbgiveycubmusjzf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZWRzYmdpdmV5Y3VibXVzanpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MDkyNTUsImV4cCI6MjA3OTA4NTI1NX0.pDbyi0dTfM_P32AvmkAIW3TlGwj8M1RW_bOOpFWPzdY';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('='.repeat(60));
console.log('ATTEMPTING TO CREATE STORAGE BUCKET');
console.log('='.repeat(60));

try {
  // List existing buckets
  console.log('\n1. Listing existing buckets...');
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.log('❌ Error listing buckets:', listError.message);
  } else {
    console.log('✅ Current buckets:', buckets.length > 0 ? buckets.map(b => b.name).join(', ') : 'None');
  }

  // Try to create the resumes bucket
  console.log('\n2. Attempting to create "resumes" bucket...');
  const { data, error } = await supabase.storage.createBucket('resumes', {
    public: false,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  });

  if (error) {
    console.log('❌ Error creating bucket:', error.message);
    console.log('   Error code:', error.status);
    console.log('\n   Note: Creating buckets requires service_role key, not anon key.');
    console.log('   This operation must be done via:');
    console.log('   - Supabase Dashboard UI');
    console.log('   - Supabase CLI with service_role key');
    console.log('   - Migration applied by database admin');
  } else {
    console.log('✅ Bucket created successfully!');
    console.log('   Bucket data:', data);
  }

  // List buckets again to verify
  console.log('\n3. Listing buckets after creation attempt...');
  const { data: bucketsAfter, error: listError2 } = await supabase.storage.listBuckets();
  
  if (listError2) {
    console.log('❌ Error listing buckets:', listError2.message);
  } else {
    console.log('✅ Current buckets:', bucketsAfter.length > 0 ? bucketsAfter.map(b => b.name).join(', ') : 'None');
    
    if (bucketsAfter.some(b => b.name === 'resumes')) {
      console.log('\n🎉 SUCCESS! "resumes" bucket exists!');
    } else {
      console.log('\n⚠️ "resumes" bucket not found. Manual creation required.');
    }
  }

} catch (err) {
  console.log('❌ Unexpected error:', err.message);
}

console.log('\n' + '='.repeat(60));
console.log('TEST COMPLETE');
console.log('='.repeat(60));
