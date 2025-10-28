
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Typewriter from '@/components/ui/typewriter';
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
      <header className="relative h-screen overflow-hidden text-center text-white bg-header-background bg-cover bg-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center max-w-3xl px-4 mx-auto">
          <h1 className="font-headline bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-400 text-4xl font-bold tracking-tight md:text-6xl">
            MooviTech
          </h1>
          <div className="mt-4 text-lg text-gray-200 md:text-xl h-16 md:h-auto">
            <Typewriter
              phrases={[
                "Descubre smartphones de última generación y lleva tu conectividad al siguiente nivel.",
                "Encuentra accesorios exclusivos diseñados para complementar tu estilo de vida digital.",
                "Explora nuestra selección curada con la mejor tecnología, garantía y soporte para ti.",
              ]}
              className="text-2xl"
            />
          </div>
          <div className="mt-8">
            <Link href="#product-catalog">
              <Button size="lg">Ver Catálogo</Button>
            </Link>
          </div>
        </div>

        {/* Fade-out effect */}
        <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-background to-transparent"></div>
      </header>

      <div id="product-catalog" className="container mx-auto px-4 py-12">
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
