// services/conversation-models/persona-conversation-service.ts
import { ConversationSegment, PersonaId, ConversationContext } from '@/types';
import { conversationData } from './processed-conversation-data';

export class PersonaConversationService {
  private conversationModels: Map<PersonaId, ConversationModel>;

  constructor() {
    this.initializeConversationModels();
  }

  private initializeConversationModels() {
    this.conversationModels = new Map([
      ['maya', this.createMayaModel()],
      ['alex', this.createAlexModel()],
      ['luna', this.createLunaModel()]
    ]);
  }

  // Maya (Patient Teacher) - Based on university and academic conversations
  private createMayaModel(): ConversationModel {
    return {
      personaId: 'maya',
      personalityTraits: {
        patience: 10,
        encouragement: 'high',
        correctionStyle: 'gentle_explanation',
        culturalSensitivity: 'high'
      },
      
      conversationPatterns: {
        // From: "chapitre 1 dans une cité universitaire..."
        academic_encouragement: [
          "Ne t'inquiète pas, tout ira bien",
          "Courage, c'est normal d'avoir des difficultés",
          "Ma pauvre, je comprends que c'est difficile"
        ],
        
        // From geography lesson conversations
        gentle_corrections: [
          "Mais non, ce n'est pas {incorrect}. C'est {correct}",
          "Au contraire, c'est {positive_reframe}",
          "Ah non mon {term_of_endearment}, {gentle_correction}"
        ],
        
        // From university social interactions
        social_support: [
          "Est-ce que tu es libre pour {activity}?",
          "J'ai une idée, {suggestion}",
          "C'est dommage, mais {alternative}"
        ]
      },
      
      vocabularyFocus: {
        academic: ['examen', 'cours', 'université', 'étudier', 'réviser'],
        encouragement: ['courage', 'normal', 'difficile', 'patience'],
        social: ['libre', 'rendez-vous', 'dîner', 'amis', 'fête']
      },
      
      culturalContexts: [
        'french_university_system',
        'student_social_life',
        'academic_pressure_support'
      ]
    };
  }

  // Alex (Casual Friend) - Based on social and professional networking
  private createAlexModel(): ConversationModel {
    return {
      personaId: 'alex',
      personalityTraits: {
        casualness: 8,
        enthusiasm: 7,
        practical_advice: 9,
        social_engagement: 8
      },
      
      conversationPatterns: {
        // From: "Alexandre travaille" conversation
        casual_greetings: [
          "Tiens {name}, bonjour!",
          "Salut {name}, comment ça va?",
          "Bon, quoi de neuf?"
        ],
        
        // Professional networking enthusiasm
        positive_reactions: [
          "C'est vrai ça, c'est une bonne nouvelle!",
          "Excellente nouvelle, ça change un peu",
          "J'adore ça!"
        ],
        
        // Practical lifestyle advice
        practical_suggestions: [
          "Il y a {location} juste après {landmark}",
          "Vous prenez {direction} et après {instruction}",
          "C'est facile à {action}"
        ]
      },
      
      vocabularyFocus: {
        work_life: ['travail', 'société', 'technique', 'horaire', 'collègues'],
        sports_leisure: ['sport', 'jogging', 'tennis', 'basket', 'club'],
        practical: ['quartier', 'route', 'parc', 'facile', 'organiser']
      },
      
      culturalContexts: [
        'french_work_culture',
        'sports_and_leisure',
        'neighborhood_community'
      ]
    };
  }

  // Luna (Cultural Guide) - Based on formal and cultural interactions
  private createLunaModel(): ConversationModel {
    return {
      personaId: 'luna',
      personalityTraits: {
        formality: 7,
        cultural_guidance: 10,
        politeness: 9,
        situational_awareness: 8
      },
      
      conversationPatterns: {
        // Formal greetings and politeness
        formal_interactions: [
          "Excusez-moi, {polite_request}",
          "S'il vous plaît, {request}",
          "Je vous prie, {formal_expression}"
        ],
        
        // Cultural explanations
        cultural_guidance: [
          "En France, on dit {cultural_norm}",
          "C'est important de comprendre que {cultural_context}",
          "Dans la culture française, {cultural_explanation}"
        ],
        
        // Professional courtesy
        professional_courtesy: [
          "Ravi de vous rencontrer",
          "Bonne continuation",
          "Au revoir et bonne journée"
        ]
      },
      
      vocabularyFocus: {
        formal_language: ['excusez-moi', 'politesse', 'respectueux', 'formel'],
        cultural_terms: ['culture', 'tradition', 'coutume', 'savoir-vivre'],
        professional: ['monsieur', 'madame', 'rendez-vous', 'présentation']
      },
      
      culturalContexts: [
        'french_politeness_codes',
        'professional_etiquette',
        'social_formality_levels'
      ]
    };
  }

  // Main method to generate persona responses
  async generatePersonaResponse(
    personaId: PersonaId,
    userMessage: string,
    context: ConversationContext
  ): Promise<PersonaResponse> {
    
    const model = this.conversationModels.get(personaId);
    if (!model) throw new Error(`Persona ${personaId} not found`);

    // Analyze user message context
    const messageAnalysis = await this.analyzeUserMessage(userMessage, context);
    
    // Select appropriate conversation pattern
    const pattern = this.selectConversationPattern(model, messageAnalysis);
    
    // Generate response using conversation data
    const response = await this.generateResponse(pattern, messageAnalysis, model);
    
    return {
      content: response.text,
      audioPath: await this.generateAudio(response.text, personaId),
      culturalNotes: response.culturalContext,
      grammarPoints: this.extractGrammarPoints(response.text),
      vocabularyHighlights: this.highlightVocabulary(response.text, model),
      nextSuggestions: await this.generateFollowUpSuggestions(pattern, messageAnalysis)
    };
  }

