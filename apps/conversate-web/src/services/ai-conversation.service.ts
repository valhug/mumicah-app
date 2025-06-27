import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

// AI Service for conversation management
export class AIConversationService {
  private openai: OpenAI | null = null
  private anthropic: Anthropic | null = null

  constructor() {
    // Initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    }

    // Initialize Anthropic if API key is available
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_claude_api_key_here') {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      })
    }
  }

  // Generate AI response with persona context
  async generateResponse(options: {
    message: string
    persona: PersonaConfig
    conversationHistory: ConversationMessage[]
    userProfile: UserProfile
    learningGoals?: string[]
  }): Promise<AIResponse> {
    const { message, persona, conversationHistory, userProfile, learningGoals } = options

    try {
      // Try Claude first (better for language learning)
      if (this.anthropic) {
        return await this.generateClaudeResponse(options)
      }
      
      // Fallback to OpenAI
      if (this.openai) {
        return await this.generateOpenAIResponse(options)
      }

      // Demo response if no API keys
      return this.generateDemoResponse(options)
    } catch (error) {
      console.error('AI Service Error:', error)
      return this.generateDemoResponse(options)
    }
  }

  // Claude-specific response generation
  private async generateClaudeResponse(options: AIGenerationOptions): Promise<AIResponse> {
    const { message, persona, conversationHistory, userProfile } = options

    const systemPrompt = this.buildSystemPrompt(persona, userProfile)
    const conversationContext = this.buildConversationContext(conversationHistory)

    const response = await this.anthropic!.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        ...conversationContext,
        { role: 'user', content: message }
      ]
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    return {
      message: content.text,
      provider: 'claude',
      confidence: 0.95,
      learningInsights: await this.extractLearningInsights(message, content.text, persona),
      grammarCorrections: await this.extractGrammarCorrections(message),
      vocabularyTips: await this.extractVocabularyTips(message, content.text)
    }
  }

  // OpenAI-specific response generation
  private async generateOpenAIResponse(options: AIGenerationOptions): Promise<AIResponse> {
    const { message, persona, conversationHistory, userProfile } = options

    const systemPrompt = this.buildSystemPrompt(persona, userProfile)
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...this.buildConversationContext(conversationHistory),
      { role: 'user' as const, content: message }
    ]

    const response = await this.openai!.chat.completions.create({
      model: 'gpt-4',
      messages,
      max_tokens: 1000,
      temperature: 0.7
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    return {
      message: content,
      provider: 'openai',
      confidence: 0.9,
      learningInsights: await this.extractLearningInsights(message, content, persona),
      grammarCorrections: await this.extractGrammarCorrections(message),
      vocabularyTips: await this.extractVocabularyTips(message, content)
    }
  }

  // Demo response for development/fallback
  private generateDemoResponse(options: AIGenerationOptions): AIResponse {
    const { persona, message } = options
    
    const demoResponses = {
      maya: [
        "That's a great question! Let me break this down step by step. First, let's look at the grammar structure...",
        "I can see you're making good progress! Here's a helpful tip for improving your pronunciation...",
        "Let's practice this concept together. Can you try using this new vocabulary in a sentence?"
      ],
      alex: [
        "Hey, that's totally normal! Everyone struggles with that at first. Here's a casual way to say it...",
        "You know what? That reminds me of a funny story about when I was learning languages...",
        "Dude, you're getting the hang of this! Let's try some real-world examples..."
      ],
      luna: [
        "What a fascinating cultural context! In many Eastern cultures, this expression carries deep meaning...",
        "This connects beautifully to an ancient tradition. Let me share the historical background...",
        "Your intuition about the cultural nuance is excellent! Here's how native speakers would interpret this..."
      ]
    }

    const responses = demoResponses[persona.id as keyof typeof demoResponses] || demoResponses.maya
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    return {
      message: randomResponse,
      provider: 'demo',
      confidence: 0.8,
      learningInsights: [
        "You're showing good comprehension of complex sentence structures",
        "Consider practicing this type of expression in different contexts"
      ],
      grammarCorrections: [],
      vocabularyTips: [
        "Try using synonyms to expand your vocabulary range",
        "Practice using this phrase in different tenses"
      ]
    }
  }

  // Build system prompt based on persona and user profile
  private buildSystemPrompt(persona: PersonaConfig, userProfile: UserProfile): string {
    return `You are ${persona.name}, a ${persona.role} AI language learning companion.

PERSONALITY: ${persona.description}

TEACHING STYLE:
- ${persona.specialties.join(', ')}
- Always maintain your unique personality and teaching approach
- Adapt to the user's proficiency level: ${userProfile.level || 'intermediate'}

USER CONTEXT:
- Learning goals: ${userProfile.learningGoals?.join(', ') || 'general conversation'}
- Native language: ${userProfile.nativeLanguage || 'English'}
- Target languages: ${userProfile.targetLanguages?.join(', ') || 'Spanish, French, Japanese'}

RESPONSE GUIDELINES:
1. Stay in character as ${persona.name}
2. Provide helpful language learning feedback
3. Encourage and motivate the user
4. Offer practical tips and corrections when appropriate
5. Ask engaging follow-up questions
6. Keep responses conversational and engaging

Remember: You're not just answering questions, you're building a relationship and helping someone achieve their language learning goals!`
  }

  // Build conversation context from history
  private buildConversationContext(history: ConversationMessage[]): any[] {
    return history.slice(-10).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.message
    }))
  }

  // Extract learning insights from the conversation
  private async extractLearningInsights(userMessage: string, aiResponse: string, persona: PersonaConfig): Promise<string[]> {
    // Analyze the conversation for learning patterns
    const insights = []

    // Basic pattern detection
    if (userMessage.includes('?')) {
      insights.push('Great job asking questions - curiosity drives learning!')
    }

    if (userMessage.length > 50) {
      insights.push('You\'re forming complex thoughts - your confidence is growing!')
    }

    // Persona-specific insights
    if (persona.specialties.includes('Grammar explanation')) {
      insights.push('Your grammar usage is improving with each conversation')
    }

    return insights
  }

  // Extract grammar corrections
  private async extractGrammarCorrections(message: string): Promise<GrammarCorrection[]> {
    // Simple grammar pattern detection
    const corrections = []

    // Basic corrections (in a real implementation, use NLP)
    if (message.includes('I are')) {
      corrections.push({
        original: 'I are',
        corrected: 'I am',
        explanation: 'Use "am" with "I", not "are"'
      })
    }

    return corrections
  }

  // Extract vocabulary tips
  private async extractVocabularyTips(userMessage: string, aiResponse: string): Promise<string[]> {
    const tips = []

    // Detect if AI response introduced new vocabulary
    const aiWords = aiResponse.toLowerCase().split(' ')
    const complexWords = aiWords.filter(word => word.length > 6)

    if (complexWords.length > 0) {
      tips.push(`New vocabulary introduced: ${complexWords.slice(0, 3).join(', ')}`)
    }

    return tips
  }

  // Generate conversation suggestions
  async generateConversationSuggestions(options: {
    persona: PersonaConfig
    userProfile: UserProfile
    recentTopics: string[]
  }): Promise<string[]> {
    const { persona, userProfile, recentTopics } = options

    // Persona-specific suggestions
    const suggestions = {
      maya: [
        "Let's practice past tense with a story about your weekend",
        "How about we review pronunciation with some tongue twisters?",
        "Would you like to practice formal vs informal language?"
      ],
      alex: [
        "Want to chat about your hobbies in your target language?",
        "Let's practice ordering food at a restaurant!",
        "How about some workplace small talk practice?"
      ],
      luna: [
        "Shall we explore some cultural traditions from Japan?",
        "Let's discuss the meaning behind common idioms",
        "How about we read a short poem together?"
      ]
    }

    const baseSuggestions = suggestions[persona.id as keyof typeof suggestions] || suggestions.maya
    
    // Filter out recently discussed topics
    return baseSuggestions.filter(suggestion => 
      !recentTopics.some(topic => 
        suggestion.toLowerCase().includes(topic.toLowerCase())
      )
    )
  }
}

// Types
export interface PersonaConfig {
  id: string
  name: string
  role: string
  description: string
  specialties: string[]
  languages: string[]
}

export interface UserProfile {
  id: string
  level?: string
  nativeLanguage?: string
  targetLanguages?: string[]
  learningGoals?: string[]
}

export interface ConversationMessage {
  id: string
  sender: 'user' | 'ai'
  message: string
  timestamp: Date
  persona?: string
}

export interface AIResponse {
  message: string
  provider: 'claude' | 'openai' | 'demo'
  confidence: number
  learningInsights: string[]
  grammarCorrections: GrammarCorrection[]
  vocabularyTips: string[]
}

export interface GrammarCorrection {
  original: string
  corrected: string
  explanation: string
}

type AIGenerationOptions = {
  message: string
  persona: PersonaConfig
  conversationHistory: ConversationMessage[]
  userProfile: UserProfile
  learningGoals?: string[]
}

// Export singleton instance
export const aiConversationService = new AIConversationService()
