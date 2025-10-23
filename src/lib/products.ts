import type { Product } from "./types";
import { placeholderImages } from './placeholder-images.json';
import { methodGetList } from "@/lib/funtion/metodos/methodGetList"

const allImages = placeholderImages.map(img => ({
  id: img.id,
  url: img.imageUrl,
  alt: img.description,
  hint: img.imageHint,
}));

const resp = await methodGetList("celulares");
const celulares = resp.data;
console.log(resp.message);
export const products: Product[] = celulares ?? [];


export function getProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
