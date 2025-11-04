
"use client";

import { memo } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./product-card";

interface ProductCatalogProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

const ProductCatalog = memo(({
  products,
  onQuickView,
}: ProductCatalogProps) => {

  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              priority={index < 4}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full min-h-[40vh] flex-col items-center justify-center rounded-lg border border-dashed bg-card p-8 text-center">
          <h3 className="font-headline text-2xl font-semibold">
            No se Encontraron Productos
          </h3>
          <p className="mt-2 text-muted-foreground">
            Intenta ajustar tus filtros para encontrar lo que buscas.
          </p>
        </div>
      )}
    </>
  );
});

ProductCatalog.displayName = 'ProductCatalog';

export default ProductCatalog;
