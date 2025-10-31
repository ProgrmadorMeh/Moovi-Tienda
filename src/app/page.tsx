'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/hero-section';
import ProductSections from "@/components/product-sections";
import { getCellphonesCached, getAccessoriesCached } from "@/lib/data";
import type { Cellphone, Accessory } from "@/lib/types";
import ProductCardSkeleton from '@/components/product-card-skeleton';
import FilterSkeleton from '@/components/filter-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [productsData, setProductsData] = useState<Cellphone[]>([]);
  const [accessoriesData, setAccessoriesData] = useState<Accessory[]>([]);
  const [uniqueBrands, setUniqueBrands] = useState<string[]>([]);
  const [uniqueCapacities, setUniqueCapacities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [productsRes, accessoriesRes] = await Promise.all([
        getCellphonesCached(),
        getAccessoriesCached(),
      ]);

      setProductsData(productsRes);
      setAccessoriesData(accessoriesRes);
      
      const allFetchedProducts = [...productsRes, ...accessoriesRes];
      
      const brands = [...new Set(allFetchedProducts.map((p) => p.brand))];
      setUniqueBrands(brands);

      const capacities = [...new Set(productsRes.map((p) => p.capacity))].sort(
        (a, b) => parseInt(a) - parseInt(b)
      );
      setUniqueCapacities(capacities);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <>
        <HeroSection />
        <div id="product-catalog" className="container mx-auto px-4 py-12">
          <div className="py-12 md:py-16">
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

  return (
    <>
      <HeroSection />
      <div id="product-catalog" className="container mx-auto px-4 py-12">
        <ProductSections
          allProducts={productsData}
          featuredProducts={productsData.filter((p) => p.discount > 0)}
          discountedProducts={productsData.filter((p) => p.discount > 0)}
          accessories={accessoriesData}
          brands={uniqueBrands}
          capacityOptions={uniqueCapacities}
        />
      </div>
    </>
  );
}
