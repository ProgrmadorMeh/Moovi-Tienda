import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

import type { Product } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:border-primary hover:shadow-lg hover:shadow-primary/10">
        <CardHeader className="p-0">
          <div className="relative h-64 w-full">
            {product.images?.[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt}
                data-ai-hint={product.images[0].hint}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="font-headline text-lg leading-tight">
            {product.name}
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-muted-foreground">
            {product.brand}
          </CardDescription>
          <div className="mt-2 flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(product.rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-xl font-semibold">${product.price}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
