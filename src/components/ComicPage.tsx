'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Translation {
  languageCode: string
  text: string
  grammarNotes?: string
}

interface TextBubble {
  id: string
  x: number
  y: number
  width: number
  height: number
  translations: Translation[]
}

interface ComicPageProps {
  imageUrl: string
  bubbles: TextBubble[]
  nativeLanguage: string
  targetLanguage: string
  showTranslations: boolean
  showGrammarNotes: boolean
  autoPlayTranslations: boolean
}

export default function ComicPage({
  imageUrl,
  bubbles,
  nativeLanguage,
  targetLanguage,
  showTranslations,
  showGrammarNotes,
  autoPlayTranslations,
}: ComicPageProps) {
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null)

  const getTranslation = (bubble: TextBubble, languageCode: string) => {
    return bubble.translations.find((t) => t.languageCode === languageCode)
  }

  const shouldShowTranslation = (bubbleId: string) => {
    return autoPlayTranslations || hoveredBubble === bubbleId
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Comic Page Image */}
      <img
        src={imageUrl}
        alt="Comic page"
        className="w-full h-auto"
      />

      {/* Interactive Bubbles */}
      <div className="absolute inset-0">
        {bubbles.map((bubble) => {
          const targetText = getTranslation(bubble, targetLanguage)?.text
          const nativeText = getTranslation(bubble, nativeLanguage)?.text
          const grammarNotes = getTranslation(bubble, targetLanguage)?.grammarNotes

          return (
            <div
              key={bubble.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.width}%`,
                height: `${bubble.height}%`,
              }}
              onMouseEnter={() => setHoveredBubble(bubble.id)}
              onMouseLeave={() => setHoveredBubble(null)}
            >
              {/* Target Language Text */}
              <div className="absolute inset-0 flex items-center justify-center text-center p-2">
                <div className="text-sm font-medium bg-white bg-opacity-95 text-gray-900 rounded-lg p-2 shadow-lg border border-gray-200">
                  {targetText}
                </div>
              </div>

              {/* Translation Popup */}
              <AnimatePresence>
                {shouldShowTranslation(bubble.id) && showTranslations && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-10 p-4 bg-indigo-50 rounded-lg shadow-lg border border-indigo-200"
                    style={{
                      minWidth: '200px',
                      maxWidth: '300px',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {nativeText}
                    </div>
                    {showGrammarNotes && grammarNotes && (
                      <div className="mt-2 text-xs border-t border-indigo-200 pt-2">
                        <strong className="text-indigo-900">Grammar Notes:</strong>
                        <p className="text-gray-800 mt-1">{grammarNotes}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
} 