"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product, Cellphone, Accessory } from "@/lib/types";
import ProductCatalog from "./product-catalog";
import { Smartphone, Star, Tag, Watch } from "lucide-react";
import ProductCard from "./product-card";
import QuickViewModal from "./quick-view-modal";
import { useState } from "react";
import { AutoScrollCarousel } from "./ui/auto-scroll-carousel";

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

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const discountedItems = discountedProducts.map(product => 
    <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
  );

  return (
    <>
    <section className="py-12 md:py-16">
      <div className="container mx-auto space-y-16">

        {/* Sección de Ofertas */}
        <div>
           <div className="text-center mb-8">
              <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">Ofertas Imperdibles</h2>
              <p className="mt-2 text-lg text-muted-foreground">Aprovecha nuestros descuentos por tiempo limitado.</p>
           </div>
           <AutoScrollCarousel
              items={discountedItems}
              carouselOptions={{ opts: { align: "start", loop: true } }}
              autoplayOptions={{ stopOnInteraction: true }}
            />
        </div>

        {/* Sección de Catálogo Principal (Celulares) */}
        <div>
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">Nuestro Catálogo de Celulares</h2>
            <p className="mt-2 text-lg text-muted-foreground">Encuentra el dispositivo perfecto que se adapta a tus necesidades.</p>
          </div>
          <ProductCatalog
            products={allProducts}
            brands={brands}
            capacityOptions={capacityOptions}
          />
        </div>

         {/* Sección de Accesorios */}
         <div>
          <div className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">Completa tu Experiencia</h2>
              <p className="mt-2 text-lg text-muted-foreground">Descubre los mejores accesorios para tus dispositivos.</p>
            </div>
            <ProductCatalog
              products={accessories}
              brands={[...new Set(accessories.map(a => a.brand))]} // Marcas solo de accesorios
              capacityOptions={[]} // Accesorios no tienen filtro de capacidad
            />
        </div>

      </div>
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
