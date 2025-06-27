import { PageContainer, NavBar, Logo, HeroSection, HeroTitle, HeroSubtitle, Button, Badge } from '@mumicah/ui'
import Link from 'next/link'

export default function DevMentorHomePage() {
  return (
    <PageContainer>
      {/* Navigation */}
      <NavBar variant="solid">
        <div className="flex items-center space-x-2">
          <Logo size="md" showText={true} />
          <Badge variant="secondary" className="ml-2 text-xs">
            DevMentor
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </NavBar>

      {/* Hero Section */}
      <HeroSection className="py-20">
        <HeroTitle>
          Level Up Your Development Skills
        </HeroTitle>
        <HeroSubtitle className="max-w-2xl">
          Connect with experienced mentors, get personalized guidance, and accelerate your coding journey with DevMentor.
        </HeroSubtitle>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" asChild>
            <Link href="/find-mentor">Find a Mentor</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/become-mentor">Become a Mentor</Link>
          </Button>
        </div>
      </HeroSection>

      {/* Features Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DevMentor?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍💻</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Mentors</h3>
              <p className="text-muted-foreground">Learn from industry professionals with years of experience</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-muted-foreground">Get customized guidance tailored to your goals</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
              <p className="text-muted-foreground">Accelerate your development career with proven strategies</p>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  )
}
