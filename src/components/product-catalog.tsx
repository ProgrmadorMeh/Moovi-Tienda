"use client";

import { useState, useMemo, useEffect } from "react";
import type { Product, Cellphone } from "@/lib/types";
import ProductCard from "./product-card";
import ProductFilters from "./product-filters";
import PaginationControls from "./pagination-controls";

interface ProductCatalogProps {
  products: Product[];
  brands: string[];
  capacityOptions: string[];
}

const PRODUCTS_PER_PAGE = 20;

// ✅ Type guard para identificar celulares
function isCellphone(product: Product): product is Cellphone {
  return (product as Cellphone).imei !== undefined;
}

export default function ProductCatalog({
  products,
  brands,
  capacityOptions,
}: ProductCatalogProps) {
  const [filters, setFilters] = useState({
    brand: "all",
    capacity: "all",
    priceRange: [0, 10000000],
  });
  const [sort, setSort] = useState("price-asc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const { brand, capacity, priceRange } = filters;

      // Filtrar por marca
      const brandMatch = brand === "all" || product.brand === brand;

      // Filtrar por capacidad solo si es un celular
      const filterCapacity = capacity.replace(/gb|bg/i, "").trim();
      const capacityMatch =
        capacity === "all" ||
        (isCellphone(product) &&
          product.capacity.toLowerCase().includes(filterCapacity));

      // Filtrar por precio
      const priceMatch =
        product.salePrice !== undefined &&
        product.salePrice >= priceRange[0] &&
        product.salePrice <= priceRange[1];

      return brandMatch && capacityMatch && priceMatch;
    });

    // Ordenar
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
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={() => {}}
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
