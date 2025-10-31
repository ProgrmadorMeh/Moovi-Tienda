import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 pt-32 animate-pulse">
      <Skeleton className="mb-8 h-10 w-1/2 mx-auto" />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        
        {/* Forms Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Info Skeleton */}
          <div className="rounded-lg border bg-transparent p-6">
            <Skeleton className="h-8 w-2/5 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2"> <Skeleton className="h-4 w-1/4" /> <Skeleton className="h-10 w-full" /> </div>
              <div className="space-y-2"> <Skeleton className="h-4 w-1/4" /> <Skeleton className="h-10 w-full" /> </div>
              <div className="space-y-2"> <Skeleton className="h-4 w-1/4" /> <Skeleton className="h-10 w-full" /> </div>
              <div className="md:col-span-2 space-y-2"> <Skeleton className="h-4 w-1/4" /> <Skeleton className="h-10 w-full" /> </div>
              <div className="flex items-end space-x-2">
                <div className="flex-grow space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-10 w-full" /></div>
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>

          {/* Shipping Method Skeleton */}
          <div className="rounded-lg border bg-transparent p-6">
            <Skeleton className="h-8 w-2/5 mb-6" />
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>

        {/* Summary Skeleton */}
        <div className="lg:col-span-1">
            <div className="sticky top-32 rounded-lg border bg-transparent p-6 shadow-lg">
              <Skeleton className="h-8 w-3/4 mb-6" />
              <div className="space-y-4">
                <div className="flex justify-between"><Skeleton className="h-5 w-1/4" /><Skeleton className="h-5 w-1/3" /></div>
                <div className="flex justify-between"><Skeleton className="h-5 w-1/4" /><Skeleton className="h-5 w-1/3" /></div>
                <Skeleton className="h-px w-full" />
                <div className="flex justify-between"><Skeleton className="h-7 w-1/3" /><Skeleton className="h-7 w-1/2" /></div>
              </div>
              <Skeleton className="h-12 w-full mt-6" />
            </div>
        </div>
      </div>
    </div>
  );
}
