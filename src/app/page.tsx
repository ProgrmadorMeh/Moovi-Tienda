
'use client';

import { useState, useEffect } from "react";
import HeroSection from '@/components/hero-section';
import ProductSections from "@/components/product-sections";
import { getCellphonesCached, getAccessoriesCached } from "@/lib/data";
import type { Cellphone, Accessory } from "@/lib/types";
import Loading from "./loading";

const extractAndNormalizeOptions = (products: Cellphone[], key: keyof Cellphone['dataTecnica']) => {
  const allValues = new Set<string>();

  products.forEach(product => {
    const value = product.dataTecnica?.[key];
    if (typeof value === 'string' && value) {
      // Dividir por '/' y limpiar cada opción
      value.split('/').forEach(option => {
        const trimmedOption = option.trim();
        if (trimmedOption) {
          allValues.add(trimmedOption);
        }
      });
    }
  });

  // Ordenar numéricamente si es posible (ej: 128 GB, 256 GB)
  return Array.from(allValues).sort((a, b) => {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.localeCompare(b);
  });
};

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
      
      setCellphones(fetchedPhones);
      setAccessories(fetchedAccessories);
      setBrands(uniqueBrands);

      // Usar la nueva función de extracción para obtener todas las opciones posibles
      setStorageOptions(extractAndNormalizeOptions(fetchedPhones, 'Almacenamiento'));
      setRamOptions(extractAndNormalizeOptions(fetchedPhones, 'RAM'));
      setOsOptions(extractAndNormalizeOptions(fetchedPhones, 'Sistema Operativo'));
      setProcessorOptions(extractAndNormalizeOptions(fetchedPhones, 'Procesador'));
      
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
