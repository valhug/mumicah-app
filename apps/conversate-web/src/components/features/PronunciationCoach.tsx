'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@mumicah/ui'
import { Badge } from '@mumicah/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@mumicah/ui'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Zap
} from 'lucide-react'
import { 
  enhancedVoiceService, 
  type PronunciationFeedback,
  type VoiceCoachingSession,
  type RealTimeVoiceMetrics
} from '@/services/voice-service-enhanced'

interface PronunciationCoachProps {
  targetPhrase: string
  language?: string
  onComplete?: (feedback: PronunciationFeedback[]) => void
  onProgress?: (metrics: RealTimeVoiceMetrics) => void
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  className?: string
}

export function PronunciationCoach({
  targetPhrase,
  language = 'fr-FR',
  onComplete,
  onProgress,
  difficulty = 'intermediate',
  className = ''
}: PronunciationCoachProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [currentSession, setCurrentSession] = useState<VoiceCoachingSession | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [pronunciationFeedback, setPronunciationFeedback] = useState<PronunciationFeedback[]>([])
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeVoiceMetrics | null>(null)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [overallScore, setOverallScore] = useState(0)

  const words = targetPhrase.split(' ')
  const currentWord = words[currentWordIndex] || ''

  useEffect(() => {
    // Initialize coaching session
    const session = enhancedVoiceService.startVoiceCoachingSession(language, words)
    setCurrentSession(session)
  }, [targetPhrase, language, words])

  useEffect(() => {
    // Update real-time metrics during recording
    let metricsInterval: NodeJS.Timeout
    if (isRecording) {
      metricsInterval = setInterval(() => {
        const metrics = enhancedVoiceService.analyzeRealTimeVoiceMetrics()
        setRealTimeMetrics(metrics)
        onProgress?.(metrics)
      }, 500)
    }

    return () => {
      if (metricsInterval) clearInterval(metricsInterval)
    }
  }, [isRecording, onProgress])

  const startPractice = async () => {
    if (!currentSession) return

    try {
      setIsRecording(true)
      
      // Simulate voice practice for current word
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate pronunciation feedback
      const spokenWord = `${currentWord}_variation` // Mock spoken input
      const feedback = await enhancedVoiceService.analyzeAdvancedPronunciation(
        currentWord,
        spokenWord,
        language
      )

      // Update feedback
      const updatedFeedback = [...pronunciationFeedback, feedback]
      setPronunciationFeedback(updatedFeedback)

      // Update session
      const updatedSession = {
        ...currentSession,
        completedPhrases: [...currentSession.completedPhrases, currentWord],
        feedback: updatedFeedback,
        overallAccuracy: Math.round(
          updatedFeedback.reduce((sum, f) => sum + f.accuracy, 0) / updatedFeedback.length
        )
      }
      setCurrentSession(updatedSession)

      // Move to next word or complete session
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1)
      } else {
        setSessionComplete(true)
        setOverallScore(updatedSession.overallAccuracy)
        onComplete?.(updatedFeedback)
      }

    } catch (error) {
      console.error('Practice error:', error)
    } finally {
      setIsRecording(false)
    }
  }

  const playCurrentWord = async () => {
    try {
      await enhancedVoiceService.speakText(currentWord, { language })
    } catch (error) {
      console.error('Playback error:', error)
    }
  }

  const resetSession = () => {
    setCurrentWordIndex(0)
    setPronunciationFeedback([])
    setSessionComplete(false)
    setOverallScore(0)
    setRealTimeMetrics(null)
    
    if (currentSession) {
      const resetSession = enhancedVoiceService.startVoiceCoachingSession(language, words)
      setCurrentSession(resetSession)
    }
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 85) return 'text-green-600'
    if (accuracy >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'bg-green-500', icon: Award }
    if (score >= 80) return { level: 'Very Good', color: 'bg-blue-500', icon: TrendingUp }
    if (score >= 70) return { level: 'Good', color: 'bg-yellow-500', icon: Target }
    return { level: 'Needs Practice', color: 'bg-red-500', icon: BookOpen }
  }

  return (
    <motion.div
      className={`pronunciation-coach space-y-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Session Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-primary" />
              Pronunciation Coach
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {difficulty} level
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{currentWordIndex + 1} / {words.length}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div 
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentWordIndex / words.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Target Phrase */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Target Phrase:</span>
            <p className="text-lg font-semibold text-primary bg-primary/10 p-3 rounded-lg">
              {words.map((word, index) => (
                <span 
                  key={index}
                  className={`${
                    index === currentWordIndex 
                      ? 'bg-primary text-primary-foreground px-2 py-1 rounded' 
                      : index < currentWordIndex 
                        ? 'text-green-600 line-through decoration-2' 
                        : 'text-muted-foreground'
                  }`}
                >
                  {word}
                  {index < words.length - 1 && ' '}
                </span>
              ))}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Word Practice */}
      {!sessionComplete && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Practice: &ldquo;{currentWord}&rdquo;
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Controls */}
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                onClick={playCurrentWord}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Listen
              </Button>

              <Button
                size="lg"
                onClick={startPractice}
                disabled={isRecording}
                className={`flex items-center gap-2 ${
                  isRecording ? 'bg-red-500 hover:bg-red-600' : ''
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    Recording...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Practice
                  </>
                )}
              </Button>

              <Button
                size="lg"
                onClick={resetSession}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            {/* Real-time Metrics */}
            {isRecording && realTimeMetrics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-muted/50 p-3 rounded-lg space-y-2"
              >
                <span className="text-sm font-medium">Real-time Feedback:</span>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Volume:</span>
                    <div className="w-16 h-2 bg-muted rounded-full">
                      <motion.div 
                        className="bg-primary h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${realTimeMetrics.volumeLevel}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Clarity:</span>
                    <span className={getAccuracyColor(realTimeMetrics.clarity)}>
                      {Math.round(realTimeMetrics.clarity)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pace:</span>
                    <span>{Math.round(realTimeMetrics.speechRate)} WPM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tone:</span>
                    <Badge variant="outline" className="text-xs">
                      {realTimeMetrics.emotionalTone}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pronunciation Feedback */}
      <AnimatePresence>
        {pronunciationFeedback.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pronunciation Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pronunciationFeedback.map((feedback, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">&ldquo;{feedback.word}&rdquo;</span>
                      <div className="flex items-center gap-2">
                        {feedback.accuracy >= 85 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className={`text-sm font-medium ${getAccuracyColor(feedback.accuracy)}`}>
                          {feedback.accuracy}%
                        </span>
                      </div>
                    </div>
                    
                    {feedback.suggestions.length > 0 && (
                      <div className="text-sm space-y-1">
                        <span className="text-muted-foreground">Suggestions:</span>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {feedback.suggestions.map((suggestion, idx) => (
                            <li key={idx}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Phoneme Analysis */}
                    {feedback.phonemes && feedback.phonemes.length > 0 && (
                      <div className="text-sm space-y-2">
                        <span className="text-muted-foreground">Phoneme Analysis:</span>
                        <div className="flex flex-wrap gap-2">
                          {feedback.phonemes.map((phoneme, idx) => (
                            <Badge 
                              key={idx}
                              variant={phoneme.accuracy > 80 ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {phoneme.phoneme}: {phoneme.accuracy}%
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Complete */}
      {sessionComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const { level, color, icon: Icon } = getScoreLevel(overallScore)
                  return (
                    <>
                      <div className={`p-2 rounded-lg ${color}/20`}>
                        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
                      </div>
                      Session Complete - {level}!
                    </>
                  )
                })()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {overallScore}%
                </div>
                <p className="text-muted-foreground">
                  Overall Pronunciation Accuracy
                </p>
              </div>

              {currentSession && currentSession.recommendations.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Recommendations:</span>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {currentSession.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button onClick={resetSession} className="flex-1">
                  Practice Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // Generate training plan
                    const plan = enhancedVoiceService.generateVoiceTrainingPlan(
                      difficulty,
                      language,
                      overallScore < 70 ? ['pronunciation', 'clarity'] : []
                    )
                    console.log('Training plan:', plan)
                  }}
                >
                  Get Training Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
