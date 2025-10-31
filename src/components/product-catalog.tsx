"use client";

import { useState, useMemo, useEffect, memo } from "react";
import type { Product, Cellphone } from "@/lib/types";
import ProductCard from "./product-card";
import ProductFilters, { priceRanges } from "./product-filters";
import PaginationControls from "./pagination-controls";
import QuickViewModal from "./quick-view-modal";

interface ProductCatalogProps {
  products: Product[];
  brands: string[];
  capacityOptions: string[];
  onQuickView: (product: Product) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
}

const PRODUCTS_PER_PAGE = 20;

function isCellphone(product: Product): product is Cellphone {
  return 'capacity' in product && product.capacity !== undefined;
}

const ProductCatalog = memo(({
  products,
  brands,
  capacityOptions,
  onQuickView,
  onPageChange,
  currentPage,
}: ProductCatalogProps) => {
  const [filters, setFilters] = useState({
    brand: "all",
    capacity: "all",
    price: "all",
  });
  const [sort, setSort] = useState("price-asc");
  
  useEffect(() => {
    onPageChange(1);
  }, [filters, sort, onPageChange]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const { brand, capacity, price } = filters;
      const brandMatch = brand === "all" || product.brand === brand;
      const capacityMatch =
        capacity === "all" ||
        (isCellphone(product) && product.capacity === capacity);
      
      const selectedPriceRange = priceRanges.find(r => r.value === price);
      const priceMatch = price === "all" || (selectedPriceRange && product.salePrice >= selectedPriceRange.min && product.salePrice <= selectedPriceRange.max);

      return brandMatch && capacityMatch && priceMatch;
    });

    return filtered.sort((a, b) => {
      const aName = `${a.brand} ${a.model}`;
      const bName = `${b.brand} ${b.model}`;
      switch (sort) {
        case "price-asc":
          return a.salePrice - b.salePrice;
        case "price-desc":
          return b.salePrice - a.salePrice;
        case "name-asc":
          return aName.localeCompare(bName);
        case "name-desc":
          return bName.localeCompare(aName);
        default:
          return 0;
      }
    });
  }, [products, filters, sort]);

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
              capacityOptions={capacityOptions}
              filters={filters}
              setFilters={setFilters}
              sort={sort}
              setSort={setSort}
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
                  priority={currentPage === 1 && index < 4} // Prioriza los primeros 4 en la primera página
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
              onPageChange={onPageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
});

ProductCatalog.displayName = 'ProductCatalog';

export default ProductCatalog;
