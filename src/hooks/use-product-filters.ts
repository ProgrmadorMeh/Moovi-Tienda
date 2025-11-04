
import { useMemo, useState, useCallback } from "react";
import type { Product } from "@/lib/types";
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

export function useProductFilters(products: Product[]) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sort, setSort] = useState("price-asc");
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = useCallback((key: keyof FilterState | `techSpec.${keyof FilterState['techSpecs']}`, value: any) => {
    if (key.startsWith('techSpec.')) {
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
    setCurrentPage(1); // Reset page on filter change
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSort(value);
    setCurrentPage(1);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Brand Filter
      const brandMatch = filters.brand === "all" || product.brand === filters.brand;

      // Price Filter
      const selectedPriceRange = priceRanges.find(r => r.value === filters.price);
      const priceMatch = filters.price === "all" || (selectedPriceRange && product.salePrice >= selectedPriceRange.min && product.salePrice <= selectedPriceRange.max);
      
      // Technical Specs Filters
      const techSpecMatch = (specKey: keyof FilterState['techSpecs']) => {
        const selectedSpecs = filters.techSpecs[specKey];
        // Si no hay filtros seleccionados para esta especificación, no descartar el producto.
        if (selectedSpecs.length === 0) return true;
        
        const productSpecValue = product.dataTecnica?.[specKey];
        // Si el producto no tiene esta especificación, no coincide, pero solo si el filtro está activo.
        if (!productSpecValue) return false;

        // Si el producto tiene la especificación, comprobar si su valor está en los seleccionados.
        return selectedSpecs.includes(productSpecValue);
      };

      const storageMatch = techSpecMatch('Almacenamiento');
      const ramMatch = techSpecMatch('RAM');
      const osMatch = techSpecMatch('Sistema Operativo');
      const processorMatch = techSpecMatch('Procesador');

      // Un producto debe coincidir con todos los filtros activos
      return brandMatch && priceMatch && storageMatch && ramMatch && osMatch && processorMatch;
    });

    return filtered.sort((a, b) => {
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
  }, [products, filters, sort]);

  return {
    filteredAndSortedProducts,
    filters,
    sort,
    currentPage,
    setCurrentPage,
    handleFilterChange,
    handleSortChange,
  };
}
