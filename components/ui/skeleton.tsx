import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <Skeleton className="h-48 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[600px] w-full">
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-12 w-96" />
          <Skeleton className="mx-auto h-6 w-64" />
          <div className="flex justify-center space-x-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ThematicDiscoveriesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 text-center">
            <Skeleton className="mx-auto h-16 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function EventsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-64 w-80" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  );
}

export function PartnersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex space-x-8 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-32 flex-shrink-0" />
        ))}
      </div>
    </div>
  );
}

export function NewsletterSkeleton() {
  return (
    <div className="rounded-lg bg-muted/50 p-8">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto h-4 w-96" />
        <div className="flex justify-center space-x-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}