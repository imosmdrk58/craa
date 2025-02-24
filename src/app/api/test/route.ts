import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_KEY')
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET() {
  try {
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()
    if (bucketsError) throw bucketsError

    console.log('Existing buckets:', buckets)

    // Create comics bucket if it doesn't exist
    const comicsBucket = buckets?.find(b => b.name === 'comics')
    if (!comicsBucket) {
      const { data, error } = await supabaseAdmin.storage.createBucket('comics', {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
      })
      if (error) throw error
      console.log('Created comics bucket:', data)
    }

    // Create necessary folders
    const folders = ['covers', 'chapters']
    for (const folder of folders) {
      const { data, error } = await supabaseAdmin.storage
        .from('comics')
        .upload(`${folder}/.keep`, new Uint8Array(0), {
          contentType: 'text/plain',
          upsert: true
        })
      if (error && error.message !== 'The resource already exists') {
        throw error
      }
      console.log(`Ensured ${folder} folder exists`)
    }

    // Get bucket details
    const { data: bucket, error: bucketError } = await supabaseAdmin.storage.getBucket('comics')
    if (bucketError) throw bucketError

    return NextResponse.json({
      message: 'Storage initialized successfully',
      bucket,
      folders
    })
  } catch (error: any) {
    console.error('Storage initialization error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initialize storage' },
      { status: 500 }
    )
  }
} 