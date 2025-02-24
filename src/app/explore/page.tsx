'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data for demonstration
const mockCategories = [
  { id: 'popular', name: 'Popular Now' },
  { id: 'new', name: 'New Releases' },
  { id: 'language-learning', name: 'Best for Language Learning' },
]

const mockNovels = [
  {
    id: '1',
    title: 'The Adventure Begins',
    description: 'A thrilling story about language learning through adventure.',
    coverImage: 'https://picsum.photos/300/400?random=4',
    author: 'John Doe',
    languages: ['English', 'Spanish', 'Japanese'],
    genres: ['Adventure', 'Educational'],
    rating: 4.5,
    readCount: 1200,
  },
  {
    id: '2',
    title: 'Mystery in Tokyo',
    description: 'Solve mysteries while learning Japanese culture and language.',
    coverImage: 'https://picsum.photos/300/400?random=5',
    author: 'Jane Smith',
    languages: ['English', 'Japanese'],
    genres: ['Mystery', 'Cultural'],
    rating: 4.8,
    readCount: 850,
  },
  {
    id: '3',
    title: 'Spanish Tales',
    description: 'Traditional Spanish stories with modern twists.',
    coverImage: 'https://picsum.photos/300/400?random=6',
    author: 'Maria Garcia',
    languages: ['English', 'Spanish'],
    genres: ['Fantasy', 'Folk Tales'],
    rating: 4.2,
    readCount: 650,
  },
]

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState('popular')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Explore Comics
            </h2>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6">
          <div className="sm:hidden">
            <select
              id="category"
              name="category"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {mockCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              {mockCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-2 font-medium text-sm rounded-md ${
                    selectedCategory === category.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comics Grid */}
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {mockNovels.map((novel) => (
            <div
              key={novel.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={novel.coverImage}
                  alt={novel.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-lg font-medium text-white">{novel.title}</h3>
                  <p className="text-sm text-gray-300">{novel.author}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-4">{novel.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {novel.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {novel.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm text-gray-600">{novel.rating}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-600">{novel.readCount} reads</span>
                  </div>
                  <Link
                    href={`/reader/${novel.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Start Reading
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 