// services/enhanced-persona-conversation-service.ts
import { PersonaId, ConversationContext, EnhancedConversationContext, ConversationMessage, PersonaResponse } from '@/types/conversation';
import { ProcessedConversationPattern } from './conversation-data-processor';

interface PersonaConfiguration {
  id: PersonaId;
  name: string;
  description: string;
  basePersonality: {
    patience: number; // 1-10
    energy: number; // 1-10
    formality: number; // 1-10
    culturalFocus: number; // 1-10
    correctionStyle: 'gentle' | 'direct' | 'encouraging';
  };
  preferredScenarios: string[];
  responsePatterns: ResponsePattern[];
  conversationStarters: ConversationStarter[];
}

interface ResponsePattern {
  pattern: string;
  triggers: string[];
  responses: string[];
  culturalNotes?: string[];
  vocabularyFocus?: string[];
}

interface ConversationStarter {
  scenario: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  opener: string;
  context: string;
  expectedResponses: string[];
}

export class EnhancedPersonaConversationService {
  private conversationPatterns: ProcessedConversationPattern[] = [];
  private personas: Map<PersonaId, PersonaConfiguration> = new Map();
  private currentConversationData: Map<string, ConversationContext> = new Map();

  constructor(processedPatterns?: ProcessedConversationPattern[]) {
    this.initializePersonas();
    if (processedPatterns) {
      this.loadConversationPatterns(processedPatterns);
    }
  }

  /**
   * Load processed conversation patterns
   */
  loadConversationPatterns(patterns: ProcessedConversationPattern[]) {
    this.conversationPatterns = patterns;
    console.log(`✅ Loaded ${patterns.length} conversation patterns`);
    
    // Update persona configurations based on patterns
    this.updatePersonaConfigurations();
  }

  /**
   * Initialize persona configurations
   */
  private initializePersonas() {
    // Maya - Patient Teacher
    this.personas.set('maya', {
      id: 'maya',
      name: 'Maya',
      description: 'Patient teacher focused on grammar and vocabulary building',
      basePersonality: {
        patience: 10,
        energy: 6,
        formality: 7,
        culturalFocus: 6,
        correctionStyle: 'gentle'
      },
      preferredScenarios: ['educational', 'university', 'grammar_lesson'],
      responsePatterns: [
        {
          pattern: 'gentle_correction',
          triggers: ['mistake', 'error', 'wrong'],
          responses: [
            "Ne t'inquiète pas, c'est normal de faire des erreurs. La forme correcte est {correction}.",
            "Presque ! En fait, on dit plutôt {correction}. C'est une erreur commune.",
            "Bonne tentative ! La bonne réponse est {correction}. Veux-tu que je t'explique pourquoi ?"
          ],
          culturalNotes: ["French learners often appreciate gentle correction"],
          vocabularyFocus: ["grammar_terms", "encouragement"]
        },
        {
          pattern: 'encouragement',
          triggers: ['difficile', 'hard', 'challenging'],
          responses: [
            "Courage ! Tu fais de très bons progrès.",
            "C'est normal que ce soit difficile au début. Continue comme ça !",
            "Ne te décourage pas, tu y arrives très bien."
          ],
          culturalNotes: ["French culture values encouragement in learning"],
          vocabularyFocus: ["emotional_support", "learning_progress"]
        }
      ],
      conversationStarters: [
        {
          scenario: 'grammar_lesson',
          difficulty: 'beginner',
          opener: "Bonjour ! Aujourd'hui, nous allons parler de tes activités quotidiennes. Qu'est-ce que tu fais le matin ?",
          context: "Practicing present tense and daily routine vocabulary",
          expectedResponses: ["daily_activities", "present_tense_verbs"]
        },
        {
          scenario: 'vocabulary_building',
          difficulty: 'intermediate',
          opener: "Dis-moi, est-ce que tu connais bien la géographie française ? Peux-tu me nommer quelques régions ?",
          context: "Exploring French geography and cultural knowledge",
          expectedResponses: ["geography_terms", "cultural_references"]
        }
      ]
    });

    // Alex - Conversational Friend
    this.personas.set('alex', {
      id: 'alex',
      name: 'Alex',
      description: 'Energetic friend for casual conversation and cultural exchange',
      basePersonality: {
        patience: 7,
        energy: 9,
        formality: 4,
        culturalFocus: 7,
        correctionStyle: 'encouraging'
      },
      preferredScenarios: ['recreational', 'social_interaction', 'daily_life'],
      responsePatterns: [
        {
          pattern: 'enthusiastic_response',
          triggers: ['sport', 'weekend', 'vacation', 'fun'],
          responses: [
            "Oh là là, c'est génial ! Raconte-moi tout !",
            "Super ! Moi aussi j'adore ça ! Tu fais ça souvent ?",
            "Quelle chance ! Ça doit être vraiment sympa !"
          ],
          culturalNotes: ["French youth often express enthusiasm this way"],
          vocabularyFocus: ["informal_expressions", "social_activities"]
        },
        {
          pattern: 'casual_inquiry',
          triggers: ['plans', 'doing', 'today', 'tomorrow'],
          responses: [
            "Et toi, qu'est-ce que tu fais de beau ce weekend ?",
            "Tu as des projets sympas en vue ?",
            "Alors, quoi de neuf dans ta vie ?"
          ],
          culturalNotes: ["Casual inquiries are common in French social interactions"],
          vocabularyFocus: ["time_expressions", "casual_conversation"]
        }
      ],
      conversationStarters: [
        {
          scenario: 'weekend_plans',
          difficulty: 'beginner',
          opener: "Salut ! Alors, qu'est-ce que tu fais ce weekend ? Moi, je vais peut-être faire du sport avec des amis.",
          context: "Discussing weekend activities and making plans",
          expectedResponses: ["weekend_activities", "sports", "social_plans"]
        },
        {
          scenario: 'sports_discussion',
          difficulty: 'intermediate',
          opener: "Tu fais du sport ? Moi j'adore le tennis et le jogging. Et toi, tu as un sport préféré ?",
          context: "Talking about sports preferences and activities",
          expectedResponses: ["sports_vocabulary", "preferences", "frequency"]
        }
      ]
    });

    // Luna - Cultural Guide
    this.personas.set('luna', {
      id: 'luna',
      name: 'Luna',
      description: 'Cultural expert for exploring French traditions and customs',
      basePersonality: {
        patience: 8,
        energy: 7,
        formality: 6,
        culturalFocus: 10,
        correctionStyle: 'direct'
      },
      preferredScenarios: ['cultural_exploration', 'travel', 'dining', 'traditions'],
      responsePatterns: [
        {
          pattern: 'cultural_explanation',
          triggers: ['culture', 'tradition', 'custom', 'France'],
          responses: [
            "C'est une excellente question ! En France, nous avons une tradition très particulière pour ça...",
            "Ah, c'est typiquement français ! Laisse-moi t'expliquer pourquoi nous faisons ça...",
            "C'est intéressant que tu demandes ça. Dans la culture française..."
          ],
          culturalNotes: ["French people enjoy sharing cultural knowledge"],
          vocabularyFocus: ["cultural_terms", "traditions", "explanations"]
        },
        {
          pattern: 'travel_advice',
          triggers: ['visit', 'travel', 'trip', 'vacation'],
          responses: [
            "Si tu visites la France, je te recommande absolument de...",
            "Pour bien profiter de ton voyage, il faut que tu saches que...",
            "N'oublie pas que en France, c'est important de..."
          ],
          culturalNotes: ["Travel advice includes cultural etiquette"],
          vocabularyFocus: ["travel_vocabulary", "recommendations", "cultural_tips"]
        }
      ],
      conversationStarters: [
        {
          scenario: 'french_cuisine',
          difficulty: 'intermediate',
          opener: "Parlons de la cuisine française ! Connais-tu les spécialités de différentes régions ? Le petit-déjeuner français, par exemple, est très différent du petit-déjeuner américain.",
          context: "Exploring French culinary culture and regional differences",
          expectedResponses: ["food_vocabulary", "regional_specialties", "cultural_comparisons"]
        },
        {
          scenario: 'travel_planning',
          difficulty: 'advanced',
          opener: "Tu prévois de voyager en France ? Il y a tellement de choses à voir ! Entre la Toscane... ah non, pardon, ça c'est l'Italie ! En France, nous avons la Provence, la Bretagne...",
          context: "Planning travel and discussing French regions",
          expectedResponses: ["geography", "travel_plans", "regional_culture"]
        }
      ]
    });
  }

