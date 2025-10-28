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
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=2070&auto=format&fit=crop"
          alt="Imagen de fondo de tecnología abstracta y moderna"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl px-4">
          <h1 className="font-headline bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-400 text-4xl font-bold tracking-tight md:text-6xl">
            MooviTech
          </h1>
          <div className="mt-4 text-lg text-gray-200 md:text-xl h-16 md:h-8">
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
