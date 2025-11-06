
'use client';

import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { defaultBase } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";
import { cn, formatPrice } from "@/lib/utils";
import { useCurrency } from "@/lib/currency-context";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  priority?: boolean;
}

const ProductCard = memo(({ product, onQuickView, priority = false }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { currency, rate } = useCurrency(); // <-- Hook para obtener la moneda

  const productName = `${product.model}`;

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

  let imageSrc = defaultBase.imageUrl as string;

  if (product.imageUrl) {
    if (Array.isArray(product.imageUrl) && product.imageUrl.length > 0 && product.imageUrl[0]) {
      imageSrc = product.imageUrl[0];
    } else if (typeof product.imageUrl === "string" && product.imageUrl) {
      imageSrc = product.imageUrl;
    }
  }

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <div className="group relative w-full overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-lg flex flex-col">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden">
          {isImageLoading && <Skeleton className="absolute inset-0 h-full w-full" />}
          {(product.discount ?? 0) > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-2 right-2 z-10 text-base"
            >
              {product.discount}% OFF
            </Badge>
          )}
          {product.shipping && (
            <Badge
              variant="default"
              className="absolute top-2 left-2 z-10 flex items-center gap-1"
            >
              <ShieldCheck size={16} />
              <span>Envío Seguro</span>
            </Badge>
          )}
          <Image
            src={imageSrc}
            alt={productName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={cn(
                "object-cover transition-transform duration-300 group-hover:scale-105",
                isImageLoading ? "opacity-0" : "opacity-100"
            )}
            priority={priority}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)} // También maneja errores de carga
          />
        </div>
      </Link>
      
      <div className="flex flex-1 flex-col p-3 relative">
        <div className="flex-1">
          <p className="text-sm font-medium text-primary">{product.brand || 'Sin Marca'}</p>
          <h3 className="text-lg truncate font-semibold">{productName}</h3>

          <div className="mt-2 space-y-0.5">
            {product.originalPrice && product.originalPrice > product.salePrice && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice, currency, rate)}
              </p>
            )}
            <p className="text-xl font-bold">
              {formatPrice(product.salePrice, currency, rate)}
            </p>

            <p className="text-xs text-muted-foreground">
              Precio sin impuestos: {formatPrice(product.salePrice / 1.21, currency, rate)}
            </p>

            {(product.installments ?? 0) > 0 ? (
                <p className="text-sm text-green-600">
                    o {product.installments} cuotas de {formatPrice(product.salePrice / product.installments, currency, rate)}
                </p>
            ) : (product as any).fees && (
                <p className="text-sm font-semibold text-green-600">
                    o {(product as any).fees.count} cuotas de {formatPrice(((product as any).fees.price), currency, rate)}
                </p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
            <div className="grid grid-cols-2 gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleQuickViewClick}
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Vista Rápida
                </Button>
                <Button variant="outline" size="sm" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Agregar
                </Button>
            </div>
            <Link href={`/products/${product.id}`} className="w-full block mt-2">
              <Button className="w-full" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Detalles
              </Button>
            </Link>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
