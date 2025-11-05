'use client';

import { useState, useEffect } from "react";
import HeroSection from '@/components/hero-section';
import ProductSections from "@/components/product-sections";
import { getCellphonesCached, getAccessoriesCached } from "@/lib/data";
<<<<<<< HEAD
import type { Product, Cellphone } from "@/lib/types";
import Loading from "./loading"; // Importamos el esqueleto
=======
import type { Cellphone, Accessory } from "@/lib/types";
import Loading from "./loading";
>>>>>>> main

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [cellphones, setCellphones] = useState<Cellphone[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
<<<<<<< HEAD
  const [capacities, setCapacities] = useState<string[]>([]);
=======
  const [storageOptions, setStorageOptions] = useState<string[]>([]);
>>>>>>> main
  const [ramOptions, setRamOptions] = useState<string[]>([]);
  const [osOptions, setOsOptions] = useState<string[]>([]);
  const [processorOptions, setProcessorOptions] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [fetchedPhones, fetchedAccessories] = await Promise.all([
        getCellphonesCached(),
        getAccessoriesCached(),
      ]);

<<<<<<< HEAD
      const allFetchedProducts = [...fetchedPhones, ...fetchedAccessories];
      const uniqueBrands = [...new Set(allFetchedProducts.map((p) => p.brand))];
      
      const allPhones = fetchedPhones as Cellphone[];

      const uniqueCapacities = [...new Set(allPhones.map(p => p.dataTecnica?.Almacenamiento).filter(Boolean) as string[])].sort(
        (a, b) => (parseInt(a) || 0) - (parseInt(b) || 0)
      );
      const uniqueRam = [...new Set(allPhones.map(p => p.dataTecnica?.RAM).filter(Boolean) as string[])];
      const uniqueOs = [...new Set(allPhones.map(p => p.dataTecnica?.['Sistema Operativo']).filter(Boolean) as string[])];
      const uniqueProcessors = [...new Set(allPhones.map(p => p.dataTecnica?.Procesador).filter(Boolean) as string[])];
=======
      const allProducts = [...fetchedPhones, ...fetchedAccessories];
      const uniqueBrands = [...new Set(allProducts.map((p) => p.brand))];
      
      const uniqueSpecs = (key: string) => [...new Set(
        fetchedPhones
          .map(p => p.dataTecnica?.[key])
          .filter((value): value is string => typeof value === 'string' && value.length > 0)
      )].sort();
>>>>>>> main

      setCellphones(fetchedPhones);
      setAccessories(fetchedAccessories);
      setBrands(uniqueBrands);
<<<<<<< HEAD
      setCapacities(uniqueCapacities);
      setRamOptions(uniqueRam);
      setOsOptions(uniqueOs);
      setProcessorOptions(uniqueProcessors);


=======
      setStorageOptions(uniqueSpecs('Almacenamiento'));
      setRamOptions(uniqueSpecs('RAM'));
      setOsOptions(uniqueSpecs('Sistema Operativo'));
      setProcessorOptions(uniqueSpecs('Procesador'));
      
>>>>>>> main
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
<<<<<<< HEAD
          capacityOptions={capacities}
=======
          storageOptions={storageOptions}
>>>>>>> main
          ramOptions={ramOptions}
          osOptions={osOptions}
          processorOptions={processorOptions}
        />
      </div>
    </>
  );
}
