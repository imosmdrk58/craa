import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_KEY')
}

// Create Supabase client with service role
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

// Helper function to get a signed URL for a file
async function getSignedUrl(bucket: string, path: string) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60) // 1 hour expiry

  if (error) {
    console.error('Error creating signed URL:', error)
    throw error
  }

  return data.signedUrl
}

// Helper function to check if bucket exists and create it if it doesn't
async function ensureBucketExists(bucketName: string) {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    if (!bucketExists) {
      const { data, error } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
      })
      if (error) throw error
      console.log('Created bucket:', bucketName)
    }
  } catch (error) {
    console.error('Error checking/creating bucket:', error)
    throw error
  }
}

// Helper function for file upload with better error handling
const uploadFile = async (bucket: string, path: string, file: Buffer, contentType: string) => {
  try {
    // Ensure bucket exists
    await ensureBucketExists(bucket)

    console.log('Uploading file to path:', path)
    console.log('Content type:', contentType)
    
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      console.error('Error details:', {
        message: error.message,
        path,
        bucket
      })
      throw error
    }

    if (!data) {
      throw new Error('No data returned from upload')
    }

    // Get a signed URL for the uploaded file
    const signedUrl = await getSignedUrl(bucket, path)
    console.log('Upload successful, signed URL:', signedUrl)

    return {
      ...data,
      signedUrl
    }
  } catch (error) {
    console.error('Upload function error:', error)
    throw error
  }
}

export async function GET() {
  try {
    // Fetch all published comics
    const comics = await prisma.comic.findMany({
      where: {
        status: 'published'
      },
      include: {
        chapters: true
      }
    })

    // Get signed URLs for cover images
    const comicsWithUrls = await Promise.all(
      comics.map(async (comic) => {
        try {
          const coverImageUrl = await getSignedUrl('comics', comic.coverImage)
          return {
            ...comic,
            coverImageUrl
          }
        } catch (error) {
          console.error(`Failed to get signed URL for comic ${comic.id}:`, error)
          return {
            ...comic,
            coverImageUrl: null
          }
        }
      })
    )

    return NextResponse.json(comicsWithUrls)
  } catch (error: any) {
    console.error('Failed to fetch comics:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch comics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract and validate basic comic details
    const title = formData.get('title')
    const description = formData.get('description')
    const author = formData.get('author')
    const artist = formData.get('artist')
    const coverImage = formData.get('coverImage') as File
    const genres = JSON.parse(formData.get('genres') as string)
    const languages = JSON.parse(formData.get('languages') as string)
    const chapters = JSON.parse(formData.get('chapters') as string)

    // Validate required fields
    if (!title || !description || !author || !artist) {
      return NextResponse.json(
        { error: 'All basic details are required' },
        { status: 400 }
      )
    }

    if (!coverImage) {
      return NextResponse.json(
        { error: 'Cover image is required' },
        { status: 400 }
      )
    }

    // Upload cover image
    const coverImageBuffer = Buffer.from(await coverImage.arrayBuffer())
    const coverImagePath = `covers/${Date.now()}-${coverImage.name}`
    
    let coverImageData;
    try {
      coverImageData = await uploadFile('comics', coverImagePath, coverImageBuffer, coverImage.type)
    } catch (error: any) {
      console.error('Cover image upload failed:', error)
      return NextResponse.json(
        { error: `Failed to upload cover image: ${error.message}` },
        { status: 500 }
      )
    }

    // Create comic in database
    const comic = await prisma.comic.create({
      data: {
        title: title as string,
        description: description as string,
        author: author as string,
        artist: artist as string,
        coverImage: coverImagePath,
        genres,
        languages,
        status: 'published',
      },
    })

    // Upload chapter files
    try {
      const chapterPromises = chapters.map(async (chapter: any, index: number) => {
        const chapterFile = formData.get(`chapter-${index}`) as File
        if (!chapterFile) {
          throw new Error(`Chapter ${index + 1} file is missing`)
        }

        const chapterBuffer = Buffer.from(await chapterFile.arrayBuffer())
        const chapterPath = `chapters/${comic.id}/${Date.now()}-${chapterFile.name}`
        
        const chapterData = await uploadFile('comics', chapterPath, chapterBuffer, chapterFile.type)

        return prisma.comicChapter.create({
          data: {
            number: index + 1,
            title: chapter.title,
            filePath: chapterPath,
            comicId: comic.id,
          },
        })
      })

      const uploadedChapters = await Promise.all(chapterPromises)

      // Get signed URL for cover image
      const coverImageUrl = await getSignedUrl('comics', coverImagePath)

      return NextResponse.json({
        success: true,
        comic: {
          ...comic,
          coverImageUrl,
          chapters: uploadedChapters
        }
      })
    } catch (error: any) {
      // If chapter upload fails, delete the comic and uploaded files
      await prisma.comic.delete({ where: { id: comic.id } })
      await supabaseAdmin.storage.from('comics').remove([coverImagePath])
      
      console.error('Chapter upload failed:', error)
      return NextResponse.json(
        { error: `Failed to upload chapter: ${error.message}` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Failed to create comic:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create comic' },
      { status: 500 }
    )
  }
} 