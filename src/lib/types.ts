// Tipo base con los campos comunes
export type Product = {
  id: string;
  id_brand: string;
  model: string;
  description: string;
  salePrice: number;
  originalPrice: number;
  discount: number;
  stock: number;
  finalPrice: number;
  brand: string;
  imageUrl: string;
  shipping: boolean;
  installments: number;
  color: string;
};

// Tipo específico para celulares
export type Cellphone = Product & {
  imei: string;
  capacity: string;
};

// Tipo específico para accesorios
export type Accessory = Product & {
  uniquePrice: boolean;
  installPrice: number;
  category: string;
};

// Objeto base con todos los campos posibles
export const defaultBase = {
  id: "0",
  id_brand: "0",
  model: "Sin especificar",
  description: "Sin descripción",
  salePrice: 0,
  originalPrice: 0,
  discount: 0,
  stock: 0,
  finalPrice: 0,
  brand: "Otro",
  imageUrl: "https://pwxpxouatzzxvvvszdnx.supabase.co/storage/v1/object/public/celImagen/place.jpg",
  shipping: false,
  installments: 0,
  color: "Sin colores",
  // Campos de celulares
  imei: "Desconocido",
  capacity: "Sin especificar",
  // Campos de accesorios
  uniquePrice: false,
  installPrice: 0,
  category: "Otro",
};

// Tipos de default
export const defaultProduct: Product = { ...defaultBase };
export const defaultCellphone: Cellphone = { ...defaultBase };
export const defaultAccessory: Accessory = { ...defaultBase };
