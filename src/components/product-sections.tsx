"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product, Cellphone, Accessory } from "@/lib/types";
import ProductCatalog from "./product-catalog";
import ProductCard from "./product-card";
import QuickViewModal from "./quick-view-modal";
import { Smartphone, Star, Tag, Watch } from "lucide-react";

interface ProductSectionsProps {
  allProducts: Cellphone[];
  featuredProducts: Cellphone[];
  discountedProducts: Cellphone[];
  accessories: Accessory[];
  brands: string[];
  capacityOptions: string[];
}

export default function ProductSections({
  allProducts,
  featuredProducts,
  discountedProducts,
  accessories,
  brands,
  capacityOptions,
}: ProductSectionsProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  return (
    <>
      <section className="py-12 md:py-16">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto md:grid-cols-4 mb-8">
            <TabsTrigger value="all" className="py-2.5 text-base gap-2"><Smartphone />Celulares</TabsTrigger>
            <TabsTrigger value="featured" className="py-2.5 text-base gap-2"><Star />Destacados</TabsTrigger>
            <TabsTrigger value="discounted" className="py-2.5 text-base gap-2"><Tag />Ofertas</TabsTrigger>
            <TabsTrigger value="accessories" className="py-2.5 text-base gap-2"><Watch />Accesorios</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ProductCatalog
              products={allProducts}
              brands={brands}
              capacityOptions={capacityOptions}
            />
          </TabsContent>

          <TabsContent value="featured">
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="discounted">
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {discountedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="accessories">
            <ProductCatalog
              products={accessories}
              brands={[...new Set(accessories.map(a => a.brand))]} // Marcas solo de accesorios
              capacityOptions={[]} // Accesorios no tienen filtro de capacidad
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
