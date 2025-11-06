
import { useMemo, useState, useCallback } from "react";
import type { Product, Cellphone } from "@/lib/types";
import { priceRanges } from "@/components/product-filters";

export interface FilterState {
  brand: string;
  price: string;
  techSpecs: {
    Almacenamiento: string[];
    RAM: string[];
  };
}

const INITIAL_FILTERS: FilterState = {
  brand: "all",
  price: "all",
  techSpecs: {
    Almacenamiento: [],
    RAM: [],
  },
};

const isCellphone = (product: Product): product is Cellphone => {
    // Un producto es un celular si NO tiene la propiedad 'category'.
    return !('category' in product);
};

export function useProductFilters(
    products: Product[],
    productType: 'cellphones' | 'accessories' | 'all'
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
      // 1. (Opcional) Filtrar por tipo de producto si no es 'all'
      if (productType !== 'all') {
        const isCorrectType = (productType === 'cellphones' && isCellphone(product)) ||
                               (productType === 'accessories' && !isCellphone(product));
        if (!isCorrectType) return false;
      }

      // 2. Filtros comunes de marca y precio
      const brandMatch = filters.brand === "all" || product.brand === filters.brand;
      const selectedPriceRange = priceRanges.find((r) => r.value === filters.price);
      const priceMatch =
        filters.price === "all" ||
        (selectedPriceRange &&
          product.salePrice >= selectedPriceRange.min &&
          product.salePrice < selectedPriceRange.max);
      
      if (!brandMatch || !priceMatch) return false;

      // 3. Filtros de especificaciones técnicas (SOLO si el producto es un celular)
      if (isCellphone(product) && product.dataTecnica) {
        const techSpecKeys = Object.keys(filters.techSpecs) as Array<keyof FilterState['techSpecs']>;
        
        for (const specKey of techSpecKeys) {
          const selectedSpecFilters = filters.techSpecs[specKey];
          if (selectedSpecFilters.length === 0) continue; 

          const productSpecValue = product.dataTecnica?.[specKey];
          if (!productSpecValue) return false; 

          const hasMatchingSpec = selectedSpecFilters.some(filterValue =>
            String(productSpecValue).includes(filterValue.replace(' GB', '').replace(' TB', '000')) // Normalización
          );
          
          if (!hasMatchingSpec) return false; 
        }
      }

      return true;
    });

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
  };
}
