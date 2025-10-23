
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
  const productName = `${product.brand} ${product.model}`;
  
  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:border-primary hover:shadow-lg hover:shadow-primary/10">
        <CardHeader className="p-0">
          <div className="relative h-64 w-full">
            {product.imageUrl? (
              <Image
                src={product.imageUrl}
                alt={product.imageUrl}
                data-ai-hint={product.imageUrl}
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
            {productName}
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-muted-foreground">
            {product.brand}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-xl font-semibold">${product.salePrice}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
