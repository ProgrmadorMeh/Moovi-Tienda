import { methodGetList } from "@/lib/funtion/metodos/methodGetList";
import type { Cellphone, Accessory, Product } from "@/lib/types";

// ----------------- CACHE -----------------

let cachedAllProducts: Product[] | null = null;

/**
 * Procesa una lista de productos para asegurar que la lógica de precios y marcas sea consistente.
 */
function processProducts(products: any[]): Product[] {
  return products.map(p => {
    const basePrice = Number(p.salePrice) || 0;
    const discount = Number(p.discount) || 0;
    const brand = p.marcas?.nombre || 'Sin Marca';

    let finalSalePrice = basePrice;
    let originalPrice: number | undefined = undefined;

    if (discount > 0) {
      // Si hay descuento, el precio base es el original.
      originalPrice = basePrice;
      // Y el precio de venta es el precio base menos el descuento.
      finalSalePrice = basePrice * (1 - discount / 100);
    }
    
    return {
      ...p,
      salePrice: finalSalePrice,
      originalPrice: originalPrice,
      discount,
      brand, 
    };
  });
}


/**
 * Obtiene todos los productos combinados (celulares + accesorios) con cache
 * y aplica la lógica de precios y marcas correcta.
 * @param refresh - Si es true, fuerza recargar desde Supabase
 */
export async function getAllProductsCached(refresh = false): Promise<Product[]> {
  if (!refresh && cachedAllProducts) {
    return cachedAllProducts;
  }

  const results = await Promise.all([
    methodGetList("celulares"),
    methodGetList("accesorios"),
  ]);

  const cellphonesRes = results[0];
  const accessoriesRes = results[1];
  
  if (cellphonesRes.data) {
    console.log("📱 Celulares:", cellphonesRes.data.length);
  }
  if (accessoriesRes.data) {
    console.log("🎧 Accesorios:", accessoriesRes.data.length);
  }

  const allProductsRaw = [
    ...(cellphonesRes.data ?? []) as any[],
    ...(accessoriesRes.data ?? []) as any[],
  ];

  cachedAllProducts = processProducts(allProductsRaw);
  
  return cachedAllProducts;
}

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
