import type { Product } from "./types";
import { methodGetList } from "@/lib/funtion/metodos/methodGetList";
import { getAccessories } from "./accessories";

// --- CACHÉ ---
let allProducts: Product[] | null = null;
let allItemsCache: Product[] | null = null;

/**
 * Aplica la lógica de precios con descuento.
 */
function transformProductPrice(product: Product): Product {
  if (product.discount && product.discount > 0) {
    return {
      ...product,
      originalPrice: product.salePrice,
      salePrice: product.salePrice * (1 - product.discount / 100),
    };
  }
  return product;
}

/**
 * Obtiene las marcas en forma de Mapa (id → nombre)
 */
async function fetchBrandMap(): Promise<Map<string, string>> {
  const marcasResp = await methodGetList("marcas");
  if (!marcasResp.success) {
    console.error("❌ Error al obtener marcas.");
    return new Map();
  }
  const marcas = marcasResp.data as { id: string; nombre: string }[];
  return new Map(marcas.map(marca => [marca.id, marca.nombre]));
}

/**
 * Obtiene todos los celulares, con nombres de marca y precios aplicados.
 */
async function fetchAllProducts(): Promise<Product[]> {
  if (allProducts) return allProducts;

  const [celularesResp, brandMap] = await Promise.all([
    methodGetList("celulares"),
    fetchBrandMap(),
  ]);

  if (!celularesResp.success) {
    console.error("❌ Error al obtener celulares.");
    return [];
  }

  const celulares = celularesResp.data as Product[];

  allProducts = celulares.map((product) => {
    const brandName = brandMap.get(product.id_brand) || "Marca Desconocida";
    return transformProductPrice({
      ...product,
      brand: brandName,
      imageUrl:
        product.imageUrl && product.imageUrl.trim() !== ""
          ? product.imageUrl
          : "/img/default-product.jpg",
    });
  });

  return allProducts;
}

/**
 * ✅ Obtiene TODOS los celulares
 */
export async function getProducts(): Promise<Product[]> {
  return await fetchAllProducts();
}

/**
 * ✅ Obtiene TODOS los productos (celulares + accesorios) con nombre de marca
 */
export async function getAllItems(): Promise<Product[]> {
  if (allItemsCache) return allItemsCache;

  const [cellphones, accessories, brandMap] = await Promise.all([
    getProducts(),
    getAccessories(),
    fetchBrandMap(),
  ]);

  // Asigna nombre de marca a los accesorios también
  const accessoriesWithBrand = accessories.map((acc) => {
    const brandName = brandMap.get(acc.id_brand) || "Marca Desconocida";
    return transformProductPrice({
      ...acc,
      brand: brandName,
      imageUrl:
        acc.imageUrl && acc.imageUrl.trim() !== ""
          ? acc.imageUrl
          : "/img/default-product.jpg",
    });
  });

  allItemsCache = [...cellphones, ...accessoriesWithBrand];
  return allItemsCache;
}

/**
 * ✅ Obtiene un producto (celular o accesorio) por su ID
 */
export async function getProductById(id: string): Promise<Product | undefined> {
  const allItems = await getAllItems();
  return allItems.find((p) => p.id === id);
}

/**
 * ✅ Obtiene los 10 productos con menos stock (Destacados)
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const allItems = await getAllItems();
  return allItems.sort((a, b) => a.stock - b.stock).slice(0, 10);
}

/**
 * ✅ Obtiene los productos con descuento aplicado
 */
export async function getDiscountedProducts(): Promise<Product[]> {
  const allItems = await getAllItems();
  return allItems.filter((p) => p.discount && p.discount > 0);
}
