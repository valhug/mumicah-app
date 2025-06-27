// Enhanced Persona Conversation Service with LangChain Integration
import { LangChainService, ConversationContext, ConversationMessage } from '@/services/langchain.service'
import { PersonaId } from '@/config/langchain'
import { PERSONAS } from '@mumicah/shared'

export interface EnhancedConversationContext extends ConversationContext {
  sessionId: string
  startTime: Date
  totalMessages: number
  learningProgress: {
    vocabularyLearned: string[]
    grammarPointsCovered: string[]
    culturalInsightsGained: string[]
    mistakesCorrected: number
    fluencyScore: number // 1-10
  }
  conversationMetrics: {
    averageResponseTime: number
    engagementLevel: number // 1-10
    topicSwitches: number
    questionsAsked: number
  }
}

export interface PersonaResponse {
  message: string
  persona: PersonaId
  timestamp: Date
  metadata: {
    corrections?: string[]
    vocabulary?: string[]
    culturalNotes?: string[]
    suggestedTopics?: string[]
    learningTips?: string[]
    engagementScore: number
  }
  nextActions?: {
    suggestedQuestions?: string[]
    exercisePrompts?: string[]
    topicSuggestions?: string[]
  }
}

export class EnhancedPersonaConversationService {
  private langChainService: LangChainService
  private activeConversations: Map<string, EnhancedConversationContext> = new Map()

  constructor() {
    this.langChainService = new LangChainService()
  }

  /**
   * Start a new conversation with a persona
   */
  async startConversation(
    userId: string,
    personaId: PersonaId,
    targetLanguage: string,
    userNativeLanguage: string,
    proficiencyLevel: 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'proficient',
    learningGoals?: string[]
  ): Promise<{
    sessionId: string
    welcomeMessage: PersonaResponse
    conversationStarters: string[]
  }> {
    const sessionId = `${userId}-${personaId}-${Date.now()}`
    
    const context: EnhancedConversationContext = {
      userId,
      personaId,
      targetLanguage,
      userNativeLanguage,
      proficiencyLevel,
      conversationHistory: [],
      learningGoals,
      sessionId,
      startTime: new Date(),
      totalMessages: 0,
      learningProgress: {
        vocabularyLearned: [],
        grammarPointsCovered: [],
        culturalInsightsGained: [],
        mistakesCorrected: 0,
        fluencyScore: this.getInitialFluencyScore(proficiencyLevel),
      },
      conversationMetrics: {
        averageResponseTime: 0,
        engagementLevel: 5,
        topicSwitches: 0,
        questionsAsked: 0,
      },
    }

    this.activeConversations.set(sessionId, context)

    // Generate persona welcome message
    const persona = PERSONAS.find(p => p.id === personaId)
    const welcomeMessage = await this.generateWelcomeMessage(context, persona!)

    // Generate conversation starters
    const conversationStarters = await this.langChainService.suggestConversationStarters(context)

    return {
      sessionId,
      welcomeMessage,
      conversationStarters,
    }
  }

