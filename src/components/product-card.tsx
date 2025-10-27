'use client';

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
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

  const hasImage = product.imageUrl && product.imageUrl.trim() !== "";
  
  // Condiciones de visualización más estrictas para evitar ceros o valores no deseados
  const showDiscount = typeof product.discount === 'number' && product.discount > 0;
  const showOriginalPrice = typeof product.originalPrice === 'number' && product.originalPrice > product.salePrice;
  const showInstallments = typeof product.installments === 'number' && product.installments > 0;

  return (
    <div className="group relative w-full overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden">
          {showDiscount && (
            <Badge
              variant="destructive"
              className="absolute top-2 right-2 z-10"
            >
              {product.discount}% OFF
            </Badge>
          )}
          <div className="relative h-64 w-full">
            <Image
              src={hasImage ? product.imageUrl! : "https://pwxpxouatzzxvvvszdnx.supabase.co/storage/v1/object/public/celImagen/place.jpg"}
              alt={productName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </Link>
      <div className="flex flex-col p-4">
        <div className="flex-1">
          <p className="text-xs font-medium text-primary">{product.brand || 'Sin Marca'}</p>
          <h3 className="truncate font-semibold">{productName}</h3>
          
          <div className="mt-2">
            {showOriginalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                ${product.originalPrice!.toLocaleString("es-AR")}
              </p>
            )}
            <p className="text-lg font-bold">
              ${product.salePrice.toLocaleString("es-AR")}
            </p>
            {showInstallments && (
                 <p className="text-xs text-green-600">
                 o {product.installments} cuotas de ${(product.salePrice / product.installments).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
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
}
