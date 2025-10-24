import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

// --- TIPOS Y ESTADO INICIAL ---

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  shippingCost: number;
}

interface Coupon {
  code: string;
  discount: number; // Porcentaje de descuento
}

const INITIAL_STATE: CartState = {
  items: [],
  coupon: null,
  shippingCost: 0, // Iniciaremos el costo de envío en 0
};

// --- STORE ---

export const useCartStore = create(
  persist<CartState & CartActions>(
    (set, get) => ({
      ...INITIAL_STATE,

      // --- ACCIONES ---

      addItem: (product) => {
        set((state) => {
          // --- Lógica de Precios con Descuento Dinámico ---
          let finalSalePrice = product.salePrice;
          let displayOriginalPrice: number | undefined = undefined;

          // Si el producto tiene un descuento, calculamos el precio final.
          // El `salePrice` de la base de datos se convierte en el `originalPrice` para mostrar.
          if (product.discount && product.discount > 0) {
            displayOriginalPrice = product.salePrice; // Precio de DB es el "antes"
            finalSalePrice = product.salePrice * (1 - product.discount / 100); // Precio final es el "ahora"
          }

          const productForCart: Product = {
            ...product,
            salePrice: finalSalePrice, // Precio que se usa para cálculos
            originalPrice: displayOriginalPrice, // Precio para mostrar tachado
          };
          // --- Fin de la lógica ---

          const existingItem = state.items.find((item) => item.id === product.id);
          let updatedItems;

          if (existingItem) {
            // Si el ítem ya existe, solo incrementa su cantidad
            updatedItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            // Si es nuevo, lo añade con cantidad 1 y los precios ya calculados
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
          // El `salePrice` del item ya es el precio final con descuento
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
      name: "cart-storage", // Nombre para persistir en localStorage
    }
  )
);

// --- INTERFACE DE ACCIONES (para tipado) ---

interface CartActions {
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
