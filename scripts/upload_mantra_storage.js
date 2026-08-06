import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://ndivxbhhuahsspnxdtqd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaXZ4YmhodWFoc3NwbnhkdHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1OTUyNzgsImV4cCI6MjA5NTE3MTI3OH0.NIam-eAOcjDDFsBjEFHss4fwU8VqOkgqdHI7Pflrvz8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const folderPath = 'C:\\Users\\alpha\\Music\\mantra';
const bucketName = 'mantra-audio';

async function uploadFiles() {
  console.log(`Checking bucket '${bucketName}'...`);
  
  // 1. Ensure Bucket exists or create it
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  let bucketExists = buckets && buckets.some(b => b.name === bucketName);

  if (!bucketExists) {
    console.log(`Creating public bucket '${bucketName}'...`);
    const { data: createData, error: createErr } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['audio/mpeg', 'audio/mp3'],
      fileSizeLimit: 10485760 // 10MB limit per file
    });
    if (createErr) {
      console.log('Could not create bucket via API (might need dashboard/RLS permissions):', createErr.message);
    } else {
      console.log(`Bucket '${bucketName}' created successfully.`);
    }
  }

  // 2. Read files in C:\Users\alpha\Music\mantra
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.mp3'));
  console.log(`Found ${files.length} MP3 files to upload...`);

  const uploadedUrls = {};

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileBuffer = fs.readFileSync(filePath);

    // Sanitize filename for Supabase Storage (alphanumeric, underscores, hyphens)
    const sanitizedName = file.replace(/[^a-zA-Z0-9\._-]/g, '_');

    console.log(`Uploading '${file}' as '${sanitizedName}'...`);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(sanitizedName, fileBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading '${file}':`, error.message);
    } else {
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(sanitizedName);

      const publicUrl = publicUrlData.publicUrl;
      console.log(`SUCCESS: ${publicUrl}`);
      uploadedUrls[file] = publicUrl;
    }
  }

  console.log('\n--- UPLOAD SUMMARY ---');
  console.log(JSON.stringify(uploadedUrls, null, 2));

  // Save generated mapping to JSON file
  fs.writeFileSync(
    path.join(process.cwd(), 'src', 'utils', 'mantra_audio_urls.json'),
    JSON.stringify(uploadedUrls, null, 2)
  );
  console.log('\nSaved mapping to src/utils/mantra_audio_urls.json!');
}

uploadFiles().catch(console.error);
