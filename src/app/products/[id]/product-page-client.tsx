
'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Image as ImageIcon, Truck, ShoppingCart, CreditCard, Star, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import ProductSpecs from "@/components/product-specs";
import AccessoriesCarousel from "@/components/accessories-carousel";

interface ProductPageClientProps {
  product: Product;
}

// Datos de ejemplo para la galería
const placeholderImages = [
  "https://pwxpxouatzzxvvvszdnx.supabase.co/storage/v1/object/public/celImagen/place.jpg",
  "https://pwxpxouatzzxvvvszdnx.supabase.co/storage/v1/object/public/celImagen/place.jpg",
  "https://pwxpxouatzzxvvvszdnx.supabase.co/storage/v1/object/public/celImagen/place.jpg",
  "https://pwxpxouatzzxvvvszdnx.supabase.co/storage/v1/object/public/celImagen/place.jpg",
];

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const [mainImage, setMainImage] = useState(product.imageUrl || placeholderImages[0]);
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();

  const productName = `${product.brand} ${product.model}`;
  const productImages = [product.imageUrl, ...placeholderImages.slice(1)].filter(Boolean) as string[];

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "✅ Añadido al carrito",
      description: `${productName} ha sido añadido a tu carrito.`,
      action: (
        <Link href="/carrito">
            <Button variant="secondary">Ver Carrito</Button>
        </Link>
      ),
    });
  };

  const handleBuyNow = () => {
    addItem(product);
    router.push('/checkout');
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-24 pb-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        
        {/* --- COLUMNA DE IMÁGENES --- */}
        <div className="md:sticky md:top-24 md:self-start">
          <Card className="overflow-hidden">
            <CardContent className="relative aspect-square p-0">
              <Image
                src={mainImage}
                alt={product.model}
                fill
                className="object-cover transition-opacity duration-300"
                key={mainImage} // Forza el rerender en cambio de imagen
              />
              {(product.discount ?? 0) > 0 && (
                <Badge variant="destructive" className="absolute top-3 right-3 text-base">
                  {product.discount}% OFF
                </Badge>
              )}
            </CardContent>
          </Card>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {productImages.map((img, index) => (
              <div
                key={index}
                className={`relative aspect-square cursor-pointer rounded-md border-2 ${mainImage === img ? 'border-primary' : 'border-transparent'} overflow-hidden`}
                onClick={() => setMainImage(img)}
              >
                <Image src={img} alt={`${productName} - vista ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* --- COLUMNA DE INFORMACIÓN Y COMPRA --- */}
        <div className="space-y-6">
           <div>
            <p className="text-sm font-medium text-primary">{product.brand}</p>
            <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
              {productName}
            </h1>
            {/* Social Proof: Estrellas y Reseñas */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <a href="#reviews" className="text-sm text-muted-foreground hover:underline">(123 reseñas)</a>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <p suppressHydrationWarning className="text-4xl font-bold">${product.salePrice.toLocaleString('es-AR')}</p>
              {product.originalPrice && product.originalPrice > product.salePrice && (
                <p suppressHydrationWarning className="text-2xl text-muted-foreground line-through">
                  ${product.originalPrice!.toLocaleString('es-AR')}
                </p>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Precio sin impuestos nacionales: ${(product.salePrice / 1.21).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            
            {(product.installments ?? 0) > 0 && (
              <p className="text-md font-semibold text-green-500">
                o <strong>{product.installments} cuotas sin interés</strong> de <strong>${(product.salePrice / product.installments).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>
              </p>
            )}
          </div>
          
          <Separator />
          
          {/* Elementos de Confianza */}
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground sm:grid-cols-3">
              <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> <span>Compra Segura</span></div>
              <div className="flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> <span>Envío Rápido</span></div>
              <div className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> <span>Pagos Flexibles</span></div>
          </div>

          <div className="flex flex-col space-y-4 pt-4">
            <Button size="lg" className="w-full text-lg h-12" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Añadir al Carrito
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full text-lg h-12"
              onClick={handleBuyNow}
            >
              Comprar Ahora
            </Button>
          </div>

        </div>
      </div>

      {/* --- INFORMACIÓN ADICIONAL (ACORDEÓN) --- */}
      <div className="mt-16">
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-semibold">Descripción</AccordionTrigger>
                <AccordionContent className="prose prose-invert max-w-none text-lg text-muted-foreground">
                    {product.description}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl font-semibold">Ficha Técnica</AccordionTrigger>
                <AccordionContent>
                    <ProductSpecs product={product} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        
        <AccessoriesCarousel brand={product.brand} currentProductId={product.id} />
      </div>
    </div>
  );
}