  /**
   * Update persona configurations based on loaded conversation patterns
   */
  private updatePersonaConfigurations() {
    for (const [personaId, persona] of this.personas) {
      const relevantPatterns = this.conversationPatterns.filter(
        pattern => pattern.personaMapping[personaId].score >= 6
      );

      // Extract new response patterns from conversation data
      const newPatterns = this.extractResponsePatternsFromData(relevantPatterns);
      persona.responsePatterns.push(...newPatterns);

      // Extract new conversation starters
      const newStarters = this.extractConversationStarters(relevantPatterns, personaId);
      persona.conversationStarters.push(...newStarters);

      console.log(`🔄 Updated ${personaId} with ${newPatterns.length} new patterns and ${newStarters.length} new starters`);
    }
  }

  /**
   * Extract response patterns from conversation data
   */
  private extractResponsePatternsFromData(patterns: ProcessedConversationPattern[]): ResponsePattern[] {
    const responsePatterns: ResponsePattern[] = [];

    patterns.forEach(pattern => {
      // Extract patterns from dialogue segments
      pattern.dialogueSegments.forEach(segment => {
        if (segment.responsePatterns.length > 0) {
          const existingPattern = responsePatterns.find(rp => rp.pattern === segment.intent);
          
          if (existingPattern) {
            existingPattern.responses.push(segment.content);
          } else {
            responsePatterns.push({
              pattern: segment.intent,
              triggers: [segment.intent],
              responses: [segment.content],
              culturalNotes: pattern.culturalElements.map(ce => ce.description),
              vocabularyFocus: pattern.vocabularyPatterns.flatMap(vp => vp.words.map(w => w.category))
            });
          }
        }
      });
    });

    return responsePatterns.slice(0, 10); // Limit to prevent overwhelming
  }

  /**
   * Extract conversation starters from patterns
   */
  private extractConversationStarters(patterns: ProcessedConversationPattern[], personaId: PersonaId): ConversationStarter[] {
    const starters: ConversationStarter[] = [];

    patterns.forEach(pattern => {
      if (pattern.dialogueSegments.length > 0) {
        const firstSegment = pattern.dialogueSegments[0];
        
        starters.push({
          scenario: pattern.scenario,
          difficulty: pattern.difficulty,
          opener: firstSegment.content,
          context: `From real conversation: ${pattern.context.topic}`,
          expectedResponses: pattern.vocabularyPatterns.flatMap(vp => vp.words.map(w => w.category))
        });
      }
    });

    return starters.slice(0, 5); // Limit to prevent overwhelming
  }

  /**
   * Generate persona response based on user input and conversation context
   */  async generatePersonaResponse(
    personaId: PersonaId,
    userMessage: string,
    context: EnhancedConversationContext
  ): Promise<PersonaResponse> {
    const persona = this.personas.get(personaId);
    if (!persona) {
      throw new Error(`Persona ${personaId} not found`);
    }

    // Analyze user message
    const messageAnalysis = this.analyzeUserMessage(userMessage);
    
    // Find relevant conversation patterns
    const relevantPatterns = this.findRelevantPatterns(personaId, messageAnalysis, context);
    
    // Generate response based on persona configuration and patterns
    const response = await this.generateResponse(persona, messageAnalysis, relevantPatterns, context);
    
    return response;
  }
  /**
   * Analyze user message to understand intent and content
   */
  private analyzeUserMessage(message: string) {
    const lower = message.toLowerCase();
    
    return {
      intent: this.detectIntent(lower),
      topic: this.detectTopic(lower),
      difficulty: this.assessMessageDifficulty(message),
      emotionalTone: this.detectEmotionalTone(lower),
      errors: this.detectPotentialErrors(message),
      vocabulary: this.extractVocabulary(message),
      language: this.detectLanguage(message), // Add language detection
      complexity: this.assessGrammaticalComplexity(message) // Add complexity assessment
    };
  }
  /**
   * Detect language from message content with improved accuracy
   */
  private detectLanguage(message: string): 'french' | 'spanish' | 'english' {
    const lowerMessage = message.toLowerCase();
    
    // French-specific patterns (accents, articles, common words)
    const frenchIndicators = [
      // Common French words
      'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles',
      'le', 'la', 'les', 'un', 'une', 'des',
      'de', 'du', 'de la', 'des', 'à', 'au', 'aux',
      'est', 'sont', 'était', 'avez', 'avoir', 'être',
      'bonjour', 'merci', 'excusez-moi', 'au revoir', 'comment allez-vous',
      'très', 'bien', 'de rien', 'désolé', 'pardon', 's\'il vous plaît',
      'français', 'france', 'géographie', 'université', 'comprends',
      'voudrais', 'pouvez', 'différence', 'petit-déjeuner',
      // French-specific conjugations and structures
      'qu\'est-ce que', 'est-ce que', 'c\'est', 'n\'est', 'qu\'', 'où', 'quand'
    ];

    // Spanish-specific patterns
    const spanishIndicators = [
      // Common Spanish words
      'yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'ellas',
      'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
      'de', 'del', 'de la', 'de los', 'de las', 'a', 'al', 'a la',
      'es', 'son', 'era', 'tenéis', 'tener', 'ser', 'estar', 'está', 'están',
      'hola', 'gracias', 'por favor', 'buenos días', 'buenas tardes',
      'muy', 'bien', 'de nada', 'lo siento', 'perdón', 'disculpe',
      'español', 'españa', 'geografía', 'universidad', 'comprendo',
      'quisiera', 'puede', 'diferencia', 'desayuno',
      // Spanish-specific patterns
      'qué', 'cómo', 'dónde', 'cuándo', 'por qué', '¿', '¡'
    ];

    // English indicators
    const englishIndicators = [
      'i', 'you', 'he', 'she', 'we', 'they',
      'the', 'a', 'an', 'this', 'that', 'these', 'those',
      'is', 'are', 'was', 'were', 'have', 'has', 'had',
      'hello', 'thank you', 'please', 'good morning', 'good afternoon',
      'very', 'well', 'you\'re welcome', 'sorry', 'excuse me',
      'english', 'geography', 'university', 'understand',
      'would like', 'can you', 'difference', 'breakfast',
      'what', 'how', 'where', 'when', 'why'
    ];

    // Count matches with weights
    let frenchScore = 0;
    let spanishScore = 0;
    let englishScore = 0;

    // Check for exact word matches
    frenchIndicators.forEach(indicator => {
      if (lowerMessage.includes(indicator)) {
        frenchScore += indicator.length > 3 ? 2 : 1; // Longer words get more weight
      }
    });

    spanishIndicators.forEach(indicator => {
      if (lowerMessage.includes(indicator)) {
        spanishScore += indicator.length > 3 ? 2 : 1;
      }
    });

    englishIndicators.forEach(indicator => {
      if (lowerMessage.includes(indicator)) {
        englishScore += indicator.length > 3 ? 2 : 1;
      }
    });

    // Specific pattern bonuses
    if (lowerMessage.includes('qu\'est-ce que') || lowerMessage.includes('est-ce que')) {
      frenchScore += 5;
    }
    if (lowerMessage.includes('¿') || lowerMessage.includes('¡')) {
      spanishScore += 5;
    }
    if (lowerMessage.match(/\b(do|does|did|will|would|could|should)\b/)) {
      englishScore += 3;
    }

    // French accents bonus
    if (lowerMessage.match(/[àâäéèêëîïôöùûüÿç]/)) {
      frenchScore += 3;
    }

    // Spanish accents bonus
    if (lowerMessage.match(/[áéíóúñü]/)) {
      spanishScore += 3;
    }

    console.log(`Language detection - French: ${frenchScore}, Spanish: ${spanishScore}, English: ${englishScore}`);

    // Determine language based on highest score
    if (frenchScore > spanishScore && frenchScore > englishScore && frenchScore > 0) {
      return 'french';
    } else if (spanishScore > englishScore && spanishScore > 0) {
      return 'spanish';
    } else if (englishScore > 0) {
      return 'english';
    } else {
      // Default to French if no clear indicators (since most of our data is French)
      return 'french';
    }
  }

