'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

// Performance monitoring hook
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    componentMounts: 0,
    memoryUsage: 0,
    networkRequests: 0
  })

  const renderStartTime = useRef<number | undefined>(undefined)
  const mountCount = useRef(0)

  useEffect(() => {
    mountCount.current += 1
    renderStartTime.current = performance.now()

    setMetrics(prev => ({
      ...prev,
      componentMounts: mountCount.current,
      renderTime: renderStartTime.current ? performance.now() - renderStartTime.current : 0
    }))

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memoryInfo = (performance as { memory: { usedJSHeapSize: number } }).memory
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memoryInfo.usedJSHeapSize / 1024 / 1024 // MB
      }))
    }
  }, []) // Empty dependency array to run only once

  return metrics
}

// Network request monitoring
export function useNetworkMonitor() {
  const [requests, setRequests] = useState<{
    pending: number
    completed: number
    failed: number
    totalTime: number
  }>({
    pending: 0,
    completed: 0,
    failed: 0,
    totalTime: 0
  })

  const trackRequest = useCallback((url: string, options?: RequestInit) => {
    const startTime = performance.now()
    
    setRequests(prev => ({ ...prev, pending: prev.pending + 1 }))

    return fetch(url, options)
      .then(response => {
        const endTime = performance.now()
        setRequests(prev => ({
          ...prev,
          pending: prev.pending - 1,
          completed: prev.completed + 1,
          totalTime: prev.totalTime + (endTime - startTime)
        }))
        return response
      })
      .catch(error => {
        const endTime = performance.now()
        setRequests(prev => ({
          ...prev,
          pending: prev.pending - 1,
          failed: prev.failed + 1,
          totalTime: prev.totalTime + (endTime - startTime)
        }))
        throw error
      })
  }, [])

  return { requests, trackRequest }
}

// Image lazy loading hook
export function useLazyLoading() {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return { ref, isIntersecting, isLoaded, handleLoad }
}

// Debounced search hook for performance
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: {
  items: T[]
  itemHeight: number
  containerHeight: number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  )

  const startIndex = Math.max(0, visibleStart - overscan)
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan)

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex
  }
}

// Error retry hook with exponential backoff
export function useRetry() {
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const retry = useCallback(async <T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> => {
    setIsRetrying(true)
    
    try {
      const result = await fn()
      setRetryCount(0)
      setIsRetrying(false)
      return result
    } catch (error) {
      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount)
        await new Promise(resolve => setTimeout(resolve, delay))
        setRetryCount(prev => prev + 1)
        return retry(fn, maxRetries, baseDelay)
      } else {
        setIsRetrying(false)
        throw error
      }
    }
  }, [retryCount])

  const reset = useCallback(() => {
    setRetryCount(0)
    setIsRetrying(false)
  }, [])

  return { retry, retryCount, isRetrying, reset }
}

// Memory efficient state hook
export function useOptimizedState<T>(initialState: T) {
  const [state, setState] = useState(initialState)
  const previousValue = useRef(initialState)

  const optimizedSetState = useCallback((newState: T | ((prev: T) => T)) => {
    setState(prev => {
      const nextState = typeof newState === 'function' ? (newState as (prev: T) => T)(prev) : newState
      
      // Only update if value actually changed (shallow comparison)
      if (JSON.stringify(nextState) !== JSON.stringify(previousValue.current)) {
        previousValue.current = nextState
        return nextState
      }
      
      return prev
    })
  }, [])

  return [state, optimizedSetState] as const
}

// Preload resources hook
export function usePreloadResources(resources: string[]) {
  const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set())
  const [failedResources, setFailedResources] = useState<Set<string>>(new Set())

  useEffect(() => {
    const preloadPromises = resources.map(async (resource) => {
      try {
        if (resource.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          // Preload images
          return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
              setLoadedResources(prev => new Set(prev).add(resource))
              resolve(resource)
            }
            img.onerror = () => {
              setFailedResources(prev => new Set(prev).add(resource))
              reject(new Error(`Failed to load image: ${resource}`))
            }
            img.src = resource
          })
        } else {
          // Preload other resources (CSS, JS, etc.)
          return fetch(resource, { method: 'HEAD' })
            .then(() => {
              setLoadedResources(prev => new Set(prev).add(resource))
              return resource
            })
            .catch(() => {
              setFailedResources(prev => new Set(prev).add(resource))
              throw new Error(`Failed to preload: ${resource}`)
            })
        }
      } catch {
        setFailedResources(prev => new Set(prev).add(resource))
        return null
      }
    })

    Promise.allSettled(preloadPromises)
  }, [resources])

  const progress = (loadedResources.size + failedResources.size) / resources.length
  const isComplete = loadedResources.size + failedResources.size === resources.length

  return {
    loadedResources,
    failedResources,
    progress,
    isComplete
  }
}
