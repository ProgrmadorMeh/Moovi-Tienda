import Image from "next/image";
import ProductCatalog from "@/components/product-catalog";
import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";
import { CartProvider } from "@/context/CartContext";

export default function Home() {
  const products: Product[] = getProducts();
  const brands = [...new Set(products.map((p) => p.brand))];
  const storageOptions = [...new Set(products.map((p) => p.storage))].sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  return (
    <>
      <header className="relative my-16 overflow-hidden py-56 text-center">
        <Image
          src="/img/background.png"
          alt="Background image of electronic devices"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 className="mb-2 font-headline text-4xl font-bold tracking-tight text-white md:text-5xl">
            Our Product Collection
          </h1>
          <p className="text-lg text-gray-300 md:text-xl">
            Find the perfect device that fits your needs.
          </p>
        </div>
      </header>
      <div className="container mx-auto px-4 py-12">
        <ProductCatalog
          products={products}
          brands={brands}
          storageOptions={storageOptions}
        />
      </div>
    </>
  );
}