  /**
   * Assess grammatical complexity of message
   */
  private assessGrammaticalComplexity(message: string): 'simple' | 'moderate' | 'complex' {
    const complexityIndicators = {
      subordinateClauses: /\b(que|qui|dont|où|si|quand|parce que|bien que|aunque|mientras|porque)\b/gi,
      conditionals: /\b(si|if|would|could|should|podría|debería|sería)\b/gi,
      subjunctive: /\b(que.*[aeiou]e|que.*[aeiou]es|que.*[aeiou]en)\b/gi,
      complexTenses: /\b(avais|était|serait|habría|había|sería)\b/gi
    };

    let complexityScore = 0;
    
    Object.values(complexityIndicators).forEach(pattern => {
      const matches = message.match(pattern);
      if (matches) complexityScore += matches.length;
    });

    const sentenceLength = message.split(/[.!?]+/).length;
    const avgWordsPerSentence = message.split(' ').length / sentenceLength;

    if (complexityScore >= 3 || avgWordsPerSentence > 15) {
      return 'complex';
    } else if (complexityScore >= 1 || avgWordsPerSentence > 8) {
      return 'moderate';
    } else {
      return 'simple';
    }
  }

  /**
   * Detect user intent with enhanced multilingual support
   */
  private detectIntent(message: string): string {
    // Question patterns for multiple languages
    const questionPatterns = {
      french: ['?', 'est-ce que', 'où', 'quand', 'comment', 'pourquoi', 'qu\'est-ce que'],
      spanish: ['?', '¿', 'dónde', 'cuándo', 'cómo', 'por qué', 'qué', 'cuál'],
      english: ['?', 'where', 'when', 'how', 'why', 'what', 'which']
    };

    // Request patterns
    const requestPatterns = {
      french: ['je voudrais', 'pouvez-vous', 'pourriez-vous', 'j\'aimerais'],
      spanish: ['me gustaría', 'podría', 'puede', 'quisiera'],
      english: ['could you', 'would you', 'can you', 'i would like']
    };

    // Politeness patterns
    const politenessPatterns = {
      french: ['merci', 'excusez-moi', 's\'il vous plaît', 'pardon'],
      spanish: ['gracias', 'por favor', 'disculpe', 'perdón'],
      english: ['thank you', 'please', 'excuse me', 'sorry']
    };

    // Greeting patterns
    const greetingPatterns = {
      french: ['bonjour', 'salut', 'au revoir', 'bonsoir'],
      spanish: ['hola', 'buenos días', 'buenas tardes', 'adiós'],
      english: ['hello', 'good morning', 'good afternoon', 'goodbye']
    };

    // Check each intent type
    for (const patterns of Object.values(questionPatterns)) {
      if (patterns.some(pattern => message.includes(pattern))) {
        return 'question';
      }
    }

    for (const patterns of Object.values(requestPatterns)) {
      if (patterns.some(pattern => message.includes(pattern))) {
        return 'request';
      }
    }

    for (const patterns of Object.values(politenessPatterns)) {
      if (patterns.some(pattern => message.includes(pattern))) {
        return 'politeness';
      }
    }

    for (const patterns of Object.values(greetingPatterns)) {
      if (patterns.some(pattern => message.includes(pattern))) {
        return 'greeting';
      }
    }

    return 'statement';
  }

  /**
   * Enhanced topic detection with multilingual support
   */
  private detectTopic(message: string): string {
    const topicKeywords = {
      'sports': {
        french: ['sport', 'tennis', 'football', 'jogging', 'natation', 'basket'],
        spanish: ['deporte', 'fútbol', 'tenis', 'natación', 'baloncesto', 'correr'],
        english: ['sport', 'tennis', 'football', 'swimming', 'basketball', 'running']
      },
      'food': {
        french: ['manger', 'restaurant', 'cuisine', 'déjeuner', 'dîner', 'café', 'pain'],
        spanish: ['comer', 'restaurante', 'cocina', 'almuerzo', 'cena', 'café', 'pan'],
        english: ['eat', 'restaurant', 'food', 'lunch', 'dinner', 'coffee', 'bread']
      },
      'travel': {
        french: ['voyage', 'vacances', 'partir', 'visiter', 'hôtel', 'avion'],
        spanish: ['viaje', 'vacaciones', 'viajar', 'visitar', 'hotel', 'avión'],
        english: ['travel', 'vacation', 'trip', 'visit', 'hotel', 'airplane']
      },
      'work': {
        french: ['travail', 'bureau', 'collègue', 'entreprise', 'métier', 'patron'],
        spanish: ['trabajo', 'oficina', 'colega', 'empresa', 'profesión', 'jefe'],
        english: ['work', 'office', 'colleague', 'company', 'job', 'boss']
      },
      'family': {
        french: ['famille', 'parents', 'enfants', 'frère', 'sœur', 'père', 'mère'],
        spanish: ['familia', 'padres', 'niños', 'hermano', 'hermana', 'padre', 'madre'],
        english: ['family', 'parents', 'children', 'brother', 'sister', 'father', 'mother']
      },
      'education': {
        french: ['école', 'université', 'cours', 'étudier', 'apprendre', 'professeur'],
        spanish: ['escuela', 'universidad', 'clase', 'estudiar', 'aprender', 'profesor'],
        english: ['school', 'university', 'class', 'study', 'learn', 'teacher']
      },
      'shopping': {
        french: ['acheter', 'magasin', 'prix', 'cher', 'vendre', 'argent'],
        spanish: ['comprar', 'tienda', 'precio', 'caro', 'vender', 'dinero'],
        english: ['buy', 'store', 'price', 'expensive', 'sell', 'money']
      },
      'culture': {
        french: ['culture', 'tradition', 'histoire', 'art', 'musique', 'festival'],
        spanish: ['cultura', 'tradición', 'historia', 'arte', 'música', 'festival'],
        english: ['culture', 'tradition', 'history', 'art', 'music', 'festival']
      }
    };

    for (const [topic, languages] of Object.entries(topicKeywords)) {
      for (const keywords of Object.values(languages)) {
        if (keywords.some(keyword => message.includes(keyword))) {
          return topic;
        }
      }
    }

    return 'general';
  }

