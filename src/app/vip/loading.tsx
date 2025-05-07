import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section Skeleton */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <Skeleton className="h-14 w-48 mx-auto rounded-lg" />
      </div>

      {/* Benefits Section Skeleton */}
      <div className="mb-16">
        <Skeleton className="h-10 w-64 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg p-6">
              <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-40 mx-auto mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* VIP Predictions Skeleton */}
      <div className="mb-16">
        <Skeleton className="h-10 w-64 mx-auto mb-6" />
        <Skeleton className="h-5 w-96 mx-auto mb-12" />
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <Skeleton className="h-10 w-64 rounded-lg" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-6 rounded-lg">
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section Skeleton */}
      <div>
        <Skeleton className="h-10 w-64 mx-auto mb-6" />
        <Skeleton className="h-5 w-96 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
