'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ChapterUpload {
  number: number
  title: string
  file: File | null
}

export default function NewComic() {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [artist, setArtist] = useState('')
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [genres, setGenres] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [chapters, setChapters] = useState<ChapterUpload[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
    }
  }, [user, router])

  const availableGenres = [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Fantasy',
    'Mystery',
    'Romance',
    'Sci-Fi',
  ]

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'ja', name: 'Japanese' },
  ]

  const handleGenreToggle = (genre: string) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter((g) => g !== genre))
    } else {
      setGenres([...genres, genre])
    }
  }

  const handleLanguageToggle = (code: string) => {
    if (languages.includes(code)) {
      setLanguages(languages.filter((l) => l !== code))
    } else {
      setLanguages([...languages, code])
    }
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0])
    }
  }

  const addChapter = () => {
    setChapters([
      ...chapters,
      {
        number: chapters.length + 1,
        title: '',
        file: null,
      },
    ])
  }

  const updateChapter = (index: number, updates: Partial<ChapterUpload>) => {
    const newChapters = [...chapters]
    newChapters[index] = { ...newChapters[index], ...updates }
    setChapters(newChapters)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validation
      if (genres.length === 0) {
        throw new Error('Please select at least one genre')
      }
      if (languages.length === 0) {
        throw new Error('Please select at least one language')
      }
      if (chapters.length === 0) {
        throw new Error('Please add at least one chapter')
      }

      const formData = new FormData()
      
      // Add basic comic details
      formData.append('title', title)
      formData.append('description', description)
      formData.append('author', author)
      formData.append('artist', artist)
      formData.append('genres', JSON.stringify(genres))
      formData.append('languages', JSON.stringify(languages))
      
      // Add cover image
      if (!coverImage) {
        throw new Error('Cover image is required')
      }
      formData.append('coverImage', coverImage)
      
      // Add chapters data and files
      formData.append('chapters', JSON.stringify(chapters.map(c => ({ title: c.title }))))
      chapters.forEach((chapter, index) => {
        if (!chapter.file) {
          throw new Error(`File for chapter ${chapter.number} is required`)
        }
        formData.append(`chapter-${index}`, chapter.file)
      })

      const response = await fetch('/api/comics', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create comic')
      }

      router.push('/admin')
    } catch (error) {
      console.error('Failed to create comic:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              Add New Comic
            </h2>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* Basic Details */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Basic Details
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Title
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Author
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="author"
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="artist"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Artist
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="artist"
                      id="artist"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="cover-image"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Cover Image
                  </label>
                  <div className="mt-1">
                    <input
                      type="file"
                      id="cover-image"
                      name="cover-image"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Genres and Languages */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Genres and Languages
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Genres
                  </label>
                  <div className="mt-2 space-y-2">
                    {availableGenres.map((genre) => (
                      <label key={genre} className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          checked={genres.includes(genre)}
                          onChange={() => handleGenreToggle(genre)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">{genre}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Languages
                  </label>
                  <div className="mt-2 space-y-2">
                    {availableLanguages.map((language) => (
                      <label
                        key={language.code}
                        className="inline-flex items-center mr-4"
                      >
                        <input
                          type="checkbox"
                          checked={languages.includes(language.code)}
                          onChange={() => handleLanguageToggle(language.code)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">
                          {language.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Chapters
                </h3>
                <button
                  type="button"
                  onClick={addChapter}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Chapter
                </button>
              </div>
              <div className="mt-6 space-y-4">
                {chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md p-4 bg-white"
                  >
                    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                      <div>
                        <label
                          htmlFor={`chapter-${index}-title`}
                          className="block text-sm font-medium text-gray-900"
                        >
                          Chapter {chapter.number} Title
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id={`chapter-${index}-title`}
                            value={chapter.title}
                            onChange={(e) =>
                              updateChapter(index, { title: e.target.value })
                            }
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900 bg-white"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor={`chapter-${index}-file`}
                          className="block text-sm font-medium text-gray-900"
                        >
                          Chapter File
                        </label>
                        <div className="mt-1">
                          <input
                            type="file"
                            id={`chapter-${index}-file`}
                            accept="image/*"
                            onChange={(e) =>
                              updateChapter(index, {
                                file: e.target.files?.[0] || null,
                              })
                            }
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900 bg-white"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Comic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 