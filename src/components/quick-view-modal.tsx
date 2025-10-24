
'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Image as ImageIcon, ShoppingCart, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  if (!product) return null;

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
    onClose(); // Cierra la modal después de añadir al carrito
  };

  const hasImage = !!product.imageUrl;
  const installmentPrice = product.installments ? product.salePrice / product.installments : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Vista Rápida</DialogTitle>
          <DialogClose asChild>
            <button className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-6 w-6" />
              <span className="sr-only">Cerrar</span>
            </button>
          </DialogClose>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Columna de Imagen */}
          <div className="relative aspect-square">
            {hasImage ? (
              <Image
                src={product.imageUrl!}
                alt={product.model}
                fill
                className="object-cover rounded-md"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted rounded-md">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Columna de Información */}
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <p className="text-sm font-medium text-primary">{product.brand}</p>
              <h2 className="font-headline text-3xl font-bold tracking-tight">
                {productName}
              </h2>
            </div>
            
            <div className="space-y-2">
                {product.originalPrice && product.originalPrice > product.salePrice && (
                <p suppressHydrationWarning className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString('es-AR')}
                </p>
                )}
                <div className="flex items-center gap-2">
                <p suppressHydrationWarning className="text-3xl font-bold">${product.salePrice.toLocaleString('es-AR')}</p>
                {product.discount && product.discount > 0 && (
                    <Badge className="bg-green-200 text-green-800 text-lg py-1">{product.discount}% OFF</Badge>
                )}
                </div>
                
                {product.installments && product.installments > 0 && (
                <p suppressHydrationWarning className="text-md text-muted-foreground">
                    o <strong>{product.installments} cuotas sin interés</strong> de <strong>${installmentPrice.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </p>
                )}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-3">
              {product.description}
            </p>

            <Button size="lg" className="w-full text-lg mt-4" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Añadir al Carrito
            </Button>

            <Link href={`/products/${product.id}`} className="text-center text-sm text-primary hover:underline mt-2">
              Ver detalles completos
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

