import { create } from 'zustand';
import type { Product } from '@/lib/types';

// Interface para un artículo en el carrito (producto + cantidad)
export interface CartItem extends Product {
  quantity: number;
}

// Interface para el estado de nuestro store
interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

// Creación del store con zustand
export const useCartStore = create<CartState>((set) => ({
  // Estado inicial
  items: [],

  // Acción para añadir un producto
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // Si el producto ya existe, incrementa la cantidad
        const updatedItems = state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { items: updatedItems };
      } else {
        // Si es un producto nuevo, lo añade al carrito con cantidad 1
        return { items: [...state.items, { ...product, quantity: 1 }] };
      }
    }),

  // Acción para eliminar un producto
  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),

  // Acción para vaciar el carrito
  clearCart: () => set({ items: [] }),
}));
