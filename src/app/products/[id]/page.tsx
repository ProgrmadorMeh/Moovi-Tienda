// app/products/[id]/page.tsx
import { getProductById } from "@/lib/funtion/metodos/methodGetById";
import { defaultBase } from "@/lib/types";
import ProductCard from "@/components/product-card";
import type { Product } from "@/lib/types";

interface PageProps {
  params: {
    id: string;
  };
}

// Función de página async permitida en Next.js 13+ App Router
export default async function ProductPage({ params }: PageProps) {
  const { id } = params;

  // Traer producto por ID
  const productFromDb: Product | undefined = await getProductById(id);

  // Aplicar valores por defecto
  const product: Product | null = productFromDb
    ? { ...defaultBase, ...productFromDb }
    : null;

  // Si no se encuentra el producto
  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <p>El producto que buscas no existe o fue eliminado.</p>
      </div>
    );
  }

  // Renderizar ProductCard con el producto encontrado
  return (
    <div className="container mx-auto p-4">
      <ProductCard product={product} onQuickView={() => {}} />
    </div>
  );
}
