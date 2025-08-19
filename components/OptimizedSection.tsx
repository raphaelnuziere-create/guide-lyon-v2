'use client'

import { ReactNode, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useLazyLoad } from '@/hooks/useIntersectionObserver'

interface OptimizedSectionProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  loadOnce?: boolean
  priority?: boolean
}

export function OptimizedSection({
  children,
  fallback,
  className = '',
  threshold = 0.1,
  rootMargin = '100px',
  loadOnce = true,
  priority = false,
}: OptimizedSectionProps) {
  const [ref, isVisible] = useLazyLoad(undefined, {
    threshold,
    rootMargin,
    freezeOnceVisible: loadOnce,
  })

  if (priority) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <Suspense fallback={fallback || <SectionSkeleton />}>
          {children}
        </Suspense>
      ) : (
        fallback || <SectionSkeleton />
      )}
    </div>
  )
}

function SectionSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 rounded-lg"></div>
    </div>
  )
}

// Dynamic import helper with loading state
export function createDynamicComponent<P = {}>(
  loader: () => Promise<{ default: React.ComponentType<P> }>,
  options?: {
    loading?: React.ComponentType
    ssr?: boolean
  }
) {
  return dynamic(loader, {
    loading: options?.loading || (() => <ComponentSkeleton />),
    ssr: options?.ssr ?? true,
  })
}

function ComponentSkeleton() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
}

// Preload critical components
export function preloadComponent(
  loader: () => Promise<any>
) {
  if (typeof window !== 'undefined') {
    // Start loading the component in the background
    loader()
  }
}

// Code splitting helper for routes
export function lazyRoute(
  loader: () => Promise<{ default: React.ComponentType<any> }>
) {
  return dynamic(loader, {
    loading: () => <RouteSkeleton />,
    ssr: true,
  })
}

function RouteSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  )
}