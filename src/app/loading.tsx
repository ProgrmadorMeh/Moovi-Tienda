
import ProductCardSkeleton from "@/components/product-card-skeleton";
import FilterSkeleton from "@/components/filter-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <Skeleton className="h-[60vh] min-h-[500px] w-full" />
      
      <div id="product-catalog" className="container mx-auto px-4 py-12">
        <div className="py-12 md:py-16">
          {/* Tabs Skeleton */}
          <Skeleton className="mb-8 grid h-[46px] w-full grid-cols-2 rounded-md p-1 md:grid-cols-4" />
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <aside className="lg:col-span-1">
              <div className="sticky top-20">
                <FilterSkeleton />
              </div>
            </aside>
            <main className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