  private async analyzeUserMessage(
    message: string, 
    context: ConversationContext
  ): Promise<MessageAnalysis> {
    
    return {
      topic: await this.classifyTopic(message),
      difficulty: await this.assessDifficulty(message),
      intent: await this.identifyIntent(message),
      emotionalTone: await this.analyzeEmotionalTone(message),
      culturalContext: context.culturalBackground,
      learningLevel: context.userLevel
    };
  }

  private selectConversationPattern(
    model: ConversationModel, 
    analysis: MessageAnalysis
  ): ConversationPattern {
    
    // Match user's message to appropriate conversation patterns from our data
    const patternKey = this.matchPatternFromConversationData(analysis, model);
    
    return {
      patternType: patternKey,
      responseTemplates: model.conversationPatterns[patternKey],
      vocabularySet: model.vocabularyFocus[analysis.topic] || model.vocabularyFocus.general,
      culturalContext: model.culturalContexts.find(ctx => 
        this.contextMatches(ctx, analysis.culturalContext)
      )
    };
  }

  private async generateResponse(
    pattern: ConversationPattern,
    analysis: MessageAnalysis,
    model: ConversationModel
  ): Promise<GeneratedResponse> {
    
    // Select response template based on conversation data patterns
    const template = this.selectResponseTemplate(pattern, analysis);
    
    // Personalize response based on persona characteristics
    const personalizedResponse = await this.personalizeResponse(
      template, 
      model.personalityTraits, 
      analysis
    );
    
    // Add cultural context if appropriate
    const culturallyEnhanced = await this.addCulturalContext(
      personalizedResponse, 
      pattern.culturalContext,
      analysis.learningLevel
    );
    
    return {
      text: culturallyEnhanced,
      culturalContext: pattern.culturalContext,
      vocabularyUsed: this.extractVocabulary(culturallyEnhanced, pattern.vocabularySet),
      grammarStructures: this.identifyGrammarStructures(culturallyEnhanced)
    };
  }

  // Helper method to match conversation patterns from our data
  private matchPatternFromConversationData(
    analysis: MessageAnalysis,
    model: ConversationModel
  ): string {
    
    // Academic/learning context
    if (analysis.topic === 'academic' && analysis.emotionalTone === 'stressed') {
      return 'academic_encouragement';
    }
    
    // Social interaction
    if (analysis.intent === 'social_planning') {
      return 'social_support';
    }
    
    // Professional networking
    if (analysis.topic === 'professional' && analysis.intent === 'sharing_news') {
      return 'positive_reactions';
    }
    
    // Correction needed
    if (analysis.intent === 'seeking_information' && analysis.difficulty === 'incorrect') {
      return 'gentle_corrections';
    }
    
    // Default to general conversation
    return 'general_conversation';
  }

  // Generate follow-up suggestions based on conversation flow patterns
  private async generateFollowUpSuggestions(
    pattern: ConversationPattern,
    analysis: MessageAnalysis
  ): Promise<string[]> {
    
    const suggestions = [];
    
    // Based on conversation data patterns, suggest natural follow-ups
    switch (pattern.patternType) {
      case 'academic_encouragement':
        suggestions.push(
          "Parlez-moi de vos études",
          "Quels sont vos sujets préférés?",
          "Comment puis-je vous aider?"
        );
        break;
        
      case 'social_support':
        suggestions.push(
          "Qu'est-ce que vous aimez faire le weekend?",
          "Avez-vous des amis français?",
          "Voulez-vous sortir ensemble?"
        );
        break;
        
      case 'positive_reactions':
        suggestions.push(
          "Parlez-moi de votre travail",
          "Qu'est-ce que vous aimez dans votre job?",
          "Comment se passe votre vie professionnelle?"
        );
        break;
    }
    
    return suggestions;
  }

  // Extract vocabulary highlights for learning
  private highlightVocabulary(
    text: string, 
    model: ConversationModel
  ): VocabularyHighlight[] {
    
    const highlights: VocabularyHighlight[] = [];
    
    // Check against persona's vocabulary focus
    Object.entries(model.vocabularyFocus).forEach(([category, words]) => {
      words.forEach(word => {
        if (text.toLowerCase().includes(word.toLowerCase())) {
          highlights.push({
            word,
            category,
            definition: this.getDefinition(word),
            usage: this.getUsageExample(word)
          });
        }
      });
    });
    
    return highlights;
  }
}

// Types for the conversation service
interface ConversationModel {
  personaId: PersonaId;
  personalityTraits: Record<string, any>;
  conversationPatterns: Record<string, string[]>;
  vocabularyFocus: Record<string, string[]>;
  culturalContexts: string[];
}

interface MessageAnalysis {
  topic: string;
  difficulty: string;
  intent: string;
  emotionalTone: string;
  culturalContext: string;
  learningLevel: string;
}

interface ConversationPattern {
  patternType: string;
  responseTemplates: string[];
  vocabularySet: string[];
  culturalContext?: string;
}

interface GeneratedResponse {
  text: string;
  culturalContext?: string;
  vocabularyUsed: string[];
  grammarStructures: string[];
}

interface PersonaResponse {
  content: string;
  audioPath?: string;
  culturalNotes?: string;
  grammarPoints: string[];
  vocabularyHighlights: VocabularyHighlight[];
  nextSuggestions: string[];
}

interface VocabularyHighlight {
  word: string;
  category: string;
  definition: string;
  usage: string;
}

export default PersonaConversationService;
