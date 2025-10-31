import { memo, useEffect, useState } from 'react';
import { getAllProductsCached } from '@/lib/data';
import ProductCard from "@/components/product-card";
import { AutoScrollCarousel } from "@/components/ui/auto-scroll-carousel";
import type { Product } from "@/lib/types";
import { Loader2 } from 'lucide-react';

const AccessoriesCarousel = memo(({ brand, currentProductId }: { brand: string, currentProductId: string }) => {
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAccessories = async () => {
      setIsLoading(true);
      const allProducts = await getAllProductsCached();
      const filteredAccessories = allProducts
        .filter(p => p.brand === brand && p.id !== currentProductId && "category" in p)
        .slice(0, 6);
      setAccessories(filteredAccessories);
      setIsLoading(false);
    };

    if (brand) {
      loadAccessories();
    } else {
        setIsLoading(false);
    }
  }, [brand, currentProductId]);

  if (!isLoading && !accessories.length) {
    return null; // No mostrar nada si no hay accesorios y ya terminó de cargar
  }

  const carouselItems = accessories.map(acc => <ProductCard key={acc.id} product={acc} onQuickView={() => {}} />);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Accesorios Recomendados</h2>
      <div className="relative min-h-[450px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <AutoScrollCarousel
            items={carouselItems}
            carouselOptions={{
              opts: {
                align: "start",
                loop: accessories.length > 2, // Activar loop solo si hay suficientes items
              }
            }}
            autoplayOptions={{
                stopOnInteraction: true,
            }}
          />
        )}
      </div>
    </div>
  );
});

AccessoriesCarousel.displayName = 'AccessoriesCarousel';

export default AccessoriesCarousel;