  /**
   * Send a message and get persona response
   */
  async sendMessage(
    sessionId: string,
    userMessage: string,
    responseTime?: number
  ): Promise<PersonaResponse> {
    const context = this.activeConversations.get(sessionId)
    if (!context) {
      throw new Error('Conversation session not found')
    }

    // Add user message to history
    const userMsg: ConversationMessage = {
      id: `${sessionId}-${Date.now()}-user`,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    }
    
    context.conversationHistory.push(userMsg)
    context.totalMessages++

    // Update metrics
    if (responseTime) {
      this.updateResponseTimeMetrics(context, responseTime)
    }

    // Generate AI response using LangChain
    const aiResponseData = await this.langChainService.generateResponse(userMessage, context)

    // Create AI message
    const aiMsg: ConversationMessage = {
      id: `${sessionId}-${Date.now()}-ai`,
      role: 'assistant',
      content: aiResponseData.response,
      timestamp: new Date(),
      metadata: {
        persona: context.personaId,
        language: context.targetLanguage,
        corrections: aiResponseData.metadata.corrections,
        vocabulary: aiResponseData.metadata.vocabulary,
        culturalNotes: aiResponseData.metadata.culturalNotes,
      },
    }

    context.conversationHistory.push(aiMsg)

    // Update learning progress
    this.updateLearningProgress(context, aiResponseData.metadata)

    // Calculate engagement score
    const engagementScore = this.calculateEngagementScore(userMessage, context)

    // Generate next actions
    const nextActions = await this.generateNextActions(context, aiResponseData.metadata)

    const response: PersonaResponse = {
      message: aiResponseData.response,
      persona: context.personaId,
      timestamp: new Date(),
      metadata: {
        ...aiResponseData.metadata,
        learningTips: this.generateLearningTips(context, aiResponseData.metadata),
        engagementScore,
      },
      nextActions,
    }

    // Update conversation in storage
    this.activeConversations.set(sessionId, context)

    return response
  }

  /**
   * Get conversation summary and learning insights
   */
  async getConversationSummary(sessionId: string): Promise<{
    summary: string
    learningInsights: {
      progressMade: string[]
      areasToImprove: string[]
      recommendedPractice: string[]
      vocabularyGained: string[]
      culturalLearning: string[]
    }
    metrics: {
      totalMessages: number
      conversationDuration: number
      engagementLevel: number
      fluencyImprovement: number
    }
  }> {
    const context = this.activeConversations.get(sessionId)
    if (!context) {
      throw new Error('Conversation session not found')
    }

    const duration = Date.now() - context.startTime.getTime()
    
    return {
      summary: await this.generateConversationSummary(context),
      learningInsights: {
        progressMade: this.analyzeProgressMade(context),
        areasToImprove: this.identifyImprovementAreas(context),
        recommendedPractice: await this.generatePracticeRecommendations(context),
        vocabularyGained: context.learningProgress.vocabularyLearned,
        culturalLearning: context.learningProgress.culturalInsightsGained,
      },
      metrics: {
        totalMessages: context.totalMessages,
        conversationDuration: Math.round(duration / 1000 / 60), // minutes
        engagementLevel: context.conversationMetrics.engagementLevel,
        fluencyImprovement: this.calculateFluencyImprovement(context),
      },
    }
  }

  /**
   * Generate language exercise based on conversation
   */
  async generateExercise(
    sessionId: string,
    exerciseType: 'vocabulary' | 'grammar' | 'pronunciation' | 'cultural'
  ) {
    const context = this.activeConversations.get(sessionId)
    if (!context) {
      throw new Error('Conversation session not found')
    }

    return {
      exercise: `Practice exercise for ${exerciseType}`,
      instructions: 'Complete the following language exercise',
      metadata: {
        exerciseType,
        difficulty: context.proficiencyLevel
      }
    }
  }

  /**
   * Switch persona during conversation
   */
  async switchPersona(sessionId: string, newPersonaId: PersonaId): Promise<PersonaResponse> {
    const context = this.activeConversations.get(sessionId)
    if (!context) {
      throw new Error('Conversation session not found')
    }

    const oldPersona = context.personaId
    context.personaId = newPersonaId

    // Generate transition message
    const transitionMessage = await this.generatePersonaSwitchMessage(context, oldPersona, newPersonaId)
    
    return transitionMessage
  }

  /**
   * Simple method for API usage - creates or resumes session
   */
  async createOrResumeSession(
    userId: string,
    personaId: PersonaId,
    targetLanguage: string,
    proficiencyLevel: string
  ): Promise<EnhancedConversationContext> {
    const sessionId = `${userId}-${personaId}`
    
    // Check if session exists
    let context = this.activeConversations.get(sessionId)
    
    if (!context) {
      // Create new session
      context = {
        userId,
        personaId,
        targetLanguage,
        userNativeLanguage: 'English',
        proficiencyLevel: proficiencyLevel as any,
        conversationHistory: [],
        sessionId,
        startTime: new Date(),
        totalMessages: 0,
        learningProgress: {
          vocabularyLearned: [],
          grammarPointsCovered: [],
          culturalInsightsGained: [],
          mistakesCorrected: 0,
          fluencyScore: this.getInitialFluencyScore(proficiencyLevel),
        },
        conversationMetrics: {
          averageResponseTime: 0,
          engagementLevel: 5,
          topicSwitches: 0,
          questionsAsked: 0,
        },
      }
      
      this.activeConversations.set(sessionId, context)
    }
    
    return context
  }

