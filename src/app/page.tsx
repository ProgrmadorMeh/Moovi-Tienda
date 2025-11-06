
'use client';

import { useState, useEffect, useMemo } from "react";
import HeroSection from '@/components/hero-section';
import ProductSections from "@/components/product-sections";
import { getAllProductsCached } from "@/lib/data";
import type { Cellphone, Accessory, Product } from "@/lib/types";
import Loading from "./loading";
import { predefinedFilters } from "@/lib/filters";
import AnimatedFeatureCards from "@/components/ui/animated-feature-cards";

const isCellphone = (product: Product): product is Cellphone => {
    return 'imei' in product || 'dataTecnica' in product;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const storageOptions = predefinedFilters.Almacenamiento;
  const ramOptions = predefinedFilters.RAM;

  useEffect(() => {
    const loadData = async () => {
      // Forzamos la actualización de la caché en la carga inicial de la página principal.
      const fetchedProducts = await getAllProductsCached(true); 
      setAllProducts(fetchedProducts);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Memoizamos la derivación de los datos para evitar recálculos en cada render.
  const { cellphones, accessories, brands } = useMemo(() => {
    const phones: Cellphone[] = [];
    const accs: Accessory[] = [];
    const uniqueBrands = new Set<string>();

    for (const product of allProducts) {
      uniqueBrands.add(product.brand);
      if (isCellphone(product)) {
        phones.push(product);
      } else {
        accs.push(product as Accessory);
      }
    }
    
    return {
      cellphones: phones,
      accessories: accs,
      brands: Array.from(uniqueBrands),
    };
  }, [allProducts]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <HeroSection />
       {/* El carrusel ahora se solapa con la parte inferior del Hero para una transición suave */}
      <div className="relative z-20 -mt-24">
        <AnimatedFeatureCards />
      </div>
      <div id="product-catalog" className="container mx-auto px-4 py-12">
        <ProductSections
          cellphones={cellphones}
          accessories={accessories}
          brands={brands}
          storageOptions={storageOptions}
          ramOptions={ramOptions}
        />
      </div>
    </>
  );
}
