
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore, CartItem } from '@/lib/cart-store';
import {
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { defaultBase } from '@/lib/types';
import { memo, useMemo } from 'react';
import { useCurrency } from '@/lib/currency-context';
import { formatPrice } from '@/lib/utils';

export default function CartSheet() {
  const { items } = useCartStore();
  const { currency, rate } = useCurrency();

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);
  }, [items]);

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-xl">Tu Carrito</SheetTitle>
      </SheetHeader>

      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center space-y-4">
          <ShoppingCart size={48} className="text-gray-400" />
          <p className="text-center text-lg text-gray-500">
            Tu carrito está vacío
          </p>
          <SheetClose asChild>
            <Link href="/">
              <Button variant="outline">Seguir Comprando</Button>
            </Link>
          </SheetClose>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between">
          {/* Lista de productos */}
          <div className="flex-1 overflow-y-auto pr-4">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          {/* Footer del carrito */}
          <SheetFooter className="flex-col space-y-4 border-t pt-6 sm:flex-col sm:space-y-4">
            <div className="flex w-full justify-between text-lg font-semibold">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal, currency, rate)}</span>
            </div>

            <div className="grid w-full grid-cols-2 gap-4">
              <SheetClose asChild>
                <Link href="/carrito" passHref>
                  <Button variant="outline">Ver Carrito</Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/checkout" passHref>
                  <Button>Finalizar Compra</Button>
                </Link>
              </SheetClose>
            </div>
          </SheetFooter>
        </div>
      )}
    </>
  );
}

// --- Componente para cada fila del carrito (Memoizado) ---

const CartItemRow = memo(function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();
  const { currency, rate } = useCurrency();

    // Lógica para asegurar que siempre haya una URL de imagen válida
    let imageSrc = defaultBase.imageUrl as string;
    if (Array.isArray(item.imageUrl) && item.imageUrl.length > 0 && item.imageUrl[0]) {
        imageSrc = item.imageUrl[0];
    } else if (typeof item.imageUrl === 'string' && item.imageUrl) {
        imageSrc = item.imageUrl;
    }

  return (
    <div className="flex items-start space-x-4 py-4">
      <div className="relative h-24 w-24 flex-shrink-0">
        <Image
          src={imageSrc}
          alt={item.model}
          fill
          className="rounded-md object-cover"
        />
      </div>

      <div className="flex-1">
        <h4 className="font-semibold">{item.model}</h4>
        <p className="text-sm text-gray-500">{formatPrice(item.salePrice, currency, rate)}</p>

        <div className="mt-2 flex items-center rounded-md border w-fit">
          <button 
            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
            className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md transition"
            aria-label="Restar uno"
          >
            <Minus size={16} />
          </button>
          <span className="border-x px-3 py-1 text-sm font-medium">
            {item.quantity}
          </span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
            className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md transition"
            aria-label="Añadir uno"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button 
        onClick={() => removeItem(item.id)}
        className="text-gray-400 hover:text-red-600 transition"
        aria-label="Eliminar producto"
      >
        <X size={18} />
      </button>
    </div>
  );
});
