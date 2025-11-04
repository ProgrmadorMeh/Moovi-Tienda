
'use client';

import { useState, useRef, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product, Cellphone, Accessory } from '@/lib/types';
import ProductCatalog from './product-catalog';
import QuickViewModal from './quick-view-modal';
import { Smartphone, Star, Tag, Watch } from 'lucide-react';

interface ProductSectionsProps {
  allProducts: Cellphone[];
  featuredProducts: Cellphone[];
  discountedProducts: Cellphone[];
  accessories: Accessory[];
  brands: string[];
  capacityOptions: string[];
  ramOptions: string[];
  osOptions: string[];
  processorOptions: string[];
}

export default function ProductSections({
  allProducts,
  featuredProducts,
  discountedProducts,
  accessories,
  brands,
  capacityOptions,
  ramOptions,
  osOptions,
  processorOptions,
}: ProductSectionsProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const catalogRef = useRef<HTMLDivElement>(null);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const handleTabChange = () => {
    setCurrentPage(1);
  };

  return (
    <>
      <section ref={catalogRef} className="py-12 md:py-16">
        <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 h-auto md:grid-cols-4 mb-8">
            <TabsTrigger value="all" className="py-2.5 text-base gap-2">
              <Smartphone />
              Celulares
            </TabsTrigger>
            <TabsTrigger value="featured" className="py-2.5 text-base gap-2">
              <Star />
              Destacados
            </TabsTrigger>
            <TabsTrigger value="discounted" className="py-2.5 text-base gap-2">
              <Tag />
              Ofertas
            </TabsTrigger>
            <TabsTrigger value="accessories" className="py-2.5 text-base gap-2">
              <Watch />
              Accesorios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ProductCatalog
              products={allProducts}
              brands={brands}
              capacityOptions={capacityOptions}
              ramOptions={ramOptions}
              osOptions={osOptions}
              processorOptions={processorOptions}
              onQuickView={handleQuickView}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </TabsContent>

          <TabsContent value="featured">
            <ProductCatalog
              products={featuredProducts}
              brands={brands}
              capacityOptions={capacityOptions}
              ramOptions={ramOptions}
              osOptions={osOptions}
              processorOptions={processorOptions}
              onQuickView={handleQuickView}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </TabsContent>

          <TabsContent value="discounted">
            <ProductCatalog
              products={discountedProducts}
              brands={brands}
              capacityOptions={capacityOptions}
              ramOptions={ramOptions}
              osOptions={osOptions}
              processorOptions={processorOptions}
              onQuickView={handleQuickView}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </TabsContent>

          <TabsContent value="accessories">
            <ProductCatalog
              products={accessories}
              brands={[...new Set(accessories.map((a) => a.brand))]} // Marcas solo de accesorios
              capacityOptions={[]} // Accesorios no tienen filtro de capacidad
              ramOptions={[]}
              osOptions={[]}
              processorOptions={[]}
              onQuickView={handleQuickView}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </TabsContent>
        </Tabs>
      </section>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
