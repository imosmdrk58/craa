'use client'

import { Switch } from '@headlessui/react'

interface ReaderSettingsProps {
  nativeLanguage: string
  targetLanguage: string
  showTranslations: boolean
  showGrammarNotes: boolean
  difficultyLevel: number
  autoPlayTranslations: boolean
  onSettingsChange: (settings: {
    nativeLanguage: string
    targetLanguage: string
    showTranslations: boolean
    showGrammarNotes: boolean
    difficultyLevel: number
    autoPlayTranslations: boolean
  }) => void
  availableLanguages: { code: string; name: string }[]
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ReaderSettings({
  nativeLanguage,
  targetLanguage,
  showTranslations,
  showGrammarNotes,
  difficultyLevel,
  autoPlayTranslations,
  onSettingsChange,
  availableLanguages,
}: ReaderSettingsProps) {
  const handleSettingChange = <T extends keyof ReaderSettingsProps>(
    setting: T,
    value: ReaderSettingsProps[T]
  ) => {
    onSettingsChange({
      nativeLanguage,
      targetLanguage,
      showTranslations,
      showGrammarNotes,
      difficultyLevel,
      autoPlayTranslations,
      [setting]: value,
    })
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Reader Settings</h3>
        <div className="mt-6 space-y-6">
          {/* Native Language Selection */}
          <div>
            <label htmlFor="nativeLanguage" className="block text-sm font-medium text-gray-700">
              Your Language
            </label>
            <select
              id="nativeLanguage"
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={nativeLanguage}
              onChange={(e) => handleSettingChange('nativeLanguage', e.target.value)}
            >
              {availableLanguages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Language Selection */}
          <div>
            <label htmlFor="targetLanguage" className="block text-sm font-medium text-gray-700">
              Language to Learn
            </label>
            <select
              id="targetLanguage"
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={targetLanguage}
              onChange={(e) => handleSettingChange('targetLanguage', e.target.value)}
            >
              {availableLanguages.map((language) => (
                <option 
                  key={language.code} 
                  value={language.code}
                  disabled={language.code === nativeLanguage}
                >
                  {language.name}
                </option>
              ))}
            </select>
          </div>

          {/* Show Translations Toggle */}
          <Switch.Group as="div" className="flex items-center justify-between">
            <span className="flex flex-grow flex-col">
              <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
                Show Translations
              </Switch.Label>
              <Switch.Description as="span" className="text-sm text-gray-500">
                Show translations in your language when hovering
              </Switch.Description>
            </span>
            <Switch
              checked={showTranslations}
              onChange={(checked) => handleSettingChange('showTranslations', checked)}
              className={classNames(
                showTranslations ? 'bg-indigo-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  showTranslations ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
          </Switch.Group>

          {/* Show Grammar Notes Toggle */}
          <Switch.Group as="div" className="flex items-center justify-between">
            <span className="flex flex-grow flex-col">
              <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
                Show Grammar Notes
              </Switch.Label>
              <Switch.Description as="span" className="text-sm text-gray-500">
                Include grammar explanations with translations
              </Switch.Description>
            </span>
            <Switch
              checked={showGrammarNotes}
              onChange={(checked) => handleSettingChange('showGrammarNotes', checked)}
              className={classNames(
                showGrammarNotes ? 'bg-indigo-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  showGrammarNotes ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
          </Switch.Group>

          {/* Difficulty Level Slider */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
              Difficulty Level
            </label>
            <input
              type="range"
              id="difficulty"
              min="1"
              max="5"
              value={difficultyLevel}
              onChange={(e) => handleSettingChange('difficultyLevel', Number(e.target.value))}
              className="mt-1 w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>Beginner</span>
              <span>Advanced</span>
            </div>
          </div>

          {/* Auto-play Translations Toggle */}
          <Switch.Group as="div" className="flex items-center justify-between">
            <span className="flex flex-grow flex-col">
              <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
                Auto-show Translations
              </Switch.Label>
              <Switch.Description as="span" className="text-sm text-gray-500">
                Always show translations without hovering
              </Switch.Description>
            </span>
            <Switch
              checked={autoPlayTranslations}
              onChange={(checked) => handleSettingChange('autoPlayTranslations', checked)}
              className={classNames(
                autoPlayTranslations ? 'bg-indigo-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  autoPlayTranslations ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
          </Switch.Group>
        </div>
      </div>
    </div>
  )
} 