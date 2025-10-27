import { methodGetList } from "@/lib/funtion/metodos/methodGetList";
import type { Cellphone, Accessory, Product } from "@/lib/types";

// ----------------- CACHE -----------------

let cachedAllProducts: Product[] | null = null;

/**
 * Procesa una lista de productos para asegurar que la lógica de precios sea consistente.
 * Si no hay descuento, el originalPrice se establece como undefined.
 */
function processProducts(products: Product[]): Product[] {
  return products.map(p => {
    // Asegurarse de que los campos numéricos sean números
    const salePrice = Number(p.salePrice) || 0;
    const discount = Number(p.discount) || 0;
    let originalPrice = p.originalPrice ? Number(p.originalPrice) : undefined;

    // Si no hay descuento o el precio original no es mayor, no lo mostramos.
    if (discount <= 0 || (originalPrice !== undefined && originalPrice <= salePrice)) {
      originalPrice = undefined;
    }

    return {
      ...p,
      salePrice,
      discount,
      originalPrice,
    };
  });
}


/**
 * Obtiene todos los productos combinados (celulares + accesorios) con cache
 * y aplica la lógica de precios correcta.
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

  console.log("📱 Celulares:", cellphonesRes.message);
  console.log("🎧 Accesorios:", accessoriesRes.message);
  
  const allProductsRaw = [
    ...(cellphonesRes.data ?? []) as Cellphone[],
    ...(accessoriesRes.data ?? []) as Accessory[],
  ];

  // Aplicar la lógica de precios centralizada
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
