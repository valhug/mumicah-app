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

export class VoiceService {
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

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      this.recognition.onend = () => {
        if (onEnd) onEnd()
      }

      this.recognition.start()
    })
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop()
    }
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  // Get available voices for a language
  getAvailableVoices(language?: string): SpeechSynthesisVoice[] {
    if (!this.synthesis) return []

    const voices = this.synthesis.getVoices()
    
    if (language) {
      return voices.filter(voice => voice.lang.startsWith(language))
    }
    
    return voices
  }

  // Check if voice services are supported
  isVoiceSupported(): boolean {
    return this.isSupported
  }

  // Get pronunciation feedback (simplified)
  async analyzePronunciation(
    originalText: string,
    spokenText: string
  ): Promise<{
    accuracy: number
    feedback: string[]
    suggestions: string[]
  }> {
    // Simple pronunciation analysis based on text similarity
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

  private calculateTextSimilarity(text1: string, text2: string): number {
    // Simple Levenshtein distance-based similarity
    const distance = this.levenshteinDistance(text1, text2)
    const maxLength = Math.max(text1.length, text2.length)
    return maxLength === 0 ? 1 : 1 - distance / maxLength
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator   // substitution
        )
      }
    }

    return matrix[str2.length][str1.length]
  }
}

// Singleton instance
export const voiceService = new VoiceService()
