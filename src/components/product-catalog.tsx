
"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./product-card";
import ProductFilters from "./product-filters";
import QuickViewModal from "./quick-view-modal";

interface ProductCatalogProps {
  products: Product[];
  brands: string[];
  capacityOptions: string[];
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

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const { brand, capacity, priceRange } = filters;

      const brandMatch = brand === "all" || product.brand === brand;

      const productCapacity = product.capacity || "";
      const filterCapacity = capacity.replace(/gb|bg/i, "").trim();
      const capacityMatch =
        capacity === "all" ||
        productCapacity.toLowerCase().includes(filterCapacity);

      const priceMatch =
        product.salePrice !== undefined &&
        product.salePrice >= priceRange[0] &&
        product.salePrice <= priceRange[1];

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

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
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
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={handleQuickView} />
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
        </main>
      </div>
      {selectedProduct && (
        <QuickViewModal 
          product={selectedProduct} 
          isOpen={!!selectedProduct} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
}
