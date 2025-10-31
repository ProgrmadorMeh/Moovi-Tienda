
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductSections from "@/components/product-sections";
import { getCellphonesCached, getAccessoriesCached } from "@/lib/data";
import type { Cellphone, Accessory } from "@/lib/types";

export default async function Home() {
  const allProducts: Cellphone[] = await getCellphonesCached();
  const accessories: Accessory[] = await getAccessoriesCached();

  const brands = [...new Set(allProducts.map((p) => p.brand))];
  const capacityOptions = [...new Set(allProducts.map((p) => p.capacity))].sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  return (
    <>
      {/* La HeroSection ha sido movida al nuevo componente HomeHeader */}
      {/* Este div ahora solo contiene el catálogo de productos */}
      <div id="product-catalog" className="container mx-auto px-4 py-12 bg-background relative z-10 rounded-t-2xl -mt-32 shadow-2xl">
        <ProductSections
          allProducts={allProducts}
          featuredProducts={allProducts.filter((p) => p.discount > 0)}
          discountedProducts={allProducts.filter((p) => p.discount > 0)}
          accessories={accessories}
          brands={brands}
          capacityOptions={capacityOptions}
        />
      </div>
    </>
  );
}
