import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function ProductLoadingSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl px-4 pt-24 pb-12">
      {/* Back Button Skeleton */}
      <div className="mb-4">
        <div className="flex items-center h-10 w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* --- IMAGE COLUMN SKELETON --- */}
        <div className="md:sticky md:top-24 md:self-start">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="mt-2 grid grid-cols-4 gap-2">
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="aspect-square w-full rounded-md" />
          </div>
        </div>

        {/* --- INFO AND PURCHASE COLUMN SKELETON --- */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="mt-2 h-12 w-3/4" />
            <Skeleton className="mt-3 h-5 w-1/3" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-6 w-4/5" />
          </div>

          <Skeleton className="h-px w-full" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>

          <div className="flex flex-col space-y-4 pt-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>

      {/* --- ADDITIONAL INFO SKELETON --- */}
      <div className="mt-16 space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
