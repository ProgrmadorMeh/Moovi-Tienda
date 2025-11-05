
'use client';

import { useState, useCallback } from 'react';
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
  storageOptions: string[];
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
  storageOptions,
  ramOptions,
  osOptions,
  processorOptions,
}: ProductSectionsProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const accessoryBrands = [...new Set(accessories.map((a) => a.brand))];
  const cellphoneBrands = [...new Set(allProducts.map((p) => p.brand))];


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

          <TabsContent value="all">
            <ProductCatalog
              products={allProducts}
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
