import ProductCatalog from "@/components/product-catalog";
import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export default function Home() {
  const products: Product[] = getProducts();
  const brands = [...new Set(products.map((p) => p.brand))];
  const storageOptions = [...new Set(products.map((p) => p.storage))].sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="mb-2 font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Our Product Collection
        </h1>
        <p className="text-lg text-muted-foreground md:text-xl">
          Find the perfect device that fits your needs.
        </p>
      </header>
      <ProductCatalog
        products={products}
        brands={brands}
        storageOptions={storageOptions}
      />
    </div>
  );
}
