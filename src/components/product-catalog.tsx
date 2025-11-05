
"use client";

import { useMemo } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./product-card";
import PaginationControls from "./pagination-controls";
import { useProductFilters } from "@/hooks/use-product-filters";

interface ProductCatalogProps {
  products: Product[];
  productType: 'cellphones' | 'accessories';
  onQuickView: (product: Product) => void;
}

const PRODUCTS_PER_PAGE = 20;

export default function ProductCatalog({
  products,
  productType,
  onQuickView,
}: ProductCatalogProps) {
  const {
    filteredAndSortedProducts,
    currentPage,
    setCurrentPage,
  } = useProductFilters(products, productType);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE
    );
  }, [filteredAndSortedProducts, currentPage]);

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / PRODUCTS_PER_PAGE
  );

  return (
    <div>
        <main className="lg:col-span-3">
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                  priority={currentPage === 1 && index < 4}
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

          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
    </div>
  );
}