  /**
   * Get conversation session
   */
  async getSession(sessionId: string): Promise<EnhancedConversationContext | null> {
    return this.activeConversations.get(sessionId) || null
  }

  /**
   * Get user sessions
   */
  async getUserSessions(userId: string): Promise<EnhancedConversationContext[]> {
    const userSessions: EnhancedConversationContext[] = []
    
    for (const [sessionId, context] of this.activeConversations.entries()) {
      if (context.userId === userId) {
        userSessions.push(context)
      }
    }
    
    return userSessions
  }

  // Private helper methods

  private async generateWelcomeMessage(
    context: EnhancedConversationContext, 
    persona: any
  ): Promise<PersonaResponse> {
    const welcomeInput = `Hello! I'm ready to start learning ${context.targetLanguage}.`
    
    const response = await this.langChainService.generateResponse(welcomeInput, context)
    
    return {
      message: response.response,
      persona: context.personaId,
      timestamp: new Date(),
      metadata: {
        ...response.metadata,
        engagementScore: 8,
        learningTips: [`Welcome! I'm ${persona.name}, and I'm excited to help you learn ${context.targetLanguage}.`],
      },
    }
  }

  private getInitialFluencyScore(proficiencyLevel: string): number {
    const scores = {
      beginner: 2,
      elementary: 3,
      intermediate: 5,
      'upper-intermediate': 7,
      advanced: 8,
      proficient: 9,
    }
    return scores[proficiencyLevel as keyof typeof scores] || 5
  }

  private updateResponseTimeMetrics(context: EnhancedConversationContext, responseTime: number) {
    const currentAvg = context.conversationMetrics.averageResponseTime
    const totalMessages = context.totalMessages
    
    context.conversationMetrics.averageResponseTime = 
      (currentAvg * (totalMessages - 1) + responseTime) / totalMessages
  }

  private updateLearningProgress(
    context: EnhancedConversationContext, 
    metadata: any
  ) {
    if (metadata.vocabulary) {
      context.learningProgress.vocabularyLearned.push(...metadata.vocabulary)
    }
    
    if (metadata.culturalNotes) {
      context.learningProgress.culturalInsightsGained.push(...metadata.culturalNotes)
    }
    
    if (metadata.corrections) {
      context.learningProgress.mistakesCorrected += metadata.corrections.length
    }
  }

  private calculateEngagementScore(userMessage: string, context: EnhancedConversationContext): number {
    let score = 5 // baseline
    
    // Longer messages indicate engagement
    if (userMessage.length > 50) score += 1
    if (userMessage.length > 100) score += 1
    
    // Questions indicate curiosity
    if (userMessage.includes('?')) {
      score += 1
      context.conversationMetrics.questionsAsked++
    }
    
    // Emotional expressions
    if (/[!😊😄🤔💭]/.test(userMessage)) score += 1
    
    return Math.min(10, Math.max(1, score))
  }

  private async generateNextActions(
    context: EnhancedConversationContext,
    metadata: any
  ) {
    const actions: any = {}
    
    if (metadata.suggestedTopics) {
      actions.topicSuggestions = metadata.suggestedTopics
    }
    
    // Generate follow-up questions based on conversation
    if (context.conversationHistory.length > 2) {
      actions.suggestedQuestions = [
        "Can you tell me more about that?",
        "What do you think about this topic?",
        "How does this compare to your experience?",
      ]
    }
    
    return actions
  }

