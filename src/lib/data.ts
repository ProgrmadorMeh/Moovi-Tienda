import { methodGetList } from "@/lib/funtion/metodos/methodGetList";
import type { Cellphone, Accessory, Product } from "@/lib/types";

// ----------------- CACHE -----------------

let cachedAllProducts: Product[] | null = null;

/**
 * Procesa una lista de productos para asegurar que la lógica de precios y marcas sea consistente.
 */
function processProducts(products: any[]): Product[] {
  return products.map(p => {
    // Asegurarse de que los campos numéricos sean números
    const salePrice = Number(p.salePrice) || 0;
    const discount = Number(p.discount) || 0;
    let originalPrice = p.originalPrice ? Number(p.originalPrice) : undefined;

    // Si no hay descuento o el precio original no es mayor, no lo mostramos.
    if (discount <= 0 || (originalPrice !== undefined && originalPrice <= salePrice)) {
      originalPrice = undefined;
    }
    
    const brand = p.marcas?.nombre || 'Sin Marca';

    return {
      ...p,
      salePrice,
      discount,
      originalPrice,
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

  const [cellphonesRes, accessoriesRes] = await Promise.all([
    methodGetList("celulares"),
    methodGetList("accesorios"),
  ]);

  console.log("📱 Celulares:", cellphonesRes.data?.length);
  console.log("🎧 Accesorios:", accessoriesRes.data?.length);
  
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
