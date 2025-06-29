'use client'

export interface VoiceConfig {
  language: string
  accent?: string
  speed?: number
  pitch?: number
}

export interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

export interface PronunciationFeedback {
  word: string
  expectedPronunciation: string
  actualPronunciation: string
  accuracy: number
  suggestions: string[]
  phonemes?: PhonemeAnalysis[]
}

export interface PhonemeAnalysis {
  phoneme: string
  expected: string
  actual: string
  accuracy: number
  feedback: string
}

export interface VoiceCoachingSession {
  id: string
  startTime: Date
  language: string
  targetPhrases: string[]
  completedPhrases: string[]
  overallAccuracy: number
  feedback: PronunciationFeedback[]
  recommendations: string[]
}

export interface RealTimeVoiceMetrics {
  volumeLevel: number
  speechRate: number
  pauseDuration: number
  clarity: number
  emotionalTone: 'neutral' | 'confident' | 'hesitant' | 'excited'
}

// Speech Recognition types
interface SpeechRecognitionInterface {
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent {
  error: string
}

interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResultItem
}

interface SpeechRecognitionResultItem {
  isFinal: boolean
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

declare global {
  interface Window {
    SpeechRecognition?: new() => SpeechRecognitionInterface
    webkitSpeechRecognition?: new() => SpeechRecognitionInterface
  }
}

export class EnhancedVoiceService {
  private synthesis: SpeechSynthesis | null = null
  private recognition: SpeechRecognitionInterface | null = null
  private isSupported: boolean = false

  constructor() {
    this.initializeVoiceServices()
  }

  private initializeVoiceServices() {
    // Check for browser support
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis || null
      
      // Initialize Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.setupRecognition()
      }
      
