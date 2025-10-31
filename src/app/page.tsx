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
  const [allProducts, setAllProducts] = useState<Cellphone[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [capacityOptions, setCapacityOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [productsData, accessoriesData] = await Promise.all([
          getCellphonesCached(),
          getAccessoriesCached(),
        ]);

        const uniqueBrands = [...new Set(productsData.map((p) => p.brand))];
        const uniqueCapacities = [...new Set(productsData.map((p) => p.capacity))].sort(
          (a, b) => parseInt(a) - parseInt(b)
        );
        
        setAllProducts(productsData);
        setAccessories(accessoriesData);
        setBrands(uniqueBrands);
        setCapacityOptions(uniqueCapacities);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <HeroSection />
      <div id="product-catalog" className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div>
            <Skeleton className="h-[46px] w-full mb-8" />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              <aside className="lg:col-span-1">
                <FilterSkeleton />
              </aside>
              <main className="lg:col-span-3">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              </main>
            </div>
          </div>
        ) : (
          <ProductSections
            allProducts={allProducts}
            // Mantenemos la lógica original de destacados y ofertas
            featuredProducts={allProducts.filter((p) => p.discount > 0)}
            discountedProducts={allProducts.filter((p) => p.discount > 0)}
            accessories={accessories}
            brands={brands}
            capacityOptions={capacityOptions}
          />
        )}
      </div>
    </>
  );
}
