
import Link from "next/link";
import Image from "next/image";
import { Eye, Image as ImageIcon, Truck } from "lucide-react";

import type { Product } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const productName = `${product.model}`;
  const hasImage = product.imageUrl && product.imageUrl.trim() !== "";
  const installmentPrice = product.installments ? product.salePrice / product.installments : 0;

  return (
    <Card className="group relative h-full overflow-hidden transition-all duration-300 ease-in-out hover:border-primary hover:shadow-lg hover:shadow-primary/10">
      <Link href={`/products/${product.id}`} className="block">
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
              <div className="flex h-full w-full flex-col items-center justify-center bg-muted">
                <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                <span className="text-muted-foreground">sin imagen</span>
              </div>
            )}
            {product.uniquePrice && (
              <Badge variant="secondary" className="absolute top-2 right-2 bg-blue-500 text-white">
                Precio único
              </Badge>
            )}

            {/* Overlay for Quick View buttons */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between items-center p-4">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full self-end"
                onClick={(e) => {
                    e.preventDefault();
                    onQuickView(product);
                }}
                aria-label="Vista Rápida"
              >
                <Eye className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={(e) => {
                    e.preventDefault();
                    onQuickView(product);
                }}
              >
                Vista previa
              </Button>
            </div>

          </div>
        </CardHeader>

        <CardContent className="p-4">
          {product.payInBill && (
            <div className="text-sm text-pink-500 bg-pink-100 px-2 py-1 rounded-md inline-block mb-2">
              Pagalo en tu factura
            </div>
          )}
          <CardDescription className="text-lg text-muted-foreground">
            {product.brand}
          </CardDescription>
          <CardTitle className="font-headline text-xl leading-tight mt-1">
            {productName}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{product.capacity}</p>

          <div className="mt-4">
            {product.originalPrice && product.originalPrice > product.salePrice && (
              <p suppressHydrationWarning className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString('es-AR')}
              </p>
            )}
            <div className="flex items-center">
              <p suppressHydrationWarning className="text-2xl font-bold">${product.salePrice.toLocaleString('es-AR')}</p>
              {product.discount && (
                <Badge className="ml-2 bg-green-200 text-green-800">
                  {product.discount}% off
                </Badge>
              )}
            </div>

            {product.installments && product.installments > 0 && (
              <p suppressHydrationWarning className="text-sm text-muted-foreground">
                  o {product.installments} cuotas sin interés de $
                  {(product.salePrice / product.installments).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
            
            {product.taxedPrice && (
              <p suppressHydrationWarning className="text-xs text-muted-foreground mt-1">
                Precio s/imp. nac: ${product.taxedPrice.toLocaleString('es-AR')}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {product.shipping && (
            <div className="flex items-center text-blue-500">
              <Truck className="h-5 w-5 mr-2" />
              <p className="text-sm font-medium">Envío a domicilio</p>
            </div>
          )}
         </CardFooter>
      </Link>
    </Card>
  );
}
