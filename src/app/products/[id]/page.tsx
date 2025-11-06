
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

// Generamos metadatos dinámicos para cada producto
export async function generateMetadata({ params }: PageProps) {
  const awaitedParams = await params;
  const allProducts = await getAllProductsCached();
  const product = allProducts.find((p) => p.id === awaitedParams.id);

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  const productName = `${product.brand} ${product.model}`;
  
  return {
    title: productName,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const allProducts = await getAllProductsCached();
  const productFromCache = allProducts.find((p) => p.id === id);

  if (!productFromCache) {
    notFound();
  }

  // Aseguramos que el producto tenga todos los campos, usando valores por defecto si es necesario
  const product: Product = { ...defaultBase, ...productFromCache };

  return <ProductPageClient product={product} />;
}
