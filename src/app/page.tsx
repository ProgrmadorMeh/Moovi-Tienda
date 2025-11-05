
'use client';

import { useState, useEffect } from "react";
import HeroSection from '@/components/hero-section';
import ProductSections from "@/components/product-sections";
import { getCellphonesCached, getAccessoriesCached } from "@/lib/data";
import type { Cellphone, Accessory } from "@/lib/types";
import Loading from "./loading";
import { predefinedFilters } from "@/lib/filters";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [cellphones, setCellphones] = useState<Cellphone[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  
  // Usamos las opciones predefinidas desde el nuevo archivo de filtros
  const storageOptions = predefinedFilters.Almacenamiento;
  const ramOptions = predefinedFilters.RAM;
  const osOptions = predefinedFilters['Sistema Operativo'];
  const processorOptions = predefinedFilters.Procesador;

  useEffect(() => {
    const loadData = async () => {
      const [fetchedPhones, fetchedAccessories] = await Promise.all([
        getCellphonesCached(),
        getAccessoriesCached(),
      ]);

      const allProducts = [...fetchedPhones, ...fetchedAccessories];
      const uniqueBrands = [...new Set(allProducts.map((p) => p.brand))];
      
      setCellphones(fetchedPhones);
      setAccessories(fetchedAccessories);
      setBrands(uniqueBrands);
      
      setIsLoading(false);
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
          cellphones={cellphones}
          accessories={accessories}
          brands={brands}
          storageOptions={storageOptions}
          ramOptions={ramOptions}
          osOptions={osOptions}
          processorOptions={processorOptions}
        />
      </div>
    </>
  );
}
