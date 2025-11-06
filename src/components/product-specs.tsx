
import { memo } from "react";
import type { Product } from "@/lib/types";
import {
  Smartphone,
  Cpu,
  Camera,
  BatteryCharging,
  ScreenShare,
  MemoryStick,
  HardDrive,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

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
  // Asegurarnos de que tiene datos técnicos
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
      <Table>
        <TableBody>
          {techSpecs.map(([key, value]) => {
            const Icon = specIcons[key] || Smartphone; // Icono por defecto
            return (
              <TableRow key={key}>
                <TableCell className="flex items-center gap-3 font-semibold">
                  <Icon className="h-5 w-5 text-primary" />
                  <span>{key}</span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {String(value) || "N/A"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
});

ProductSpecs.displayName = "ProductSpecs";

export default ProductSpecs;
