
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

const isCellphone = (product: Product): product is Cellphone => {
  // Un producto es un celular si tiene `dataTecnica` o `imei`.
  return product.hasOwnProperty('dataTecnica') || product.hasOwnProperty('imei');
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
    setCurrentPage(1); // Reset page on filter change
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSort(value);
    setCurrentPage(1);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    // 1. Filtrar por tipo de producto (celular o accesorio)
    const typeFilteredProducts = products.filter(product => {
        if (productType === 'cellphones') return isCellphone(product);
        if (productType === 'accessories') return !isCellphone(product);
        return false;
    });

    // 2. Aplicar filtros comunes (marca y precio)
    let commonFiltered = typeFilteredProducts.filter((product) => {
      const brandMatch = filters.brand === "all" || product.brand === filters.brand;
      
      const selectedPriceRange = priceRanges.find(r => r.value === filters.price);
      const priceMatch = filters.price === "all" || (selectedPriceRange && product.salePrice >= selectedPriceRange.min && product.salePrice < selectedPriceRange.max);
      
      return brandMatch && priceMatch;
    });

    // 3. Aplicar filtros de especificaciones técnicas (solo para celulares)
    if (productType === 'cellphones') {
        commonFiltered = commonFiltered.filter(product => {
            const techSpecKeys = Object.keys(filters.techSpecs) as Array<keyof FilterState['techSpecs']>;

            return techSpecKeys.every(specKey => {
                const selectedSpecs = filters.techSpecs[specKey];
                if (selectedSpecs.length === 0) return true; // No filter for this spec

                // Asegurarse de que el producto sea un celular antes de acceder a dataTecnica
                if (isCellphone(product) && product.dataTecnica) {
                    const productSpecValue = product.dataTecnica[specKey];
                    if (productSpecValue) {
                        return selectedSpecs.includes(productSpecValue);
                    }
                }
                
                // Si el producto no tiene la especificación, no cumple el filtro
                return false;
            });
        });
    }

    // 4. Ordenar los productos resultantes
    return commonFiltered.sort((a, b) => {
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
