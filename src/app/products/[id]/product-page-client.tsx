
'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Image as ImageIcon, Truck, ShoppingCart, CreditCard } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import ProductSpecs from "@/components/product-specs";
import AccessoriesCarousel from "@/components/accessories-carousel";

interface ProductPageClientProps {
  product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();

  const productName = `${product.brand} ${product.model}`;

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

  const hasImage = !!product.imageUrl;
  
  const showDiscount = product.discount && product.discount > 0;
  const showOriginalPrice = product.originalPrice && product.originalPrice > product.salePrice;

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-24 pb-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <div className="md:sticky md:top-20 md:self-start">
          <Card className="overflow-hidden">
            <CardContent className="relative aspect-square p-0">
              {hasImage ? (
                <Image
                  src={product.imageUrl!}
                  alt={product.model}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-muted">
                  <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                  <span className="text-gray-500 font-medium text-lg">sin imagen</span>
                </div>
              )}
               {showDiscount && (
                <Badge variant="destructive" className="absolute top-3 right-3 text-base">
                  {product.discount}% OFF
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <div>
            <p className="text-sm font-medium text-primary">{product.brand}</p>
            <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
              {productName}
            </h1>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <p suppressHydrationWarning className="text-4xl font-bold">${product.salePrice.toLocaleString('es-AR')}</p>
              {showOriginalPrice && (
                <p suppressHydrationWarning className="text-2xl text-muted-foreground line-through">
                  ${product.originalPrice!.toLocaleString('es-AR')}
                </p>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Precio sin impuestos nacionales: ${(product.salePrice / 1.21).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            
            {product.installments > 0 && (
                 <p className="text-md text-muted-foreground">
                 o <strong>{product.installments} cuotas sin interés</strong> de <strong>${(product.salePrice / product.installments).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
               </p>
            )}
          </div>
          
          <p className="text-lg text-muted-foreground whitespace-pre-line">
            {product.description}
          </p>

          {product.shipping && (
            <div className="flex items-center text-blue-500 text-md font-medium">
                <Truck className="h-5 w-5 mr-2" />
                <span>Envío a domicilio disponible</span>
            </div>
          )}

          <div className="flex flex-col space-y-4 pt-4">
            <Button size="lg" className="w-full text-lg" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Añadir al Carrito
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full text-lg"
              onClick={handleBuyNow}
            >
              <CreditCard className="mr-2 h-5 w-5" /> Comprar Ahora
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="font-headline text-2xl font-semibold">Detalles</h3>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              {product.capacity && <li className="flex justify-between">
                <span className="font-medium text-foreground">Capacidad</span>
                <span>{product.capacity}</span>
              </li>}
              {product.color && <li className="flex justify-between">
                <span className="font-medium text-foreground">Color</span>
                <span>{product.color}</span>
              </li>}
              <li className="flex justify-between">
                <span className="font-medium text-foreground">En Stock</span>
                <span>{product.stock}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <ProductSpecs product={product} />
        <AccessoriesCarousel brand={product.brand} currentProductId={product.id} />
      </div>
    </div>
  );
}
