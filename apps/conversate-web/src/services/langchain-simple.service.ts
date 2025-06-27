import { LANGCHAIN_CONFIG, type PersonaId } from '@/config/langchain'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    persona?: PersonaId
    language?: string
    corrections?: string[]
    vocabulary?: string[]
    culturalNotes?: string[]
  }
}

export interface ConversationContext {
  userId: string
  personaId: PersonaId
  targetLanguage: string
  userNativeLanguage: string
  proficiencyLevel: 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'proficient'
  conversationHistory: ConversationMessage[]
  learningGoals?: string[]
  currentTopic?: string
}

export class LangChainService {
  private langchainApiKey: string
  private openaiApiKey: string
  private chatModel: ChatOpenAI | null = null

  constructor() {
    this.langchainApiKey = process.env.LANGCHAIN_API_KEY || ''
    this.openaiApiKey = process.env.OPENAI_API_KEY || ''
    
    console.log('LangChain Service initialization:', {
      hasLangChainKey: !!this.langchainApiKey,
      hasOpenAIKey: !!this.openaiApiKey,
      keyPrefix: this.langchainApiKey ? `${this.langchainApiKey.substring(0, 10)}...` : 'NOT_SET'
    })

    // Initialize OpenAI model if API key is available
    if (this.openaiApiKey) {
      this.chatModel = new ChatOpenAI({
        modelName: 'gpt-4',
        temperature: 0.7,
        openAIApiKey: this.openaiApiKey,
      })
    }

    // Set LangSmith environment variables for tracking
    if (this.langchainApiKey) {
      process.env.LANGCHAIN_TRACING_V2 = 'true'
      process.env.LANGCHAIN_ENDPOINT = 'https://api.smith.langchain.com'
      process.env.LANGCHAIN_API_KEY = this.langchainApiKey
      process.env.LANGCHAIN_PROJECT = 'conversate-personas'
    }
  }

  async generateResponse(
    userInput: string,
    context: ConversationContext
  ): Promise<{
    response: string
    metadata: {
      corrections?: string[]
      vocabulary?: string[]
      culturalNotes?: string[]
      suggestedTopics?: string[]
    }
  }> {
    try {
      console.log('Generating response for persona:', context.personaId)
      
      const personaConfig = LANGCHAIN_CONFIG.personas[context.personaId]
      if (!personaConfig) {
        throw new Error(`Persona ${context.personaId} not found`)
      }

      console.log('Using persona config for:', context.personaId)

      // Use real AI if available, otherwise fallback to mock
      if (this.chatModel && this.openaiApiKey && process.env.AI_FALLBACK_MODE !== 'true') {
        return await this.generateRealResponse(userInput, context, personaConfig)
      } else {
        console.log('Using mock response - AI_FALLBACK_MODE or no API key')
        const response = await this.generateMockResponse(userInput, context)
        return {
          response: response.content,
          metadata: {
            corrections: response.corrections,
            vocabulary: response.vocabulary,
            culturalNotes: response.culturalNotes,
            suggestedTopics: response.suggestedTopics
          }
        }
      }
    } catch (error) {
      console.error('Error generating response:', error)
      
      // Fallback to mock response on error
      const response = await this.generateMockResponse(userInput, context)
      return {
        response: `I apologize, but I'm having trouble connecting to my full capabilities right now. ${response.content}`,
        metadata: {
          corrections: response.corrections,
          vocabulary: response.vocabulary,
          culturalNotes: response.culturalNotes,
          suggestedTopics: response.suggestedTopics
        }
      }
    }
  }

