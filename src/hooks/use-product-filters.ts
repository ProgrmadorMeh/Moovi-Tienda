
<<<<<<< HEAD
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
=======
import { useMemo, useState, useCallback } from "react";
import type { Product, Cellphone } from "@/lib/types";
import { priceRanges } from "@/components/product-filters";

export interface FilterState {
  brand: string;
  price: string;
  techSpecs: {
    Almacenamiento: string[];
    RAM: string[];
    'Sistema Operativo': string[];
    Procesador: string[];
  };
}

const INITIAL_FILTERS: FilterState = {
  brand: "all",
  price: "all",
  techSpecs: {
    Almacenamiento: [],
    RAM: [],
    'Sistema Operativo': [],
    Procesador: [],
  },
};

// Un producto NO es un celular si tiene la propiedad 'category'.
// Esta es la forma más fiable de distinguir un accesorio.
const isCellphone = (product: Product): product is Cellphone => {
  return !product.hasOwnProperty('category');
};

export function useProductFilters(
    products: Product[],
    productType: 'cellphones' | 'accessories'
) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sort, setSort] = useState("price-asc");
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = useCallback((key: keyof FilterState | `techSpecs.${keyof FilterState['techSpecs']}`, value: any) => {
    if (key.startsWith('techSpecs.')) {
      const specKey = key.split('.')[1] as keyof FilterState['techSpecs'];
      setFilters(prev => ({
        ...prev,
        techSpecs: {
          ...prev.techSpecs,
          [specKey]: value,
        },
      }));
    } else {
      setFilters(prev => ({ ...prev, [key as keyof FilterState]: value }));
    }
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSort(value);
    setCurrentPage(1);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filteredProducts = products.filter((product) => {
      // 1. Filtrar por tipo de producto (cellphone vs accessory)
      if (productType === 'cellphones' && !isCellphone(product)) {
        return false;
      }
      if (productType === 'accessories' && isCellphone(product)) {
        return false;
      }

      // 2. Filtros comunes de marca y precio
      const brandMatch = filters.brand === "all" || product.brand === filters.brand;
      const selectedPriceRange = priceRanges.find((r) => r.value === filters.price);
      const priceMatch =
        filters.price === "all" ||
        (selectedPriceRange &&
          product.salePrice >= selectedPriceRange.min &&
          product.salePrice < selectedPriceRange.max);
      
      const commonFiltersMatch = brandMatch && priceMatch;

      if (!commonFiltersMatch) {
        return false;
      }

      // 3. Filtros de especificaciones técnicas (SOLO para celulares)
      if (productType === 'cellphones' && isCellphone(product)) {
        const techSpecKeys = Object.keys(filters.techSpecs) as Array<keyof FilterState['techSpecs']>;
        
        for (const specKey of techSpecKeys) {
          const selectedSpecs = filters.techSpecs[specKey];
          if (selectedSpecs.length === 0) {
            continue; // No hay filtro para esta especificación, pasar a la siguiente.
          }
          
          const productSpecValue = product.dataTecnica?.[specKey];
          if (!productSpecValue || !selectedSpecs.includes(productSpecValue)) {
            return false; // Si el producto no tiene la spec o no coincide, descartarlo.
          }
        }
      }

      return true;
    });

    // Ordenar los productos resultantes
    return filteredProducts.sort((a, b) => {
      const aName = `${a.brand} ${a.model}`;
      const bName = `${b.brand} ${b.model}`;
      switch (sort) {
        case "price-asc": return a.salePrice - b.salePrice;
        case "price-desc": return b.salePrice - a.salePrice;
        case "name-asc": return aName.localeCompare(bName);
        case "name-desc": return bName.localeCompare(aName);
        default: return 0;
      }
    });
  }, [products, filters, sort, productType]);

  return {
    filteredAndSortedProducts,
    filters,
    sort,
    currentPage,
    setCurrentPage,
    handleFilterChange,
    handleSortChange,
>>>>>>> main
  };
}
