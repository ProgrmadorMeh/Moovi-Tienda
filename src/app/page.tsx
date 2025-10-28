import Image from "next/image";
import Link from 'next/link';
import ProductSections from "@/components/product-sections";
import { Button } from "@/components/ui/button";
// ✅ Importa las funciones que obtienen productos ya procesados
import { getCellphonesCached, getAccessoriesCached } from "@/lib/data"; 
import type { Product, Cellphone, Accessory } from "@/lib/types";
import Typewriter from "@/components/ui/typewriter";

export default async function Home() {
  // ✅ Trae celulares y accesorios ya procesados por separado
  const allProducts: Cellphone[] = await getCellphonesCached();
  const accessories: Accessory[] = await getAccessoriesCached();

  // Filtrar marcas y capacidades solo para celulares
  const brands = [...new Set(allProducts.map((p) => p.brand))];
  const capacityOptions = [...new Set(allProducts.map((p) => p.capacity))].sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  return (
    <>
      <header className="relative flex h-screen items-center justify-center overflow-hidden text-center text-white">
        <Image
          src="/img/background.png"
          alt="Imagen de fondo de dispositivos electrónicos"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl px-4">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl">
            MooviTech
          </h1>
          <div className="mt-4 text-lg text-gray-200 md:text-xl h-8">
            <Typewriter
              phrases={[
                "Smartphones de última generación.",
                "Accesorios exclusivos.",
                "La mejor tecnología para ti.",
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
      </header>

      <div id="product-catalog" className="container mx-auto px-4 py-12">
        <ProductSections
          allProducts={allProducts}
          // Los productos destacados y con descuento ahora se filtran desde la lista de celulares ya procesada
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
