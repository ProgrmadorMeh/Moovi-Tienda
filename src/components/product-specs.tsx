
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const ProductSpecs = ({ product }) => {
  // Ejemplo de datos de ficha técnica (puedes pasarlos como prop)
  const techSpecs = [
    { label: "Pantalla", value: "6.5 pulgadas Super AMOLED, 120Hz" },
    { label: "Procesador", value: "Octa-Core 2.4GHz" },
    { label: "RAM", value: "6 GB" },
    { label: "Almacenamiento", value: "128 GB (ampliable)" },
    { label: "Cámara Principal", value: "50 MP + 12 MP + 5 MP" },
    { label: "Batería", value: "5000 mAh, Carga rápida 25W" },
    { label: "Sistema Operativo", value: "Android 13" },
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
};

export default ProductSpecs;
