'use client'

import { PersonaId } from '@/types/conversation'

export interface ConversationStarter {
  id: string
  text: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  persona: PersonaId | 'all'
  language: string
  context?: string
  followUpQuestions?: string[]
}

export interface StarterCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

export class ConversationStarterService {
  private starters: ConversationStarter[] = [
    // Maya (Teacher) - Educational focus
    {
      id: 'maya_1',
      text: "Bonjour ! Comment s'est passée votre semaine ? Racontez-moi vos activités préférées.",
      category: 'daily_life',
      difficulty: 'beginner',
      persona: 'maya',
      language: 'fr-FR',
      context: 'Casual greeting and daily routine practice',
      followUpQuestions: [
        "Qu'avez-vous fait de spécial ?",
        "Quelle est votre activité préférée ?",
        "Comment organisez-vous votre temps libre ?"
      ]
    },
    {
      id: 'maya_2',
      text: "Parlons de vos objectifs d'apprentissage. Que souhaitez-vous améliorer en français aujourd'hui ?",
      category: 'learning',
      difficulty: 'intermediate',
      persona: 'maya',
      language: 'fr-FR',
      context: 'Learning goals and study planning',
      followUpQuestions: [
        "Quelles sont vos difficultés principales ?",
        "Préférez-vous la grammaire ou le vocabulaire ?",
        "Comment pratiquez-vous à la maison ?"
      ]
    },
    {
      id: 'maya_3',
      text: "Aujourd'hui, explorons un sujet complexe : l'art et la culture française. Que savez-vous sur l'impressionnisme ?",
      category: 'culture',
      difficulty: 'advanced',
      persona: 'maya',
      language: 'fr-FR',
      context: 'Advanced cultural discussion',
      followUpQuestions: [
        "Quel est votre peintre français préféré ?",
        "Comment l'art influence-t-il la société ?",
        "Avez-vous visité des musées français ?"
      ]
    },

    // Alex (Friend) - Casual conversations
    {
      id: 'alex_1',
      text: "Salut ! Alors, quoi de neuf ? Tu as fait des trucs sympas ce weekend ?",
      category: 'social',
      difficulty: 'beginner',
      persona: 'alex',
      language: 'fr-FR',
      context: 'Friendly casual greeting',
      followUpQuestions: [
        "Tu as vu des films récemment ?",
        "Tu aimes sortir ou rester chez toi ?",
        "Qu'est-ce que tu fais pour te détendre ?"
      ]
    },
    {
      id: 'alex_2',
      text: "Eh, tu connais de la musique française ? Moi j'adore Stromae et Christine and the Queens !",
      category: 'entertainment',
      difficulty: 'intermediate',
      persona: 'alex',
      language: 'fr-FR',
      context: 'Music and entertainment discussion',
      followUpQuestions: [
        "Quel genre de musique tu préfères ?",
        "Tu vas souvent en concert ?",
        "Tu joues d'un instrument ?"
      ]
    },
    {
      id: 'alex_3',
      text: "Dis-moi, tu voyages beaucoup ? J'aimerais bien aller au Japon l'année prochaine. Tu as des conseils ?",
      category: 'travel',
      difficulty: 'advanced',
      persona: 'alex',
      language: 'fr-FR',
      context: 'Travel planning and experiences',
      followUpQuestions: [
        "Quel est ton voyage le plus mémorable ?",
        "Tu préfères l'aventure ou le repos ?",
        "Comment tu choisis tes destinations ?"
      ]
    },

    // Luna (Cultural Guide) - Cultural focus
    {
      id: 'luna_1',
      text: "Bonsoir ! Découvrons ensemble une tradition française : l'art de vivre. Comment imaginez-vous le style de vie français ?",
      category: 'culture',
      difficulty: 'beginner',
      persona: 'luna',
      language: 'fr-FR',
      context: 'Introduction to French lifestyle',
      followUpQuestions: [
        "Qu'est-ce qui vous attire dans la culture française ?",
        "Connaissez-vous des coutumes françaises ?",
        "Quelle région de France vous intéresse ?"
      ]
    },
    {
      id: 'luna_2',
      text: "Explorons la gastronomie française. Avez-vous déjà goûté des plats traditionnels comme le coq au vin ou la ratatouille ?",
      category: 'food',
      difficulty: 'intermediate',
      persona: 'luna',
      language: 'fr-FR',
      context: 'French cuisine exploration',
      followUpQuestions: [
        "Quel plat français aimeriez-vous apprendre à cuisiner ?",
        "Connaissez-vous les régions gastronomiques ?",
        "Avez-vous déjà visité un marché français ?"
      ]
    },
    {
      id: 'luna_3',
      text: "Plongeons dans l'histoire française. Que pensez-vous de l'influence de la Révolution française sur le monde moderne ?",
      category: 'history',
      difficulty: 'advanced',
      persona: 'luna',
      language: 'fr-FR',
      context: 'Historical and philosophical discussion',
      followUpQuestions: [
        "Quels événements historiques vous fascinent ?",
        "Comment l'histoire influence-t-elle notre présent ?",
        "Aimez-vous visiter des sites historiques ?"
      ]
    },

    // Universal starters (work with any persona)
    {
      id: 'universal_1',
      text: "Présentez-vous ! D'où venez-vous et qu'est-ce qui vous passionne dans la vie ?",
      category: 'introductions',
      difficulty: 'beginner',
      persona: 'all',
      language: 'fr-FR',
      context: 'Self-introduction and interests'
    },
    {
      id: 'universal_2',
      text: "Parlons de vos rêves et ambitions. Où vous voyez-vous dans cinq ans ?",
      category: 'future_plans',
      difficulty: 'intermediate',
      persona: 'all',
      language: 'fr-FR',
      context: 'Future aspirations and goals'
    },
    {
      id: 'universal_3',
      text: "Si vous pouviez changer une chose dans le monde, que serait-ce et pourquoi ?",
      category: 'philosophy',
      difficulty: 'advanced',
      persona: 'all',
      language: 'fr-FR',
      context: 'Philosophical and social discussion'
    }
  ]

