import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";
import { getAllProductsCached } from "@/lib/data";

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
        // Aplicamos la transformación de precios como antes
        const transformed = products.map(p => {
          if (p.discount && p.discount > 0) {
            return {
              ...p,
              originalPrice: p.salePrice,
              salePrice: p.salePrice * (1 - p.discount / 100),
            };
          }
          return { ...p, originalPrice: p.salePrice };
        });
        set({ allProducts: transformed });
      },

      addItem: (product) => {
        set((state) => {
          let finalSalePrice = product.salePrice;
          let displayOriginalPrice: number | undefined = product.originalPrice;

          if (product.discount && product.discount > 0) {
            displayOriginalPrice = product.salePrice;
            finalSalePrice = product.salePrice * (1 - product.discount / 100);
          }

          const productForCart: Product = {
            ...product,
            salePrice: finalSalePrice,
            originalPrice: displayOriginalPrice ?? finalSalePrice,
          };

          const existingItem = state.items.find((item) => item.id === product.id);
          let updatedItems;

          if (existingItem) {
            updatedItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedItems = [...state.items, { ...productForCart, quantity: 1 }];
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
          return {
            items: state.items.map((item) =>
              item.id === productId ? { ...item, quantity: newQuantity } : item
            ),
          };
        });
      },

      applyCoupon: (coupon) => set({ coupon }),
      setShippingCost: (cost) => set({ shippingCost: cost }),
      clearCart: () => set(INITIAL_STATE),

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
