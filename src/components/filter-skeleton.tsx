import { Skeleton } from "@/components/ui/skeleton"

export default function FilterSkeleton() {
  return (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      {/* Title Skeleton */}
      <Skeleton className="h-8 w-2/5" />

      {/* Sort By Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Skeleton className="h-px w-full" />
      
      {/* Filter Skeletons */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
