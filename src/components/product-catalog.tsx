
"use client";

import { useMemo, useEffect } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./product-card";
import PaginationControls from "./pagination-controls";
import { useProductFilters } from "@/hooks/use-product-filters";
import ProductFilters from "./product-filters";

interface ProductCatalogProps {
  products: Product[];
  productType: 'cellphones' | 'accessories' | 'all';
  brands: string[];
  storageOptions: string[];
  ramOptions: string[];
  onQuickView: (product: Product) => void;
}

const PRODUCTS_PER_PAGE = 20;

export default function ProductCatalog({
  products,
  productType,
  brands,
  storageOptions,
  ramOptions,
  onQuickView,
}: ProductCatalogProps) {
  const {
    filteredAndSortedProducts,
    filters,
    handleFilterChange,
    sort,
    handleSortChange,
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

  useEffect(() => {
    console.log("Filtered Products:", filteredAndSortedProducts);
    console.log("Paginated Products:", paginatedProducts);
  }, [filteredAndSortedProducts, paginatedProducts]);

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / PRODUCTS_PER_PAGE
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      <aside className="lg:col-span-1">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
          <ProductFilters
            brands={brands}
            storageOptions={storageOptions}
            ramOptions={ramOptions}
            filters={filters}
            onFilterChange={handleFilterChange}
            sort={sort}
            onSortChange={handleSortChange}
            productType={productType}
          />
        </div>
      </aside>

      <main className="lg:col-span-3">
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedProducts.map((product, index) => (
              <ProductCard
                key={`${'imei' in product ? 'cell-' : 'acc-'}${product.id}`}
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
