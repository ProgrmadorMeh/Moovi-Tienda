'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/hero-section';
import ProductSections from "@/components/product-sections";
import { getCellphonesCached, getAccessoriesCached } from "@/lib/data";
import type { Cellphone, Accessory } from "@/lib/types";
import Loading from './loading'; // Importamos el esqueleto de carga

export default function Home() {
  const [productsData, setProductsData] = useState<Cellphone[]>([]);
  const [accessoriesData, setAccessoriesData] = useState<Accessory[]>([]);
  const [uniqueBrands, setUniqueBrands] = useState<string[]>([]);
  const [uniqueCapacities, setUniqueCapacities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [phones, accessories] = await Promise.all([
        getCellphonesCached(),
        getAccessoriesCached(),
      ]);

      const allFetchedProducts = [...phones, ...accessories];
      const brands = [...new Set(allFetchedProducts.map((p) => p.brand))];
      const capacities = [...new Set(phones.map((p) => p.capacity))].sort(
        (a, b) => parseInt(a) - parseInt(b)
      );
      
      setProductsData(phones);
      setAccessoriesData(accessories);
      setUniqueBrands(brands);
      setUniqueCapacities(capacities);
      
      // Pequeño retraso para asegurar que el DOM se actualice antes de quitar el skeleton
      setTimeout(() => setIsLoading(false), 50);
    };

    loadData();
  }, []);

  if (isLoading) {
    return <Loading />;
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