  private async generateRealResponse(
    userInput: string,
    context: ConversationContext,
    personaConfig: typeof LANGCHAIN_CONFIG.personas[PersonaId]
  ) {
    if (!this.chatModel) {
      throw new Error('OpenAI model not initialized')
    }

    // Create a comprehensive prompt for the persona
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', this.createSystemPrompt(context, personaConfig)],
      ['human', userInput]
    ])

    // Create the chain
    const chain = prompt.pipe(this.chatModel).pipe(new StringOutputParser())

    // Generate response
    const response = await chain.invoke({
      userInput,
      targetLanguage: context.targetLanguage,
      userLevel: context.proficiencyLevel,
      persona: context.personaId
    })

    // Extract learning metadata (simplified for now)
    const metadata = this.extractSimpleLearningData(userInput, response)

    return {
      response,
      metadata
    }
  }

  private createSystemPrompt(
    context: ConversationContext,
    personaConfig: typeof LANGCHAIN_CONFIG.personas[PersonaId]
  ): string {
    return `${personaConfig.systemPrompt}

CONVERSATION CONTEXT:
- Target Language: ${context.targetLanguage}
- User's Native Language: ${context.userNativeLanguage || 'English'}
- User's Proficiency Level: ${context.proficiencyLevel}
- Current Topic: ${context.currentTopic || 'General conversation'}
- Learning Goals: ${context.learningGoals?.join(', ') || 'General language improvement'}

INSTRUCTIONS:
1. Respond naturally in ${context.targetLanguage} at an appropriate level for ${context.proficiencyLevel} learners
2. If the user makes mistakes, gently correct them and provide brief explanations
3. Encourage the user and provide positive, constructive feedback
4. Keep responses conversational and engaging
5. Occasionally introduce new vocabulary appropriate to their level
6. Stay true to your persona characteristics while being helpful

Remember: You are helping someone learn ${context.targetLanguage}. Be patient, encouraging, and educational while maintaining natural conversation flow.`
  }

  private extractSimpleLearningData(
    userInput: string,
    aiResponse: string
  ) {
    // Simple learning data extraction (could be enhanced with another AI call)
    const metadata: {
      corrections?: string[]
      vocabulary?: string[]
      culturalNotes?: string[]
      suggestedTopics?: string[]
    } = {}

    // Basic vocabulary extraction (look for quoted words or emphasized terms)
    const vocabularyMatches = aiResponse.match(/"([^"]+)"/g)
    if (vocabularyMatches) {
      metadata.vocabulary = vocabularyMatches.map(match => match.replace(/"/g, ''))
    }

    // Basic correction detection (look for correction patterns)
    if (aiResponse.toLowerCase().includes('correct') || aiResponse.toLowerCase().includes('better')) {
      metadata.corrections = ['Check the AI response for corrections and suggestions']
    }

    // Add some default learning suggestions
    metadata.suggestedTopics = ['Continue conversation', 'Ask follow-up questions', 'Practice new vocabulary']

    return metadata
  }

  private async generateMockResponse(
    userInput: string, 
    context: ConversationContext
  ) {
    // Simulate different persona responses
    const responses = {
      maya: {
        content: `Hi! I'm Maya, your patient teacher. I noticed you said "${userInput}". That's a great start! Let me help you practice this in a gentle way. Would you like to try forming a similar sentence?`,
        corrections: [`Remember to use "I am" instead of "I'm" in formal writing`],
        vocabulary: [`"practice" - to do something repeatedly to improve`],
        culturalNotes: [`In many cultures, patience is highly valued in learning`],
        suggestedTopics: [`Basic greetings`, `Sentence formation`]
      },
      alex: {
        content: `Hey! Alex here. "${userInput}" - I totally get what you're saying! That's pretty cool. Want to chat about something fun? Maybe we can talk about hobbies or what you did today?`,
        corrections: [`"pretty cool" is casual - in formal settings, say "quite interesting"`],
        vocabulary: [`"hobbies" - activities you enjoy in your free time`],
        culturalNotes: [`Casual conversation often includes expressions like "pretty cool"`],
        suggestedTopics: [`Hobbies`, `Daily activities`, `Casual expressions`]
      },
      luna: {
        content: `Greetings! Luna speaking. "${userInput}" brings to mind beautiful cultural traditions. In many cultures, we express such thoughts through stories and art. Would you like to explore how different cultures approach this topic? 🌸`,
        corrections: [`Consider the cultural context when expressing ideas`],
        vocabulary: [`"traditions" - customs passed down through generations`],
        culturalNotes: [`Different cultures have unique ways of expressing similar concepts`],
        suggestedTopics: [`Cultural traditions`, `Art and expression`, `Storytelling`]
      }
    }

    // Return the appropriate response or a default
    return responses[context.personaId as keyof typeof responses] || {
      content: `Hello! I'm your language learning companion. Thank you for saying "${userInput}". I'm here to help you learn and practice. What would you like to explore today?`,
      corrections: [],
      vocabulary: [],
      culturalNotes: [],
      suggestedTopics: ['Basic conversation', 'Learning goals']
    }
  }

  async suggestConversationStarters(context: ConversationContext): Promise<string[]> {
    const starters = {
      maya: [
        "Let's start with basic greetings. How do you say hello?",
        "Would you like to practice introducing yourself?",
        "Let's work on simple sentences together."
      ],
      alex: [
        "What's your favorite hobby? Let's chat about it!",
        "Tell me about your day - what did you do?",
        "Want to learn some casual expressions?"
      ],
      luna: [
        "Let's explore a cultural tradition from your country.",
        "Would you like to hear a story from another culture?",
        "How do people in your culture express happiness?"
      ]
    }

    return starters[context.personaId as keyof typeof starters] || [
      "What would you like to talk about today?",
      "Is there something specific you'd like to learn?",
      "Let's start a conversation!"
    ]
  }

  private createPersonaPrompt(personaId: PersonaId, context: ConversationContext): string {
    const persona = LANGCHAIN_CONFIG.personas[personaId]
    const recentHistory = context.conversationHistory.slice(-5)

    // Extract persona name from the ID
    const personaName = personaId.charAt(0).toUpperCase() + personaId.slice(1)

    return `${persona.systemPrompt}

User Profile:
- Target Language: ${context.targetLanguage}
- Native Language: ${context.userNativeLanguage}
- Proficiency Level: ${context.proficiencyLevel}
- Learning Goals: ${context.learningGoals?.join(', ') || 'General conversation practice'}

Recent Conversation:
${recentHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current Topic: ${context.currentTopic || 'General conversation'}

Remember to:
1. Stay in character as ${personaName}
2. Adapt your language to the user's proficiency level
3. Provide helpful corrections and vocabulary
4. Share cultural insights when relevant
5. Keep the conversation engaging and educational

Respond naturally as ${personaName} would, helping the user learn while maintaining an engaging conversation.`
  }
}

export default LangChainService
