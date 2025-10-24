import type { Product } from "./types";
import { methodGetList } from "@/lib/funtion/metodos/methodGetList";

// ✅ Carga los productos desde tu API o base de datos
export async function getProducts(): Promise<Product[]> {
  const resp = await methodGetList("celulares");

  if (!resp || !Array.isArray(resp.data)) {
    console.error("❌ Error al obtener productos:", resp);
    return [];
  }

  const celulares = resp.data as Product[];

  // Opcional: agrega un fallback si `imageUrl` está vacío
  const products = celulares.map((product) => ({
    ...product,
    imageUrl: product.imageUrl && product.imageUrl.trim() !== ""
      ? product.imageUrl
      : "/img/default-product.jpg", // 👉 pon una imagen por defecto si lo deseas
  }));

  console.log("✅ Productos cargados:", products.length);
  return products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}
