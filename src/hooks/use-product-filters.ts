
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
  return product.hasOwnProperty('dataTecnica');
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
    let filtered = products.filter((product) => {
      // Brand Filter
      const brandMatch = filters.brand === "all" || product.brand === filters.brand;

      // Price Filter
      const selectedPriceRange = priceRanges.find(r => r.value === filters.price);
      const priceMatch = filters.price === "all" || (selectedPriceRange && product.salePrice >= selectedPriceRange.min && product.salePrice < selectedPriceRange.max);
      
      // Early exit for non-matching common filters
      if (!brandMatch || !priceMatch) {
          return false;
      }

      // If we are filtering accessories, we are done.
      if (productType === 'accessories') {
          return true;
      }

      // --- Logic for cellphones: check all tech specs ---
      if (productType === 'cellphones' && isCellphone(product)) {
        const techSpecKeys = Object.keys(filters.techSpecs) as Array<keyof FilterState['techSpecs']>;

        // Check every tech spec filter. `every` returns true if the array is empty.
        return techSpecKeys.every(specKey => {
            const selectedSpecs = filters.techSpecs[specKey];
            // If no filter is selected for this spec, it's a match.
            if (selectedSpecs.length === 0) return true;

            const productSpecValue = product.dataTecnica?.[specKey];
            // If the product has the spec, its value must be in the selected filters.
            if (productSpecValue) {
                return selectedSpecs.includes(productSpecValue);
            }

            // If the product doesn't have the spec, it's not a match for this filter.
            return false;
        });
      }

      // Default to false if it's not an accessory and doesn't pass cellphone checks
      return false;
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
