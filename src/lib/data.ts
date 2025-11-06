
import { cache } from 'react';
import { methodGetList } from "@/lib/funtion/metodos/methodGetList";
import type { Cellphone, Accessory, Product } from "@/lib/types";
import { createClient } from './supabase/server'; // Importar el cliente del SERVIDOR

// ----------------- CACHE -----------------

let cachedAllProducts: Product[] | null = null;

const isRawProductCellphone = (p: any): boolean => {
    // Un producto es un celular si NO tiene la propiedad 'category'.
    // Esta es la forma más simple de distinguir basado en el modelo de datos.
    return !p.hasOwnProperty('category');
};

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
    
    if (typeof processedImageUrl === 'string' && processedImageUrl.startsWith('[') && processedImageUrl.endsWith(']')) {
      try {
        const parsed = JSON.parse(processedImageUrl);
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
          processedImageUrl = parsed;
        } else {
           processedImageUrl = null;
        }
      } catch (e) {
        console.error("Failed to parse imageUrl string:", processedImageUrl, e);
        processedImageUrl = null;
      }
    }
    
    // --- Procesamiento de dataTecnica ---
    let processedDataTecnica = p.dataTecnica;
    if (typeof processedDataTecnica === 'string') {
      try {
        processedDataTecnica = JSON.parse(processedDataTecnica);
      } catch (e) {
        console.error("Failed to parse dataTecnica string:", processedDataTecnica, e);
        processedDataTecnica = {}; // Asignar objeto vacío si el parseo falla
      }
    }
    
    const processedProduct: Product = {
      ...p,
      salePrice: finalSalePrice,
      originalPrice: originalPrice,
      discount,
      brand, 
      imageUrl: processedImageUrl,
      dataTecnica: processedDataTecnica,
      // Asignación de peso
      weight: isRawProductCellphone(p) ? 0.2 : 0.1, // 200g para celulares, 100g para accesorios
    };

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

  const supabase = createClient(); // Crear el cliente de servidor una vez

  const results = await Promise.all([
    methodGetList(supabase, "celulares"),
    methodGetList(supabase, "accesorios"),
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
  return allProducts.filter((p): p is Cellphone => 'imei' in p || (p.hasOwnProperty('dataTecnica') && !p.hasOwnProperty('category')));
}

/**
 * Obtiene solo accesorios, ya procesados.
 */
export async function getAccessoriesCached(refresh = false): Promise<Accessory[]> {
  const allProducts = await getAllProductsCached(refresh);
  return allProducts.filter((p): p is Accessory => "category" in p);
}