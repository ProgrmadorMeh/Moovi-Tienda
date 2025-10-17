'use client';

import { getProductById } from "@/lib/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import * as React from "react";

import Preference from "@/lib/funtion/RealizarCompra";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = React.use(params);
  const product = getProductById(resolvedParams.id);
  const { addToCart } = useCartStore();
  const { toast } = useToast();

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      action: (
        <Button asChild variant="secondary">
          <a href="#">View Cart</a>
        </Button>
      ),
    });
  };

  const handleBuyNow = async () => {
    if (!product) return;
    const email = "test.user@example.com"; // TODO: Reemplazar con el email del usuario logueado
    const cartItem = {
      nombre: product.name,
      cantidad: 1,
      precio: product.price,
    };
    await Preference(email, [cartItem]);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <div className="md:sticky md:top-20 md:self-start">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden">
                    <CardContent className="relative aspect-square p-0">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        data-ai-hint={image.hint}
                        fill
                        className="object-cover"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-primary">{product.brand}</p>
            <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-5 w-5",
                    i < Math.round(product.rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <p className="text-4xl font-bold">${product.price}</p>

          <p className="text-lg text-muted-foreground">{product.description}</p>
          
          <div className="flex flex-col space-y-4">
            <Button size="lg" className="w-full text-lg" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button variant="secondary" size="lg" className="w-full text-lg" onClick={handleBuyNow}>
              <CreditCard className="mr-2 h-5 w-5" /> Buy Now
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="font-headline text-2xl font-semibold">Specifications</h3>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="font-medium text-foreground">{key}</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
