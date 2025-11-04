
"use client";

import { useState, useMemo, useEffect, useCallback, RefObject } from "react";
import type { Product, Cellphone } from "@/lib/types";
import { priceRanges } from "@/components/product-filters";

function isCellphone(product: Product): product is Cellphone {
  // Un producto es un celular si NO tiene la propiedad 'category'.
  // Esto es más robusto que buscar 'imei'.
  return !("category" in product);
}

export type Filters = {
  brand: string;
  capacity: string[];
  price: string;
  ram: string[];
  os: string[];
  processor: string[];
};

export default function useProductFilters(
  products: Product[],
  productsPerPage: number,
  scrollRef?: RefObject<HTMLDivElement>
) {
  const [filters, setFilters] = useState<Filters>({
    brand: "all",
    capacity: [],
    price: "all",
    ram: [],
    os: [],
    processor: [],
  });
  const [sort, setSort] = useState("price-asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 when filters or sort order change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort, products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products].filter((product) => {
      const { brand, price, capacity, ram, os, processor } = filters;
      
      const brandMatch = brand === "all" || product.brand === brand;
      
      const selectedPriceRange = priceRanges.find(r => r.value === price);
      const priceMatch = price === "all" || (selectedPriceRange && product.salePrice >= selectedPriceRange.min && product.salePrice <= selectedPriceRange.max);
      
      // Si no es un celular, no aplicamos filtros técnicos y lo dejamos pasar
      if (!isCellphone(product)) {
        return brandMatch && priceMatch;
      }

      // Si es un celular, aplicamos los filtros técnicos
      const tech = product.dataTecnica || {};
      
      const capacityMatch = capacity.length === 0 || (tech.Almacenamiento && capacity.includes(tech.Almacenamiento));
      const ramMatch = ram.length === 0 || (tech.RAM && ram.includes(tech.RAM));
      const osMatch = os.length === 0 || (tech['Sistema Operativo'] && os.includes(tech['Sistema Operativo']));
      const processorMatch = processor.length === 0 || (tech.Procesador && processor.includes(tech.Procesador));

      return brandMatch && priceMatch && capacityMatch && ramMatch && osMatch && processorMatch;
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
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );
  }, [filteredAndSortedProducts, currentPage, productsPerPage]);

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / productsPerPage
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollRef]);

  return {
    paginatedProducts,
    filters,
    setFilters,
    sort,
    setSort,
    currentPage,
    totalPages,
    handlePageChange,
  };
}
