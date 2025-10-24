import type { Product } from "./types";
import { methodGetList } from "@/lib/funtion/metodos/methodGetList";
import { getAccessories } from "./accessories";

// --- CACHÉ --- 
// Almacena en caché los productos para evitar múltiples llamadas a la base de datos.
let allProducts: Product[] | null = null;
let allItemsCache: Product[] | null = null;

/**
 * Transforma un producto para aplicar la lógica de precios con descuento.
 * El `salePrice` de la BD se trata como el precio original.
 * El precio final se calcula aplicando el `discount`.
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

async function fetchAllProducts(): Promise<Product[]> {
  if (allProducts) {
    return allProducts;
  }

  const [celularesResp, marcasResp] = await Promise.all([
    methodGetList("celulares"),
    methodGetList("marcas"),
  ]);

  if (!celularesResp.success || !marcasResp.success) {
    console.error("❌ Error al obtener celulares o marcas.");
    return [];
  }

  const celulares = celularesResp.data as Product[];
  const marcas = marcasResp.data as { id: string; nombre: string }[];
  const marcasMap = new Map(marcas.map(marca => [marca.id, marca.nombre]));

  // Combina los datos y aplica la transformación de precios
  allProducts = celulares.map((product) => {
    const brandName = marcasMap.get(product.id_brand) || "Marca Desconocida";
    const transformedProduct = transformProductPrice({ // ✅ Aplica la lógica de precios
        ...product,
        brand: brandName,
        imageUrl: product.imageUrl && product.imageUrl.trim() !== ""
            ? product.imageUrl
            : "/img/default-product.jpg",
    });
    return transformedProduct;
  });

  return allProducts;
}

// ✅ Obtiene TODOS los celulares (con nombres de marca y precios transformados)
export async function getProducts(): Promise<Product[]> {
  return await fetchAllProducts();
}

// ✅ Obtiene TODOS los productos (celulares Y accesorios) con precios transformados
export async function getAllItems(): Promise<Product[]> {
  if (allItemsCache) {
    return allItemsCache;
  }
  
  const [cellphones, accessories] = await Promise.all([
    getProducts(),
    getAccessories(), // Asumiendo que getAccessories también aplica la transformación
  ]);

  allItemsCache = [...cellphones, ...accessories];
  return allItemsCache;
}

// ✅ Obtiene un producto (celular O accesorio) por su ID
export async function getProductById(id: string): Promise<Product | undefined> {
  const allItems = await getAllItems();
  return allItems.find((p) => p.id === id);
}

// ✅ Obtiene los 10 productos con menos stock (Destacados)
export async function getFeaturedProducts(): Promise<Product[]> {
  const allItems = await getAllItems();
  return allItems.sort((a, b) => a.stock - b.stock).slice(0, 10);
}

// ✅ Obtiene los productos que tienen un descuento aplicado
export async function getDiscountedProducts(): Promise<Product[]> {
  const allItems = await getAllItems();
  // Ahora el filtro se mantiene simple porque la transformación ya se hizo
  return allItems.filter(p => p.discount && p.discount > 0);
}
