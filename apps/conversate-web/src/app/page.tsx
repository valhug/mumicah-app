import { getCurrentUser } from '@/lib/dal'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { AnimatedBackground } from '@/components/animated-background'
import { 
  PageContainer,
  NavBar,
  Logo,
  HeroSection,
  HeroTitle,
  HeroSubtitle,
  PersonaCard,
  FeatureCard,
  CTASection,
  Footer,
  Section,
  Badge,
  Button
} from '@mumicah/ui'

export default async function HomePage() {
  const user = await getCurrentUser()
  
  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <PageContainer>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Navigation */}
      <NavBar variant="glass">
        <div className="flex items-center space-x-2">
          <Logo size="md" showText={true} />
          <Badge variant="secondary" className="ml-2 text-xs">
            Beta
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {process.env.NODE_ENV === 'development' && (
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dev Dashboard</Link>
            </Button>
          )}
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </NavBar>

      {/* Hero Section */}
      <HeroSection>
        {/* Hero Badge */}
        <div className="flex justify-center">
          <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5">
            🌍 Connect with native speakers worldwide
          </Badge>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-6">
          <HeroTitle>
            Learn Languages<br />
            <span className="gradient-text">Naturally</span>
          </HeroTitle>
          
          <HeroSubtitle>
            Join millions of learners practicing with AI personas and real native speakers. 
            Experience immersive conversations that make language learning{' '}
            <span className="text-primary font-semibold">fun and effective</span>.
          </HeroSubtitle>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" asChild>
            <Link href="/signup">✨ Start Learning Free</Link>
          </Button>
          <Button variant="outline" size="lg" className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 px-8 py-6 text-lg rounded-full transition-all duration-300" asChild>
            <Link href="/demo">🎥 Watch Demo</Link>
          </Button>
        </div>

        {/* Social Proof */}
        <div className="pt-8 space-y-4">
          <p className="text-sm text-muted-foreground">Trusted by learners from 150+ countries</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">50K+</span>
              </div>
              <span className="text-sm">Active Learners</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">30+</span>
              </div>
              <span className="text-sm">Languages</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">4.9</span>
              </div>
              <span className="text-sm">User Rating</span>
            </div>
          </div>
        </div>
      </HeroSection>

      {/* AI Personas Preview */}
      <Section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Meet Your AI Language{' '}
            <span className="text-primary">Companions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practice with AI personas designed with unique personalities and teaching styles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <PersonaCard
            name="Maya"
            role="Patient Teacher"
            description="Gentle and encouraging, Maya breaks down complex concepts into digestible lessons. Perfect for beginners who need extra support."
            emoji="👩‍🏫"
            color="amber"
            badges={["Beginner Friendly", "Grammar Focus"]}
          />
          
          <PersonaCard
            name="Alex"
            role="Casual Friend"
            description="Laid-back and conversational, Alex helps you practice everyday conversations and slang. Great for building confidence."
            emoji="🧑‍💼"
            color="emerald"
            badges={["Conversational", "Slang & Idioms"]}
          />
          
          <PersonaCard
            name="Luna"
            role="Cultural Guide"
            description="Knowledgeable about traditions and customs, Luna teaches language through cultural context and stories."
            emoji="🌸"
            color="violet"
            badges={["Cultural Context", "Advanced"]}
          />
        </div>

        {/* Try Personas CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/5 px-8 py-6 rounded-full" asChild>
            <Link href="/personas">🤖 Try AI Personas Free</Link>
          </Button>
        </div>
      </Section>

      {/* Features Grid */}
      <Section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <span className="text-primary"> Master Languages</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Real-time Conversations"
            description="Practice with native speakers and AI in natural, flowing conversations that adapt to your level."
            icon="💬"
            gradient="from-blue-500 to-cyan-500"
          />
          
          <FeatureCard
            title="Smart Progress Tracking"
            description="Detailed analytics show your improvement over time with personalized insights and recommendations."
            icon="📊"
            gradient="from-green-500 to-emerald-500"
          />
          
          <FeatureCard
            title="Global Communities"
            description="Join language-specific communities where learners and natives connect, share, and learn together."
            icon="🌐"
            gradient="from-purple-500 to-pink-500"
          />
          
          <FeatureCard
            title="Adaptive Learning"
            description="AI-powered system adapts to your learning style, pace, and goals for maximum effectiveness."
            icon="🧠"
            gradient="from-orange-500 to-red-500"
          />
          
          <FeatureCard
            title="Cultural Immersion"
            description="Learn not just language, but culture, customs, and context for deeper understanding."
            icon="🏛️"
            gradient="from-indigo-500 to-purple-500"
          />
          
          <FeatureCard
            title="Learn Anywhere"
            description="Seamless experience across all devices. Practice during commutes, breaks, or whenever inspiration strikes."
            icon="📱"
            gradient="from-teal-500 to-cyan-500"
          />
        </div>
      </Section>

      {/* Final CTA */}
      <CTASection
        title="Ready to Start Your Language Journey?"
        subtitle="Join thousands of successful language learners who've transformed their communication skills with Mumicah."
        primaryAction={{
          text: "🚀 Start Learning Now",
          href: "/signup"
        }}
        secondaryAction={{
          text: "💬 Talk to Us",
          href: "/contact"
        }}
      />

      <Footer />
    </PageContainer>
  )
}
