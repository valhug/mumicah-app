import React from 'react'
import { cn } from '../utils'
import { Logo } from './navigation'

// ===== FOOTER COMPONENT =====

// Footer component
export interface FooterLink {
  text: string
  href: string
}

export interface FooterProps {
  links?: FooterLink[]
  copyright?: string
  className?: string
}

export const Footer: React.FC<FooterProps> = ({
  links = [
    { text: 'Privacy', href: '/privacy' },
    { text: 'Terms', href: '/terms' },
    { text: 'Contact', href: '/contact' },
    { text: 'Help', href: '/help' }
  ],
  copyright = '© 2024 Mumicah. Empowering global communication through language learning.',
  className
}) => {
  return (
    <footer className={cn(
      'relative z-10 border-t border-border/50 bg-card/30 backdrop-blur-sm',
      className
    )}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Logo size="md" />
          
          <div className="flex space-x-6 text-sm text-muted-foreground mt-4 md:mt-0">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
