
'use client';

import { useState, useEffect } from "react";
import HeroSection from '@/components/hero-section';
import ProductSections from "@/components/product-sections";
import { getCellphonesCached, getAccessoriesCached } from "@/lib/data";
import type { Cellphone, Accessory } from "@/lib/types";
import Loading from "./loading"; 

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [cellphones, setCellphones] = useState<Cellphone[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [storageOptions, setStorageOptions] = useState<string[]>([]);
  const [ramOptions, setRamOptions] = useState<string[]>([]);
  const [osOptions, setOsOptions] = useState<string[]>([]);
  const [processorOptions, setProcessorOptions] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [fetchedPhones, fetchedAccessories] = await Promise.all([
        getCellphonesCached(),
        getAccessoriesCached(),
      ]);

      const allProducts = [...fetchedPhones, ...fetchedAccessories];
      const uniqueBrands = [...new Set(allProducts.map((p) => p.brand))];
      
      const uniqueSpecs = (key: string) => [...new Set(
        fetchedPhones
          .map(p => p.dataTecnica?.[key])
          .filter((value): value is string => typeof value === 'string' && value.length > 0)
      )].sort();

      setCellphones(fetchedPhones);
      setAccessories(fetchedAccessories);
      setBrands(uniqueBrands);
      setStorageOptions(uniqueSpecs('Almacenamiento'));
      setRamOptions(uniqueSpecs('RAM'));
      setOsOptions(uniqueSpecs('Sistema Operativo'));
      setProcessorOptions(uniqueSpecs('Procesador'));
      
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
