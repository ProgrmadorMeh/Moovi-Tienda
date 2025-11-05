
'use client';

import { useState, useCallback, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product, Cellphone, Accessory } from '@/lib/types';
import ProductCatalog from './product-catalog';
import QuickViewModal from './quick-view-modal';
import { Smartphone, Star, Tag, Watch } from 'lucide-react';
import useProductFilters from '@/hooks/use-product-filters';
import ProductFilters from './product-filters';
import PaginationControls from './pagination-controls';

interface ProductSectionsProps {
  cellphones: Cellphone[];
  accessories: Accessory[];
  brands: string[];
<<<<<<< HEAD
  capacityOptions: string[];
=======
  storageOptions: string[];
>>>>>>> main
  ramOptions: string[];
  osOptions: string[];
  processorOptions: string[];
}

const PRODUCTS_PER_PAGE = 20;

export default function ProductSections({
  cellphones,
  accessories,
  brands,
<<<<<<< HEAD
  capacityOptions,
=======
  storageOptions,
>>>>>>> main
  ramOptions,
  osOptions,
  processorOptions,
}: ProductSectionsProps) {
<<<<<<< HEAD
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const catalogRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('all');

  const productsMap: { [key: string]: Product[] } = {
    all: allProducts,
    featured: featuredProducts,
    discounted: discountedProducts,
    accessories: accessories,
  };

  const currentProductList = productsMap[activeTab];

  const {
    paginatedProducts,
    filters,
    setFilters,
    sort,
    setSort,
    currentPage,
    totalPages,
    handlePageChange,
  } = useProductFilters(currentProductList, PRODUCTS_PER_PAGE, catalogRef);
=======
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
>>>>>>> main

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

<<<<<<< HEAD
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Determinar qué filtros mostrar basados en la pestaña activa
  const isAccessoryTab = activeTab === 'accessories';
  const currentBrands = isAccessoryTab ? [...new Set(accessories.map((a) => a.brand))] : brands;
=======
  // Derivamos los productos destacados y en oferta SOLAMENTE de los celulares.
  const featuredProducts = useMemo(() => cellphones.filter((p) => p.discount > 0), [cellphones]);
  const discountedProducts = useMemo(() => cellphones.filter((p) => p.discount > 0), [cellphones]);

  const accessoryBrands = [...new Set(accessories.map((a) => a.brand))];
  const cellphoneBrands = [...new Set(cellphones.map((p) => p.brand))];

>>>>>>> main

  return (
    <>
      <section className="py-12 md:py-16">
        <Tabs defaultValue="all" className="w-full">
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

<<<<<<< HEAD
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              <aside className="lg:col-span-1">
                  <div className="sticky top-20">
                      <ProductFilters
                          brands={currentBrands}
                          capacityOptions={isAccessoryTab ? [] : capacityOptions}
                          ramOptions={isAccessoryTab ? [] : ramOptions}
                          osOptions={isAccessoryTab ? [] : osOptions}
                          processorOptions={isAccessoryTab ? [] : processorOptions}
                          filters={filters}
                          setFilters={setFilters}
                          sort={sort}
                          setSort={setSort}
                      />
                  </div>
              </aside>
              <main className="lg:col-span-3">
                  <ProductCatalog
                      products={paginatedProducts}
                      onQuickView={handleQuickView}
                  />
                  {totalPages > 1 && (
                      <PaginationControls
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                      />
                  )}
              </main>
          </div>
=======
          <TabsContent value="all">
            <ProductCatalog
              products={cellphones}
              productType="cellphones"
              brands={cellphoneBrands}
              storageOptions={storageOptions}
              ramOptions={ramOptions}
              osOptions={osOptions}
              processorOptions={processorOptions}
              onQuickView={handleQuickView}
            />
          </TabsContent>

          <TabsContent value="featured">
            <ProductCatalog
              products={featuredProducts}
              productType="cellphones"
              brands={cellphoneBrands}
              storageOptions={storageOptions}
              ramOptions={ramOptions}
              osOptions={osOptions}
              processorOptions={processorOptions}
              onQuickView={handleQuickView}
            />
          </TabsContent>

          <TabsContent value="discounted">
            <ProductCatalog
              products={discountedProducts}
              productType="cellphones"
              brands={cellphoneBrands}
              storageOptions={storageOptions}
              ramOptions={ramOptions}
              osOptions={osOptions}
              processorOptions={processorOptions}
              onQuickView={handleQuickView}
            />
          </TabsContent>

          <TabsContent value="accessories">
            <ProductCatalog
              products={accessories}
              productType="accessories"
              brands={accessoryBrands}
              storageOptions={[]}
              ramOptions={[]}
              osOptions={[]}
              processorOptions={[]}
              onQuickView={handleQuickView}
            />
          </TabsContent>
>>>>>>> main
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
