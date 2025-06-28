// types/conversation.ts
export type PersonaId = 'maya' | 'alex' | 'luna' | 'diego' | 'marie' | 'raj';

export interface ConversationContext {
  conversationId?: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  culturalBackground?: string;
  sessionGoal?: string;
  topics?: string[];
  difficultyLevel?: string;
  conversationTurn?: number;
  // Enhanced context for persona service
  conversationContext?: {
    scenario: string;
    previousMessages: { role: string; content: string; }[];
    userPreferences: {
      focusAreas: string[];
      learningStyle: string;
    };
  };
}

export interface EnhancedConversationContext {
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  conversationContext: {
    scenario: string;
    previousMessages: { role: string; content: string; }[];
    userPreferences: {
      focusAreas: string[];
      learningStyle: string;
    };
  };
}

export interface ConversationMessage {
  id: string;
  sender: PersonaId | 'user';
  content: string;
  timestamp: Date;
  metadata?: {
    culturalNotes?: string;
    vocabularyHighlights?: VocabularyHighlight[];
    grammarPoints?: string[];
    audioPath?: string;
    isError?: boolean;
  };
}

export interface VocabularyHighlight {
  word: string;
  category: string;
  definition: string;
  usage?: string;
}

export interface PersonaResponse {
  content: string;
  audioPath?: string;
  culturalNotes?: string;
  grammarPoints: string[];
  vocabularyHighlights: VocabularyHighlight[];
  nextSuggestions: string[];
  // Enhanced response for compatibility
  response?: string;
  teachingElements?: {
    vocabularyHighlights?: VocabularyHighlight[];
    grammarExplanations?: { concept: string; explanation: string; }[];
    culturalInsights?: { aspect: string; description: string; }[];
    suggestedFollowUp?: string;
  };
}

// Additional utility types
export interface MessageAnalysis {
  topic: string;
  difficulty: string;
  intent: string;
  emotionalTone: string;
  culturalContext: string;
  learningLevel: string;
}

export interface ConversationSegment {
  id: string;
  content: string;
  speaker: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    emotionalTone?: string;
    difficulty?: string;
  };
}
