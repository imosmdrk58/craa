'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ComicPage from '@/components/ComicPage'
import ReaderSettings from '@/components/ReaderSettings'

// Mock data for demonstration
const mockPages = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/800/1200?random=1',
    bubbles: [
      {
        id: 'bubble1',
        x: 20,
        y: 30,
        width: 25,
        height: 15,
        translations: [
          {
            languageCode: 'en',
            text: 'Hello! How are you?',
            grammarNotes: 'Basic greeting using present tense',
          },
          {
            languageCode: 'es',
            text: '¡Hola! ¿Cómo estás?',
            grammarNotes: 'Greeting using estar (to be) in informal form',
          },
          {
            languageCode: 'ja',
            text: 'こんにちは！お元気ですか？',
            grammarNotes: 'Polite form greeting using です',
          },
        ],
      },
      {
        id: 'bubble2',
        x: 50,
        y: 60,
        width: 30,
        height: 20,
        translations: [
          {
            languageCode: 'en',
            text: "I'm doing great, thanks!",
            grammarNotes: 'Present continuous tense with contraction',
          },
          {
            languageCode: 'es',
            text: '¡Muy bien, gracias!',
            grammarNotes: 'Common response using estar omission',
          },
          {
            languageCode: 'ja',
            text: 'はい、元気です！',
            grammarNotes: 'Informal response with です',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/800/1200?random=2',
    bubbles: [
      {
        id: 'bubble3',
        x: 30,
        y: 40,
        width: 25,
        height: 15,
        translations: [
          {
            languageCode: 'en',
            text: 'Would you like to get coffee?',
            grammarNotes: 'Polite question using would',
          },
          {
            languageCode: 'es',
            text: '¿Te gustaría tomar un café?',
            grammarNotes: 'Conditional tense with gustar',
          },
          {
            languageCode: 'ja',
            text: 'コーヒーでも飲みませんか？',
            grammarNotes: 'Invitation form using ませんか',
          },
        ],
      },
    ],
  },
]

const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'ja', name: 'Japanese' },
]

export default function Reader({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(0)
  const [settings, setSettings] = useState({
    nativeLanguage: 'en',
    targetLanguage: 'ja',
    showTranslations: true,
    showGrammarNotes: true,
    difficultyLevel: 1,
    autoPlayTranslations: false,
  })

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < mockPages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comic Reader */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg border border-gray-200 sm:rounded-lg overflow-hidden">
            <div className="relative">
              <ComicPage
                imageUrl={mockPages[currentPage].imageUrl}
                bubbles={mockPages[currentPage].bubbles}
                nativeLanguage={settings.nativeLanguage}
                targetLanguage={settings.targetLanguage}
                showTranslations={settings.showTranslations}
                showGrammarNotes={settings.showGrammarNotes}
                autoPlayTranslations={settings.autoPlayTranslations}
              />
              
              {/* Overlay for bubble hints */}
              {settings.showTranslations && (
                <div className="absolute inset-0 pointer-events-none">
                  {mockPages[currentPage].bubbles.map((bubble) => (
                    <div
                      key={bubble.id}
                      className="absolute border-2 border-indigo-400 border-dashed rounded-lg bg-indigo-50 bg-opacity-30"
                      style={{
                        left: `${bubble.x}%`,
                        top: `${bubble.y}%`,
                        width: `${bubble.width}%`,
                        height: `${bubble.height}%`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Page Navigation */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-between items-center">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${
                  currentPage === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : 'text-white bg-indigo-600 hover:bg-indigo-700 border-transparent'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                Previous Page
              </button>
              <span className="text-sm font-medium text-gray-700">
                Page {currentPage + 1} of {mockPages.length}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === mockPages.length - 1}
                className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${
                  currentPage === mockPages.length - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : 'text-white bg-indigo-600 hover:bg-indigo-700 border-transparent'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                Next Page
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="lg:col-span-1">
          <ReaderSettings
            {...settings}
            onSettingsChange={setSettings}
            availableLanguages={availableLanguages}
          />
        </div>
      </div>
    </div>
  )
} 