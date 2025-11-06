
import { memo } from "react";
import type { Cellphone, Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Cpu,
  Camera,
  BatteryCharging,
  ScreenShare,
  MemoryStick,
  HardDrive,
} from "lucide-react";

// Función para verificar si el producto es un celular
function isCellphone(product: Product): product is Cellphone {
  return "capacity" in product;
}

// Mapeo de claves de especificaciones a iconos
const specIcons: Record<string, React.ElementType> = {
  Pantalla: ScreenShare,
  Procesador: Cpu,
  RAM: MemoryStick,
  Almacenamiento: HardDrive,
  Cámara: Camera,
  Batería: BatteryCharging,
  // Añade más mapeos si es necesario
};

const ProductSpecs = memo(({ product }: { product: Product }) => {
  // Asegurarnos de que estamos tratando con un celular y que tiene datos técnicos
  if (!product.dataTecnica || Object.keys(product.dataTecnica).length === 0) {
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
      <div className="flex flex-wrap gap-3">
        {techSpecs.map(([key, value]) => {
          const Icon = specIcons[key] || Smartphone; // Icono por defecto
          return (
            <Badge
              key={key}
              variant="outline"
              className="flex items-center gap-2 rounded-lg p-3 text-base"
            >
              <Icon className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{key}</p>
                <p className="text-sm text-muted-foreground">{String(value) || "N/A"}</p>
              </div>
            </Badge>
          );
        })}
      </div>
    </div>
  );
});

ProductSpecs.displayName = "ProductSpecs";

export default ProductSpecs;
