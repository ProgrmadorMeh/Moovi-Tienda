import { Skeleton } from "@/components/ui/skeleton"

export default function ProductCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-card shadow-sm flex flex-col">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full" />
      
      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          {/* Brand Skeleton */}
          <Skeleton className="h-5 w-1/4" />
          {/* Model Skeleton */}
          <Skeleton className="h-7 w-3/4 mt-2" />

          <div className="mt-4 space-y-2">
            {/* Price Skeleton */}
            <Skeleton className="h-8 w-1/2" />
            {/* Installments Skeleton */}
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
        
        <div className="mt-6">
            <div className="grid grid-cols-2 gap-2">
                {/* Button Skeletons */}
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            {/* Main Button Skeleton */}
            <Skeleton className="h-10 w-full mt-4" />
        </div>
      </div>
    </div>
  )
}
