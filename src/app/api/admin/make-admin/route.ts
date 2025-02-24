import { NextRequest, NextResponse } from 'next/server'
import { makeUserAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const success = await makeUserAdmin(userId)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to make user admin' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in make-admin route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to make user admin' },
      { status: 500 }
    )
  }
} 