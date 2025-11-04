import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Product } from "@/lib/types";

interface ProductSpecsProps {
  product: Product;
}

const ProductSpecs = memo<ProductSpecsProps>(({ product }) => {
  const dataTecnica = product.dataTecnica || {};

  const techSpecs = [
    { label: "Sistema Operativo", value: dataTecnica["Sistema Operativo"] || "N/A" },
    { label: "Batería", value: dataTecnica["Batería"] || "N/A" },
    { label: "Cámara Principal", value: dataTecnica["Cámara Principal"] || "N/A" },
    { label: "Almacenamiento", value: dataTecnica["Almacenamiento"] || "N/A" },
    { label: "RAM", value: dataTecnica["RAM"] || "N/A" },
    { label: "Procesador", value: dataTecnica["Procesador"] || "N/A" },
    { label: "Pantalla", value: dataTecnica["Pantalla"] || "N/A" },
  ];

  return (
    <div className="py-4">
      <ul className="space-y-4 text-base">
        {techSpecs.map((spec, index) => (
          <li key={index} className="flex justify-between border-b pb-3">
            <span className="font-medium text-muted-foreground">{spec.label}</span>
            <span className="text-right text-foreground">{spec.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

ProductSpecs.displayName = 'ProductSpecs';

export default ProductSpecs;
