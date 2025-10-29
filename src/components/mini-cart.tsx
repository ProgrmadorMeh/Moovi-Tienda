'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus } from 'lucide-react';
import { useCartStore, CartItem } from '@/lib/cart-store';
import { defaultBase } from '@/lib/types';

interface MiniCartProps {
  onClose: () => void;
}

export default function MiniCart({ onClose }: MiniCartProps) {
  const {
    items,
    getSubtotal,
  } = useCartStore();

  const subtotal = getSubtotal();

  return (
    <div className='absolute right-0 top-full mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-xl'>
      <div className='flex items-center justify-between border-b border-gray-200 p-4'>
        <h3 className='font-semibold text-gray-900'>Tu Carrito</h3>
        <button
          onClick={onClose}
          className='text-gray-400 hover:text-gray-600'
          aria-label='Cerrar carrito'
        >
          <X size={20} />
        </button>
      </div>

      {items.length === 0 ? (
        <p className='p-8 text-center text-gray-500'>Tu carrito está vacío.</p>
      ) : (
        <>
          <div className='max-h-96 overflow-y-auto p-4'>
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className='border-t border-gray-200 p-4'>
            <div className='mb-4 flex justify-between font-semibold'>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className='space-y-2'>
              <Link href='/carrito' passHref>
                <button
                  onClick={onClose}
                  className='w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                >
                  Ver Carrito
                </button>
              </Link>
              <Link href='/checkout' passHref>
                <button
                  onClick={onClose}
                  className='w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
                >
                  Finalizar Compra
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- Componente para cada fila del carrito ---

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  let imageSrc = defaultBase.imageUrl as string;
  if (Array.isArray(item.imageUrl) && item.imageUrl.length > 0 && item.imageUrl[0]) {
      imageSrc = item.imageUrl[0];
  } else if (typeof item.imageUrl === 'string' && item.imageUrl) {
      imageSrc = item.imageUrl;
  }

  return (
    <div className='flex items-center space-x-3 py-2'>
      <div className="relative h-16 w-16 flex-shrink-0">
        <Image
          src={imageSrc}
          alt={item.model}
          fill
          className='rounded-md object-cover'
        />
      </div>
      <div className='flex-1'>
        <p className='text-sm font-medium text-gray-800'>{item.model}</p>
        <p className='text-xs text-gray-500'>${item.salePrice.toFixed(2)}</p>
        <div className='mt-1 flex items-center'>
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className='p-1 text-gray-500 hover:text-blue-600'><Minus size={14} /></button>
          <span className='px-2 text-sm'>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className='p-1 text-gray-500 hover:text-blue-600'><Plus size={14} /></button>
        </div>
      </div>
      <button onClick={() => removeItem(item.id)} className='text-gray-400 hover:text-red-500'><X size={16} /></button>
    </div>
  );
}
