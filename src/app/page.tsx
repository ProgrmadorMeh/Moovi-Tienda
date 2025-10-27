import Image from "next/image";
import ProductSections from "@/components/product-sections";
// ✅ Importa las funciones que obtienen productos ya procesados
import { getCellphonesCached, getAccessoriesCached } from "@lib/data"; 
import type { Product, Cellphone, Accessory } from "@/lib/types";

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
      <header className="relative my-16 overflow-hidden py-56 text-center">
        <Image
          src="/img/background.png"
          alt="Imagen de fondo de dispositivos electrónicos"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 className="mb-2 font-headline text-4xl font-bold tracking-tight text-white md:text-5xl">
            Nuestra Colección de Productos
          </h1>
          <p className="text-lg text-gray-300 md:text-xl">
            Encuentra el dispositivo perfecto que se adapta a tus necesidades.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
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
