import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_KEY')
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function getSignedUrl(path: string) {
  const { data, error } = await supabaseAdmin.storage
    .from('comics')
    .createSignedUrl(path, 60 * 60) // 1 hour expiry

  if (error) {
    console.error('Error creating signed URL:', error)
    throw error
  }

  return data.signedUrl
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch reading history with comic details
    const readingHistory = await prisma.readingHistory.findMany({
      where: {
        userId,
      },
      include: {
        comic: {
          include: {
            chapters: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Get signed URLs for cover images
    const historyWithUrls = await Promise.all(
      readingHistory.map(async (history) => {
        try {
          const coverImageUrl = await getSignedUrl(history.comic.coverImage)
          return {
            id: history.id,
            lastChapterNumber: history.lastChapter,
            lastReadAt: history.updatedAt,
            comic: {
              id: history.comic.id,
              title: history.comic.title,
              coverImageUrl,
              languages: history.comic.languages,
              chapters: history.comic.chapters
            }
          }
        } catch (error) {
          console.error(`Failed to get signed URL for comic ${history.comic.id}:`, error)
          return {
            id: history.id,
            lastChapterNumber: history.lastChapter,
            lastReadAt: history.updatedAt,
            comic: {
              id: history.comic.id,
              title: history.comic.title,
              coverImageUrl: null,
              languages: history.comic.languages,
              chapters: history.comic.chapters
            }
          }
        }
      })
    )

    return NextResponse.json(historyWithUrls)
  } catch (error: any) {
    console.error('Failed to fetch reading history:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reading history' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, comicId, chapterNumber = 1, pageNumber = 1 } = await request.json()

    if (!userId || !comicId) {
      return NextResponse.json(
        { error: 'User ID and Comic ID are required' },
        { status: 400 }
      )
    }

    // Update or create reading history
    const history = await prisma.readingHistory.upsert({
      where: {
        userId_comicId: {
          userId,
          comicId
        }
      },
      update: {
        lastChapter: chapterNumber,
        lastPage: pageNumber,
        updatedAt: new Date()
      },
      create: {
        userId,
        comicId,
        lastChapter: chapterNumber,
        lastPage: pageNumber
      }
    })

    return NextResponse.json(history)
  } catch (error: any) {
    console.error('Failed to update reading history:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update reading history' },
      { status: 500 }
    )
  }
} 