  /**
   * Assess message difficulty
   */
  private assessMessageDifficulty(message: string): 'beginner' | 'intermediate' | 'advanced' {
    const words = message.split(' ').length;
    const avgWordLength = message.replace(/\s/g, '').length / words;
    const hasComplexGrammar = message.includes('que') || message.includes('dont') || message.includes('si');

    if (words > 15 || avgWordLength > 8 || hasComplexGrammar) {
      return 'advanced';
    } else if (words > 8 || avgWordLength > 6) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  }

  /**
   * Detect emotional tone
   */
  private detectEmotionalTone(message: string): string {
    if (message.includes('super') || message.includes('génial') || message.includes('excellent')) {
      return 'enthusiastic';
    } else if (message.includes('difficile') || message.includes('problème') || message.includes('ne comprends pas')) {
      return 'confused';
    } else if (message.includes('merci') || message.includes('content')) {
      return 'positive';
    } else {
      return 'neutral';
    }
  }

  /**
   * Detect potential errors (simplified)
   */
  private detectPotentialErrors(message: string): string[] {
    const errors: string[] = [];
    
    // Common error patterns
    if (message.includes('je suis aller')) {
      errors.push('Past participle agreement with être');
    }
    if (message.includes('j\'ai allé')) {
      errors.push('Incorrect auxiliary verb - should use être');
    }
    // Add more error detection patterns
    
    return errors;
  }

  /**
   * Extract vocabulary from message
   */
  private extractVocabulary(message: string): string[] {
    // Simple word extraction - in practice, you'd use more sophisticated NLP
    return message.split(' ').filter(word => word.length > 3);
  }  /**
   * Find relevant conversation patterns with improved scoring
   */
  private findRelevantPatterns(personaId: PersonaId, messageAnalysis: any, context: EnhancedConversationContext): ProcessedConversationPattern[] {
    const allPatterns = this.conversationPatterns.filter(pattern => {
      // Check if pattern exists and has persona mapping
      if (!pattern.personaMapping || !pattern.personaMapping[personaId]) return false;
      
      // Check persona relevance (lowered threshold for better matching)
      if (pattern.personaMapping[personaId].score < 4) return false;
      
      return true;
    });

    // Score patterns based on multiple factors
    const scoredPatterns = allPatterns.map(pattern => {
      let score = pattern.personaMapping[personaId].score;
      
      // Language match bonus (important for multilingual support)
      const patternLanguage = this.detectPatternLanguage(pattern);
      if (patternLanguage === messageAnalysis.language) {
        score += 3;
      }
      
      // Topic relevance bonus
      if (pattern.context.topic === messageAnalysis.topic) {
        score += 2;
      }
      
      // Difficulty appropriateness
      if (pattern.difficulty === messageAnalysis.difficulty) {
        score += 1;
      } else if (this.isDifficultyAppropriate(pattern.difficulty, messageAnalysis.difficulty)) {
        score += 0.5;
      }      // Scenario matching bonus - commenting out since scenario may not exist in context
      // if (context.scenario && pattern.scenario === context.scenario) {
      //   score += 2;
      // }
      
      // Context relevance based on communicative function
      if (this.isContextRelevant(pattern.context, messageAnalysis.intent)) {
        score += 1;
      }
      
      // Cultural element relevance
      if (pattern.culturalElements.length > 0 && messageAnalysis.topic === 'culture') {
        score += 1;
      }
      
      // Vocabulary complexity match
      if (this.isVocabularyAppropriate(pattern.vocabularyPatterns, messageAnalysis.complexity)) {
        score += 0.5;
      }

      return { pattern, score };
    });

    // Sort by score and return top patterns
    return scoredPatterns
      .sort((a, b) => b.score - a.score)
      .slice(0, 10) // Take top 10 patterns
      .map(scored => scored.pattern);
  }

  /**
   * Detect the language of a conversation pattern
   */
  private detectPatternLanguage(pattern: ProcessedConversationPattern): 'french' | 'spanish' | 'english' {
    const dialogueText = pattern.dialogueSegments.map(segment => segment.content).join(' ').toLowerCase();
    
    // Count language-specific indicators
    const spanishIndicators = ['es', 'son', 'está', 'están', 'muy', 'pero', 'con', 'por', 'para', 'que', 'qué', 'cómo'];
    const frenchIndicators = ['est', 'sont', 'très', 'mais', 'avec', 'pour', 'que', 'qu\'', 'comment', 'où'];
    
    const spanishCount = spanishIndicators.filter(indicator => dialogueText.includes(indicator)).length;
    const frenchCount = frenchIndicators.filter(indicator => dialogueText.includes(indicator)).length;
    
    if (spanishCount > frenchCount && spanishCount > 2) {
      return 'spanish';
    } else if (frenchCount > 2) {
      return 'french';
    } else {
      return 'english';
    }
  }
  /**
   * Check if difficulty levels are appropriate for matching
   */
  private isDifficultyAppropriate(patternDifficulty: string, userDifficulty: string): boolean {
    const difficultyLevels: Record<string, number> = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    const patternLevel = difficultyLevels[patternDifficulty] || 1;
    const userLevel = difficultyLevels[userDifficulty] || 1;
    
    // Allow patterns one level above or below user level
    return Math.abs(patternLevel - userLevel) <= 1;
  }
  /**
   * Check if context is relevant to user intent
   */
  private isContextRelevant(patternContext: any, userIntent: string): boolean {
    const intentContextMap: Record<string, string[]> = {
      'question': ['teaching_learning', 'informational', 'academic_discussion'],
      'request': ['service_interaction', 'professional_discussion'],
      'greeting': ['social_interaction', 'casual_conversation'],
      'politeness': ['cultural_exchange', 'formal_interaction'],
      'statement': ['conversation', 'sharing', 'discussion']
    };
    
    const relevantContexts = intentContextMap[userIntent] || [];
    return relevantContexts.includes(patternContext.communicativeFunction);
  }
  /**
   * Check if vocabulary is appropriate for user's complexity level
   */
  private isVocabularyAppropriate(vocabularyPatterns: any[], userComplexity: string): boolean {
    if (vocabularyPatterns.length === 0) return true;
    
    const complexityLevels: Record<string, number> = { 'simple': 1, 'moderate': 2, 'complex': 3 };
    const userLevel = complexityLevels[userComplexity] || 1;
    
    // Check average difficulty of vocabulary in patterns
    const avgDifficulty = vocabularyPatterns.reduce((sum, vp) => {
      const diffLevel = complexityLevels[vp.difficulty as string] || 1;
      return sum + diffLevel;
    }, 0) / vocabularyPatterns.length;
      // Allow vocabulary within reasonable range
    return Math.abs(avgDifficulty - userLevel) <= 1.5;
  }
  /**
   * Generate response based on persona and patterns with improved fallback handling
   */  
  private async generateResponse(
    persona: PersonaConfiguration,
    messageAnalysis: any,
    relevantPatterns: ProcessedConversationPattern[],
    context: EnhancedConversationContext
  ): Promise<PersonaResponse> {
    let content = '';
    let grammarPoints: string[] = [];
    let vocabularyHighlights: any[] = [];
    let culturalNotes = '';

    // Try persona-specific pattern first
    const responsePattern = this.findBestResponsePattern(persona, messageAnalysis);
    
    if (responsePattern) {
      // Use persona-specific pattern response
      content = this.selectContextualResponse(responsePattern, messageAnalysis);
      
      // Add cultural notes if available
      if (responsePattern.culturalNotes && responsePattern.culturalNotes.length > 0) {
        culturalNotes = responsePattern.culturalNotes[0];
      }
    } else if (relevantPatterns.length > 0) {
      // Try to use conversation pattern data
      const selectedPattern = this.selectBestPattern(relevantPatterns, messageAnalysis);
      
      if (selectedPattern && selectedPattern.dialogueSegments.length > 0) {
        const dialogueSegment = this.selectBestDialogueSegment(selectedPattern, messageAnalysis);
        
        // Validate content quality before using
        if (this.isContentAppropriate(dialogueSegment.content, messageAnalysis)) {
          content = this.adaptContentToPersona(dialogueSegment.content, persona, messageAnalysis);
          grammarPoints = selectedPattern.grammarStructures.map(gs => gs.pattern);
          vocabularyHighlights = selectedPattern.vocabularyPatterns.flatMap(vp => vp.words);
          
          if (selectedPattern.culturalElements.length > 0) {
            culturalNotes = selectedPattern.culturalElements[0].description;
          }
        } else {
          // Content not appropriate, use default response
          content = this.generateContextualDefaultResponse(persona, messageAnalysis);
        }
      } else {
        // No valid pattern segments, use default
        content = this.generateContextualDefaultResponse(persona, messageAnalysis);
      }
    } else {
      // No patterns available, generate contextual default response
      content = this.generateContextualDefaultResponse(persona, messageAnalysis);
    }

    // Add language-appropriate corrections if needed
    if (messageAnalysis.errors.length > 0) {
      const correction = this.generateLanguageSpecificCorrection(persona, messageAnalysis);
      content = correction + " " + content;
    }

    // Ensure content is not empty or too short
    if (!content || content.length < 10) {
      content = this.generateContextualDefaultResponse(persona, messageAnalysis);
    }

    // Generate next suggestions based on conversation flow
    const nextSuggestions = this.generateNextSuggestions(persona, messageAnalysis, context);

    // Prepare enhanced teaching elements with language adaptation
    const teachingElements = {
      vocabularyHighlights: vocabularyHighlights.slice(0, 5).map(vh => ({
        word: vh.word || '',
        definition: vh.definition || '',
        category: vh.category || 'general',
        usage: vh.usage || '',
        language: messageAnalysis.language
      })),
      grammarExplanations: grammarPoints.slice(0, 3).map(gp => ({
        concept: gp,
        explanation: this.getGrammarExplanation(gp),
        examples: this.getGrammarExamples(gp, messageAnalysis.language)
      })),
      culturalInsights: culturalNotes ? [{
        aspect: this.extractCulturalAspect(culturalNotes),
        description: culturalNotes,
        language: messageAnalysis.language
      }] : [],
      suggestedFollowUp: nextSuggestions.length > 0 ? nextSuggestions[0] : undefined
    };

    return {
      content,
      culturalNotes,
      grammarPoints,
      vocabularyHighlights,
      nextSuggestions,
      // Enhanced fields for compatibility
      response: content,
      teachingElements
    };
  }

