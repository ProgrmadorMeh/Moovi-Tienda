
'use client';

import { useState, useEffect } from "react";
import HeroSection from '@/components/hero-section';
import ProductSections from "@/components/product-sections";
import { getCellphonesCached, getAccessoriesCached } from "@/lib/data";
import type { Product, Cellphone } from "@/lib/types";
import Loading from "./loading"; // Importamos el esqueleto

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [phones, setPhones] = useState<Product[]>([]);
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [capacities, setCapacities] = useState<string[]>([]);
  const [ramOptions, setRamOptions] = useState<string[]>([]);
  const [osOptions, setOsOptions] = useState<string[]>([]);
  const [processorOptions, setProcessorOptions] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // Para simular una carga más lenta y ver el esqueleto:
      // await new Promise(resolve => setTimeout(resolve, 2000));
      
      const [fetchedPhones, fetchedAccessories] = await Promise.all([
        getCellphonesCached(),
        getAccessoriesCached(),
      ]);

      const allFetchedProducts = [...fetchedPhones, ...fetchedAccessories];
      const uniqueBrands = [...new Set(allFetchedProducts.map((p) => p.brand))];
      const uniqueCapacities = [...new Set(fetchedPhones.map((p) => p.capacity))].sort(
        (a, b) => parseInt(a) - parseInt(b)
      );

      const allPhones = fetchedPhones as Cellphone[];
      const uniqueRam = [...new Set(allPhones.map(p => p.dataTecnica?.RAM).filter(Boolean) as string[])];
      const uniqueOs = [...new Set(allPhones.map(p => p.dataTecnica?.['Sistema Operativo']).filter(Boolean) as string[])];
      const uniqueProcessors = [...new Set(allPhones.map(p => p.dataTecnica?.Procesador).filter(Boolean) as string[])];

      setPhones(fetchedPhones);
      setAccessories(fetchedAccessories);
      setBrands(uniqueBrands);
      setCapacities(uniqueCapacities);
      setRamOptions(uniqueRam);
      setOsOptions(uniqueOs);
      setProcessorOptions(uniqueProcessors);


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
          allProducts={phones}
          featuredProducts={phones.filter((p) => p.discount > 0)}
          discountedProducts={phones.filter((p) => p.discount > 0)}
          accessories={accessories}
          brands={brands}
          capacityOptions={capacities}
          ramOptions={ramOptions}
          osOptions={osOptions}
          processorOptions={processorOptions}
        />
      </div>
    </>
  );
}
