import { useState, useEffect } from 'react'

interface Preferences {
  defaultLanguage: string
  showTranslations: boolean
  showGrammarNotes: boolean
  difficultyLevel: number
  autoPlayTranslations: boolean
}

const defaultPreferences: Preferences = {
  defaultLanguage: 'en',
  showTranslations: true,
  showGrammarNotes: true,
  difficultyLevel: 1,
  autoPlayTranslations: false,
}

export function usePreferences(userId?: string) {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Try to load from localStorage first
        const storedPreferences = localStorage.getItem('userPreferences')
        if (storedPreferences) {
          setPreferences(JSON.parse(storedPreferences))
          setIsLoading(false)
          return
        }

        // If user is logged in, try to load from API
        if (userId) {
          const response = await fetch(`/api/preferences?userId=${userId}`)
          if (!response.ok) {
            throw new Error('Failed to fetch preferences')
          }
          const data = await response.json()
          setPreferences(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        // Fall back to default preferences
        setPreferences(defaultPreferences)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [userId])

  const updatePreferences = async (newPreferences: Partial<Preferences>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences }
      setPreferences(updatedPreferences)

      // Always update localStorage
      localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences))

      // If user is logged in, update API
      if (userId) {
        const response = await fetch('/api/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            ...updatedPreferences,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update preferences')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      // Revert changes on error
      setPreferences(preferences)
    }
  }

  const resetPreferences = () => {
    setPreferences(defaultPreferences)
    localStorage.removeItem('userPreferences')
    setError(null)
  }

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    resetPreferences,
  }
} 