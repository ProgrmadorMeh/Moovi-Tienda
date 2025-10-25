'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Fuse from 'fuse.js';
import { Search, Loader2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { getAllItems } from '@/lib/products';
import { Input } from './ui/input';

// Hook para detectar clics fuera de un elemento
function useClickOutside(ref: React.RefObject<any>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default function FuzzySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Fuse.FuseResult<Product>[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(searchContainerRef, () => {
    setIsDropdownVisible(false);
  });
  
  // Opciones de Fuse.js para la búsqueda "fuzzy"
  const fuseOptions = {
    keys: ['model', 'brand', 'description'],
    includeScore: true,
    threshold: 0.4, // Umbral de sensibilidad (0 es exacto, 1 es muy flexible)
    minMatchCharLength: 2,
  };
  
  let fuse: Fuse<Product> | null = null;
  if(allProducts.length > 0) {
      fuse = new Fuse(allProducts, fuseOptions);
  }

  // Cargar todos los productos una sola vez
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const items = await getAllItems();
      setAllProducts(items);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    if (newQuery.length > 1 && fuse) {
      const searchResults = fuse.search(newQuery);
      setResults(searchResults.slice(0, 5)); // Limitar a los 5 mejores resultados
      setIsDropdownVisible(true);
    } else {
      setResults([]);
      setIsDropdownVisible(false);
    }
  };

  const handleFocus = () => {
    if (query.length > 1 && results.length > 0) {
      setIsDropdownVisible(true);
    }
  }

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar productos..."
          value={query}
          onChange={handleSearch}
          onFocus={handleFocus}
          disabled={isLoading}
          className="w-full pl-10 bg-white/10 border-white/20 placeholder:text-gray-300"
        />
        {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isDropdownVisible && query.length > 1 && (
        <div className="absolute top-full mt-2 w-full rounded-md border bg-background shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <ul>
              {results.map(({ item }) => (
                <li key={item.id}>
                  <Link 
                    href={`/products/${item.id}`} 
                    className="flex items-center space-x-4 p-3 hover:bg-accent transition-colors"
                    onClick={() => setIsDropdownVisible(false)} // Ocultar al hacer clic
                  >
                    <div className="relative h-16 w-16 flex-shrink-0">
                       <Image
                          src={item.imageUrl || '/img/default-product.jpg'}
                          alt={item.model}
                          fill
                          className="rounded-md object-cover"
                        />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.brand} {item.model}</p>
                      <p className="text-xs text-muted-foreground">${item.salePrice.toLocaleString('es-AR')}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No se encontraron resultados para "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
