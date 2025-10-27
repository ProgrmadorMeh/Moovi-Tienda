import { methodGetList } from "@/lib/funtion/metodos/methodGetList";
import type { Cellphone, Accessory, Product } from "@/lib/types";


// ----------------- CACHE -----------------

let cachedCellphones: Cellphone[] | null = null;
let cachedAccessories: Accessory[] | null = null;

/**
 * Obtiene celulares con cache en memoria.
 * @param refresh - Si es true, fuerza recargar desde Supabase
 */
export async function getCellphonesCached(refresh = false): Promise<Cellphone[]> {
  if (!refresh && cachedCellphones) return cachedCellphones;

  const resp = await methodGetList("celulares");
  console.log("📱 Celulares:", resp.message);

  cachedCellphones = (resp.data ?? []) as Cellphone[];
  return cachedCellphones;
}

/**
 * Obtiene accesorios con cache en memoria.
 * @param refresh - Si es true, fuerza recargar desde Supabase
 */
export async function getAccessoriesCached(refresh = false): Promise<Accessory[]> {
  if (!refresh && cachedAccessories) return cachedAccessories;

  const resp = await methodGetList("accesorios");
  console.log("🎧 Accesorios:", resp.message);

  cachedAccessories = (resp.data ?? []) as Accessory[];
  return cachedAccessories;
}

/**
 * Obtiene todos los productos combinados (celulares + accesorios)
 */
export async function getAllProductsCached(refresh = false): Promise<Product[]> {
  const [cellphones, accessories] = await Promise.all([
    getCellphonesCached(refresh),
    getAccessoriesCached(refresh),
  ]);
  return [...cellphones, ...accessories];
}
