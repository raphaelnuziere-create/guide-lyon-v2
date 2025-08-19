'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  quality?: number
  sizes?: string
  onLoad?: () => void
  fill?: boolean
  style?: React.CSSProperties
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  quality = 75,
  sizes,
  onLoad,
  fill = false,
  style,
  objectFit = 'cover',
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [priority])

  const handleLoad = () => {
    setHasLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
  }

  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f6f7f8" offset="20%" />
          <stop stop-color="#edeef1" offset="50%" />
          <stop stop-color="#f6f7f8" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f6f7f8" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str)

  const defaultBlurDataURL = `data:image/svg+xml;base64,${toBase64(
    shimmer(width || 700, height || 475)
  )}`

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          ...style,
        }}
      >
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div
      ref={imageRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
        ...style,
      }}
    >
      {isInView ? (
        <>
          <Image
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            className={`transition-opacity duration-300 ${
              hasLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            quality={quality}
            sizes={sizes}
            placeholder={placeholder}
            blurDataURL={blurDataURL || defaultBlurDataURL}
            onLoad={handleLoad}
            onError={handleError}
            priority={priority}
            style={{
              objectFit: objectFit,
            }}
          />
          {!hasLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}