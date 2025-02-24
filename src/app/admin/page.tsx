'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useState } from 'react'

// Mock data for demonstration
const mockComics = [
  {
    id: '1',
    title: 'The Adventure Begins',
    status: 'published',
    languages: ['English', 'Spanish', 'Japanese'],
    chaptersCount: 5,
    lastUpdated: '2024-02-24T15:30:00Z',
  },
  {
    id: '2',
    title: 'Mystery in Tokyo',
    status: 'draft',
    languages: ['English', 'Japanese'],
    chaptersCount: 3,
    lastUpdated: '2024-02-23T10:15:00Z',
  },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('comics')

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Admin access required
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Admin Dashboard
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/admin/comics/new"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New Comic
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab('comics')}
              className={`${
                selectedTab === 'comics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Comics
            </button>
            <button
              onClick={() => setSelectedTab('translations')}
              className={`${
                selectedTab === 'translations'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Translations
            </button>
            <button
              onClick={() => setSelectedTab('settings')}
              className={`${
                selectedTab === 'settings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Comics List */}
        {selectedTab === 'comics' && (
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {mockComics.map((comic) => (
                  <li key={comic.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {comic.title}
                          </p>
                          <span
                            className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              comic.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {comic.status}
                          </span>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <Link
                            href={`/admin/comics/${comic.id}`}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {comic.chaptersCount} chapters
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            {comic.languages.join(', ')}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          Last updated:{' '}
                          {new Date(comic.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Translations Panel */}
        {selectedTab === 'translations' && (
          <div className="mt-8">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Translation Management
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Manage translations and language settings for all comics.</p>
                </div>
                <div className="mt-5">
                  <Link
                    href="/admin/translations/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add New Translation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {selectedTab === 'settings' && (
          <div className="mt-8">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Admin Settings
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Configure admin permissions and general settings.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 