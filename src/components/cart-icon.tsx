'use client';

import { useState, useEffect, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import MiniCart from './mini-cart';

export default function CartIcon() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const cartRef = useRef<HTMLDivElement>(null);

  // Cierra el mini-carrito si se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartRef]);

  return (
    <div className='relative' ref={cartRef}>
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className='relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        aria-label='Abrir carrito de compras'
      >
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white'>
            {totalItems}
          </span>
        )}
      </button>

      {isCartOpen && <MiniCart onClose={() => setIsCartOpen(false)} />}
    </div>
  );
}
