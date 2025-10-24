import Image from "next/image";
import ProductSections from "@/components/product-sections"; // ✅ NUEVO
import {
  getProducts,
  getFeaturedProducts,
  getDiscountedProducts,
} from "@/lib/products"; // ✅ NUEVO
import { getAccessories } from "@/lib/accessories"; // ✅ NUEVO
import type { Product } from "@/lib/types";

export default async function Home() {
  // Obtenemos todos los datos necesarios para las secciones
  const allProducts: Product[] = await getProducts();
  const featuredProducts: Product[] = await getFeaturedProducts(); // ✅ NUEVO
  const discountedProducts: Product[] = await getDiscountedProducts(); // ✅ NUEVO
  const accessories: Product[] = await getAccessories(); // ✅ NUEVO

  // Los filtros solo se usan para la sección "Celulares"
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
        {/* ✅ Renderizamos el nuevo componente de secciones */}
        <ProductSections
          allProducts={allProducts}
          featuredProducts={featuredProducts}
          discountedProducts={discountedProducts}
          accessories={accessories}
          brands={brands}
          capacityOptions={capacityOptions}
        />
      </div>
    </>
  );
}
