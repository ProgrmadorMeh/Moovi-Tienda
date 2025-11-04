import { memo } from "react";
import type { Cellphone, Product } from "@/lib/types";

// Función para verificar si el producto es un celular
function isCellphone(product: Product): product is Cellphone {
  return "capacity" in product;
}

const ProductSpecs = memo(({ product }: { product: Product }) => {
  // Asegurarnos de que estamos tratando con un celular y que tiene datos técnicos
  if (!isCellphone(product) || !product.dataTecnica || Object.keys(product.dataTecnica).length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        No hay especificaciones técnicas detalladas para este producto.
      </div>
    );
  }

  // Convertimos el objeto de especificaciones en un array para poder mapearlo
  const techSpecs = Object.entries(product.dataTecnica);

  return (
    <div className="py-4">
      <ul className="space-y-4 text-base">
        {techSpecs.map(([key, value]) => (
          <li key={key} className="flex flex-col sm:flex-row sm:justify-between border-b pb-3">
            <span className="font-medium text-muted-foreground">{key}</span>
            <span className="text-left sm:text-right text-foreground">{String(value) || 'N/A'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

ProductSpecs.displayName = 'ProductSpecs';

export default ProductSpecs;
