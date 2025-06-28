'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
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
  Footer,
  Section,
  Badge,
  Button
} from '@mumicah/ui'

export default function HomePageContent() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  const cardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6 }
    },
    hover: { 
      y: -10,
      scale: 1.05,
      transition: { duration: 0.3 }
    }
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Badge */}
          <motion.div className="flex justify-center" variants={itemVariants}>
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5">
              🌍 Connect with native speakers worldwide
            </Badge>
          </motion.div>

          {/* Hero Title & Subtitle */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <HeroTitle>
              Learn Languages<br />
              <span className="gradient-text">Naturally</span>
            </HeroTitle>
            
            <HeroSubtitle>
              Join millions of learners practicing with AI personas and real native speakers. 
              Experience immersive conversations that make language learning{' '}
              <span className="text-primary font-semibold">fun and effective</span>.
            </HeroSubtitle>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            variants={itemVariants}
          >
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" asChild>
              <Link href="/signup">✨ Start Learning Free</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 px-8 py-6 text-lg rounded-full transition-all duration-300" asChild>
              <Link href="/demo">🎥 Watch Demo</Link>
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div className="pt-8 space-y-4" variants={itemVariants}>
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
          </motion.div>
        </motion.div>
      </HeroSection>

      {/* AI Personas Preview */}
      <Section className="py-16">
        <motion.div 
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-foreground mb-6"
            variants={itemVariants}
          >
            Meet Your AI Language{' '}
            <span className="text-primary">Companions</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Practice with AI personas designed with unique personalities and teaching styles
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={cardVariants} whileHover="hover">
            <PersonaCard
              name="Maya"
              role="Patient Teacher"
              description="Gentle and encouraging, Maya breaks down complex concepts into digestible lessons. Perfect for beginners who need extra support."
              emoji="👩‍🏫"
              color="amber"
              badges={["Beginner Friendly", "Grammar Focus"]}
            />
          </motion.div>
          
          <motion.div variants={cardVariants} whileHover="hover">
            <PersonaCard
              name="Alex"
              role="Casual Friend"
              description="Laid-back and conversational, Alex helps you practice everyday conversations and slang. Great for building confidence."
              emoji="🧑‍💼"
              color="emerald"
              badges={["Conversational", "Slang & Idioms"]}
            />
          </motion.div>
          
          <motion.div variants={cardVariants} whileHover="hover">
            <PersonaCard
              name="Luna"
              role="Cultural Guide"
              description="Knowledgeable about traditions and customs, Luna teaches language through cultural context and stories."
              emoji="🌸"
              color="violet"
              badges={["Cultural Context", "Advanced"]}
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className="text-center"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Button size="lg" asChild>
            <Link href="/personas">
              🎭 Explore All Personas
            </Link>
          </Button>
        </motion.div>
      </Section>

      {/* Features Section */}
      <Section className="py-16 bg-muted/30">
        <motion.div 
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-foreground mb-6"
            variants={itemVariants}
          >
            Why Choose{' '}
            <span className="text-primary">Conversate</span>?
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Advanced AI technology meets proven language learning methodologies
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={cardVariants}>
            <FeatureCard
              icon="🧠"
              title="AI-Powered Learning"
              description="Advanced AI personas adapt to your learning style and pace, providing personalized feedback and guidance."
              gradient="from-blue-500 to-purple-500"
            />
          </motion.div>
          
          <motion.div variants={cardVariants}>
            <FeatureCard
              icon="🌍"
              title="Real Cultural Context"
              description="Learn languages as they're actually spoken, with cultural nuances and real-world applications."
              gradient="from-emerald-500 to-teal-500"
            />
          </motion.div>
          
          <motion.div variants={cardVariants}>
            <FeatureCard
              icon="📈"
              title="Progress Tracking"
              description="Detailed analytics and progress tracking help you stay motivated and see your improvement over time."
              gradient="from-amber-500 to-orange-500"
            />
          </motion.div>
        </motion.div>
      </Section>

      {/* CTA Section */}
      <Section className="py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-foreground mb-6"
            variants={itemVariants}
          >
            Ready to Start Your{' '}
            <span className="gradient-text">Journey</span>?
          </motion.h2>
          
          <motion.p 
            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Join thousands of learners who are already improving their language skills with our AI-powered platform.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white px-8 py-6 text-lg rounded-full" asChild>
              <Link href="/signup">🚀 Start Learning Now</Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-full" asChild>
              <Link href="/personas">👀 Browse Personas</Link>
            </Button>
          </motion.div>
        </motion.div>
      </Section>

      {/* Footer */}
      <Footer />
    </PageContainer>
  )
}
