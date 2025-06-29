'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@mumicah/ui'

interface CommunityFeatureCardProps {
  title: string
  description: string
  icon: string
  className?: string
}

export function CommunityFeatureCard({
  title,
  description,
  icon,
  className = ''
}: CommunityFeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="h-full border-border hover:border-primary/30 transition-colors">
        <CardContent className="p-6 text-center space-y-4">
          <div className="text-4xl mb-3">{icon}</div>
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
