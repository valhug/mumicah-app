// processed-conversation-data.ts - AI conversation processing data
export interface ProcessedConversationData {
  messageId: string
  timestamp: Date
  content: string
  language: string
  
  // AI Analysis
  grammarPoints: GrammarPoint[]
  vocabulary: VocabularyItem[]
  culturalContext: CulturalContext[]
  
  // Learning Insights
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  topicClassification: string[]
  emotionalTone: 'positive' | 'neutral' | 'negative'
  communicativeIntent: string
  
  // Audio Features
  audioUrl?: string
  pronunciation?: PronunciationFeedback
  
  // Conversation Flow
  responseQuality: number // 0-100
  engagementLevel: number // 0-100
  learningObjectives: string[]
}

export interface GrammarPoint {
  id: string
  rule: string
  example: string
  explanation: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
}

export interface VocabularyItem {
  word: string
  definition: string
  partOfSpeech: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  usage: string
  examples: string[]
  frequency: 'common' | 'uncommon' | 'rare'
}

export interface CulturalContext {
  aspect: string
  description: string
  significance: string
  examples: string[]
  region?: string
}

export interface PronunciationFeedback {
  accuracy: number // 0-100
  suggestions: string[]
  commonMistakes: string[]
  targetSounds: string[]
}

// Mock data for development
export const mockProcessedData: ProcessedConversationData[] = [
  {
    messageId: '1',
    timestamp: new Date('2025-06-26T10:00:00Z'),
    content: 'Hola, ¿cómo estás?',
    language: 'Spanish',
    grammarPoints: [
      {
        id: 'g1',
        rule: 'Question formation with ¿cómo?',
        example: '¿Cómo estás?',
        explanation: 'Use ¿cómo? to ask "how" questions in Spanish',
        difficulty: 'beginner',
        category: 'interrogatives'
      }
    ],
    vocabulary: [
      {
        word: 'hola',
        definition: 'hello',
        partOfSpeech: 'interjection',
        difficulty: 'beginner',
        usage: 'greeting',
        examples: ['Hola, ¿cómo estás?', 'Hola, María'],
        frequency: 'common'
      }
    ],
    culturalContext: [
      {
        aspect: 'Greetings',
        description: 'Spanish greetings are warm and personal',
        significance: 'Shows respect and friendliness',
        examples: ['Hola', 'Buenos días', '¿Qué tal?']
      }
    ],
    difficultyLevel: 'beginner',
    topicClassification: ['greetings', 'social'],
    emotionalTone: 'positive',
    communicativeIntent: 'greeting',
    responseQuality: 85,
    engagementLevel: 90,
    learningObjectives: ['Basic greetings', 'Question formation']
  }
]

export default {
  mockProcessedData
}