  private generateLearningTips(
    context: EnhancedConversationContext,
    metadata: any
  ): string[] {
    const tips: string[] = []
    
    if (metadata.vocabulary?.length > 0) {
      tips.push(`Great! You learned ${metadata.vocabulary.length} new words in this conversation.`)
    }
    
    if (metadata.corrections?.length > 0) {
      tips.push(`I made ${metadata.corrections.length} gentle corrections to help improve your grammar.`)
    }
    
    if (context.learningProgress.fluencyScore > 7) {
      tips.push("Your fluency is improving! Try expressing more complex ideas.")
    }
    
    return tips
  }

  private async generateConversationSummary(context: EnhancedConversationContext): Promise<string> {
    const recentMessages = context.conversationHistory.slice(-10)
    const conversationText = recentMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n')
    
    // This would ideally use LangChain to generate a proper summary
    return `Had a great conversation about various topics. Covered ${context.learningProgress.vocabularyLearned.length} new vocabulary words and made significant progress in ${context.targetLanguage}.`
  }

  private analyzeProgressMade(context: EnhancedConversationContext): string[] {
    const progress: string[] = []
    
    if (context.learningProgress.vocabularyLearned.length > 0) {
      progress.push(`Learned ${context.learningProgress.vocabularyLearned.length} new vocabulary words`)
    }
    
    if (context.learningProgress.mistakesCorrected > 0) {
      progress.push(`Received corrections for ${context.learningProgress.mistakesCorrected} grammar/usage mistakes`)
    }
    
    if (context.conversationMetrics.questionsAsked > 0) {
      progress.push(`Asked ${context.conversationMetrics.questionsAsked} engaging questions`)
    }
    
    return progress
  }

  private identifyImprovementAreas(context: EnhancedConversationContext): string[] {
    const areas: string[] = []
    
    if (context.learningProgress.mistakesCorrected > 5) {
      areas.push("Grammar and sentence structure")
    }
    
    if (context.conversationMetrics.averageResponseTime > 30) {
      areas.push("Fluency and response speed")
    }
    
    if (context.conversationMetrics.questionsAsked < 2) {
      areas.push("Active participation and curiosity")
    }
    
    return areas
  }

  private async generatePracticeRecommendations(context: EnhancedConversationContext): Promise<string[]> {
    return [
      `Practice using the new vocabulary: ${context.learningProgress.vocabularyLearned.slice(0, 3).join(', ')}`,
      `Focus on grammar patterns that came up in our conversation`,
      `Try having conversations about ${context.currentTopic || 'daily activities'}`,
    ]
  }

  private calculateFluencyImprovement(context: EnhancedConversationContext): number {
    // Calculate improvement based on various metrics
    const baseScore = this.getInitialFluencyScore(context.proficiencyLevel)
    let improvement = 0
    
    if (context.totalMessages > 10) improvement += 0.5
    if (context.learningProgress.vocabularyLearned.length > 5) improvement += 0.5
    if (context.conversationMetrics.engagementLevel > 7) improvement += 0.5
    
    return Math.round(improvement * 10) / 10
  }

  private async generatePersonaSwitchMessage(
    context: EnhancedConversationContext,
    oldPersonaId: PersonaId,
    newPersonaId: PersonaId
  ): Promise<PersonaResponse> {
    const oldPersona = PERSONAS.find(p => p.id === oldPersonaId)
    const newPersona = PERSONAS.find(p => p.id === newPersonaId)
    
    const switchMessage = `Hi! I'm ${newPersona?.name}. ${oldPersona?.name} told me you've been doing great with your ${context.targetLanguage} practice. I'm excited to continue the conversation with you!`
    
    return {
      message: switchMessage,
      persona: newPersonaId,
      timestamp: new Date(),
      metadata: {
        engagementScore: 7,
        learningTips: [`You're now chatting with ${newPersona?.name} - ${newPersona?.description}`],
      },
    }
  }
}

export { EnhancedPersonaConversationService as LangChainEnhancedService }