  /**
   * Check if content is appropriate for the context
   */
  private isContentAppropriate(content: string, messageAnalysis: any): boolean {
    // Check if content is too long (likely to be incoherent segments)
    if (content.length > 200) {
      return false;
    }
    
    // Check if content is too short or fragmented
    if (content.length < 10 || content.includes('...') || content.split(' ').length < 3) {
      return false;
    }
    
    // Check if content seems relevant to the topic
    const contentWords = content.toLowerCase().split(' ');
    const topicWords = messageAnalysis.topic.toLowerCase().split('_');
      // At least one topic word should appear, unless it's a general response
    const hasTopicRelevance = topicWords.some((word: string) => 
      contentWords.some((contentWord: string) => contentWord.includes(word) || word.includes(contentWord))
    );
    
    return hasTopicRelevance || messageAnalysis.topic === 'general';
  }

  /**
   * Find the best response pattern for the given context
   */
  private findBestResponsePattern(persona: PersonaConfiguration, messageAnalysis: any): ResponsePattern | undefined {
    const patterns = persona.responsePatterns;
    
    // Score patterns based on relevance
    const scoredPatterns = patterns.map(pattern => {
      let score = 0;
        // Check trigger matches
      const triggerMatches = pattern.triggers.filter(trigger => 
        messageAnalysis.topic.includes(trigger) || 
        messageAnalysis.intent === trigger ||
        messageAnalysis.vocabulary.some((word: string) => word.toLowerCase().includes(trigger.toLowerCase()))
      );
      score += triggerMatches.length * 2;
        // Check vocabulary focus alignment
      if (pattern.vocabularyFocus && pattern.vocabularyFocus.includes(messageAnalysis.topic)) {
        score += 1;
      }
      
      return { pattern, score };
    });

    // Return the highest scoring pattern if it has a meaningful score
    const bestMatch = scoredPatterns.sort((a, b) => b.score - a.score)[0];
    return bestMatch && bestMatch.score > 0 ? bestMatch.pattern : undefined;
  }

