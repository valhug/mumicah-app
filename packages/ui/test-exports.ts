// Test direct imports from UI components
import { Button, Badge, Card, PageContainer } from './components/common.tsx'
import { NavBar, Logo } from './components/navigation.tsx'
import { HeroSection } from './components/hero.tsx'

console.log('Button:', Button)
console.log('Badge:', Badge)
console.log('Card:', Card)
console.log('PageContainer:', PageContainer)
console.log('NavBar:', NavBar)
console.log('Logo:', Logo)
console.log('HeroSection:', HeroSection)

// Test re-export
export { Button, Badge, Card, PageContainer, NavBar, Logo, HeroSection }
