
"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./product-card";
import ProductFilters from "./product-filters";
import PaginationControls from "./pagination-controls";
import { useProductFilters } from "@/hooks/use-product-filters";

interface ProductCatalogProps {
  products: Product[];
  brands: string[];
  storageOptions: string[];
  ramOptions: string[];
  osOptions: string[];
  processorOptions: string[];
  onQuickView: (product: Product) => void;
}

const PRODUCTS_PER_PAGE = 20;

export default function ProductCatalog({
  products,
  brands,
  storageOptions,
  ramOptions,
  osOptions,
  processorOptions,
  onQuickView,
}: ProductCatalogProps) {
  const {
    filteredAndSortedProducts,
    filters,
    sort,
    currentPage,
    setCurrentPage,
    handleFilterChange,
    handleSortChange,
  } = useProductFilters(products);

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
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="sticky top-20">
            <ProductFilters
              brands={brands}
              storageOptions={storageOptions}
              ramOptions={ramOptions}
              osOptions={osOptions}
              processorOptions={processorOptions}
              filters={filters}
              onFilterChange={handleFilterChange}
              sort={sort}
              onSortChange={handleSortChange}
            />
          </div>
        </aside>
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
    </div>
  );
}
