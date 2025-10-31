'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/hero-section';
import ProductSections from "@/components/product-sections";
import { getCellphonesCached, getAccessoriesCached } from "@/lib/data";
import type { Cellphone, Accessory } from "@/lib/types";
import { Loader2 } from 'lucide-react';

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
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <span className="ml-4 text-xl">Cargando productos...</span>
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
