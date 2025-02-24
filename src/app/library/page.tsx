'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Comic {
  id: string
  title: string
  description: string
  author: string
  artist: string
  coverImageUrl: string | null
  genres: string[]
  languages: string[]
  chapters: any[]
  status: string
}

export default function Library() {
  const [comics, setComics] = useState<Comic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch('/api/comics')
        if (!response.ok) {
          throw new Error('Failed to fetch comics')
        }
        const data = await response.json()
        setComics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load comics')
      } finally {
        setLoading(false)
      }
    }

    fetchComics()
  }, [])

  const filteredComics = comics.filter(comic => {
    const languageMatch = selectedLanguage === 'all' || comic.languages.includes(selectedLanguage)
    const genreMatch = selectedGenre === 'all' || comic.genres.includes(selectedGenre)
    return languageMatch && genreMatch
  })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading comics...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    )
  }

  // Get unique languages and genres from comics
  const availableLanguages = Array.from(new Set(comics.flatMap(comic => comic.languages)))
  const availableGenres = Array.from(new Set(comics.flatMap(comic => comic.genres)))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters */}
      <div className="mb-8 flex gap-4">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Languages</option>
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Genres</option>
          {availableGenres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      {/* Comics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComics.map((comic) => (
          <div
            key={comic.id}
            className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-48 relative">
              {comic.coverImageUrl ? (
                <img
                  src={comic.coverImageUrl}
                  alt={comic.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No cover image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{comic.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                By {comic.author}{comic.artist ? ` • Art by ${comic.artist}` : ''}
              </p>
              <p className="text-sm text-gray-500 mt-2">{comic.description}</p>
              
              <div className="mt-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {comic.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {comic.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {comic.chapters.length} chapter{comic.chapters.length !== 1 ? 's' : ''}
                </span>
                <Link
                  href={`/reader/${comic.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Start Reading
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredComics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No comics found matching your filters.</p>
        </div>
      )}
    </div>
  )
} 