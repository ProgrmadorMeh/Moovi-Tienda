
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

// Un producto es un accesorio si tiene la propiedad 'category'.
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
      if (productType === 'cellphones' && !isCellphone(product)) return false;
      if (productType === 'accessories' && isCellphone(product)) return false;

      // 2. Filtros comunes de marca y precio
      const brandMatch = filters.brand === "all" || product.brand === filters.brand;
      const selectedPriceRange = priceRanges.find((r) => r.value === filters.price);
      const priceMatch =
        filters.price === "all" ||
        (selectedPriceRange &&
          product.salePrice >= selectedPriceRange.min &&
          product.salePrice < selectedPriceRange.max);
      
      if (!brandMatch || !priceMatch) return false;

      // 3. Filtros de especificaciones técnicas (SOLO para celulares)
      if (productType === 'cellphones' && isCellphone(product)) {
        const techSpecKeys = Object.keys(filters.techSpecs) as Array<keyof FilterState['techSpecs']>;
        
        for (const specKey of techSpecKeys) {
          const selectedSpecFilters = filters.techSpecs[specKey];
          if (selectedSpecFilters.length === 0) continue; // No hay filtro para esta spec, continuar.

          const productSpecValue = product.dataTecnica?.[specKey];
          if (!productSpecValue) return false; // El producto no tiene esta spec, descartar.

          // Comprobar si *alguna* de las etiquetas seleccionadas está presente en el valor de la spec del producto.
          const hasMatchingSpec = selectedSpecFilters.some(filterValue =>
            productSpecValue.includes(filterValue)
          );
          
          if (!hasMatchingSpec) return false; // Si ninguna etiqueta coincide, descartar el producto.
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
  };
}
