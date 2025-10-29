'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, X, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/cart-store';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { defaultBase } from '@/lib/types';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: '✅ Añadido al carrito',
      description: `${product.model} ha sido añadido a tu carrito.`,
      action: (
        <Link href="/carrito">
          <Button variant="secondary">Ver Carrito</Button>
        </Link>
      ),
    });
    onClose(); // Cierra la modal después de añadir al carrito
  };

  const showDiscount = (product.discount ?? 0) > 0;
  const showOriginalPrice = product.originalPrice && product.originalPrice > product.salePrice;

  // Determina la imagen a mostrar
  let imageSrc = defaultBase.imageUrl;
  if (product.imageUrl) {
    if (Array.isArray(product.imageUrl) && product.imageUrl.length > 0 && product.imageUrl[0]) {
      imageSrc = product.imageUrl[0];
    } else if (typeof product.imageUrl === 'string' && product.imageUrl) {
      imageSrc = product.imageUrl;
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[825px]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Columna de Imagen */}
          <div className="relative aspect-square">
            <Image
              src={imageSrc}
              alt={product.model}
              fill
              className="rounded-md object-cover"
            />
            {showDiscount && (
              <Badge variant="destructive" className="absolute top-3 right-3 text-lg">
                {product.discount}% OFF
              </Badge>
            )}
          </div>

          {/* Columna de Información */}
          <div className="flex flex-col space-y-4">
            <DialogHeader>
              <p className="text-sm font-medium text-primary">{product.brand}</p>
              <DialogTitle className="text-3xl font-bold font-headline">{product.model}</DialogTitle>
            </DialogHeader>

            <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold">${product.salePrice.toLocaleString('es-AR')}</p>
                    {showOriginalPrice && (
                        <p className="text-xl text-muted-foreground line-through">
                        ${product.originalPrice!.toLocaleString('es-AR')}
                        </p>
                    )}
                </div>
                {(product.installments ?? 0) > 0 ? (
                    <p className="text-sm text-green-600">
                        o {product.installments} cuotas sin interés de ${(product.salePrice / product.installments).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </p>
                ) : (product as any).fees && (
                    <p className="text-base font-semibold text-green-600">
                        o {(product as any).fees.count} cuotas de ${((product as any).fees.price).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                )}
            </div>

            <DialogDescription className="text-base text-muted-foreground flex-grow overflow-y-auto max-h-40">
                {product.description}
            </DialogDescription>
            
            <DialogFooter className="flex-col sm:flex-col sm:space-x-0 space-y-2">
              <Button size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Añadir al Carrito
              </Button>
              <Link href={`/products/${product.id}`} className="w-full">
                  <Button variant="outline" size="lg" className="w-full" onClick={onClose}>
                      Ver Detalles Completos
                  </Button>
              </Link>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
