'use client'

import { useState, useEffect } from 'react'
import { Card } from '@mumicah/ui'
import { Badge } from '@mumicah/ui'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Volume2, 
  BookOpen,
  Lightbulb,
  RefreshCw,
  MessageSquare
} from 'lucide-react'

interface LanguageFeedbackProps {
  message: string
  language: string
  onFeedbackApplied?: (correction: string) => void
  className?: string
}

interface GrammarIssue {
  id: string
  type: 'grammar' | 'spelling' | 'punctuation' | 'style'
  severity: 'error' | 'warning' | 'suggestion'
  original: string
  corrected: string
  explanation: string
  position: { start: number; end: number }
  rule?: string
}

interface PronunciationTip {
  word: string
  ipa: string
  audioUrl?: string
  difficulty: 'easy' | 'medium' | 'hard'
  tip: string
}

interface VocabularyEnhancement {
  word: string
  level: 'basic' | 'intermediate' | 'advanced'
  alternatives: string[]
  context: string
}

export default function LanguageFeedback({ 
  message, 
  language, 
  onFeedbackApplied,
  className = '' 
}: LanguageFeedbackProps) {
  const [grammarIssues, setGrammarIssues] = useState<GrammarIssue[]>([])
  const [pronunciationTips, setPronunciationTips] = useState<PronunciationTip[]>([])
  const [vocabularyTips, setVocabularyTips] = useState<VocabularyEnhancement[]>([])
  const [loading, setLoading] = useState(false)
  const [correctedMessage, setCorrectedMessage] = useState('')
  const [selectedTab, setSelectedTab] = useState<'grammar' | 'pronunciation' | 'vocabulary'>('grammar')

  useEffect(() => {
    if (message.trim()) {
      analyzeMessage()
    }
  }, [message, language])

  const analyzeMessage = async () => {
    if (!message.trim()) return
    
    setLoading(true)
    try {
      // Simulate AI analysis (in real implementation, would use OpenAI/Claude API)
      await new Promise(resolve => setTimeout(resolve, 800))

      // Mock grammar analysis
      const mockGrammarIssues: GrammarIssue[] = []
      
      // Simple pattern detection for demo
      if (message.includes('I are')) {
        mockGrammarIssues.push({
          id: '1',
          type: 'grammar',
          severity: 'error',
          original: 'I are',
          corrected: 'I am',
          explanation: 'Use "am" with the first person singular pronoun "I"',
          position: { start: message.indexOf('I are'), end: message.indexOf('I are') + 5 },
          rule: 'Subject-verb agreement'
        })
      }

      if (message.toLowerCase().includes('alot')) {
        const start = message.toLowerCase().indexOf('alot')
        mockGrammarIssues.push({
          id: '2',
          type: 'spelling',
          severity: 'error',
          original: message.substring(start, start + 4),
          corrected: 'a lot',
          explanation: '"A lot" should be written as two separate words',
          position: { start, end: start + 4 },
          rule: 'Spelling'
        })
      }

      if (message.includes('?!')) {
        mockGrammarIssues.push({
          id: '3',
          type: 'punctuation',
          severity: 'suggestion',
          original: '?!',
          corrected: '?',
          explanation: 'Avoid using multiple punctuation marks together in formal writing',
          position: { start: message.indexOf('?!'), end: message.indexOf('?!') + 2 },
          rule: 'Punctuation style'
        })
      }

      // Mock pronunciation tips
      const words = message.toLowerCase().split(/\s+/)
      const mockPronunciationTips: PronunciationTip[] = []
      
      if (words.includes('through')) {
        mockPronunciationTips.push({
          word: 'through',
          ipa: '/θruː/',
          difficulty: 'medium',
          tip: 'The "th" sound is voiceless. Place your tongue between your teeth and blow air.'
        })
      }

      if (words.includes('pronunciation')) {
        mockPronunciationTips.push({
          word: 'pronunciation',
          ipa: '/prəˌnʌnsiˈeɪʃən/',
          difficulty: 'hard',
          tip: 'Note the stress on the fourth syllable: pro-nun-ci-A-tion'
        })
      }

      // Mock vocabulary enhancements
      const mockVocabularyTips: VocabularyEnhancement[] = []
      
      if (words.includes('good')) {
        mockVocabularyTips.push({
          word: 'good',
          level: 'basic',
          alternatives: ['excellent', 'outstanding', 'remarkable', 'superb'],
          context: 'Consider using more specific adjectives to enhance your expression'
        })
      }

      if (words.includes('big')) {
        mockVocabularyTips.push({
          word: 'big',
          level: 'basic',
          alternatives: ['enormous', 'massive', 'substantial', 'colossal'],
          context: 'Vary your vocabulary with more descriptive size adjectives'
        })
      }

      setGrammarIssues(mockGrammarIssues)
      setPronunciationTips(mockPronunciationTips)
      setVocabularyTips(mockVocabularyTips)

      // Generate corrected message
      let corrected = message
      mockGrammarIssues.forEach(issue => {
        if (issue.severity === 'error') {
          corrected = corrected.replace(issue.original, issue.corrected)
        }
      })
      setCorrectedMessage(corrected)

    } catch (error) {
      console.error('Error analyzing message:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyCorrection = (issue: GrammarIssue) => {
    const newMessage = message.replace(issue.original, issue.corrected)
    onFeedbackApplied?.(newMessage)
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return XCircle
      case 'warning': return AlertCircle
      case 'suggestion': return Lightbulb
      default: return CheckCircle
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'suggestion': return 'text-blue-600 bg-blue-100'
      default: return 'text-green-600 bg-green-100'
    }
  }

  if (!message.trim()) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Type a message to get AI-powered language feedback</p>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
          <h3 className="font-semibold text-lg">Analyzing your message...</h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </Card>
    )
  }

  const totalIssues = grammarIssues.length + pronunciationTips.length + vocabularyTips.length

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-lg">Language Feedback</h3>
        </div>
        <Badge variant={totalIssues > 0 ? 'default' : 'secondary'} className="text-xs">
          {totalIssues} {totalIssues === 1 ? 'suggestion' : 'suggestions'}
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'grammar', label: 'Grammar', count: grammarIssues.length },
          { key: 'pronunciation', label: 'Pronunciation', count: pronunciationTips.length },
          { key: 'vocabulary', label: 'Vocabulary', count: vocabularyTips.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key as any)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Grammar Issues */}
      {selectedTab === 'grammar' && (
        <div className="space-y-3">
          {grammarIssues.length > 0 ? (
            grammarIssues.map(issue => {
              const Icon = getSeverityIcon(issue.severity)
              const colorClass = getSeverityColor(issue.severity)
              
              return (
                <div
                  key={issue.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 capitalize">
                          {issue.type} {issue.severity}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {issue.rule}
                        </Badge>
                      </div>
                      
                      <div className="mb-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-red-600 bg-red-50 px-2 py-1 rounded">
                            "{issue.original}"
                          </span>
                          <span>→</span>
                          <span className="text-green-600 bg-green-50 px-2 py-1 rounded">
                            "{issue.corrected}"
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {issue.explanation}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => applyCorrection(issue)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Apply correction
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-400" />
              <p>Great! No grammar issues detected.</p>
            </div>
          )}
        </div>
      )}

      {/* Pronunciation Tips */}
      {selectedTab === 'pronunciation' && (
        <div className="space-y-3">
          {pronunciationTips.length > 0 ? (
            pronunciationTips.map((tip, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                    <Volume2 className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        "{tip.word}"
                      </h4>
                      <Badge 
                        variant={tip.difficulty === 'hard' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {tip.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="mb-3 space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">IPA: </span>
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {tip.ipa}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {tip.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Volume2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No pronunciation tips for this message.</p>
            </div>
          )}
        </div>
      )}

      {/* Vocabulary Enhancement */}
      {selectedTab === 'vocabulary' && (
        <div className="space-y-3">
          {vocabularyTips.length > 0 ? (
            vocabularyTips.map((tip, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600 flex-shrink-0">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        "{tip.word}"
                      </h4>
                      <Badge 
                        variant={tip.level === 'basic' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {tip.level}
                      </Badge>
                    </div>
                    
                    <div className="mb-3 space-y-2">
                      <p className="text-sm text-gray-600">
                        {tip.context}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tip.alternatives.map((alt, i) => (
                          <span
                            key={i}
                            className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full"
                          >
                            {alt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No vocabulary suggestions for this message.</p>
            </div>
          )}
        </div>
      )}

      {/* Corrected Message Preview */}
      {correctedMessage !== message && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Corrected Version:</h4>
          <p className="text-sm text-green-800">
            "{correctedMessage}"
          </p>
        </div>
      )}
    </Card>
  )
}
