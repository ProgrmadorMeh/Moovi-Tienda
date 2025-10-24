import Link from "next/link";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

import type { Product } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}



export default function ProductCard({ product }: ProductCardProps) {

  const isValidImageUrl = (url?: string) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }; 
  const productName = `${product.brand} ${product.model}`;
  const hasImage = product.imageUrl && isValidImageUrl(product.imageUrl);
  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:border-primary hover:shadow-lg hover:shadow-primary/10">
        <CardHeader className="p-0">
          
          <div className="relative h-64 w-full">
          {hasImage ? (
            <Image
              src={product.imageUrl!}
              alt={productName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gray-200">
              <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
              <span className="text-gray-500 font-medium text-lg">sin imagen</span>
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
