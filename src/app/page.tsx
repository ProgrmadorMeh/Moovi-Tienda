import Image from "next/image";
import ProductSections from "@/components/product-sections";
import { getAllProductsCached } from "@lib/data"; // ✅ Función combinada celulares + accesorios con cache
import type { Product, Cellphone, Accessory } from "@/lib/types";
import { defaultBase } from "@lib/types";

export default async function Home() {
  // ✅ Trae todos los productos combinados usando cache
  const allItems: Product[] = await getAllProductsCached();

  // Separar productos por tipo usando type guards
  const allProductsRaw: Cellphone[] = allItems.filter(
    (p): p is Cellphone => "capacity" in p
  );
  const accessoriesRaw: Accessory[] = allItems.filter(
    (p): p is Accessory => "category" in p
  );

  // Aplicar valores por defecto solo a los productos correspondientes
  const allProducts: Cellphone[] = allProductsRaw.map(p => ({
    ...defaultBase,
    ...p,
  }));

  const accessories: Accessory[] = accessoriesRaw.map(p => ({
    ...defaultBase,
    ...p,
  }));

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
