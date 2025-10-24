import { getProductById } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductPageClient from "./product-page-client";

interface ProductPageProps {
  params: {
    id: string;
  };
}

// ✅ Server Component (puede usar await)
export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}
