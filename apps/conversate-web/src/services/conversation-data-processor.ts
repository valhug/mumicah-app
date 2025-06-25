// services/conversation-data-processor.ts
import { PersonaId, ConversationSegment, VocabularyHighlight } from '@/types/conversation';

export interface RawConversationData {
  timestamp: string;
  chapter: string;
  transcript: string;
  participants?: string[];
  setting?: string;
}

export interface ProcessedConversationPattern {
  id: string;
  scenario: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  context: {
    setting: string;
    participants: string[];
    topic: string;
    communicativeFunction: string;
  };
  dialogueSegments: DialogueSegment[];
  vocabularyPatterns: VocabularyPattern[];
  grammarStructures: GrammarStructure[];
  culturalElements: CulturalElement[];
  personaMapping: PersonaMapping;
}

export interface DialogueSegment {
  speaker: string;
  content: string;
  intent: string;
  emotionalTone: string;
  responsePatterns: string[];
}

export interface VocabularyPattern {
  theme: string;
  words: VocabularyHighlight[];
  frequency: number;
  difficulty: string;
}

export interface GrammarStructure {
  pattern: string;
  examples: string[];
  level: string;
  usage: string;
}

export interface CulturalElement {
  aspect: string;
  description: string;
  example: string;
  significance: string;
}

export interface PersonaMapping {
  maya: PersonaRelevance;
  alex: PersonaRelevance;
  luna: PersonaRelevance;
}

export interface PersonaRelevance {
  score: number; // 0-10
  matchingTraits: string[];
  applicableScenarios: string[];
  adaptationNotes: string[];
}

export class ConversationDataProcessor {
  private conversationPatterns: ProcessedConversationPattern[] = [];

  /**
   * Main method to process raw transcript data from conversations_two_examples.md
   */
  async processTranscriptFile(fileContent: string): Promise<ProcessedConversationPattern[]> {
    const rawSegments = this.parseTranscriptFile(fileContent);
    const processedPatterns: ProcessedConversationPattern[] = [];

    for (const segment of rawSegments) {
      const pattern = await this.processConversationSegment(segment);
      if (pattern) {
        processedPatterns.push(pattern);
        this.conversationPatterns.push(pattern);
      }
    }

    return processedPatterns;
  }

  /**
   * Parse the transcript file into structured segments
   */
  private parseTranscriptFile(content: string): RawConversationData[] {
    const segments: RawConversationData[] = [];
    const lines = content.split('\n');
    
    let currentSegment: Partial<RawConversationData> = {};
    let currentTranscript = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check for timestamp
      const timestampMatch = trimmedLine.match(/^(\d{2}:\d{2})/);
      if (timestampMatch) {
        // Save previous segment if exists
        if (currentSegment.timestamp && currentTranscript) {
          segments.push({
            timestamp: currentSegment.timestamp,
            chapter: currentSegment.chapter || '',
            transcript: currentTranscript.trim()
          });
        }
        
        // Start new segment
        currentSegment = { timestamp: timestampMatch[1] };
        currentTranscript = trimmedLine.substring(timestampMatch[0].length).trim();
        
        // Extract chapter if present
        const chapterMatch = currentTranscript.match(/chapitre (\d+) (.+?)(?=\s[a-z])/i);
        if (chapterMatch) {
          currentSegment.chapter = `Chapter ${chapterMatch[1]}: ${chapterMatch[2]}`;
          currentTranscript = currentTranscript.substring(chapterMatch[0].length).trim();
        }
      } else if (trimmedLine && currentSegment.timestamp) {
        // Continue building transcript
        currentTranscript += ' ' + trimmedLine;
      }
    }
    
    // Don't forget the last segment
    if (currentSegment.timestamp && currentTranscript) {
      segments.push({
        timestamp: currentSegment.timestamp,
        chapter: currentSegment.chapter || '',
        transcript: currentTranscript.trim()
      });
    }
    
