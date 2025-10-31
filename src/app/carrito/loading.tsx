import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function CartLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 pt-32 animate-pulse">
      <Skeleton className="mb-8 h-10 w-3/5 mx-auto" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row rounded-lg border bg-transparent p-4 sm:items-center sm:space-x-6">
              <Skeleton className="h-[100px] w-[100px] rounded-md self-start sm:self-center flex-shrink-0" />
              <div className="flex-1 mt-4 sm:mt-0">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2 mt-2" />
              </div>
              <div className="flex items-center justify-between sm:justify-end sm:space-x-8 mt-4 sm:mt-0">
                <Skeleton className="h-10 w-28 rounded-md" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Summary Skeleton */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 rounded-lg border bg-transparent p-6 shadow-lg">
            <Skeleton className="h-8 w-1/2 mb-6" />
            <div className="space-y-4">
              <div className="flex justify-between"><Skeleton className="h-5 w-1/4" /><Skeleton className="h-5 w-1/3" /></div>
              <div className="flex justify-between"><Skeleton className="h-5 w-1/4" /><Skeleton className="h-5 w-1/3" /></div>
              <Skeleton className="h-px w-full" />
              <div className="flex justify-between"><Skeleton className="h-7 w-1/3" /><Skeleton className="h-7 w-1/2" /></div>
            </div>
            <div className="mt-6 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <div className="flex space-x-2">
                    <Skeleton className="h-10 flex-grow" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
            <Skeleton className="h-12 w-full mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
