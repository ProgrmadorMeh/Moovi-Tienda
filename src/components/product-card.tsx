'use client';

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { defaultBase } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

const ProductCard = memo(({ product, onQuickView }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const { toast } = useToast();

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

  // 🔹 Determinar la imagen a usar
  let imageSrc = defaultBase.imageUrl as string;

  if (product.imageUrl) {
    if (Array.isArray(product.imageUrl) && product.imageUrl.length > 0 && product.imageUrl[0]) {
      imageSrc = product.imageUrl[0];
    } else if (typeof product.imageUrl === "string" && product.imageUrl) {
      imageSrc = product.imageUrl;
    }
  }


  return (
    <div className="group relative w-full overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden">
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
              <ShieldCheck size={24} />
              <span>Envío Seguro</span>
            </Badge>
          )}
          <Image
            src={imageSrc}
            alt={productName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Botón de Vista Rápida que aparece al hacer hover */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="secondary"
          className="shadow-lg"
          onClick={(e) => {
            e.stopPropagation(); // Evita que el link de la tarjeta se active
            onQuickView(product);
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          Vista Rápida
        </Button>
      </div>

      <div className="flex flex-col p-4">
        <div className="flex-1">
          <p className="text-xl font-medium text-primary">{product.brand || 'Sin Marca'}</p>
          <p className="text-xl truncate font-semibold">{productName}</p>

          <div className="mt-2 space-y-1">
            {product.originalPrice && product.originalPrice > product.salePrice && (
              <p className="text-lg text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString("es-AR")}
              </p>
            )}
            <p className="text-2xl font-bold">
              ${product.salePrice.toLocaleString("es-AR")}
            </p>

            <p className="text-lg text-muted-foreground">
              Precio sin impuestos nacionales: ${(product.salePrice / 1.21).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>

            {(product.installments ?? 0) > 0 ? (
                <p className="text-lg text-green-600">
                    o {product.installments} cuotas sin interés de ${(product.salePrice / product.installments).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </p>
            ) : (product as any).fees && (
                <p className="text-lg font-semibold text-green-600">
                    o {(product as any).fees.count} cuotas de ${((product as any).fees.price).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            )}
          </div>
        </div>
        <Button onClick={handleAddToCart} className="mt-4 w-full">
          <ShoppingCart className="mr-2 h-4 w-4" /> Agregar al carrito
        </Button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
