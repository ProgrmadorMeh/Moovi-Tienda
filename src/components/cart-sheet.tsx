
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

export default function CartSheet() {
  const {
    items,
    getSubtotal,
  } = useCartStore();

  const subtotal = getSubtotal();

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
              <span>${subtotal.toFixed(2)}</span>
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

// --- Componente para cada fila del carrito ---

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-start space-x-4 py-4">
      <div className="relative h-24 w-24 flex-shrink-0">
        <Image
          src={item.imageUrl}
          alt={item.model}
          fill
          className="rounded-md object-cover"
        />
      </div>

      <div className="flex-1">
        <h4 className="font-semibold">{item.model}</h4>
        <p className="text-sm text-gray-500">${item.salePrice.toFixed(2)}</p>

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
}
