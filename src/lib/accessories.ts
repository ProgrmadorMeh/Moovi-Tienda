import type { Product } from "./types";
import { methodGetList } from "@/lib/funtion/metodos/methodGetList";

let allAccessories: Product[] | null = null;

/**
 * Transforma un producto para aplicar la lógica de precios con descuento.
 */
function transformProductPrice(product: Product): Product {
    if (product.discount && product.discount > 0) {
        return {
            ...product,
            originalPrice: product.salePrice, // El precio de venta de la BD es el "original"
            salePrice: product.salePrice * (1 - product.discount / 100), // El nuevo salePrice es el precio con descuento
        };
    }
    return product; // Si no hay descuento, devuelve el producto tal cual.
}

// Obtiene todos los accesorios desde Supabase
export async function getAccessories(): Promise<Product[]> {
  if (allAccessories) {
    return allAccessories;
  }

  const resp = await methodGetList("accesorios");

  if (!resp.success || !Array.isArray(resp.data)) {
    console.error("❌ Error al obtener accesorios o los datos no son un array.");
    return [];
  }

  // Aplica la transformación de precios a cada accesorio
  allAccessories = resp.data.map(item => transformProductPrice({
    ...item,
    imageUrl: item.imageUrl && item.imageUrl.trim() !== "" 
        ? item.imageUrl 
        : "/img/default-product.jpg",
  }));

  return allAccessories;
}
