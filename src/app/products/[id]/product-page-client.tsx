'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Image as ImageIcon, Truck, ShoppingCart, CreditCard } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import Preference from "@/lib/funtion/pago/RealizarCompra.js";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";

interface ProductPageClientProps {
  product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();

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

  const handleBuyNow = async () => {
    // CORRECCIÓN: Usar 'nombre', 'cantidad' y 'precio' para consistencia con el backend.
    const cartForMP = [{
      nombre: productName,
      cantidad: 1,
      precio: product.salePrice
    }];

    // Aquí deberías obtener el email del usuario logueado, por ahora usamos uno de prueba
    const email = "test.user@example.com"; 

    try {
      await Preference(email, cartForMP);
    } catch (error) {
      console.error("Error al iniciar la compra:", error);
      toast({
        variant: "destructive",
        title: "Error al comprar",
        description: "No se pudo iniciar el proceso de pago. Inténtalo de nuevo."
      });
    }
  };

  const hasImage = !!product.imageUrl;
  const installmentPrice = product.installments ? product.salePrice / product.installments : 0;

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-24 pb-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Imagen del producto */}
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
            </CardContent>
          </Card>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-primary">{product.brand}</p>
            <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
              {productName}
            </h1>
          </div>

          {/* SECCIÓN DE PRECIOS Y DESCUENTOS */}
          <div className="space-y-2">
            {product.originalPrice && product.originalPrice > product.salePrice && (
              <p suppressHydrationWarning className="text-xl text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString('es-AR')}
              </p>
            )}
            <div className="flex items-center gap-2">
              <p suppressHydrationWarning className="text-4xl font-bold">${product.salePrice.toLocaleString('es-AR')}</p>
              {product.discount && product.discount > 0 && (
                <Badge className="bg-green-200 text-green-800 text-lg py-1">{product.discount}% OFF</Badge>
              )}
            </div>
            
            {product.installments && product.installments > 0 && (
              <p suppressHydrationWarning className="text-md text-muted-foreground">
                o <strong>{product.installments} cuotas sin interés</strong> de <strong>${installmentPrice.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </p>
            )}
          </div>
          
          <p className="text-lg text-muted-foreground whitespace-pre-line">
            {product.description}
          </p>

          {/* Envío */}
          {product.shipping && (
            <div className="flex items-center text-blue-500 text-md font-medium">
                <Truck className="h-5 w-5 mr-2" />
                <span>Envío a domicilio disponible</span>
            </div>
          )}

          {/* Botones de acción */}
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

          {/* Detalles del producto */}
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
    </div>
  );
}