    return segments;
  }

  /**
   * Process a single conversation segment
   */
  private async processConversationSegment(segment: RawConversationData): Promise<ProcessedConversationPattern | null> {
    if (!segment.transcript || segment.transcript.length < 20) {
      return null; // Skip very short segments
    }

    const context = this.analyzeContext(segment);
    const dialogueSegments = this.extractDialogueSegments(segment.transcript);
    const vocabularyPatterns = this.extractVocabularyPatterns(segment.transcript, context.topic);
    const grammarStructures = this.extractGrammarStructures(segment.transcript);
    const culturalElements = this.extractCulturalElements(segment.transcript, context);
    const personaMapping = this.mapToPersonas(context, dialogueSegments);

    return {
      id: `conv_${segment.timestamp.replace(':', '_')}_${Date.now()}`,
      scenario: context.setting,
      difficulty: this.assessDifficulty(segment.transcript, vocabularyPatterns, grammarStructures),
      context,
      dialogueSegments,
      vocabularyPatterns,
      grammarStructures,
      culturalElements,
      personaMapping
    };
  }

  /**
   * Analyze the context and setting of a conversation
   */
  private analyzeContext(segment: RawConversationData): ProcessedConversationPattern['context'] {
    const transcript = segment.transcript.toLowerCase();
    const chapter = segment.chapter?.toLowerCase() || '';
    
    // Determine setting based on keywords and chapter info
    let setting = 'general';
    let participants: string[] = [];
    let topic = 'daily_conversation';
    let communicativeFunction = 'social_interaction';

    // University/Academic settings
    if (transcript.includes('cité universitaire') || transcript.includes('examen') || 
        transcript.includes('cours') || chapter.includes('universitaire')) {
      setting = 'university';
      topic = 'academic_life';
      communicativeFunction = 'academic_discussion';
    }
    
    // Geography/Education
    else if (transcript.includes('géographie') || transcript.includes('finlande') || 
             transcript.includes('helsinki') || chapter.includes('géographie')) {
      setting = 'educational';
      topic = 'geography_learning';
      communicativeFunction = 'teaching_learning';
    }
    
    // Work/Professional
    else if (transcript.includes('travaille') || transcript.includes('société') || 
             transcript.includes('technicien') || transcript.includes('travail')) {
      setting = 'workplace';
      topic = 'professional_life';
      communicativeFunction = 'professional_discussion';
    }
    
    // Sports/Recreation
    else if (transcript.includes('sport') || transcript.includes('jogging') || 
             transcript.includes('tennis') || transcript.includes('basket')) {
      setting = 'recreational';
      topic = 'sports_activities';
      communicativeFunction = 'leisure_discussion';
    }
    
    // Travel/Vacation
    else if (transcript.includes('vacances') || transcript.includes('voyage') || 
             transcript.includes('italie') || transcript.includes('hôtel')) {
      setting = 'travel';
      topic = 'vacation_planning';
      communicativeFunction = 'travel_planning';
    }
    
    // Gym/Health
    else if (transcript.includes('club de gym') || transcript.includes('musculation') || 
             transcript.includes('stretching') || transcript.includes('régime')) {
      setting = 'health_fitness';
      topic = 'health_wellness';
      communicativeFunction = 'service_interaction';
    }
    
    // Family/Home
    else if (transcript.includes('famille') || transcript.includes('enfants') || 
             transcript.includes('valise') || transcript.includes('papa')) {
      setting = 'family_home';
      topic = 'family_life';
      communicativeFunction = 'family_interaction';
    }
      // Spanish language patterns
    else if (transcript.includes('universidad') || transcript.includes('examen') || 
             transcript.includes('clase') || transcript.includes('estudios')) {
      setting = 'university';
      topic = 'academic_life';
      communicativeFunction = 'academic_discussion';
    }
    
    // Spanish work/business
    else if (transcript.includes('trabajo') || transcript.includes('empresa') || 
             transcript.includes('negocio') || transcript.includes('oficina')) {
      setting = 'workplace';
      topic = 'professional_life';
      communicativeFunction = 'professional_discussion';
    }
    
    // Spanish travel/vacation
    else if (transcript.includes('vacaciones') || transcript.includes('viaje') || 
             transcript.includes('hotel') || transcript.includes('turismo')) {
      setting = 'travel';
      topic = 'vacation_planning';
      communicativeFunction = 'travel_planning';
    }
    
    // Spanish food/dining
    else if (transcript.includes('comida') || transcript.includes('restaurante') || 
             transcript.includes('desayuno') || transcript.includes('cena')) {
      setting = 'dining';
      topic = 'food_meals';
      communicativeFunction = 'dining_discussion';
    }
    
    // Spanish family/home
    else if (transcript.includes('familia') || transcript.includes('casa') || 
             transcript.includes('niños') || transcript.includes('padre')) {
      setting = 'family_home';
      topic = 'family_life';
      communicativeFunction = 'family_interaction';
    }
    
    // Spanish culture/social
    else if (transcript.includes('cultura') || transcript.includes('tradición') || 
             transcript.includes('fiesta') || transcript.includes('celebración')) {
      setting = 'cultural';
      topic = 'cultural_discussion';
      communicativeFunction = 'cultural_exchange';
    }
    
    // Food/Dining
    else if (transcript.includes('petit-déjeuner') || transcript.includes('café') || 
             transcript.includes('confiture') || transcript.includes('dîner')) {
      setting = 'dining';
      topic = 'food_meals';
      communicativeFunction = 'dining_discussion';
    }

    // Extract participant names/roles
    participants = this.extractParticipants(segment.transcript);

    return {
      setting,
      participants,
      topic,
      communicativeFunction
    };
  }

  /**
   * Extract participants from the conversation
   */
  private extractParticipants(transcript: string): string[] {
    const namePattern = /\b([A-Z][a-z]+)\b/g;
    const names = new Set<string>();
    let match;
    
    // Common French names that might appear
    const commonNames = ['Benoît', 'Raphaël', 'Bertrand', 'Jérôme', 'Virginie', 'Alexandre', 
                        'Frédéric', 'Émilie', 'Gaspard', 'Margot', 'Bastien', 'Véronique', 
                        'Isabelle', 'Paul', 'François', 'Quentin'];
    
    while ((match = namePattern.exec(transcript)) !== null) {
      const name = match[1];
      if (commonNames.includes(name)) {
        names.add(name);
      }
    }
    
    // If no specific names, determine roles
    if (names.size === 0) {
      if (transcript.includes('papa') || transcript.includes('maman')) {
        return ['parent', 'child'];
      } else if (transcript.includes('madame') || transcript.includes('monsieur')) {
        return ['customer', 'service_provider'];
      } else {
        return ['speaker_a', 'speaker_b'];
      }
    }
    
    return Array.from(names);
  }

  /**
   * Extract dialogue segments with speaker intent analysis
   */
  private extractDialogueSegments(transcript: string): DialogueSegment[] {
    // This is a simplified approach - in practice, you might use NLP libraries
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 5);
    const segments: DialogueSegment[] = [];
    
    sentences.forEach((sentence, index) => {
      const trimmed = sentence.trim();
      if (trimmed) {
        const intent = this.analyzeIntent(trimmed);
        const emotionalTone = this.analyzeEmotionalTone(trimmed);
        const responsePatterns = this.extractResponsePatterns(trimmed);
        
        segments.push({
          speaker: `speaker_${(index % 2) + 1}`, // Alternate between speakers
          content: trimmed,
          intent,
          emotionalTone,
          responsePatterns
        });
      }
    });
    
    return segments;
  }

  /**
   * Analyze the intent of a dialogue segment
   */
  private analyzeIntent(sentence: string): string {
    const lower = sentence.toLowerCase();
    
    if (lower.includes('est-ce que') || lower.includes('où') || lower.includes('quand') || 
        lower.includes('comment') || lower.includes('pourquoi') || lower.includes('qu\'est-ce que')) {
      return 'question';
    } else if (lower.includes('je voudrais') || lower.includes('j\'aimerais') || 
               lower.includes('pouvez-vous') || lower.includes('s\'il vous plaît')) {
      return 'request';
    } else if (lower.includes('oui') || lower.includes('non') || lower.includes('bien sûr') || 
               lower.includes('d\'accord')) {
      return 'response';
    } else if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('au revoir')) {
      return 'greeting';
    } else if (lower.includes('merci') || lower.includes('excusez-moi') || lower.includes('désolé')) {
      return 'politeness';
    } else if (lower.includes('mais non') || lower.includes('au contraire') || 
               lower.includes('ce n\'est pas')) {
      return 'correction';
    } else {
      return 'statement';
    }
  }

  /**
   * Analyze emotional tone
   */
  private analyzeEmotionalTone(sentence: string): string {
    const lower = sentence.toLowerCase();
    
    if (lower.includes('super') || lower.includes('génial') || lower.includes('excellent') || 
        lower.includes('formidable') || lower.includes('quelle chance')) {
      return 'enthusiastic';
    } else if (lower.includes('dommage') || lower.includes('désolé') || lower.includes('malheureusement')) {
      return 'disappointed';
    } else if (lower.includes('ma pauvre') || lower.includes('courage') || lower.includes('ne t\'inquiète pas')) {
      return 'sympathetic';
    } else if (lower.includes('vraiment') || lower.includes('c\'est difficile') || 
               lower.includes('compliqué')) {
      return 'concerned';
    } else {
      return 'neutral';
    }
  }

  /**
   * Extract response patterns
   */
  private extractResponsePatterns(sentence: string): string[] {
    const patterns: string[] = [];
    
    // Question patterns
    if (sentence.includes('Est-ce que')) {
      patterns.push('yes_no_question');
    }
    if (sentence.includes('Où') || sentence.includes('Quand') || sentence.includes('Comment')) {
      patterns.push('wh_question');
    }
    
    // Response patterns
    if (sentence.includes('Oui') || sentence.includes('Non')) {
      patterns.push('direct_answer');
    }
    if (sentence.includes('Je ne sais pas')) {
      patterns.push('uncertainty_expression');
    }
    
    // Politeness patterns
    if (sentence.includes('s\'il vous plaît') || sentence.includes('s\'il te plaît')) {
      patterns.push('polite_request');
    }
    
    return patterns;
  }

  /**
   * Extract vocabulary patterns by theme
   */
  private extractVocabularyPatterns(transcript: string, topic: string): VocabularyPattern[] {
    const patterns: VocabularyPattern[] = [];
    
    // Create vocabulary patterns based on the topic
    const topicVocabulary = this.getTopicVocabulary(topic, transcript);
    
    if (topicVocabulary.length > 0) {
      patterns.push({
        theme: topic,
        words: topicVocabulary,
        frequency: topicVocabulary.length,
        difficulty: this.assessVocabularyDifficulty(topicVocabulary)
      });
    }
    
    return patterns;
  }

  /**
   * Get vocabulary specific to a topic
   */
  private getTopicVocabulary(topic: string, transcript: string): VocabularyHighlight[] {
    const vocabulary: VocabularyHighlight[] = [];
    const lower = transcript.toLowerCase();
    
    // Define vocabulary by topic
    const topicVocabularies: Record<string, Array<{word: string, definition: string, category: string}>> = {
      academic_life: [
        { word: 'cité universitaire', definition: 'university residence', category: 'education' },
        { word: 'examen', definition: 'exam', category: 'education' },
        { word: 'cours', definition: 'class/course', category: 'education' },
        { word: 'vacances', definition: 'vacation/holidays', category: 'time' }
      ],
      geography_learning: [
        { word: 'géographie', definition: 'geography', category: 'academic_subject' },
        { word: 'capitale', definition: 'capital city', category: 'geography' },
        { word: 'pays', definition: 'country', category: 'geography' },
        { word: 'langues', definition: 'languages', category: 'linguistics' }
      ],
      professional_life: [
        { word: 'travaille', definition: 'works', category: 'work' },
        { word: 'société', definition: 'company', category: 'work' },
        { word: 'technicien', definition: 'technician', category: 'profession' },
        { word: 'collègues', definition: 'colleagues', category: 'work' }
      ],      sports_activities: [
        { word: 'jogging', definition: 'jogging', category: 'sports' },
        { word: 'tennis', definition: 'tennis', category: 'sports' },
        { word: 'basket', definition: 'basketball', category: 'sports' },
        { word: 'natation', definition: 'swimming', category: 'sports' }
      ],
      // Spanish vocabulary patterns
      cultural_discussion: [
        { word: 'cultura', definition: 'culture', category: 'social' },
        { word: 'tradición', definition: 'tradition', category: 'social' },
        { word: 'fiesta', definition: 'party/celebration', category: 'social' },
        { word: 'celebración', definition: 'celebration', category: 'social' }
      ],
      vacation_planning: [
        { word: 'vacaciones', definition: 'vacation', category: 'travel' },
        { word: 'viaje', definition: 'trip/journey', category: 'travel' },
        { word: 'hotel', definition: 'hotel', category: 'travel' },
        { word: 'turismo', definition: 'tourism', category: 'travel' }
      ],
      food_meals: [
        { word: 'petit-déjeuner', definition: 'breakfast', category: 'food' },
        { word: 'café', definition: 'coffee', category: 'food' },
        { word: 'confiture', definition: 'jam', category: 'food' },
        { word: 'dîner', definition: 'dinner', category: 'food' },
        { word: 'comida', definition: 'food/meal', category: 'food' },
        { word: 'restaurante', definition: 'restaurant', category: 'food' },
        { word: 'desayuno', definition: 'breakfast', category: 'food' },
        { word: 'cena', definition: 'dinner', category: 'food' }
      ]
    };
    
    const relevantVocab = topicVocabularies[topic] || [];
    
    relevantVocab.forEach(vocab => {
      if (lower.includes(vocab.word.toLowerCase())) {
        vocabulary.push({
          word: vocab.word,
          definition: vocab.definition,
          category: vocab.category,
          usage: this.extractUsageExample(transcript, vocab.word)
        });
      }
    });
    
    return vocabulary;
  }

  /**
   * Extract usage example for a word
   */
  private extractUsageExample(transcript: string, word: string): string {
    const sentences = transcript.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(word.toLowerCase())) {
        return sentence.trim();
      }
    }
    return '';
  }

  /**
   * Extract grammar structures
   */
  private extractGrammarStructures(transcript: string): GrammarStructure[] {
    const structures: GrammarStructure[] = [];
    
    // Question formation
    if (transcript.includes('Est-ce que')) {
      structures.push({
        pattern: 'est_ce_que_questions',
        examples: this.extractExamples(transcript, 'Est-ce que'),
        level: 'beginner',
        usage: 'Formal way to ask yes/no questions'
      });
    }
    
    // Negative formation
    if (transcript.includes('ne') && transcript.includes('pas')) {
      structures.push({
        pattern: 'negation_ne_pas',
        examples: this.extractExamples(transcript, 'ne.*pas'),
        level: 'beginner',
        usage: 'Standard negation in French'
      });
    }
      // Present tense
    const presentVerbs = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont', 'ai', 'as', 'a', 'avons', 'avez', 'ont'];
    if (presentVerbs.some(verb => transcript.includes(verb))) {
      structures.push({
        pattern: 'present_tense',
        examples: this.extractVerbExamples(transcript, presentVerbs),
        level: 'beginner',
        usage: 'Present tense conjugation'
      });
    }
    
    // Spanish question formation
    if (transcript.includes('¿') || transcript.includes('?')) {
      structures.push({
        pattern: 'spanish_questions',
        examples: this.extractExamples(transcript, '¿.*\\?'),
        level: 'beginner',
        usage: 'Spanish question formation with inverted question marks'
      });
    }
    
    // Spanish present tense (ser/estar/tener)
    const spanishPresentVerbs = ['soy', 'eres', 'es', 'somos', 'sois', 'son', 'estoy', 'estás', 'está', 'estamos', 'estáis', 'están', 'tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'];
    if (spanishPresentVerbs.some(verb => transcript.includes(verb))) {
      structures.push({
        pattern: 'spanish_present_tense',
        examples: this.extractVerbExamples(transcript, spanishPresentVerbs),
        level: 'beginner',
        usage: 'Spanish present tense conjugation (ser/estar/tener)'
      });
    }
    
    // Spanish articles
    if (transcript.includes('el ') || transcript.includes('la ') || transcript.includes('los ') || transcript.includes('las ')) {
      structures.push({
        pattern: 'spanish_articles',
        examples: this.extractExamples(transcript, '(el|la|los|las) \\w+'),
        level: 'beginner',
        usage: 'Spanish definite articles (gender and number agreement)'
      });
    }
    
    return structures;
  }

  /**
   * Extract examples for a pattern
   */
  private extractExamples(transcript: string, pattern: string): string[] {
    const regex = new RegExp(pattern, 'gi');
    const sentences = transcript.split(/[.!?]+/);
    const examples: string[] = [];
    
    sentences.forEach(sentence => {
      if (regex.test(sentence)) {
        examples.push(sentence.trim());
      }
    });
    
    return examples.slice(0, 3); // Limit to 3 examples
  }

  /**
   * Extract verb examples
   */
  private extractVerbExamples(transcript: string, verbs: string[]): string[] {
    const sentences = transcript.split(/[.!?]+/);
    const examples: string[] = [];
    
    sentences.forEach(sentence => {
      if (verbs.some(verb => sentence.includes(` ${verb} `))) {
        examples.push(sentence.trim());
      }
    });
    
    return examples.slice(0, 3);
  }

  /**
   * Extract cultural elements
   */
  private extractCulturalElements(transcript: string, context: ProcessedConversationPattern['context']): CulturalElement[] {
    const elements: CulturalElement[] = [];
    
    // French social customs
    if (transcript.includes('tu') && transcript.includes('vous')) {
      elements.push({
        aspect: 'formality_levels',
        description: 'French uses tu (informal) and vous (formal) to indicate relationship and respect levels',
        example: 'The conversation switches between tu and vous',
        significance: 'Understanding when to use formal vs informal address is crucial in French culture'
      });
    }
    
    // French meal culture
    if (context.topic === 'food_meals') {
      elements.push({
        aspect: 'french_breakfast_culture',
        description: 'Traditional French breakfast includes coffee/tea, bread with butter and jam',
        example: 'Pain avec du beurre et de la confiture',
        significance: 'French breakfast is typically lighter than American breakfast'
      });
    }
      // French geography/education
    if (context.topic === 'geography_learning') {
      elements.push({
        aspect: 'european_awareness',
        description: 'French education emphasizes European geography and cultural diversity',
        example: 'Discussion of European Union countries and languages',
        significance: 'Reflects France\'s position in European context'
      });
    }
    
    // Spanish formality (tú/usted)
    if (transcript.includes('tú ') && transcript.includes('usted ')) {
      elements.push({
        aspect: 'spanish_formality',
        description: 'Spanish uses tú (informal) and usted (formal) for different levels of respect',
        example: 'Switching between tú and usted based on relationship',
        significance: 'Proper address forms are essential in Spanish-speaking cultures'
      });
    }
    
    // Spanish cultural celebrations
    if (context.topic === 'cultural_discussion' && (transcript.includes('fiesta') || transcript.includes('celebración'))) {
      elements.push({
        aspect: 'spanish_celebrations',
        description: 'Spanish culture places great importance on family celebrations and community festivals',
        example: 'Discussion of traditional fiestas and family gatherings',
        significance: 'Family and community bonds are central to Spanish-speaking cultures'
      });
    }
    
    // Spanish business culture
    if (context.setting === 'workplace' && (transcript.includes('trabajo') || transcript.includes('empresa'))) {
      elements.push({
        aspect: 'spanish_business_culture',
        description: 'Spanish business culture emphasizes personal relationships and respect for hierarchy',
        example: 'Professional discussions with formal address and personal connection',
        significance: 'Building personal relationships is crucial in Spanish business contexts'
      });
    }
    
    return elements;
  }

  /**
   * Map conversation patterns to personas
   */
  private mapToPersonas(context: ProcessedConversationPattern['context'], dialogueSegments: DialogueSegment[]): PersonaMapping {
    const mayaScore = this.calculatePersonaScore('maya', context, dialogueSegments);
    const alexScore = this.calculatePersonaScore('alex', context, dialogueSegments);
    const lunaScore = this.calculatePersonaScore('luna', context, dialogueSegments);
    
    return {
      maya: {
        score: mayaScore,
        matchingTraits: this.getMatchingTraits('maya', context, dialogueSegments),
        applicableScenarios: this.getApplicableScenarios('maya', context),
        adaptationNotes: this.getAdaptationNotes('maya', context)
      },
      alex: {
        score: alexScore,
        matchingTraits: this.getMatchingTraits('alex', context, dialogueSegments),
        applicableScenarios: this.getApplicableScenarios('alex', context),
        adaptationNotes: this.getAdaptationNotes('alex', context)
      },
      luna: {
        score: lunaScore,
        matchingTraits: this.getMatchingTraits('luna', context, dialogueSegments),
        applicableScenarios: this.getApplicableScenarios('luna', context),
        adaptationNotes: this.getAdaptationNotes('luna', context)
      }
    };
  }

  /**
   * Calculate persona relevance score
   */
  private calculatePersonaScore(persona: PersonaId, context: ProcessedConversationPattern['context'], dialogueSegments: DialogueSegment[]): number {
    let score = 0;
    
    // Maya (Patient Teacher) scoring
    if (persona === 'maya') {
      if (context.setting === 'educational' || context.setting === 'university') score += 3;
      if (context.communicativeFunction === 'teaching_learning') score += 3;
      if (dialogueSegments.some(s => s.intent === 'correction')) score += 2;
      if (dialogueSegments.some(s => s.emotionalTone === 'sympathetic')) score += 2;
    }
    
    // Alex (Conversational Friend) scoring
    else if (persona === 'alex') {
      if (context.setting === 'recreational' || context.setting === 'family_home') score += 3;
      if (context.communicativeFunction === 'social_interaction') score += 3;
      if (dialogueSegments.some(s => s.intent === 'question')) score += 2;
      if (dialogueSegments.some(s => s.emotionalTone === 'enthusiastic')) score += 2;
    }
    
    // Luna (Cultural Guide) scoring
    else if (persona === 'luna') {
      if (context.setting === 'travel' || context.setting === 'dining') score += 3;
      if (context.topic.includes('culture') || context.topic.includes('food')) score += 3;
      if (dialogueSegments.some(s => s.intent === 'statement')) score += 2;
      if (context.participants.length > 2) score += 1; // Group interactions
    }
    
    return Math.min(score, 10); // Cap at 10
  }

  /**
   * Get matching traits for a persona
   */
  private getMatchingTraits(persona: PersonaId, context: ProcessedConversationPattern['context'], dialogueSegments: DialogueSegment[]): string[] {
    const traits: string[] = [];
    
    if (persona === 'maya') {
      if (dialogueSegments.some(s => s.emotionalTone === 'sympathetic')) traits.push('empathetic');
      if (dialogueSegments.some(s => s.intent === 'correction')) traits.push('corrective');
      if (context.communicativeFunction === 'teaching_learning') traits.push('educational');
    } else if (persona === 'alex') {
      if (dialogueSegments.some(s => s.emotionalTone === 'enthusiastic')) traits.push('energetic');
      if (context.setting === 'recreational') traits.push('sporty');
      if (dialogueSegments.some(s => s.intent === 'question')) traits.push('curious');
    } else if (persona === 'luna') {
      if (context.setting === 'travel') traits.push('worldly');
      if (context.topic.includes('food')) traits.push('culinary');
      if (dialogueSegments.length > 5) traits.push('conversational');
    }
    
    return traits;
  }

  /**
   * Get applicable scenarios for a persona
   */
  private getApplicableScenarios(persona: PersonaId, context: ProcessedConversationPattern['context']): string[] {
    const scenarios: string[] = [];
    
    if (persona === 'maya') {
      scenarios.push('grammar_lessons', 'vocabulary_building', 'error_correction');
      if (context.setting === 'university') scenarios.push('academic_conversation');
    } else if (persona === 'alex') {
      scenarios.push('casual_chat', 'daily_activities', 'social_interactions');
      if (context.setting === 'recreational') scenarios.push('sports_discussion');
    } else if (persona === 'luna') {
      scenarios.push('cultural_exploration', 'travel_planning', 'food_discussion');
      if (context.setting === 'travel') scenarios.push('vacation_conversation');
    }
    
    return scenarios;
  }

  /**
   * Get adaptation notes for a persona
   */
  private getAdaptationNotes(persona: PersonaId, context: ProcessedConversationPattern['context']): string[] {
    const notes: string[] = [];
    
    if (persona === 'maya') {
      notes.push('Use patient and encouraging tone');
      notes.push('Provide clear explanations for corrections');
      if (context.setting === 'university') notes.push('Include academic vocabulary');
    } else if (persona === 'alex') {
      notes.push('Maintain casual and friendly tone');
      notes.push('Use contemporary expressions');
      if (context.setting === 'recreational') notes.push('Include sports terminology');
    } else if (persona === 'luna') {
      notes.push('Emphasize cultural context');
      notes.push('Provide background information');
      if (context.setting === 'travel') notes.push('Include practical travel tips');
    }
    
    return notes;
  }

  /**
   * Assess overall difficulty level
   */
  private assessDifficulty(transcript: string, vocabularyPatterns: VocabularyPattern[], grammarStructures: GrammarStructure[]): 'beginner' | 'intermediate' | 'advanced' {
    let score = 0;
    
    // Vocabulary complexity
    vocabularyPatterns.forEach(pattern => {
      if (pattern.difficulty === 'advanced') score += 2;
      else if (pattern.difficulty === 'intermediate') score += 1;
    });
    
    // Grammar complexity
    grammarStructures.forEach(structure => {
      if (structure.level === 'advanced') score += 2;
      else if (structure.level === 'intermediate') score += 1;
    });
    
    // Sentence length and complexity
    const avgSentenceLength = transcript.split(/[.!?]+/).reduce((sum, s) => sum + s.trim().split(' ').length, 0) / transcript.split(/[.!?]+/).length;
    if (avgSentenceLength > 15) score += 2;
    else if (avgSentenceLength > 10) score += 1;
    
    if (score >= 6) return 'advanced';
    if (score >= 3) return 'intermediate';
    return 'beginner';
  }

  /**
   * Assess vocabulary difficulty
   */
  private assessVocabularyDifficulty(vocabulary: VocabularyHighlight[]): string {
    // Simple heuristic based on word length and frequency
    const avgLength = vocabulary.reduce((sum, v) => sum + v.word.length, 0) / vocabulary.length;
    
    if (avgLength > 12) return 'advanced';
    if (avgLength > 8) return 'intermediate';
    return 'beginner';
  }

  /**
   * Get all processed conversation patterns
   */
  getProcessedPatterns(): ProcessedConversationPattern[] {
    return this.conversationPatterns;
  }

  /**
   * Get patterns for a specific persona
   */
  getPatternsForPersona(persona: PersonaId): ProcessedConversationPattern[] {
    return this.conversationPatterns.filter(pattern => 
      pattern.personaMapping[persona].score >= 6
    );
  }

  /**
   * Get patterns by difficulty level
   */
  getPatternsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): ProcessedConversationPattern[] {
    return this.conversationPatterns.filter(pattern => 
      pattern.difficulty === difficulty
    );
  }

  /**
   * Get patterns by topic/scenario
   */
  getPatternsByTopic(topic: string): ProcessedConversationPattern[] {
    return this.conversationPatterns.filter(pattern => 
      pattern.context.topic.includes(topic) || pattern.scenario.includes(topic)
    );
  }
}
