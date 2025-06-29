'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@mumicah/ui'
import { Badge } from '@mumicah/ui'
import { Card, CardContent } from '@mumicah/ui'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Headphones,
  Settings,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { voiceService, type SpeechRecognitionResult } from '@/services/voice-service'
import { enhancedVoiceService, type RealTimeVoiceMetrics } from '@/services/voice-service-enhanced'
import { useToast } from '@/components/common/Toast'
import { errorHandler } from '@/services/error-handling.service'

interface VoiceControlsProps {
  onVoiceInput?: (text: string) => void
  onVoicePlayback?: (text: string) => void
  onPronunciationRequest?: (text: string) => void
  language?: string
  isActive?: boolean
  showAdvancedFeatures?: boolean
  className?: string
}

export function VoiceControls({
  onVoiceInput,
  onVoicePlayback,
  onPronunciationRequest,
  language = 'fr-FR',
  isActive = true,
  showAdvancedFeatures = false,
  className = ''
}: VoiceControlsProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [transcriptionResult, setTranscriptionResult] = useState<SpeechRecognitionResult | null>(null)
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeVoiceMetrics | null>(null)
  const [voiceSettings, setVoiceSettings] = useState({
    autoSpeak: true,
    pronunciationFeedback: true,
    backgroundNoise: false
  })
  const [listeningDuration, setListeningDuration] = useState(0)
  const [extendedListening, setExtendedListening] = useState(false)
  const { error: showError, warning, success } = useToast()

  useEffect(() => {
    setVoiceSupported(voiceService.isVoiceSupported())
    
    // Simulate audio level changes when recording
    let audioLevelInterval: NodeJS.Timeout
    let metricsInterval: NodeJS.Timeout
    let durationInterval: NodeJS.Timeout
    
    if (isRecording) {
      // Audio level animation
      audioLevelInterval = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 5))
      }, 200)
      
      // Duration counter for extended listening
      durationInterval = setInterval(() => {
        setListeningDuration(prev => prev + 1)
      }, 1000)
      
      // Update real-time metrics if advanced features are enabled
      if (showAdvancedFeatures) {
        metricsInterval = setInterval(() => {
          const metrics = enhancedVoiceService.analyzeRealTimeVoiceMetrics()
          setRealTimeMetrics(metrics)
        }, 500)
      }
    } else {
      // Reset duration when not recording
      setListeningDuration(0)
    }
    
    return () => {
      if (audioLevelInterval) clearInterval(audioLevelInterval)
      if (metricsInterval) clearInterval(metricsInterval)
      if (durationInterval) clearInterval(durationInterval)
    }
  }, [isRecording, showAdvancedFeatures])

  const startRecording = async () => {
    if (!voiceSupported || !isActive) return

    try {
      setIsRecording(true)
      setExtendedListening(true)
      setListeningDuration(0)
      
      // Show initial feedback to user
      success(
        'Listening Started',
        'Speak clearly. I\'m listening for up to 30 seconds.',
        { duration: 3000 }
      )
      
      await voiceService.startListening(
        language,
        (result) => {
          // Handle result callback
          if (result.transcript) {
            setTranscriptionResult(result)
            
            // Auto-extend listening if user is still speaking
            if (!result.isFinal && result.transcript.length > 5) {
              setExtendedListening(true)
            }
            
            if (result.isFinal) {
              onVoiceInput?.(result.transcript)
              
              // Show success feedback for good transcription
              if (result.confidence && result.confidence > 0.7) {
                success(
                  'Great Pronunciation!',
                  `Recognized: "${result.transcript}"`,
                  { duration: 4000 }
                )
              }
              
              // Provide pronunciation feedback if enabled
              if (voiceSettings.pronunciationFeedback && result.confidence) {
                setTimeout(() => {
                  setTranscriptionResult(null)
                }, 3000)
              }
              
              // Auto-restart listening if in extended mode and user wants to continue
              if (extendedListening && listeningDuration < 30) {
                setTimeout(() => {
                  if (!isRecording) {
                    startRecording()
                  }
                }, 1000)
              }
            }
          }
        },
        () => {
          // Handle end callback
          setIsRecording(false)
          setExtendedListening(false)
        }
      )
    } catch (error) {
      console.error('Recording error:', error)
      
      // Handle error with service
      const handledError = errorHandler.handleError(error as Error, {
        logToConsole: true,
        showToast: false // We'll handle toast manually
      })

      // Show user-friendly error message based on error type
      if (handledError.type === 'permission') {
        showError(
          'Microphone Access Denied',
          'Please allow microphone access to use voice features.',
          {
            action: {
              label: 'Settings',
              onClick: () => window.open('https://support.google.com/chrome/answer/2693767', '_blank')
            }
          }
        )
      } else if (handledError.type === 'network') {
        warning(
          'Voice Service Unavailable',
          'Voice recognition is temporarily unavailable. Try again later.'
        )
      } else {
        showError(
          'Voice Error',
          handledError.details || 'Unable to start voice recording. Please try again.'
        )
      }
      
      setIsRecording(false)
      setExtendedListening(false)
    }
  }

  const stopRecording = () => {
    voiceService.stopListening()
    setIsRecording(false)
    setExtendedListening(false)
    setListeningDuration(0)
    
    // Provide feedback to user
    success(
      'Listening Stopped',
      'Thank you! I heard what you said.',
      { duration: 2000 }
    )
  }

  const playText = async (text: string) => {
    if (!voiceSupported || !text) return

    try {
      setIsPlaying(true)
      await voiceService.speakText(text, { language })
      onVoicePlayback?.(text)
    } catch (error) {
      console.error('Playback error:', error)
      
      // Handle playback errors
      const handledError = errorHandler.handleError(error as Error, {
        logToConsole: true,
        showToast: false
      })

      // Show contextual error message
      if (handledError.type === 'client') {
        warning(
          'Audio Not Supported',
          'Your browser doesn\'t support text-to-speech. Try a different browser.'
        )
      } else {
        warning(
          'Playback Failed',
          handledError.details || 'Unable to play audio. Please try again.'
        )
      }
    } finally {
      setIsPlaying(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500'
    if (confidence >= 0.6) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'Excellent'
    if (confidence >= 0.6) return 'Good'
    return 'Needs Practice'
  }

  if (!voiceSupported) {
    return (
      <Card className={`${className} opacity-50`}>
        <CardContent className="p-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <MicOff className="w-4 h-4" />
            <span>Voice not supported in this browser</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      className={`voice-controls p-4 bg-card border rounded-lg shadow-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Headphones className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Voice Controls</h3>
            <p className="text-xs text-muted-foreground">
              {voiceSupported ? 'Ready for voice interaction' : 'Voice not supported'}
            </p>
          </div>
        </div>
        
        {/* Voice Support Indicator */}
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${
            voiceSupported ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <Badge variant="outline" className="text-xs hidden sm:inline-flex">
            {voiceSupported ? 'Supported' : 'Unavailable'}
          </Badge>
        </div>
      </div>

      {!voiceSupported && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-sm text-destructive">
              Voice features are not supported in this browser
            </p>
          </div>
        </div>
      )}

      {/* Main Controls - Enhanced for Mobile */}
      <div className="space-y-4">
        {/* Recording Control */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Large Touch-Friendly Record Button for Mobile */}
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              className={`min-w-[3rem] min-h-[3rem] sm:min-w-[2.5rem] sm:min-h-[2.5rem] relative flex-shrink-0 ${
                !voiceSupported || !isActive ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!voiceSupported || !isActive}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5 sm:w-4 sm:h-4" />
              ) : (
                <Mic className="w-5 h-5 sm:w-4 sm:h-4" />
              )}
              {isRecording && (
                <motion.div
                  className="absolute inset-0 bg-red-500/20 rounded-md"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </Button>

            {/* Audio Level Indicator - Responsive */}
            {isRecording && (
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-1 sm:w-1 bg-primary rounded-full ${
                      i < audioLevel ? 'opacity-100' : 'opacity-30'
                    }`}
                    style={{ height: `${10 + i * 3}px` }}
                    animate={{ 
                      height: isRecording ? [`${10 + i * 3}px`, `${15 + i * 4}px`, `${10 + i * 3}px`] : `${10 + i * 3}px`
                    }}
                    transition={{ 
                      repeat: isRecording ? Infinity : 0, 
                      duration: 0.5 + i * 0.1 
                    }}
                  />
                ))}
              </div>
            )}

            {/* Status Badge - Hide on very small screens */}
            <Badge 
              variant={isActive ? "default" : "secondary"}
              className="text-xs hidden xs:inline-flex"
            >
              {isRecording ? 'Recording...' : isPlaying ? 'Playing...' : 'Ready'}
            </Badge>

            {/* Listening Timer - Show when recording */}
            {isRecording && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span>{Math.floor(listeningDuration / 60)}:{(listeningDuration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </Badge>
                {extendedListening && (
                  <Badge variant="secondary" className="text-xs">
                    Extended
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Mobile Status Text with Timer */}
          <div className="text-center sm:hidden">
            <p className="text-sm font-medium text-foreground">
              {isRecording ? (
                <div className="flex flex-col items-center gap-1">
                  <span>Recording...</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.floor(listeningDuration / 60)}:{(listeningDuration % 60).toString().padStart(2, '0')}
                    {extendedListening && ' (Extended)'}
                  </span>
                </div>
              ) : isPlaying ? 'Playing...' : 'Tap to Record'}
            </p>
          </div>

          {/* Settings Button - Responsive */}
          <Button
            size="sm"
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={() => {
              setVoiceSettings(prev => ({
                ...prev,
                pronunciationFeedback: !prev.pronunciationFeedback
              }))
            }}
          >
            <Settings className="w-4 h-4 mr-2" />
            <span className="sm:hidden">Voice Settings</span>
          </Button>
        </div>

        {/* Transcription Result */}
        <AnimatePresence>
          {transcriptionResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Transcription:</span>
                      {transcriptionResult.confidence && (
                        <div className="flex items-center space-x-1">
                          {transcriptionResult.confidence >= 0.8 ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-yellow-500" />
                          )}
                          <span className={`text-xs ${getConfidenceColor(transcriptionResult.confidence)}`}>
                            {getConfidenceLabel(transcriptionResult.confidence)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-foreground bg-background p-2 rounded border">
                      &ldquo;{transcriptionResult.transcript}&rdquo;
                    </p>

                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => playText(transcriptionResult.transcript)}
                        disabled={isPlaying}
                        className="flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" />
                        {isPlaying ? 'Playing...' : 'Play Back'}
                      </Button>
                      
                      {voiceSettings.pronunciationFeedback && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (onPronunciationRequest && transcriptionResult) {
                              onPronunciationRequest(transcriptionResult.transcript)
                            }
                          }}
                          className="flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3" />
                          Analyze
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-time Voice Metrics (Advanced Features) */}
        {showAdvancedFeatures && isRecording && realTimeMetrics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <Card className="bg-blue-50/50 dark:bg-blue-900/10">
              <CardContent className="p-3">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Real-time Analysis:</span>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Speech Rate:</span>
                      <span>{Math.round(realTimeMetrics.speechRate)} WPM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Clarity:</span>
                      <span className={getConfidenceColor(realTimeMetrics.clarity / 100)}>
                        {Math.round(realTimeMetrics.clarity)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tone:</span>
                      <Badge variant="outline" className="text-xs">
                        {realTimeMetrics.emotionalTone}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Volume:</span>
                      <div className="w-12 h-2 bg-muted rounded-full">
                        <motion.div 
                          className="bg-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${realTimeMetrics.volumeLevel}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setVoiceSettings(prev => ({ ...prev, autoSpeak: !prev.autoSpeak }))}
              className={`flex items-center space-x-1 ${voiceSettings.autoSpeak ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Volume2 className="w-3 h-3" />
              <span>Auto-speak</span>
            </button>
            
            <button
              onClick={() => setVoiceSettings(prev => ({ ...prev, pronunciationFeedback: !prev.pronunciationFeedback }))}
              className={`flex items-center space-x-1 ${voiceSettings.pronunciationFeedback ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Zap className="w-3 h-3" />
              <span>Feedback</span>
            </button>
          </div>

          <div className="flex items-center space-x-1 text-muted-foreground">
            <Headphones className="w-3 h-3" />
            <span>Voice AI</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
