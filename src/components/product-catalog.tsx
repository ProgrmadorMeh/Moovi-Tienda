
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
  ramOptions: string[];
  osOptions: string[];
  processorOptions: string[];
  onQuickView: (product: Product) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
}

const PRODUCTS_PER_PAGE = 20;

function isCellphone(product: Product): product is Cellphone {
  // A 'cellphone' is defined as a product that is NOT an accessory.
  // The 'category' field only exists on accessories.
  return !("category" in product);
}

type Filters = {
  brand: string;
  capacity: string[];
  price: string;
  ram: string[];
  os: string[];
  processor: string[];
};

const ProductCatalog = memo(({
  products,
  brands,
  capacityOptions,
  ramOptions,
  osOptions,
  processorOptions,
  onQuickView,
  onPageChange,
  currentPage,
}: ProductCatalogProps) => {
  const [filters, setFilters] = useState<Filters>({
    brand: "all",
    capacity: [],
    price: "all",
    ram: [],
    os: [],
    processor: [],
  });
  const [sort, setSort] = useState("price-asc");
  
  useEffect(() => {
    // Reset page to 1 when filters or sort order change
    onPageChange(1);
  }, [filters, sort, onPageChange]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const { brand, price } = filters;
      
      const brandMatch = brand === "all" || product.brand === brand;
      
      const selectedPriceRange = priceRanges.find(r => r.value === price);
      const priceMatch = price === "all" || (selectedPriceRange && product.salePrice >= selectedPriceRange.min && product.salePrice <= selectedPriceRange.max);
      
      // Technical specs filters - only apply to cellphones
      let techSpecsMatch = true;
      if (isCellphone(product)) {
        const { capacity, ram, os, processor } = filters;
        const capacityMatch = capacity.length === 0 || (product.dataTecnica?.Almacenamiento && capacity.includes(product.dataTecnica.Almacenamiento));
        const ramMatch = ram.length === 0 || (product.dataTecnica?.RAM && ram.includes(product.dataTecnica.RAM));
        const osMatch = os.length === 0 || (product.dataTecnica?.['Sistema Operativo'] && os.includes(product.dataTecnica['Sistema Operativo']));
        const processorMatch = processor.length === 0 || (product.dataTecnica?.Procesador && processor.includes(product.dataTecnica.Procesador));
        techSpecsMatch = capacityMatch && ramMatch && osMatch && processorMatch;
      }

      return brandMatch && priceMatch && techSpecsMatch;
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
              ramOptions={ramOptions}
              osOptions={osOptions}
              processorOptions={processorOptions}
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
