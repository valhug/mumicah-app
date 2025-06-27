import React from 'react'
import { Button } from '@mumicah/ui'

interface CommunityFiltersProps {
  selectedLanguage: string
  selectedCategory: string
  onLanguageChange: (language: string) => void
  onCategoryChange: (category: string) => void
}

const languages = ['All', 'Spanish', 'French', 'Japanese', 'German', 'Italian', 'Portuguese', 'Korean', 'Chinese']
const categories = ['All', 'Travel', 'Business', 'Entertainment', 'Technology', 'Culture', 'Education', 'Health']

export const CommunityFilters: React.FC<CommunityFiltersProps> = ({
  selectedLanguage,
  selectedCategory,
  onLanguageChange,
  onCategoryChange
}) => {
  return (
    <div className="space-y-4">
      {/* Language Filters */}
      <div>
        <h3 className="body-medium content-primary mb-3">Language</h3>
        <div className="flex flex-wrap gap-2">
          {languages.map((language) => (
            <Button
              key={language}
              variant={selectedLanguage === language || (selectedLanguage === '' && language === 'All') ? "default" : "outline"}
              size="sm"
              onClick={() => onLanguageChange(language === 'All' ? '' : language)}
            >
              {language}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div>
        <h3 className="body-medium content-primary mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category || (selectedCategory === '' && category === 'All') ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category === 'All' ? '' : category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
