'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@mumicah/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@mumicah/ui'
import { Badge } from '@mumicah/ui'
import { Shuffle, Clock, Star, Users, BookOpen, Globe, Zap } from 'lucide-react'
import { conversationStarterService, type ConversationStarter, type StarterCategory } from '@/services/conversation-starter-service'
import { PersonaId } from '@/types/conversation'

interface ConversationStartersProps {
  persona: PersonaId
  userLevel: 'beginner' | 'intermediate' | 'advanced'
  onStarterSelect: (starter: ConversationStarter) => void
  recentTopics?: string[]
  userInterests?: string[]
  className?: string
}

export function ConversationStarters({
  persona,
  userLevel,
  onStarterSelect,
  recentTopics = [],
  userInterests = [],
  className = ''
}: ConversationStartersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [suggestedStarters, setSuggestedStarters] = useState<ConversationStarter[]>([])
  const [categories, setCategories] = useState<StarterCategory[]>([])
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning')

  const loadSuggestions = useCallback(() => {
    if (selectedCategory === 'all') {
      // Get personalized suggestions
      const personalized = conversationStarterService.getPersonalizedStarters(
        persona,
        userLevel,
        recentTopics,
        userInterests
      )
      
      // Add time-appropriate starter
      const contextual = conversationStarterService.generateContextualStarter(
        persona,
        timeOfDay,
        userLevel
      )
      
      setSuggestedStarters([contextual, ...personalized])
    } else {
      // Get category-specific starters
      const categoryStarters = conversationStarterService.getStartersForPersona(
        persona,
        userLevel,
        selectedCategory,
        4
      )
      setSuggestedStarters(categoryStarters)
    }
  }, [selectedCategory, persona, userLevel, recentTopics, userInterests, timeOfDay])

  useEffect(() => {
    // Determine time of day
    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 18) setTimeOfDay('afternoon')
    else setTimeOfDay('evening')

    // Load categories
    setCategories(conversationStarterService.getCategories())

    // Load initial suggestions
    loadSuggestions()
  }, [persona, userLevel, loadSuggestions])

  useEffect(() => {
    loadSuggestions()
  }, [selectedCategory, persona, userLevel, recentTopics, userInterests, loadSuggestions])

  const handleRandomStarter = () => {
    const randomStarter = conversationStarterService.getRandomStarter(persona, userLevel)
    onStarterSelect(randomStarter)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'daily_life':
        return <BookOpen className="w-4 h-4" />
      case 'social':
        return <Users className="w-4 h-4" />
      case 'culture':
        return <Globe className="w-4 h-4" />
      case 'learning':
        return <Star className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  const starterVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Conversation Starters
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRandomStarter}
              className="flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Random
            </Button>
          </div>
          
          {/* Time-based greeting */}
          <motion.div 
            className="text-sm text-muted-foreground"
            variants={itemVariants}
          >
            {timeOfDay === 'morning' && '🌅 Good morning! Ready to start the day with French?'}
            {timeOfDay === 'afternoon' && '☀️ Good afternoon! Perfect time for conversation practice.'}
            {timeOfDay === 'evening' && '🌙 Good evening! Let\'s wind down with some French chat.'}
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Category Filter */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectedCategory === 'all' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="text-xs"
              >
                All
              </Button>
              {categories.slice(0, 5).map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-xs flex items-center gap-1"
                >
                  <span>{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Starter Cards */}
          <AnimatePresence mode="wait">
            <motion.div 
              className="space-y-3"
              key={selectedCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {suggestedStarters.map((starter) => (
                <motion.div
                  key={starter.id}
                  variants={starterVariants}
                  className="group"
                >
                  <Card 
                    className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 hover:scale-[1.02]"
                    onClick={() => onStarterSelect(starter)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Starter Text */}
                        <p className="text-sm leading-relaxed group-hover:text-primary transition-colors">
                          {starter.text}
                        </p>
                        
                        {/* Metadata */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(starter.difficulty)}>
                              {starter.difficulty}
                            </Badge>
                            {selectedCategory === 'all' && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                {getCategoryIcon(starter.category)}
                                {categories.find(c => c.id === starter.category)?.name || starter.category}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {starter.persona === 'all' ? 'Universal' : starter.persona}
                          </div>
                        </div>

                        {/* Context (if available) */}
                        {starter.context && (
                          <div className="text-xs text-muted-foreground italic border-l-2 border-muted pl-2">
                            {starter.context}
                          </div>
                        )}

                        {/* Follow-up Questions Preview */}
                        {starter.followUpQuestions && starter.followUpQuestions.length > 0 && (
                          <motion.div 
                            className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <span className="font-medium">Follow-ups: </span>
                            {starter.followUpQuestions[0]}
                            {starter.followUpQuestions.length > 1 && (
                              <span className="text-muted-foreground/70"> +{starter.followUpQuestions.length - 1} more</span>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Quick Actions */}
          <motion.div 
            className="pt-4 border-t"
            variants={itemVariants}
          >
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadSuggestions()}
                className="text-xs"
              >
                <Shuffle className="w-3 h-3 mr-1" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory('culture')}
                className="text-xs"
              >
                <Globe className="w-3 h-3 mr-1" />
                Cultural
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
