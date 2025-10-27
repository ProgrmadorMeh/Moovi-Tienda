"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product, Cellphone, Accessory } from "@/lib/types";
import ProductCatalog from "./product-catalog";
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

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto">
        <Tabs defaultValue="celulares" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto bg-violet-50 dark:bg-violet-950 rounded-xl p-2">
            <TabsTrigger value="celulares" className="flex flex-col gap-2 h-full py-3">
              <Smartphone className="w-7 h-7" />
              <span>Celulares</span>
            </TabsTrigger>
            <TabsTrigger value="destacados" className="flex flex-col gap-2 h-full py-3">
              <Star className="w-7 h-7" />
              <span>Destacados</span>
            </TabsTrigger>
            <TabsTrigger value="ofertas" className="flex flex-col gap-2 h-full py-3">
              <Tag className="w-7 h-7" />
              <span>Ofertas</span>
            </TabsTrigger>
            <TabsTrigger value="accesorios" className="flex flex-col gap-2 h-full py-3">
              <Watch className="w-7 h-7" />
              <span>Accesorios</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="celulares">
            <ProductCatalog
              products={allProducts}
              brands={brands}
              capacityOptions={capacityOptions}
            />
          </TabsContent>

          <TabsContent value="destacados">
            <ProductCatalog
              products={featuredProducts}
              brands={brands}
              capacityOptions={capacityOptions}
            />
          </TabsContent>

          <TabsContent value="ofertas">
            <ProductCatalog
              products={discountedProducts}
              brands={brands}
              capacityOptions={capacityOptions}
            />
          </TabsContent>

          <TabsContent value="accesorios">
            <ProductCatalog
              products={accessories}
              brands={brands}
              capacityOptions={[]} // Accesorios no tienen filtro de capacidad
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
