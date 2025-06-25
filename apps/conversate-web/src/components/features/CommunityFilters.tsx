interface CommunityFiltersProps {
  selectedLanguage: string
  selectedCategory: string
  onLanguageChange: (language: string) => void
  onCategoryChange: (category: string) => void
}

const LANGUAGES = [
  'Spanish',
  'French', 
  'German',
  'Italian',
  'Portuguese',
  'Japanese',
  'Korean',
  'Chinese',
  'Arabic',
  'Russian'
]

const CATEGORIES = [
  'Travel',
  'Business',
  'Technology',
  'Entertainment',
  'Culture',
  'Food',
  'Sports',
  'Art',
  'Music',
  'Literature'
]

const DIFFICULTY_LEVELS = [
  'Beginner',
  'Intermediate', 
  'Advanced'
]

export function CommunityFilters({
  selectedLanguage,
  selectedCategory,
  onLanguageChange,
  onCategoryChange
}: CommunityFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Language Filter */}
      <div className="min-w-48">
        <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Language
        </label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Languages</option>
          {LANGUAGES.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="min-w-48">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {(selectedLanguage || selectedCategory) && (
        <div className="flex items-end">
          <button
            onClick={() => {
              onLanguageChange('')
              onCategoryChange('')
            }}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
