// app/products/[id]/page.tsx

import { getAllProductsCached } from "@/lib/data";
import { defaultBase, type Product } from "@/lib/types";
import ProductPageClient from "./product-page-client";
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = params;

  // Usa la función cacheada para evitar llamadas innecesarias
  const allProducts = await getAllProductsCached();
  const productFromCache = allProducts.find((p) => p.id === id);

  if (!productFromCache) {
    notFound(); // Devuelve una página 404 si el producto no existe
  }

  // Aplica valores por defecto para asegurar que no haya campos undefined
  const product: Product = { ...defaultBase, ...productFromCache };

  return <ProductPageClient product={product} />;
}
