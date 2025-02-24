import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_KEY')
}

// Log configuration for debugging
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Service key length:', process.env.SUPABASE_SERVICE_KEY.length)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function GET() {
  try {
    // Just try to list buckets
    const { data, error } = await supabaseAdmin.storage.listBuckets()
    
    if (error) {
      console.error('Failed to list buckets:', error)
      return NextResponse.json({ 
        error: error.message,
        details: error.stack || 'No stack trace available'
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Successfully listed buckets',
      buckets: data
    })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: error.message || 'Unexpected error occurred',
      details: error.stack || 'No stack trace available'
    }, { status: 500 })
  }
} 