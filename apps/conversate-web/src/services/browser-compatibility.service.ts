'use client'

// Browser compatibility and polyfill service
export interface BrowserFeature {
  name: string
  supported: boolean
  polyfillAvailable: boolean
  fallbackStrategy?: string
}

export interface BrowserInfo {
  name: string
  version: string
  platform: string
  mobile: boolean
  features: BrowserFeature[]
  recommendedAction?: 'continue' | 'warn' | 'upgrade'
}

class BrowserCompatibilityService {
  private features: BrowserFeature[] = []
  private browserInfo: BrowserInfo | null = null

  // Initialize browser detection and feature checking
  init(): BrowserInfo {
    if (this.browserInfo) {
      return this.browserInfo
    }

    this.browserInfo = this.detectBrowser()
    this.features = this.checkFeatures()
    this.browserInfo.features = this.features
    this.browserInfo.recommendedAction = this.getRecommendedAction()

    return this.browserInfo
  }

  // Detect browser type and version
  private detectBrowser(): BrowserInfo {
    const userAgent = navigator.userAgent
    const platform = navigator.platform
    const mobile = /Mobi|Android/i.test(userAgent)

    let name = 'Unknown'
    let version = 'Unknown'

    // Chrome
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      name = 'Chrome'
      const match = userAgent.match(/Chrome\/(\d+)\./)
      version = match ? match[1] : 'Unknown'
    }
    // Firefox
    else if (userAgent.includes('Firefox')) {
      name = 'Firefox'
      const match = userAgent.match(/Firefox\/(\d+)\./)
      version = match ? match[1] : 'Unknown'
    }
    // Safari
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      name = 'Safari'
      const match = userAgent.match(/Version\/(\d+)\./)
      version = match ? match[1] : 'Unknown'
    }
    // Edge
    else if (userAgent.includes('Edg')) {
      name = 'Edge'
      const match = userAgent.match(/Edg\/(\d+)\./)
      version = match ? match[1] : 'Unknown'
    }
    // Internet Explorer
    else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
      name = 'Internet Explorer'
      const match = userAgent.match(/(?:MSIE |rv:)(\d+)\./)
      version = match ? match[1] : 'Unknown'
    }

    return {
      name,
      version,
      platform,
      mobile,
      features: []
    }
  }

  // Check for essential features
  private checkFeatures(): BrowserFeature[] {
    const features: BrowserFeature[] = []

    // Essential APIs
    features.push({
      name: 'Fetch API',
      supported: typeof fetch !== 'undefined',
      polyfillAvailable: true,
      fallbackStrategy: 'Use XMLHttpRequest'
    })

    features.push({
      name: 'Promises',
      supported: typeof Promise !== 'undefined',
      polyfillAvailable: true,
      fallbackStrategy: 'Use callbacks'
    })

    features.push({
      name: 'Local Storage',
      supported: typeof localStorage !== 'undefined',
      polyfillAvailable: false,
      fallbackStrategy: 'Use session storage or cookies'
    })

    features.push({
      name: 'Session Storage',
      supported: typeof sessionStorage !== 'undefined',
      polyfillAvailable: false,
      fallbackStrategy: 'Use cookies'
    })

    // Modern JavaScript features
    features.push({
      name: 'Arrow Functions',
      supported: this.checkArrowFunctions(),
      polyfillAvailable: false,
      fallbackStrategy: 'Use function expressions'
    })

    features.push({
      name: 'Async/Await',
      supported: this.checkAsyncAwait(),
      polyfillAvailable: false,
      fallbackStrategy: 'Use Promises'
    })

    features.push({
      name: 'Destructuring',
      supported: this.checkDestructuring(),
      polyfillAvailable: false,
      fallbackStrategy: 'Use explicit variable assignment'
    })

    // CSS features
    features.push({
      name: 'CSS Grid',
      supported: this.checkCSSGrid(),
      polyfillAvailable: false,
      fallbackStrategy: 'Use Flexbox or floats'
    })

    features.push({
      name: 'CSS Flexbox',
      supported: this.checkFlexbox(),
      polyfillAvailable: false,
      fallbackStrategy: 'Use table or float layouts'
    })

    features.push({
      name: 'CSS Custom Properties',
      supported: this.checkCSSCustomProperties(),
      polyfillAvailable: true,
      fallbackStrategy: 'Use fixed CSS values'
    })

    // Web APIs
    features.push({
      name: 'Intersection Observer',
      supported: typeof IntersectionObserver !== 'undefined',
      polyfillAvailable: true,
      fallbackStrategy: 'Use scroll events'
    })

    features.push({
      name: 'Speech Synthesis',
      supported: typeof speechSynthesis !== 'undefined',
      polyfillAvailable: false,
      fallbackStrategy: 'Disable voice features'
    })

    features.push({
      name: 'Speech Recognition',
      supported: typeof window.SpeechRecognition !== 'undefined' || typeof window.webkitSpeechRecognition !== 'undefined',
      polyfillAvailable: false,
      fallbackStrategy: 'Use text input only'
    })

    features.push({
      name: 'Web Workers',
      supported: typeof Worker !== 'undefined',
      polyfillAvailable: false,
      fallbackStrategy: 'Run on main thread'
    })

    features.push({
      name: 'Service Workers',
      supported: 'serviceWorker' in navigator,
      polyfillAvailable: false,
      fallbackStrategy: 'No offline support'
    })

    // Media APIs
    features.push({
      name: 'Media Queries',
      supported: typeof window.matchMedia !== 'undefined',
      polyfillAvailable: true,
      fallbackStrategy: 'Use fixed layouts'
    })

    features.push({
      name: 'getUserMedia',
      supported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      polyfillAvailable: false,
      fallbackStrategy: 'Disable camera/microphone features'
    })

    return features
  }

  // Feature detection methods
  private checkArrowFunctions(): boolean {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const test = () => {}
      return true
    } catch {
      return false
    }
  }

  private checkAsyncAwait(): boolean {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const test = async () => await Promise.resolve()
      return true
    } catch {
      return false
    }
  }

  private checkDestructuring(): boolean {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { test } = { test: true }
      return true
    } catch {
      return false
    }
  }

  private checkCSSGrid(): boolean {
    const testElement = document.createElement('div')
    testElement.style.display = 'grid'
    return testElement.style.display === 'grid'
  }

  private checkFlexbox(): boolean {
    const testElement = document.createElement('div')
    testElement.style.display = 'flex'
    return testElement.style.display === 'flex'
  }

  private checkCSSCustomProperties(): boolean {
    return window.CSS && window.CSS.supports && window.CSS.supports('--test', '0')
  }

  // Determine recommended action based on browser support
  private getRecommendedAction(): 'continue' | 'warn' | 'upgrade' {
    const criticalFeatures = this.features.filter(f => 
      ['Fetch API', 'Promises', 'Local Storage'].includes(f.name)
    )
    
    const unsupportedCritical = criticalFeatures.filter(f => !f.supported)
    
    if (unsupportedCritical.length > 0) {
      return 'upgrade'
    }

    const modernFeatures = this.features.filter(f => 
      ['CSS Grid', 'Async/Await', 'Speech Recognition'].includes(f.name)
    )
    
    const unsupportedModern = modernFeatures.filter(f => !f.supported)
    
    if (unsupportedModern.length > 2) {
      return 'warn'
    }

    return 'continue'
  }

  // Load polyfills for missing features
  async loadPolyfills(): Promise<void> {
    const polyfillsToLoad: string[] = []

    // Check for features that need polyfills
    this.features.forEach(feature => {
      if (!feature.supported && feature.polyfillAvailable) {
        switch (feature.name) {
          case 'Fetch API':
            polyfillsToLoad.push('fetch')
            break
          case 'Promises':
            polyfillsToLoad.push('es6-promise')
            break
          case 'Intersection Observer':
            polyfillsToLoad.push('intersection-observer')
            break
          case 'CSS Custom Properties':
            polyfillsToLoad.push('css-vars-ponyfill')
            break
        }
      }
    })

    // Load polyfills dynamically
    for (const polyfill of polyfillsToLoad) {
      try {
        await this.loadPolyfill(polyfill)
        console.log(`Polyfill loaded: ${polyfill}`)
      } catch (error) {
        console.warn(`Failed to load polyfill: ${polyfill}`, error)
      }
    }
  }

  private async loadPolyfill(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load ${name}`))
      
      // In a real app, you'd load from a CDN or local files
      switch (name) {
        case 'fetch':
          script.src = 'https://polyfill.io/v3/polyfill.min.js?features=fetch'
          break
        case 'es6-promise':
          script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6'
          break
        case 'intersection-observer':
          script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver'
          break
        case 'css-vars-ponyfill':
          script.src = 'https://cdn.jsdelivr.net/npm/css-vars-ponyfill@2'
          break
        default:
          reject(new Error(`Unknown polyfill: ${name}`))
          return
      }
      
      document.head.appendChild(script)
    })
  }

  // Apply fallback strategies
  applyFallbacks(): void {
    this.features.forEach(feature => {
      if (!feature.supported && feature.fallbackStrategy) {
        switch (feature.name) {
          case 'CSS Grid':
            this.applyCSSGridFallback()
            break
          case 'Speech Synthesis':
            this.applySpeechFallback()
            break
          case 'getUserMedia':
            this.applyMediaFallback()
            break
        }
      }
    })
  }

  private applyCSSGridFallback(): void {
    // Add fallback CSS classes
    document.documentElement.classList.add('no-grid')
    
    // You would include fallback CSS like:
    // .no-grid .grid-container { display: flex; flex-wrap: wrap; }
  }

  private applySpeechFallback(): void {
    // Disable speech features in the app
    document.documentElement.classList.add('no-speech')
  }

  private applyMediaFallback(): void {
    // Disable camera/microphone features
    document.documentElement.classList.add('no-media')
  }

  // Get compatibility report
  getCompatibilityReport(): {
    browser: BrowserInfo
    supported: BrowserFeature[]
    unsupported: BrowserFeature[]
    warnings: string[]
  } {
    const supported = this.features.filter(f => f.supported)
    const unsupported = this.features.filter(f => !f.supported)
    const warnings: string[] = []

    if (this.browserInfo?.name === 'Internet Explorer') {
      warnings.push('Internet Explorer is not officially supported. Consider upgrading to a modern browser.')
    }

    if (this.browserInfo?.name === 'Safari' && parseInt(this.browserInfo.version) < 12) {
      warnings.push('Your Safari version may have limited functionality. Consider updating.')
    }

    unsupported.forEach(feature => {
      warnings.push(`${feature.name} is not supported. ${feature.fallbackStrategy || 'Some features may not work.'}`)
    })

    return {
      browser: this.browserInfo!,
      supported,
      unsupported,
      warnings
    }
  }

  // Check if browser meets minimum requirements
  meetsMinimumRequirements(): boolean {
    const requiredFeatures = ['Fetch API', 'Promises', 'Local Storage']
    return requiredFeatures.every(featureName => 
      this.features.find(f => f.name === featureName)?.supported
    )
  }

  // Get recommended polyfills
  getRecommendedPolyfills(): string[] {
    return this.features
      .filter(f => !f.supported && f.polyfillAvailable)
      .map(f => f.name)
  }
}

// Export singleton instance
export const browserCompatibility = new BrowserCompatibilityService()

// Initialize on module load
if (typeof window !== 'undefined') {
  browserCompatibility.init()
}
