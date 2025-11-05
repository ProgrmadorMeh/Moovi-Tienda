
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
      // Filtros comunes de marca y precio
      const brandMatch = filters.brand === "all" || product.brand === filters.brand;
      const selectedPriceRange = priceRanges.find((r) => r.value === filters.price);
      const priceMatch =
        filters.price === "all" ||
        (selectedPriceRange &&
          product.salePrice >= selectedPriceRange.min &&
          product.salePrice < selectedPriceRange.max);
      
      const commonFiltersMatch = brandMatch && priceMatch;

      if (productType === 'cellphones') {
        if (!isCellphone(product)) {
          return false; // Descartar si no es un celular
        }
        
        // Filtros de especificaciones técnicas para celulares
        const techSpecKeys = Object.keys(filters.techSpecs) as Array<keyof FilterState['techSpecs']>;
        const techSpecsMatch = techSpecKeys.every((specKey) => {
          const selectedSpecs = filters.techSpecs[specKey];
          if (selectedSpecs.length === 0) {
            return true; // No hay filtro para esta especificación
          }
          const productSpecValue = product.dataTecnica?.[specKey];
          // Solo aplicar el filtro si el producto tiene la especificación.
          // Si el producto no tiene la spec, no lo descartamos por este filtro.
          if (!productSpecValue) return true;
          return selectedSpecs.includes(productSpecValue);
        });

        return commonFiltersMatch && techSpecsMatch;
      }

      if (productType === 'accessories') {
        // Para accesorios, solo aplicamos filtros comunes y nos aseguramos de que no sea un celular
        return !isCellphone(product) && commonFiltersMatch;
      }

      return false; // No debería llegar aquí
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
  };
}