  /**
   * Select contextual response from pattern
   */
  private selectContextualResponse(pattern: ResponsePattern, messageAnalysis: any): string {
    const responses = pattern.responses;
    
    // For now, select randomly, but could be enhanced with sentiment matching
    if (messageAnalysis.emotionalTone === 'enthusiastic' && responses.length > 1) {
      // Prefer more enthusiastic responses if available
      return responses[0];
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  /**
   * Select the best conversation pattern based on context
   */
  private selectBestPattern(patterns: ProcessedConversationPattern[], messageAnalysis: any): ProcessedConversationPattern {
    if (patterns.length === 0) {
      // Return a fallback pattern if none available
      return this.createFallbackPattern(messageAnalysis);
    }

    // Score patterns based on multiple factors
    const scoredPatterns = patterns.map(pattern => {
      let score = 0;
      
      // Language match (highest priority)
      const patternLanguage = this.detectPatternLanguage(pattern);
      if (patternLanguage === messageAnalysis.language) {
        score += 5;
      }
      
      // Topic relevance
      if (pattern.context.topic.toLowerCase().includes(messageAnalysis.topic.toLowerCase())) {
        score += 3;
      }
      
      // Difficulty appropriateness
      if (pattern.difficulty === messageAnalysis.difficulty) {
        score += 2;
      }
      
      // Dialogue segment relevance
      const hasRelevantSegment = pattern.dialogueSegments.some(segment =>
        segment.intent === messageAnalysis.intent ||
        segment.content.toLowerCase().includes(messageAnalysis.topic.toLowerCase())
      );
      if (hasRelevantSegment) {
        score += 2;
      }
      
      // Prefer patterns with fewer words to avoid overly long responses
      const avgSegmentLength = pattern.dialogueSegments.reduce((sum, seg) => 
        sum + seg.content.split(' ').length, 0) / pattern.dialogueSegments.length;
      if (avgSegmentLength < 20) {
        score += 1;
      }
      
      return { pattern, score };
    });

    // Return the highest scoring pattern
    const bestPattern = scoredPatterns.sort((a, b) => b.score - a.score)[0];
    return bestPattern.pattern;
  }
  /**
   * Create a fallback pattern when no patterns are available
   */
  private createFallbackPattern(messageAnalysis: any): ProcessedConversationPattern {
    return {
      id: 'fallback',
      scenario: 'general_conversation',
      difficulty: messageAnalysis.difficulty,
      context: {
        setting: 'casual',
        participants: ['user', 'assistant'],
        topic: messageAnalysis.topic,
        communicativeFunction: 'conversation'
      },
      dialogueSegments: [{
        speaker: 'assistant',
        content: this.generateFallbackContent(messageAnalysis),
        intent: messageAnalysis.intent,
        emotionalTone: messageAnalysis.emotionalTone || 'neutral',
        responsePatterns: []
      }],
      vocabularyPatterns: [],
      grammarStructures: [],
      culturalElements: [],      personaMapping: {
        maya: { 
          score: 5,
          matchingTraits: ['supportive', 'educational'],
          applicableScenarios: ['general_conversation'],
          adaptationNotes: ['Use encouraging tone', 'Provide grammar support']
        },
        alex: { 
          score: 5,
          matchingTraits: ['casual', 'friendly'], 
          applicableScenarios: ['general_conversation'],
          adaptationNotes: ['Keep conversation light', 'Use informal expressions']
        },
        luna: { 
          score: 5,
          matchingTraits: ['informative', 'cultural'],
          applicableScenarios: ['general_conversation'], 
          adaptationNotes: ['Include cultural context', 'Explain traditions']
        }
      }
    };
  }

  /**
   * Generate appropriate fallback content
   */
  private generateFallbackContent(messageAnalysis: any): string {
    const language = messageAnalysis.language;
    const topic = messageAnalysis.topic;
    
    const fallbackTemplates = {
      french: {
        question: `C'est une bonne question sur ${topic}. Pouvez-vous me donner plus de détails ?`,
        greeting: `Bonjour ! Comment ça va ?`,
        statement: `Intéressant ! J'aimerais en savoir plus sur ${topic}.`,
        request: `Bien sûr, je peux vous aider avec ${topic}.`,
        default: `Parlons de ${topic}. Qu'est-ce que vous en pensez ?`
      },
      spanish: {
        question: `Es una buena pregunta sobre ${topic}. ¿Puede darme más detalles?`,
        greeting: `¡Hola! ¿Cómo está?`,
        statement: `¡Interesante! Me gustaría saber más sobre ${topic}.`,
        request: `Por supuesto, puedo ayudarle con ${topic}.`,
        default: `Hablemos de ${topic}. ¿Qué piensa?`
      },
      english: {
        question: `That's a good question about ${topic}. Can you give me more details?`,
        greeting: `Hello! How are you?`,
        statement: `Interesting! I'd like to know more about ${topic}.`,
        request: `Of course, I can help you with ${topic}.`,
        default: `Let's talk about ${topic}. What do you think?`
      }
    };

    const templates = (fallbackTemplates as any)[language] || fallbackTemplates.english;
    return templates[messageAnalysis.intent] || templates.default;
  }
  /**
   * Select best dialogue segment from pattern with better context matching
   */
  private selectBestDialogueSegment(pattern: ProcessedConversationPattern, messageAnalysis: any) {
    if (pattern.dialogueSegments.length === 0) {
      return {
        speaker: 'assistant',
        content: this.generateFallbackContent(messageAnalysis),
        intent: messageAnalysis.intent,
        emotionalTone: messageAnalysis.emotionalTone || 'neutral',
        responsePatterns: []
      };
    }

    // Score segments based on relevance
    const scoredSegments = pattern.dialogueSegments.map(segment => {
      let score = 0;
      
      // Intent match (highest priority)
      if (segment.intent === messageAnalysis.intent) {
        score += 5;
      }
        // Topic mention in content
      const topicWords = messageAnalysis.topic.toLowerCase().split('_');
      const contentLower = segment.content.toLowerCase();
      topicWords.forEach((word: string) => {
        if (contentLower.includes(word)) {
          score += 2;
        }
      });
      
      // Vocabulary relevance
      messageAnalysis.vocabulary.forEach((word: string) => {
        if (contentLower.includes(word.toLowerCase())) {
          score += 1;
        }
      });
      
      // Emotional tone match
      if (segment.emotionalTone === messageAnalysis.emotionalTone) {
        score += 1;
      }
      
      // Prefer shorter, more conversational segments
      const wordCount = segment.content.split(' ').length;
      if (wordCount >= 5 && wordCount <= 25) {
        score += 1;
      } else if (wordCount > 50) {
        score -= 2; // Penalize very long segments
      }
      
      // Avoid segments that seem like partial conversations
      if (segment.content.includes('...') || segment.content.length < 10) {
        score -= 3;
      }
      
      return { segment, score };
    });

    // Return the highest scoring segment, or first if all have low scores
    const bestMatch = scoredSegments.sort((a, b) => b.score - a.score)[0];
    return bestMatch && bestMatch.score > 0 ? bestMatch.segment : pattern.dialogueSegments[0];
  }

  /**
   * Adapt content to persona style
   */
  private adaptContentToPersona(content: string, persona: PersonaConfiguration, messageAnalysis: any): string {
    // Add persona-specific modifications
    if (persona.id === 'maya' && persona.basePersonality.correctionStyle === 'gentle') {
      // Maya adds encouraging phrases
      if (messageAnalysis.emotionalTone === 'confused') {
        return `Ne t'inquiète pas, c'est normal. ${content}`;
      }
    } else if (persona.id === 'alex' && persona.basePersonality.energy > 8) {
      // Alex adds enthusiastic expressions
      if (messageAnalysis.emotionalTone === 'positive') {
        return `${content} C'est génial !`;
      }
    } else if (persona.id === 'luna' && persona.basePersonality.culturalFocus === 10) {
      // Luna adds cultural context
      return content; // Cultural context added through culturalNotes
    }
    
    return content;
  }
  /**
   * Generate contextual default response based on language and persona with variety
   */
  private generateContextualDefaultResponse(persona: PersonaConfiguration, messageAnalysis: any): string {
    const language = messageAnalysis.language;
    const topic = messageAnalysis.topic;
    const intent = messageAnalysis.intent;
    
    // Topic-specific responses for better context
    const topicSpecificResponses = {
      french: {
        maya: {
          food: [
            "La cuisine française est fascinante ! Voulez-vous que nous explorions ensemble les spécialités de chaque région ?",
            "C'est un excellent sujet ! Commençons par les bases : connaissez-vous les repas traditionnels français ?",
            "Parfait ! La gastronomie française offre tant d'opportunités d'apprendre. Quel aspect vous intéresse le plus ?"
          ],
          sports: [
            "Le sport est un excellent moyen de pratiquer le français ! Quel sport vous passionne ?",
            "Très bien ! Nous pouvons apprendre beaucoup de vocabulaire en parlant de sport. Pratiquez-vous un sport particulier ?",
            "Excellente idée ! Le vocabulaire sportif est très utile en français. Commençons par vos activités préférées."
          ],
          travel: [
            "Les voyages sont parfaits pour pratiquer le français ! Où aimeriez-vous aller en France ?",
            "Magnifique ! Voyager en France est une excellente motivation pour apprendre. Avez-vous des destinations en tête ?",
            "C'est formidable ! Préparons votre voyage avec le vocabulaire essentiel. Quel type de voyage vous intéresse ?"
          ],
          family: [
            "La famille est un sujet important ! Apprenons le vocabulaire familial ensemble.",
            "Très bien ! Parler de la famille aide beaucoup à pratiquer. Voulez-vous commencer par décrire votre famille ?",
            "Excellent choix ! Les relations familiales offrent un riche vocabulaire à explorer."
          ]
        },
        alex: {
          food: [
            "Oh, la bouffe ! C'est mon truc préféré ! Tu connais des plats français sympas ?",
            "Miam ! J'adore parler de cuisine. Tu cuisines parfois ou tu préfères les restos ?",
            "Cool ! Moi aussi j'adore manger. Dis-moi, qu'est-ce que tu aimes comme cuisine ?"
          ],
          sports: [
            "Super ! Moi je suis fan de foot et de tennis. Et toi, tu fais quoi comme sport ?",
            "Génial ! J'adore le sport ! Tu regardes les matchs ou tu préfères pratiquer ?",
            "Ah cool ! On va bien s'entendre alors. Raconte-moi tes sports préférés !"
          ],
          travel: [
            "Waouh ! J'adore voyager ! Tu es déjà allé en France ? C'est trop beau !",
            "Oh là là ! Les voyages, c'est la vie ! Où tu rêves d'aller ?",
            "Génial ! Moi j'ai visité plein d'endroits cool. Tu veux des conseils ?"
          ],
          family: [
            "Ah, la famille ! C'est important ça. Tu es proche de ta famille ?",
            "Cool ! Moi j'adore ma famille. Tu as des frères et sœurs ?",
            "Sympa ! C'est toujours intéressant de parler de sa famille."
          ]
        },
        luna: {
          food: [
            "Ah, la gastronomie française ! C'est tout un art, vous savez. Chaque région a ses spécialités uniques.",
            "La cuisine française reflète notre riche patrimoine culturel. Connaissez-vous l'histoire derrière nos plats traditionnels ?",
            "Excellente question ! Notre culture culinaire est intimement liée à nos traditions. Laissez-moi vous expliquer..."
          ],
          travel: [
            "La France offre une diversité culturelle extraordinaire ! Chaque région a son charme particulier.",
            "Voyager en France, c'est découvrir mille facettes de notre culture. Quel aspect vous attire le plus ?",
            "Magnifique ! Nos provinces regorgent de trésors culturels à explorer. Permettez-moi de vous guider..."
          ],
          culture: [
            "Ah, notre patrimoine culturel ! C'est une passion pour moi. Quel aspect vous intrigue le plus ?",
            "La culture française est si riche et variée ! Par où voulez-vous commencer votre découverte ?",
            "Formidable ! Notre héritage culturel mérite qu'on s'y attarde. Laissez-moi vous éclairer..."
          ]
        }
      },
      spanish: {
        maya: {
          food: [
            "¡La cocina española es maravillosa! ¿Le gustaría que exploráramos juntos las especialidades de cada región?",
            "¡Es un excelente tema! Empecemos por lo básico: ¿conoce las comidas tradicionales españolas?",
            "¡Perfecto! La gastronomía española ofrece tantas oportunidades de aprender. ¿Qué aspecto le interesa más?"
          ],
          travel: [
            "¡Los viajes son perfectos para practicar español! ¿Dónde le gustaría ir en España?",
            "¡Magnífico! Viajar por España es una excelente motivación para aprender. ¿Tiene destinos en mente?",
            "¡Es formidable! Preparemos su viaje con el vocabulario esencial. ¿Qué tipo de viaje le interesa?"
          ]
        },
        alex: {
          food: [
            "¡Ah, la comida! ¡Es mi tema favorito! ¿Conoces platos españoles geniales?",
            "¡Ñam! Me encanta hablar de cocina. ¿Cocinas a veces o prefieres los restaurantes?",
            "¡Genial! A mí también me encanta comer. Dime, ¿qué tipo de cocina te gusta?"
          ],
          travel: [
            "¡Guau! ¡Me encanta viajar! ¿Ya has estado en España? ¡Es increíble!",
            "¡Oh! ¡Los viajes son la vida! ¿Dónde sueñas con ir?",
            "¡Genial! Yo he visitado muchos lugares increíbles. ¿Quieres consejos?"
          ]
        },
        luna: {
          culture: [
            "¡Ah, nuestro patrimonio cultural! Es una pasión para mí. ¿Qué aspecto le intriga más?",
            "¡La cultura española es tan rica y variada! ¿Por dónde quiere empezar su descubrimiento?",
            "¡Formidable! Nuestro legado cultural merece que nos detengamos en él. Permítame explicarle..."
          ]
        }
      }
    };

    // Get persona-specific responses for the topic
    const languageResponses = (topicSpecificResponses as any)[language];
    if (languageResponses && languageResponses[persona.id] && languageResponses[persona.id][topic]) {
      const responses = languageResponses[persona.id][topic];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Fallback to general responses based on intent and persona
    const generalResponses = {
      french: {
        maya: {
          question: [
            "C'est une excellente question ! Explorons cela ensemble.",
            "Très bonne question ! Cela mérite qu'on s'y attarde.",
            "Je vois que vous êtes curieux. C'est parfait pour apprendre !"
          ],
          greeting: [
            "Bonjour ! Je suis ravie de vous rencontrer. Comment puis-je vous aider aujourd'hui ?",
            "Salut ! Prêt pour une nouvelle leçon ? Que souhaitez-vous apprendre ?",
            "Bonjour ! J'espère que vous êtes motivé pour progresser aujourd'hui !"
          ],
          statement: [
            "C'est intéressant ! Pouvez-vous me dire plus ?",
            "Je comprends. Approfondissons ce sujet ensemble.",
            "Très bien ! Continuons sur cette lancée."
          ]
        },
        alex: {
          question: [
            "Oh, bonne question ! Ça m'intéresse aussi !",
            "Tiens, c'est marrant ça ! Qu'est-ce qui te fait dire ça ?",
            "Cool ! On va découvrir ça ensemble !"
          ],
          greeting: [
            "Salut ! Ça va bien ? Qu'est-ce qu'on fait aujourd'hui ?",
            "Hey ! Content de te revoir ! Quoi de neuf ?",
            "Coucou ! Prêt pour une discussion sympa ?"
          ],
          statement: [
            "Ah ouais ? Raconte-moi en plus !",
            "C'est cool ça ! Et toi, qu'est-ce que tu en penses ?",
            "Intéressant ! Moi aussi j'ai des trucs à raconter là-dessus !"
          ]
        },
        luna: {
          question: [
            "Voilà une question qui mérite réflexion ! Dans notre culture française...",
            "Excellente interrogation ! Permettez-moi de vous éclairer avec mon expérience...",
            "C'est une question fascinante ! L'approche française est particulière..."
          ],
          greeting: [
            "Bonjour ! Bienvenue dans cette exploration culturelle française !",
            "Salutations ! Prête pour un voyage au cœur de la culture française ?",
            "Bonjour ! J'ai hâte de partager notre patrimoine avec vous !"
          ],
          statement: [
            "Très pertinente remarque ! Cela me rappelle une tradition française...",
            "Intéressant ! Nous avons quelque chose de similaire en France...",
            "C'est fascinant ! Laissez-moi vous raconter comment nous voyons cela en France..."
          ]
        }
      },
      spanish: {
        maya: {
          question: [
            "¡Es una excelente pregunta! Exploremos esto juntos.",
            "¡Muy buena pregunta! Esto merece que nos detengamos.",
            "Veo que tiene curiosidad. ¡Es perfecto para aprender!"
          ],
          greeting: [
            "¡Hola! Estoy encantada de conocerle. ¿Cómo puedo ayudarle hoy?",
            "¡Salud! ¿Listo para una nueva lección? ¿Qué desea aprender?",
            "¡Buenos días! ¡Espero que esté motivado para progresar hoy!"
          ]
        },
        alex: {
          question: [
            "¡Oh, buena pregunta! ¡A mí también me interesa!",
            "¡Vaya, qué curioso! ¿Qué te hace decir eso?",
            "¡Genial! ¡Vamos a descubrir eso juntos!"
          ],
          greeting: [
            "¡Hola! ¿Qué tal? ¿Qué hacemos hoy?",
            "¡Hey! ¡Me alegra verte! ¿Qué hay de nuevo?",
            "¡Hola! ¿Listo para una charla genial?"
          ]
        }
      },
      english: {
        maya: {
          question: [
            "That's an excellent question! Let's explore this together.",
            "Very good question! This deserves our attention.",
            "I can see you're curious. That's perfect for learning!"
          ],
          greeting: [
            "Hello! I'm delighted to meet you. How can I help you today?",
            "Hi! Ready for a new lesson? What would you like to learn?",
            "Good day! I hope you're motivated to progress today!"
          ]
        }
      }
    };

    const generalLangResponses = (generalResponses as any)[language] || generalResponses.english;
    const personaResponses = generalLangResponses[persona.id];
    
    if (personaResponses && personaResponses[intent]) {
      const responses = personaResponses[intent];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Ultimate fallback
    const ultimateFallbacks = {
      french: "Intéressant ! Parlez-moi de cela.",
      spanish: "¡Interesante! Cuénteme más.",
      english: "Interesting! Tell me more about that."
    };

    return (ultimateFallbacks as any)[language] || ultimateFallbacks.english;
  }

  /**
   * Generate language-specific correction response
   */
  private generateLanguageSpecificCorrection(persona: PersonaConfiguration, messageAnalysis: any): string {
    const corrections = {
      french: {
        gentle: `Petite correction : ${messageAnalysis.errors[0]}. `,
        encouraging: `Presque ! ${messageAnalysis.errors[0]}. Bonne tentative ! `,
        direct: `${messageAnalysis.errors[0]}. `
      },
      spanish: {
        gentle: `Pequeña corrección: ${messageAnalysis.errors[0]}. `,
        encouraging: `¡Casi! ${messageAnalysis.errors[0]}. ¡Buen intento! `,
        direct: `${messageAnalysis.errors[0]}. `
      },
      english: {
        gentle: `Small correction: ${messageAnalysis.errors[0]}. `,
        encouraging: `Almost! ${messageAnalysis.errors[0]}. Good try! `,
        direct: `${messageAnalysis.errors[0]}. `
      }
    };

    const correctionStyle = persona.basePersonality.correctionStyle || 'gentle';
    const languageCorrections = (corrections as any)[messageAnalysis.language] || corrections.english;
    return languageCorrections[correctionStyle] || languageCorrections.gentle;
  }

  /**
   * Get grammar examples for different languages
   */
  private getGrammarExamples(grammarPattern: string, language: string): string[] {
    const examples = {
      french: {
        'present_tense': ['Je suis étudiant', 'Tu as un livre', 'Il fait beau'],
        'negation_ne_pas': ['Je ne comprends pas', 'Elle n\'aime pas', 'Nous n\'avons pas'],
        'est_ce_que_questions': ['Est-ce que tu viens ?', 'Est-ce qu\'il pleut ?']
      },
      spanish: {
        'spanish_present_tense': ['Soy estudiante', 'Tienes un libro', 'Hace buen tiempo'],
        'spanish_questions': ['¿Cómo estás?', '¿Dónde vives?', '¿Qué haces?'],
        'spanish_articles': ['el libro', 'la casa', 'los niños', 'las flores']
      },
      english: {
        'present_tense': ['I am a student', 'You have a book', 'It is sunny'],
        'questions': ['How are you?', 'Where do you live?', 'What do you do?']
      }
    };

    const languageExamples = (examples as any)[language] || examples.english;
    return languageExamples[grammarPattern] || [`Example of ${grammarPattern}`];
  }

  /**
   * Generate next conversation suggestions
   */
  private generateNextSuggestions(persona: PersonaConfiguration, messageAnalysis: any, context: EnhancedConversationContext): string[] {
    const suggestions: string[] = [];
    
    // Topic-based suggestions
    if (messageAnalysis.topic === 'sports') {
      suggestions.push("Quel est ton sport préféré ?");
      suggestions.push("Tu fais du sport souvent ?");
    } else if (messageAnalysis.topic === 'food') {
      suggestions.push("Qu'est-ce que tu aimes manger ?");
      suggestions.push("Connais-tu la cuisine française ?");
    }
    
    // Persona-specific suggestions
    if (persona.id === 'maya') {
      suggestions.push("Veux-tu que je t'explique cette règle de grammaire ?");
      suggestions.push("Essayons un exercice pratique !");
    } else if (persona.id === 'alex') {
      suggestions.push("Et toi, qu'est-ce que tu en penses ?");
      suggestions.push("Tu veux qu'on parle d'autre chose ?");
    } else if (persona.id === 'luna') {
      suggestions.push("Veux-tu en savoir plus sur cette tradition ?");
      suggestions.push("Comparons avec ta culture !");
    }
    
    return suggestions.slice(0, 3);
  }

  /**
   * Get conversation starter for persona
   */
  getConversationStarter(personaId: PersonaId, difficulty: 'beginner' | 'intermediate' | 'advanced', scenario?: string): ConversationStarter | null {
    const persona = this.personas.get(personaId);
    if (!persona) return null;

    const starters = persona.conversationStarters.filter(starter => 
      starter.difficulty === difficulty && 
      (!scenario || starter.scenario === scenario)
    );

    if (starters.length === 0) return null;
    
    return starters[Math.floor(Math.random() * starters.length)];
  }

  /**
   * Get persona information
   */
  getPersonaInfo(personaId: PersonaId): PersonaConfiguration | null {
    return this.personas.get(personaId) || null;
  }
  /**
   * Get conversation patterns for persona
   */
  getConversationPatternsForPersona(personaId: PersonaId): ProcessedConversationPattern[] {
    return this.conversationPatterns.filter(
      pattern => pattern.personaMapping[personaId].score >= 6
    );
  }

  /**
   * Get grammar explanation for a pattern
   */
  private getGrammarExplanation(pattern: string): string {
    const explanations: Record<string, string> = {
      'present_tense': 'Le présent de l\'indicatif est utilisé pour exprimer une action qui se déroule maintenant.',
      'past_tense': 'Le passé composé est utilisé pour exprimer une action terminée dans le passé.',
      'future_tense': 'Le futur simple exprime une action qui aura lieu dans l\'avenir.',
      'conditional': 'Le conditionnel exprime une action qui dépend d\'une condition.',
      'subjunctive': 'Le subjonctif exprime le doute, l\'émotion, ou la volonté.',
      'imperative': 'L\'impératif est utilisé pour donner des ordres ou des conseils.',
      'question_formation': 'Les questions peuvent être formées avec est-ce que, inversion, ou intonation.',
      'negation': 'La négation en français utilise généralement ne...pas.',
      'adjective_agreement': 'Les adjectifs s\'accordent en genre et en nombre avec le nom qu\'ils qualifient.'
    };
    
    return explanations[pattern] || `Structure grammaticale: ${pattern}`;
  }

  /**
   * Extract cultural aspect from cultural notes
   */
  private extractCulturalAspect(culturalNotes: string): string {
    if (culturalNotes.includes('formality') || culturalNotes.includes('tu') || culturalNotes.includes('vous')) {
      return 'Niveaux de formalité';
    } else if (culturalNotes.includes('food') || culturalNotes.includes('breakfast') || culturalNotes.includes('déjeuner')) {
      return 'Culture culinaire française';
    } else if (culturalNotes.includes('Europe') || culturalNotes.includes('geography')) {
      return 'Conscience européenne';
    } else if (culturalNotes.includes('education') || culturalNotes.includes('school')) {
      return 'Système éducatif français';
    } else {
      return 'Culture française';
    }
  }
}

export type { PersonaConfiguration, ResponsePattern, ConversationStarter };
