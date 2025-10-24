'use client';

import React from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import Preference from "@/lib/funtion/pago/RealizarCompra";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, CreditCard } from "lucide-react";
import type { Product } from "@/lib/types";

interface ProductPageClientProps {
  product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const { addToCart } = useCartStore();
  const { toast } = useToast();

  const productName = `${product.brand} ${product.model}`;

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${productName} has been added to your cart.`,
      action: (
        <Button asChild variant="secondary">
          <a href="#">View Cart</a>
        </Button>
      ),
    });
  };

  const handleBuyNow = async () => {
    const email = "test.user@example.com"; // ⚠️ Reemplazar con email real del usuario logueado
    const cartItem = {
      nombre: productName,
      cantidad: 1,
      precio: product.salePrice,
    };
    await Preference(email, [cartItem]);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-24 pb-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Imagen del producto */}
        <div className="md:sticky md:top-20 md:self-start">
          <Card className="overflow-hidden">
            <CardContent className="relative aspect-square p-0">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.model}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <span className="text-muted-foreground">No Image</span>
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

          <p className="text-4xl font-bold">${product.salePrice}</p>
          <p className="text-lg text-muted-foreground whitespace-pre-line">
            {product.description}
          </p>

          <div className="flex flex-col space-y-4">
            <Button size="lg" className="w-full text-lg" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full text-lg"
              onClick={handleBuyNow}
            >
              <CreditCard className="mr-2 h-5 w-5" /> Buy Now
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="font-headline text-2xl font-semibold">Details</h3>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="flex justify-between">
                <span className="font-medium text-foreground">Capacity</span>
                <span>{product.capacity}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-foreground">Color</span>
                <span>{product.color}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-foreground">In Stock</span>
                <span>{product.stock}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
