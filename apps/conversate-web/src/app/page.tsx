import { getCurrentUser } from '@/lib/dal'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnimatedBackground } from '@/components/animated-background'

export default async function HomePage() {
  const user = await getCurrentUser()
  
  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Mumicah
            </h1>
            <Badge variant="secondary" className="ml-2 text-xs">
              Beta
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">
                Sign in
              </Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                Get started
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center space-y-8">
          {/* Hero Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5">
              🌍 Connect with native speakers worldwide
            </Badge>
          </div>

          {/* Hero Title */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground animate-fade-in">
              Learn Languages
              <br />
              <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Naturally
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Join millions of learners practicing with AI personas and real native speakers. 
              Experience immersive conversations that make language learning 
              <span className="text-primary font-semibold"> fun and effective</span>.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" asChild>
              <Link href="/signup">
                ✨ Start Learning Free
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 px-8 py-6 text-lg rounded-full transition-all duration-300" asChild>
              <Link href="/demo">
                🎥 Watch Demo
              </Link>
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
        </div>
      </section>

      {/* AI Personas Preview */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Meet Your AI Language 
            <span className="text-primary"> Companions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practice with AI personas designed with unique personalities and teaching styles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Maya - Patient Teacher */}
          <div className="group relative p-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500">
                <span className="text-2xl">👩‍🏫</span>
              </div>
              <h3 className="text-2xl font-bold text-amber-600 mb-3">Maya</h3>
              <p className="text-sm text-amber-600/80 mb-4 font-medium">Patient Teacher</p>
              <p className="text-muted-foreground leading-relaxed">
                Gentle and encouraging, Maya breaks down complex concepts into digestible lessons. Perfect for beginners who need extra support.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 border-amber-500/20">
                  Beginner Friendly
                </Badge>
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 border-amber-500/20">
                  Grammar Focus
                </Badge>
              </div>
            </div>
          </div>

          {/* Alex - Casual Friend */}
          <div className="group relative p-8 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500">
                <span className="text-2xl">🧑‍💼</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-600 mb-3">Alex</h3>
              <p className="text-sm text-emerald-600/80 mb-4 font-medium">Casual Friend</p>
              <p className="text-muted-foreground leading-relaxed">
                Laid-back and conversational, Alex helps you practice everyday conversations and slang. Great for building confidence.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                  Conversational
                </Badge>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                  Slang & Idioms
                </Badge>
              </div>
            </div>
          </div>

          {/* Luna - Cultural Guide */}
          <div className="group relative p-8 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500">
                <span className="text-2xl">🌸</span>
              </div>
              <h3 className="text-2xl font-bold text-violet-600 mb-3">Luna</h3>
              <p className="text-sm text-violet-600/80 mb-4 font-medium">Cultural Guide</p>
              <p className="text-muted-foreground leading-relaxed">
                Knowledgeable about traditions and customs, Luna teaches language through cultural context and stories.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-violet-500/10 text-violet-700 border-violet-500/20">
                  Cultural Context
                </Badge>
                <Badge variant="secondary" className="bg-violet-500/10 text-violet-700 border-violet-500/20">
                  Advanced
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Try Personas CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/5 px-8 py-6 rounded-full" asChild>
            <Link href="/personas">
              🤖 Try AI Personas Free
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <span className="text-primary"> Master Languages</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Real-time Conversations */}
          <div className="p-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-3">Real-time Conversations</h3>
            <p className="text-muted-foreground">
              Practice with native speakers and AI in natural, flowing conversations that adapt to your level.
            </p>
          </div>

          {/* Progress Tracking */}
          <div className="p-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-3">Smart Progress Tracking</h3>
            <p className="text-muted-foreground">
              Detailed analytics show your improvement over time with personalized insights and recommendations.
            </p>
          </div>

          {/* Global Communities */}
          <div className="p-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-3">Global Communities</h3>
            <p className="text-muted-foreground">
              Join language-specific communities where learners and natives connect, share, and learn together.
            </p>
          </div>

          {/* Adaptive Learning */}
          <div className="p-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-3">Adaptive Learning</h3>
            <p className="text-muted-foreground">
              AI-powered system adapts to your learning style, pace, and goals for maximum effectiveness.
            </p>
          </div>

          {/* Cultural Context */}
          <div className="p-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🏛️</span>
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-3">Cultural Immersion</h3>
            <p className="text-muted-foreground">
              Learn not just language, but culture, customs, and context for deeper understanding.
            </p>
          </div>

          {/* Mobile Learning */}
          <div className="p-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-3">Learn Anywhere</h3>
            <p className="text-muted-foreground">
              Seamless experience across all devices. Practice during commutes, breaks, or whenever inspiration strikes.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center p-16 bg-gradient-to-br from-primary/10 via-orange-500/10 to-amber-500/10 border border-primary/20 rounded-3xl backdrop-blur-sm">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Ready to Start Your
            <br />
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Language Journey?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of successful language learners who've transformed their communication skills with Mumicah.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white px-12 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" asChild>
              <Link href="/signup">
                🚀 Start Learning Now
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 px-12 py-6 text-xl rounded-full transition-all duration-300" asChild>
              <Link href="/contact">
                💬 Talk to Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                Mumicah
              </span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
              <Link href="/help" className="hover:text-foreground transition-colors">Help</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Mumicah. Empowering global communication through language learning.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
