import { useEffect, useRef, useState, RefObject } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [RefObject<HTMLDivElement>, boolean] {
  const { threshold = 0, root = null, rootMargin = '0px', freezeOnceVisible = false } = options
  
  const [isIntersecting, setIsIntersecting] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const frozen = useRef(false)

  useEffect(() => {
    const element = elementRef.current
    
    if (!element || frozen.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        
        setIsIntersecting(isElementIntersecting)
        
        if (freezeOnceVisible && isElementIntersecting) {
          frozen.current = true
          observer.disconnect()
        }
      },
      { threshold, root, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, freezeOnceVisible])

  return [elementRef, isIntersecting]
}

export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  onVisible?: () => void,
  options: UseIntersectionObserverOptions = {}
): [RefObject<T>, boolean] {
  const { threshold = 0, root = null, rootMargin = '50px', freezeOnceVisible = true } = options
  
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const elementRef = useRef<T>(null)

  useEffect(() => {
    const element = elementRef.current
    
    if (!element || hasBeenVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true)
          onVisible?.()
          
          if (freezeOnceVisible) {
            observer.disconnect()
          }
        }
      },
      { threshold, root, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, freezeOnceVisible, hasBeenVisible, onVisible])

  return [elementRef, hasBeenVisible]
}

export function useProgressiveImage(lowQualitySrc: string, highQualitySrc: string) {
  const [src, setSrc] = useState(lowQualitySrc)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setSrc(lowQualitySrc)
    setIsLoading(true)
    
    const img = new window.Image()
    
    img.onload = () => {
      setSrc(highQualitySrc)
      setIsLoading(false)
    }
    
    img.src = highQualitySrc
    
    return () => {
      img.onload = null
    }
  }, [lowQualitySrc, highQualitySrc])

  return { src, isLoading, blur: src === lowQualitySrc }
}