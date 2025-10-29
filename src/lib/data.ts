
import { cache } from 'react';
import { methodGetList } from "@/lib/funtion/metodos/methodGetList";
import type { Cellphone, Accessory, Product } from "@/lib/types";

// ----------------- CACHE -----------------

let cachedAllProducts: Product[] | null = null;

/**
 * Procesa una lista de productos para asegurar que la lógica de precios, marcas e imágenes sea consistente.
 */
function processProducts(products: any[]): Product[] {
  return products.map(p => {
    const basePrice = Number(p.salePrice) || 0;
    const discount = Number(p.discount) || 0;
    const brand = p.marcas?.nombre || 'Sin Marca';

    let finalSalePrice = basePrice;
    let originalPrice: number | undefined = undefined;

    if (discount > 0) {
      originalPrice = basePrice;
      finalSalePrice = basePrice * (1 - discount / 100);
    }
    
    // --- Procesamiento de Imágenes ---
    let processedImageUrl: string | string[] | null = p.imageUrl;
    
    // Si imageUrl es una cadena que parece un array JSON, intentamos parsearlo
    if (typeof processedImageUrl === 'string' && processedImageUrl.startsWith('[') && processedImageUrl.endsWith(']')) {
      try {
        const parsed = JSON.parse(processedImageUrl);
        // Nos aseguramos de que el resultado sea un array de strings
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
          processedImageUrl = parsed;
        } else {
           processedImageUrl = null; // Si el formato interior no es el esperado
        }
      } catch (e) {
        console.error("Failed to parse imageUrl string:", processedImageUrl, e);
        processedImageUrl = null; // Si el parseo falla
      }
    }
    // --- Fin del procesamiento de Imágenes ---
    
    const processedProduct: Product = {
      ...p,
      salePrice: finalSalePrice,
      originalPrice: originalPrice,
      discount,
      brand, 
      imageUrl: processedImageUrl, // Usamos la URL procesada
    };

    // Si no hay cuotas sin interés, agregar un plan de 6 cuotas con 10% de recargo.
    if (!p.installments) {
        (processedProduct as any).fees = {
            count: 6,
            price: (finalSalePrice * 1.1) / 6,
        };
    }
    
    return processedProduct;
  });
}


/**
 * Obtiene todos los productos combinados (celulares + accesorios) con cache
 * y aplica la lógica de precios y marcas correcta.
 * @param refresh - Si es true, fuerza recargar desde Supabase
 */
export const getAllProductsCached = cache(async (refresh = false): Promise<Product[]> => {
  if (!refresh && cachedAllProducts) {
    return cachedAllProducts;
  }

  const results = await Promise.all([
    methodGetList("celulares"),
    methodGetList("accesorios"),
  ]);

  const cellphonesRes = results[0];
  const accessoriesRes = results[1];

  const allProductsRaw = [
    ...(cellphonesRes.data ?? []) as any[],
    ...(accessoriesRes.data ?? []) as any[],
  ];

  cachedAllProducts = processProducts(allProductsRaw);
  
  return cachedAllProducts;
});

/**
 * Obtiene solo celulares, ya procesados.
 */
export async function getCellphonesCached(refresh = false): Promise<Cellphone[]> {
  const allProducts = await getAllProductsCached(refresh);
  return allProducts.filter((p): p is Cellphone => "capacity" in p);
}

/**
 * Obtiene solo accesorios, ya procesados.
 */
export async function getAccessoriesCached(refresh = false): Promise<Accessory[]> {
  const allProducts = await getAllProductsCached(refresh);
  return allProducts.filter((p): p is Accessory => "category" in p);
}