  private categories: StarterCategory[] = [
    {
      id: 'daily_life',
      name: 'Vie Quotidienne',
      description: 'Daily routines and activities',
      icon: '🏠',
      color: 'blue'
    },
    {
      id: 'social',
      name: 'Social',
      description: 'Friendship and social interactions',
      icon: '👥',
      color: 'green'
    },
    {
      id: 'culture',
      name: 'Culture',
      description: 'French culture and traditions',
      icon: '🎭',
      color: 'purple'
    },
    {
      id: 'learning',
      name: 'Apprentissage',
      description: 'Language learning and education',
      icon: '📚',
      color: 'orange'
    },
    {
      id: 'entertainment',
      name: 'Divertissement',
      description: 'Music, movies, and entertainment',
      icon: '🎵',
      color: 'pink'
    },
    {
      id: 'food',
      name: 'Gastronomie',
      description: 'French cuisine and cooking',
      icon: '🍷',
      color: 'red'
    },
    {
      id: 'travel',
      name: 'Voyage',
      description: 'Travel experiences and planning',
      icon: '✈️',
      color: 'teal'
    },
    {
      id: 'introductions',
      name: 'Présentation',
      description: 'Getting to know each other',
      icon: '👋',
      color: 'yellow'
    },
    {
      id: 'future_plans',
      name: 'Projets',
      description: 'Dreams and future aspirations',
      icon: '🌟',
      color: 'indigo'
    },
    {
      id: 'philosophy',
      name: 'Philosophie',
      description: 'Deep thoughts and big questions',
      icon: '🤔',
      color: 'gray'
    }
  ]

  // Get conversation starters for a specific persona and difficulty
  getStartersForPersona(
    persona: PersonaId,
    difficulty?: 'beginner' | 'intermediate' | 'advanced',
    category?: string,
    limit: number = 5
  ): ConversationStarter[] {
    let filtered = this.starters.filter(starter => 
      starter.persona === persona || starter.persona === 'all'
    )

    if (difficulty) {
      filtered = filtered.filter(starter => starter.difficulty === difficulty)
    }

    if (category) {
      filtered = filtered.filter(starter => starter.category === category)
    }

    // Shuffle and limit
    const shuffled = filtered.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, limit)
  }

  // Get all categories
  getCategories(): StarterCategory[] {
    return this.categories
  }

  // Get category by ID
  getCategory(id: string): StarterCategory | undefined {
    return this.categories.find(cat => cat.id === id)
  }

  // Get personalized starters based on user history
  getPersonalizedStarters(
    persona: PersonaId,
    userLevel: 'beginner' | 'intermediate' | 'advanced',
    recentTopics: string[] = [],
    interests: string[] = []
  ): ConversationStarter[] {
    let starters = this.getStartersForPersona(persona, userLevel)

    // Filter out recently discussed topics
    if (recentTopics.length > 0) {
      starters = starters.filter(starter => 
        !recentTopics.includes(starter.category)
      )
    }

    // Prioritize user interests
    if (interests.length > 0) {
      const prioritized = starters.filter(starter =>
        interests.includes(starter.category)
      )
      const others = starters.filter(starter =>
        !interests.includes(starter.category)
      )
      
      starters = [...prioritized, ...others]
    }

    return starters.slice(0, 3)
  }

  // Get random starter for quick start
  getRandomStarter(
    persona?: PersonaId,
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  ): ConversationStarter {
    let filtered = this.starters

    if (persona) {
      filtered = filtered.filter(starter => 
        starter.persona === persona || starter.persona === 'all'
      )
    }

    if (difficulty) {
      filtered = filtered.filter(starter => starter.difficulty === difficulty)
    }

    const randomIndex = Math.floor(Math.random() * filtered.length)
    return filtered[randomIndex] || this.starters[0]
  }

  // Generate dynamic starter based on context
  generateContextualStarter(
    persona: PersonaId,
    timeOfDay: 'morning' | 'afternoon' | 'evening',
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): ConversationStarter {
    const timeGreetings = {
      morning: {
        maya: "Bonjour ! Comment avez-vous commencé votre journée ?",
        alex: "Salut ! Tu es matinal aujourd'hui ! Ça va ?",
        luna: "Bonjour ! Quelle belle façon de commencer la journée en français !"
      },
      afternoon: {
        maya: "Bon après-midi ! Comment se passe votre journée d'apprentissage ?",
        alex: "Salut ! Tu fais quoi de beau cet après-midi ?",
        luna: "Bon après-midi ! Profitons de ce moment pour explorer la culture française."
      },
      evening: {
        maya: "Bonsoir ! Faisons le point sur ce que vous avez appris aujourd'hui.",
        alex: "Bonsoir ! Tu as passé une bonne journée ?",
        luna: "Bonsoir ! C'est le moment parfait pour une conversation enrichissante."
      }
    }

    return {
      id: `dynamic_${persona}_${timeOfDay}`,
      text: timeGreetings[timeOfDay][persona],
      category: 'dynamic',
      difficulty,
      persona,
      language: 'fr-FR',
      context: `Time-appropriate greeting for ${timeOfDay}`
    }
  }
}

// Singleton instance
export const conversationStarterService = new ConversationStarterService()
