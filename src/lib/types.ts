// lib/types.ts

// Campos base que todos los productos comparten.
type BaseProduct = {
  id: string;
  model: string;
  description: string;
  salePrice: number;
  originalPrice?: number; // Es opcional, solo existe si hay descuento.
  discount: number;
  stock: number;
  brand: string;
  imageUrl: string | string[] | null; // <-- Acepta una URL, un array de URLs o null
  shipping: boolean;
  installments: number;
  color: string;
  dataTecnica?: { [key: string]: string }; // Objeto para especificaciones técnicas
};

// Tipo específico para celulares, extiende la base y añade sus propios campos.
export type Cellphone = BaseProduct & {
  imei: string;
  // Excluimos campos de accesorios para evitar solapamientos.
  category?: never;
};

// Tipo específico para accesorios.
export type Accessory = BaseProduct & {
  category: string;
  // Excluimos campos de celulares.
  imei?: never;
};

// El tipo `Product` es una unión de `Cellphone` o `Accessory`.
// Esto permite que un producto sea uno u otro, pero no ambos.
export type Product = Cellphone | Accessory;


// --- VALORES POR DEFECTO ---

// Objeto base con valores por defecto para todos los campos posibles.
// Ayuda a prevenir errores de "undefined" en el renderizado.
export const defaultBase = {
  id: "0",
  model: "Sin especificar",
  description: "Sin descripción.",
  salePrice: 0,
  originalPrice: undefined,
  discount: 0,
  stock: 0,
  brand: "Marca Desconocida",
  imageUrl: "https://pwxpxouatzzxvvvszdnx.supabase.co/storage/v1/object/public/celImagen/place.webp",
  shipping: false,
  installments: 0,
  color: "No especificado",
  dataTecnica: {},
  // Campos específicos con valores por defecto
  imei: "N/A",
  category: "General",
};

// Esto asegura que al crear un `defaultProduct`, tiene todos los campos de `Product`
export const defaultProduct: Product = { ...defaultBase, imei: "N/A" };
export const defaultCellphone: Cellphone = { ...defaultBase, imei: "N/A" };
export const defaultAccessory: Accessory = { ...defaultBase, category: "General" };
