import { PageContainer, Button, Badge, Section } from '@mumicah/ui'
import Link from 'next/link'

const AI_PERSONAS = [
  {
    id: 'maya',
    name: 'Maya',
    emoji: '👩‍🏫',
    color: 'amber',
    role: 'Patient Teacher',
    description: 'Gentle and encouraging, Maya breaks down complex concepts into digestible lessons. Perfect for beginners who need extra support and detailed explanations.',
    badges: ['Beginner Friendly', 'Grammar Focus', 'Step-by-Step'],
    specialties: ['Grammar explanation', 'Pronunciation help', 'Basic vocabulary', 'Cultural context'],
    languages: ['English', 'Spanish', 'French'],
    rating: 4.9,
    conversations: '12.5K+'
  },
  {
    id: 'alex',
    name: 'Alex',
    emoji: '🧑‍💼',
    color: 'emerald',
    role: 'Casual Friend',
    description: 'Laid-back and conversational, Alex helps you practice everyday conversations and slang. Great for building confidence in natural speech patterns.',
    badges: ['Conversational', 'Slang & Idioms', 'Confidence Building'],
    specialties: ['Casual conversation', 'Slang and idioms', 'Workplace English', 'Social situations'],
    languages: ['English', 'German', 'Dutch'],
    rating: 4.8,
    conversations: '18.2K+'
  },
  {
    id: 'luna',
    name: 'Luna',
    emoji: '🌸',
    color: 'violet',
    role: 'Cultural Guide',
    description: 'Knowledgeable about traditions and customs, Luna teaches language through cultural context and fascinating stories from around the world.',
    badges: ['Cultural Context', 'Advanced', 'Storytelling'],
    specialties: ['Cultural immersion', 'Advanced vocabulary', 'Literature discussion', 'History and traditions'],
    languages: ['English', 'Japanese', 'Mandarin', 'Korean'],
    rating: 4.9,
    conversations: '9.8K+'
  },
  {
    id: 'diego',
    name: 'Diego',
    emoji: '⚽',
    color: 'blue',
    role: 'Sports Enthusiast',
    description: 'Passionate about sports and fitness, Diego makes learning fun through discussions about games, exercise, and healthy living.',
    badges: ['Sports Talk', 'Motivational', 'Latin Culture'],
    specialties: ['Sports vocabulary', 'Fitness discussions', 'Latin American culture', 'Motivational speaking'],
    languages: ['Spanish', 'Portuguese', 'English'],
    rating: 4.7,
    conversations: '7.3K+'
  },
  {
    id: 'marie',
    name: 'Marie',
    emoji: '🎨',
    color: 'pink',
    role: 'Art & Culture Expert',
    description: 'Creative and inspiring, Marie explores language through art, music, and cultural expressions. Perfect for creative minds and art lovers.',
    badges: ['Creative', 'Art & Music', 'European Culture'],
    specialties: ['Art vocabulary', 'Music discussion', 'Creative expression', 'European culture'],
    languages: ['French', 'Italian', 'English'],
    rating: 4.8,
    conversations: '5.9K+'
  },
  {
    id: 'raj',
    name: 'Raj',
    emoji: '💻',
    color: 'indigo',
    role: 'Tech Mentor',
    description: 'Tech-savvy and forward-thinking, Raj helps you learn language skills essential for the digital age and technology industry.',
    badges: ['Tech Talk', 'Business English', 'Innovation'],
    specialties: ['Technical vocabulary', 'Business communication', 'Innovation discussions', 'Industry trends'],
    languages: ['English', 'Hindi', 'Bengali'],
    rating: 4.6,
    conversations: '4.1K+'
  }
]

export default function PersonasPage() {
  return (
    <PageContainer>
      {/* Header Section */}
      <Section className="py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Meet Your AI{' '}
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Language Companions
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Each AI persona has a unique personality, teaching style, and expertise. 
            Choose the perfect conversation partner for your learning goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/chat">Start Chatting Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Personas Grid */}
      <Section className="py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AI_PERSONAS.map((persona) => (
              <div
                key={persona.id}
                className="group relative bg-card rounded-3xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Persona Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getPersonaGradient(persona.color)} flex items-center justify-center text-2xl shadow-lg`}>
                    {persona.emoji}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{persona.name}</h3>
                    <p className="text-primary font-medium">{persona.role}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">⭐</span>
                    <span>{persona.rating}</span>
                  </div>
                  <div>{persona.conversations} chats</div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {persona.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {persona.badges.map((badge) => (
                    <Badge key={badge} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Specialties:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {persona.specialties.slice(0, 3).map((specialty) => (
                      <li key={specialty} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {specialty}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Languages */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Languages:</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.languages.map((language) => (
                      <Badge key={language} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full" 
                  asChild
                >
                  <Link href={`/chat?persona=${persona.id}`}>
                    Chat with {persona.name}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Bottom CTA */}
      <Section className="py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-muted-foreground mb-8">
            Choose any persona to begin your personalized language learning journey. 
            You can switch between personas anytime during your conversation.
          </p>
          <Button size="lg" asChild>
            <Link href="/chat">
              🚀 Start Your First Conversation
            </Link>
          </Button>
        </div>
      </Section>
    </PageContainer>
  )
}

function getPersonaGradient(color: string): string {
  const colorMap = {
    amber: 'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-teal-500',
    violet: 'from-violet-500 to-purple-500',
    blue: 'from-blue-500 to-cyan-500',
    pink: 'from-pink-500 to-rose-500',
    indigo: 'from-indigo-500 to-blue-500'
  }
  
  return colorMap[color as keyof typeof colorMap] || 'from-blue-500 to-cyan-500'
}
