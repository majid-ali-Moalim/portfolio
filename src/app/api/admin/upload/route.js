import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Create a Supabase client with the service key for storage operations
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    return createClient(url, key);
  }
  return null;
}

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}_${safeName}`;

    // Strategy 1: Try Supabase Storage (works on Netlify / any serverless platform)
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        // Ensure the 'uploads' bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === 'uploads');
        if (!bucketExists) {
          await supabase.storage.createBucket('uploads', { public: true });
        }

        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(filename, buffer, {
            contentType: file.type || 'application/octet-stream',
            upsert: true,
          });

        if (error) throw error;

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(filename);

        return NextResponse.json({ url: urlData.publicUrl }, { status: 201 });
      } catch (storageErr) {
        console.warn('Supabase Storage upload failed, falling back to local:', storageErr.message);
      }
    }

    // Strategy 2: Fallback to local filesystem (works in local development only)
    const isServerless = process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production';
    if (isServerless) {
      return NextResponse.json({ error: 'Image upload failed. Cloud storage (Supabase URL & Key) is not configured in Netlify/Vercel Environment Variables.' }, { status: 500 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (err) {
    console.error('File upload error:', err);
    return NextResponse.json({ error: 'Upload failed: ' + err.message }, { status: 500 });
  }
}
