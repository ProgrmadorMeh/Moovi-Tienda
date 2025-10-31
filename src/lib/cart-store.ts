
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";
import { getAllProductsCached } from "@/lib/data";
import { toast } from "@/hooks/use-toast";

// --- TIPOS Y ESTADO INICIAL ---

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  shippingCost: number;
  allProducts: Product[]; // guardamos todos los productos para usar en el carrito o búsqueda
}

interface Coupon {
  code: string;
  discount: number; // Porcentaje de descuento
}

const INITIAL_STATE: CartState = {
  items: [],
  coupon: null,
  shippingCost: 0,
  allProducts: [],
};

// --- STORE ---

export const useCartStore = create(
  persist<CartState & CartActions>(
    (set, get) => ({
      ...INITIAL_STATE,

      // --- ACCIONES ---

      loadProducts: async () => {
        const products = await getAllProductsCached();
        set({ allProducts: products });
      },

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          const stock = product.stock ?? 0;
          let updatedItems;

          if (existingItem) {
             if (existingItem.quantity >= stock) {
              toast({
                variant: 'destructive',
                description: 'No puedes agregar más productos que el stock disponible.',
              });
              return { items: state.items };
            }
            updatedItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
             if (stock <= 0) {
              toast({
                variant: 'destructive',
                description: 'Este producto no tiene stock disponible.',
              });
              return { items: state.items };
            }
            updatedItems = [...state.items, { ...product, quantity: 1 }];
          }

          return { items: updatedItems };
        });
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== productId) }));
      },

      updateQuantity: (productId, newQuantity) => {
        set((state) => {
          if (newQuantity <= 0) {
            return { items: state.items.filter((item) => item.id !== productId) };
          }
          
          const itemToUpdate = state.items.find((item) => item.id === productId);
          const stock = itemToUpdate?.stock ?? 0;

          if (newQuantity > stock) {
            toast({
              variant: 'destructive',
              description: 'No puedes agregar más productos que el stock disponible.',
            });
            return {
              items: state.items.map((item) =>
                item.id === productId ? { ...item, quantity: stock } : item
              ),
            };
          }

          return {
            items: state.items.map((item) =>
              item.id === productId ? { ...item, quantity: newQuantity } : item
            ),
          };
        });
      },

      applyCoupon: (coupon) => set({ coupon }),
      setShippingCost: (cost) => set({ shippingCost: cost }),
      clearCart: () => set((state) => ({...INITIAL_STATE, allProducts: state.allProducts})),

      // --- SELECTORES ---
      getSubtotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.salePrice * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const couponDiscount = get().coupon ? subtotal * (get().coupon!.discount / 100) : 0;
        return subtotal - couponDiscount + get().shippingCost;
      },
    }),
    {
      name: "cart-storage",
      // Solo persistimos los items del carrito, no el cupón ni el costo de envío.
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// --- INTERFACE DE ACCIONES ---

interface CartActions {
  loadProducts: () => Promise<void>;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: Coupon | null) => void;
  setShippingCost: (cost: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
  getTotal: () => number;
}