      this.isSupported = !!(this.synthesis && this.recognition)
    }
  }

  private setupRecognition() {
    if (!this.recognition) return

    this.recognition.continuous = false
    this.recognition.interimResults = true
    this.recognition.maxAlternatives = 1
  }

  // Text-to-Speech
  async speakText(
    text: string, 
    config: VoiceConfig = { language: 'fr-FR' }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      
      // Configure voice
      const voices = this.synthesis.getVoices()
      const voice = voices.find(v => v.lang.startsWith(config.language)) || voices[0]
      
      if (voice) {
        utterance.voice = voice
      }
      
      utterance.lang = config.language
      utterance.rate = config.speed || 0.9
      utterance.pitch = config.pitch || 1.0

      utterance.onend = () => resolve()
      utterance.onerror = (error) => reject(error)

      this.synthesis.speak(utterance)
    })
  }

  // Speech-to-Text
  async startListening(
    language: string = 'fr-FR',
    onResult?: (result: SpeechRecognitionResult) => void,
    onEnd?: () => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'))
        return
      }

      this.recognition.lang = language

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.results.length - 1]
        const transcript = result[0].transcript
        const confidence = result[0].confidence

        if (onResult) {
          onResult({
            transcript,
            confidence,
            isFinal: result.isFinal
          })
        }

        if (result.isFinal) {
          resolve()
        }
      }

      this.recognition.onerror = (error: SpeechRecognitionErrorEvent) => {
        reject(new Error(error.error))
      }

      this.recognition.onend = () => {
        if (onEnd) onEnd()
      }

      this.recognition.start()
    })
  }

  // Stop listening
  stopListening() {
    if (this.recognition) {
      this.recognition.stop()
    }
  }

  // Check if voice services are supported
  isVoiceSupported(): boolean {
    return this.isSupported
  }

  // Basic pronunciation analysis
  async analyzePronunciation(
    originalText: string,
    spokenText: string
  ): Promise<{
    accuracy: number
    feedback: string[]
    suggestions: string[]
  }> {
    const similarity = this.calculateTextSimilarity(originalText.toLowerCase(), spokenText.toLowerCase())
    
    const feedback: string[] = []
    const suggestions: string[] = []

    if (similarity > 0.9) {
      feedback.push('Excellent pronunciation! 🎉')
    } else if (similarity > 0.7) {
      feedback.push('Good pronunciation with minor improvements needed')
      suggestions.push('Try speaking a bit slower for clarity')
    } else if (similarity > 0.5) {
      feedback.push('Pronunciation needs some work')
      suggestions.push('Focus on clear articulation of each syllable')
      suggestions.push('Practice with the audio model first')
    } else {
      feedback.push('Let\'s work on pronunciation together')
      suggestions.push('Listen to the pronunciation example')
      suggestions.push('Break down the word syllable by syllable')
    }

    return {
      accuracy: Math.round(similarity * 100),
      feedback,
      suggestions
    }
  }

  // Advanced Pronunciation Feedback
  async analyzeAdvancedPronunciation(
    targetWord: string,
    spokenWord: string,
    language: string = 'fr-FR'
  ): Promise<PronunciationFeedback> {
    const similarity = this.calculateTextSimilarity(targetWord.toLowerCase(), spokenWord.toLowerCase())
    const accuracy = Math.round(similarity * 100)

    // Mock phoneme analysis
    const phonemes: PhonemeAnalysis[] = this.analyzePhonemes(targetWord, spokenWord)

    const suggestions: string[] = []
    if (accuracy < 70) {
      suggestions.push('Try speaking more slowly')
      suggestions.push('Focus on vowel sounds')
      suggestions.push('Practice tongue placement')
    } else if (accuracy < 85) {
      suggestions.push('Great progress! Work on consonant clarity')
      suggestions.push('Pay attention to syllable stress')
    }

    return {
      word: targetWord,
      expectedPronunciation: targetWord,
      actualPronunciation: spokenWord,
      accuracy,
      suggestions,
      phonemes
    }
  }

  // Voice Coaching Session
  startVoiceCoachingSession(
    language: string,
    targetPhrases: string[]
  ): VoiceCoachingSession {
    return {
      id: `session-${Date.now()}`,
      startTime: new Date(),
      language,
      targetPhrases,
      completedPhrases: [],
      overallAccuracy: 0,
      feedback: [],
      recommendations: [
        'Speak clearly and at a moderate pace',
        'Focus on proper breathing',
        'Listen carefully to pronunciation examples'
      ]
    }
  }

  // Real-time Voice Metrics
  analyzeRealTimeVoiceMetrics(): RealTimeVoiceMetrics {
    // Mock data for demonstration
    return {
      volumeLevel: Math.random() * 100,
      speechRate: 120 + Math.random() * 60, // words per minute
      pauseDuration: Math.random() * 2000, // milliseconds
      clarity: 70 + Math.random() * 30, // percentage
      emotionalTone: this.detectEmotionalTone()
    }
  }

  // Pronunciation Practice
  async practicePronunciation(
    targetPhrase: string,
    language: string = 'fr-FR',
    onProgress?: (feedback: PronunciationFeedback) => void
  ): Promise<PronunciationFeedback[]> {
    const words = targetPhrase.split(' ')
    const feedbackList: PronunciationFeedback[] = []

    for (const word of words) {
      // Simulate user speaking the word
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user speech recognition result
      const spokenWord = this.simulateUserSpeech(word)
      
      const feedback = await this.analyzeAdvancedPronunciation(word, spokenWord, language)
      feedbackList.push(feedback)
      
      if (onProgress) {
        onProgress(feedback)
      }
    }

    return feedbackList
  }

  // Voice Training Recommendations
  generateVoiceTrainingPlan(
    currentLevel: 'beginner' | 'intermediate' | 'advanced',
    language: string,
    weakAreas: string[] = []
  ): string[] {
    const recommendations: string[] = []

    switch (currentLevel) {
      case 'beginner':
        recommendations.push('Practice basic vowel sounds daily')
        recommendations.push('Record yourself reading simple phrases')
        recommendations.push('Use slow, clear speech patterns')
        break
      case 'intermediate':
        recommendations.push('Work on consonant clusters')
        recommendations.push('Practice stress patterns in longer sentences')
        recommendations.push('Focus on rhythm and intonation')
        break
      case 'advanced':
        recommendations.push('Perfect subtle sound distinctions')
        recommendations.push('Practice natural connected speech')
        recommendations.push('Work on accent reduction if desired')
        break
    }

    // Add specific recommendations based on weak areas
    if (weakAreas.includes('vowels')) {
      recommendations.push('Spend extra time on vowel pronunciation drills')
    }
    if (weakAreas.includes('rhythm')) {
      recommendations.push('Practice with metronome for better rhythm')
    }

    return recommendations
  }

  // Helper methods
  private analyzePhonemes(expected: string, actual: string): PhonemeAnalysis[] {
    const phonemes: PhonemeAnalysis[] = []
    
    for (let i = 0; i < Math.min(expected.length, actual.length); i++) {
      const expectedChar = expected[i]
      const actualChar = actual[i]
      const accuracy = expectedChar === actualChar ? 100 : Math.random() * 60 + 20
      
      phonemes.push({
        phoneme: expectedChar,
        expected: expectedChar,
        actual: actualChar,
        accuracy: Math.round(accuracy),
        feedback: accuracy > 80 ? 'Good' : accuracy > 60 ? 'Needs work' : 'Practice more'
      })
    }
    
    return phonemes
  }

  private detectEmotionalTone(): RealTimeVoiceMetrics['emotionalTone'] {
    const tones: RealTimeVoiceMetrics['emotionalTone'][] = ['neutral', 'confident', 'hesitant', 'excited']
    return tones[Math.floor(Math.random() * tones.length)]
  }

  private simulateUserSpeech(targetWord: string): string {
    // Simulate some common pronunciation variations
    const variations = [
      targetWord, // perfect
      targetWord.replace(/th/g, 'z'), // common mistake
      targetWord.replace(/r/g, 'w'), // another common mistake
      targetWord.toLowerCase()
    ]
    return variations[Math.floor(Math.random() * variations.length)]
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    // Simple similarity calculation using character comparison
    const minLength = Math.min(text1.length, text2.length)
    const maxLength = Math.max(text1.length, text2.length)
    
    if (maxLength === 0) return 1
    
    let matches = 0
    for (let i = 0; i < minLength; i++) {
      if (text1[i] === text2[i]) {
        matches++
      }
    }
    
    return matches / maxLength
  }
}

// Create singleton instance
export const enhancedVoiceService = new EnhancedVoiceService()
