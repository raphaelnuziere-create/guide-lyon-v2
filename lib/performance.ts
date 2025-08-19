export function measurePerformance(name: string) {
  if (typeof window === 'undefined') return
  
  const startMark = `${name}-start`
  const endMark = `${name}-end`
  const measureName = `${name}-duration`
  
  performance.mark(startMark)
  
  return () => {
    performance.mark(endMark)
    performance.measure(measureName, startMark, endMark)
    
    const measure = performance.getEntriesByName(measureName)[0]
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱ ${name}: ${measure.duration.toFixed(2)}ms`)
    }
    
    performance.clearMarks(startMark)
    performance.clearMarks(endMark)
    performance.clearMeasures(measureName)
    
    return measure.duration
  }
}

export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    console.log(metric)
    
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      navigationType: metric.navigationType,
      url: window.location.href,
      userAgent: navigator.userAgent,
    })
    
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body)
    } else {
      fetch('/api/analytics/vitals', {
        method: 'POST',
        body,
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }
}

export class PerformanceObserver {
  private observer: globalThis.PerformanceObserver | null = null
  
  observe() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }
    
    try {
      this.observer = new window.PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            console.log('Navigation timing:', {
              domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
              loadComplete: entry.loadEventEnd - entry.loadEventStart,
              domInteractive: entry.domInteractive,
              firstByte: entry.responseStart - entry.requestStart,
            })
          }
          
          if (entry.entryType === 'resource') {
            const isSlowResource = entry.duration > 1000
            
            if (isSlowResource) {
              console.warn(`Slow resource: ${entry.name} (${entry.duration.toFixed(2)}ms)`)
            }
          }
        }
      })
      
      this.observer.observe({ entryTypes: ['navigation', 'resource'] })
    } catch (error) {
      console.error('Failed to setup PerformanceObserver:', error)
    }
  }
  
  disconnect() {
    this.observer?.disconnect()
  }
}

export function lazyLoad<T>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    delay?: number
    onError?: (error: Error) => void
  }
): Promise<T> {
  const { delay = 0, onError } = options || {}
  
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      importFn()
        .then((module) => resolve(module.default))
        .catch((error) => {
          if (onError) {
            onError(error)
          }
          reject(error)
        })
    }, delay)
    
    return () => clearTimeout(timer)
  })
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}