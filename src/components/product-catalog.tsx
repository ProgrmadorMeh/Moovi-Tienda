"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./product-card";
import ProductFilters from "./product-filters";
import { Separator } from "./ui/separator";

interface ProductCatalogProps {
  products: Product[];
  brands: string[];
  storageOptions: string[];
}

export default function ProductCatalog({
  products,
  brands,
  storageOptions,
}: ProductCatalogProps) {
  const [filters, setFilters] = useState({
    brand: "all",
    storage: "all",
    priceRange: [0, 1500],
  });
  const [sort, setSort] = useState("price-asc");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const { brand, storage, priceRange } = filters;
      const brandMatch = brand === "all" || product.brand === brand;
      const storageMatch =
        storage === "all" || product.storage === storage;
      const priceMatch =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      return brandMatch && storageMatch && priceMatch;
    });

    return filtered.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [products, filters, sort]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      <aside className="lg:col-span-1">
        <div className="sticky top-20">
          <ProductFilters
            brands={brands}
            storageOptions={storageOptions}
            filters={filters}
            setFilters={setFilters}
            sort={sort}
            setSort={setSort}
          />
        </div>
      </aside>
      <main className="lg:col-span-3">
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-[40vh] flex-col items-center justify-center rounded-lg border border-dashed bg-card p-8 text-center">
            <h3 className="font-headline text-2xl font-semibold">No Products Found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
