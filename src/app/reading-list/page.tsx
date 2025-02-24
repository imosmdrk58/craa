'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface ReadingHistory {
  id: string
  comic: {
    id: string
    title: string
    coverImageUrl: string | null
    languages: string[]
    chapters: any[]
  }
  lastChapterNumber: number
  lastReadAt: string
}

export default function ReadingList() {
  const { user } = useAuth()
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReadingHistory = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/reading-history?userId=${user.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch reading history')
        }
        const data = await response.json()
        setReadingHistory(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reading history')
      } finally {
        setLoading(false)
      }
    }

    fetchReadingHistory()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Sign in to view your reading list
          </h2>
          <div className="mt-6">
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading reading history...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Your Reading List
            </h2>
          </div>
        </div>

        {readingHistory.length === 0 ? (
          <div className="mt-8 text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">You haven't started reading any comics yet.</p>
            <Link
              href="/library"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Library
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {readingHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  {item.comic.coverImageUrl ? (
                    <img
                      src={item.comic.coverImageUrl}
                      alt={item.comic.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No cover image</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-lg font-medium text-white">{item.comic.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.comic.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2">
                    <div className="text-sm text-gray-500">
                      Chapter {item.lastChapterNumber} of {item.comic.chapters.length}
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-indigo-600 rounded-full"
                        style={{
                          width: `${(item.lastChapterNumber / item.comic.chapters.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      href={`/reader/${item.comic.id}?chapter=${item.lastChapterNumber}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Continue Reading
                    </Link>
                    <span className="text-sm text-gray-500">
                      {new Date(item.lastReadAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 