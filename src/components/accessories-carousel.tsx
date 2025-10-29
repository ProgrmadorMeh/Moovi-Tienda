import { memo, useEffect, useState } from 'react';
import { getAllProductsCached } from '@/lib/data';
import ProductCard from "@/components/product-card";
import { AutoScrollCarousel } from "@/components/ui/auto-scroll-carousel";
import type { Product } from "@/lib/types";

const AccessoriesCarousel = memo(({ brand, currentProductId }: { brand: string, currentProductId: string }) => {
  const [accessories, setAccessories] = useState<Product[]>([]);

  useEffect(() => {
    const loadAccessories = async () => {
      const allProducts = await getAllProductsCached();
      const filteredAccessories = allProducts
        .filter(p => p.brand === brand && p.id !== currentProductId && "category" in p)
        .slice(0, 6);
      setAccessories(filteredAccessories);
    };

    if (brand) {
      loadAccessories();
    }
  }, [brand, currentProductId]);

  if (!accessories.length) {
    return null; // No mostrar nada si no hay accesorios
  }

  const carouselItems = accessories.map(acc => <ProductCard key={acc.id} product={acc} onQuickView={() => {}} />);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Accesorios Recomendados</h2>
      <AutoScrollCarousel
        items={carouselItems}
        carouselOptions={{
          opts: {
            align: "start",
            loop: true,
          }
        }}
        autoplayOptions={{
            stopOnInteraction: false,
        }}
      />
    </div>
  );
});

AccessoriesCarousel.displayName = 'AccessoriesCarousel';

export default AccessoriesCarousel;
