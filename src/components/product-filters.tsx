
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "./ui/separator";

// Definimos los rangos de precios
export const priceRanges = [
  { value: "all", label: "Cualquier Precio" },
  { value: "0-250000", label: "Menos de $250.000", min: 0, max: 250000 },
  { value: "250000-500000", label: "$250.000 a $500.000", min: 250000, max: 500000 },
  { value: "500000-1000000", label: "$500.000 a $1.000.000", min: 500000, max: 1000000 },
  { value: "1000000-2000000", label: "$1.000.000 a $2.000.000", min: 1000000, max: 2000000 },
  { value: "2000000-99999999", label: "Más de $2.000.000", min: 2000000, max: 99999999 },
];

type FilterValues = {
  brand: string;
  capacity: string;
  price: string;
};

interface ProductFiltersProps {
  brands: string[];
  capacityOptions: string[];
  filters: FilterValues;
  setFilters: (filters: FilterValues) => void;
  sort: string;
  setSort: (sort: string) => void;
}

export default function ProductFilters({
  brands = [],
  capacityOptions = [],
  filters,
  setFilters,
  sort,
  setSort,
}: ProductFiltersProps) {
  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      <h3 className="font-headline text-2xl font-semibold">Filtros</h3>

      <div className="space-y-4">
        <Label htmlFor="sort">Ordenar por</Label>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger id="sort">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
            <SelectItem value="name-asc">Nombre: A a Z</SelectItem>
            <SelectItem value="name-desc">Nombre: Z a A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label htmlFor="brand">Marca</Label>
        <Select value={filters.brand} onValueChange={(v) => handleFilterChange('brand', v)}>
          <SelectTrigger id="brand">
            <SelectValue placeholder="Selecciona una marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Marcas</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="price">Precio</Label>
        <Select value={filters.price} onValueChange={(v) => handleFilterChange('price', v)}>
          <SelectTrigger id="price">
            <SelectValue placeholder="Selecciona un rango de precio" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="capacity">Almacenamiento</Label>
        <Select value={filters.capacity} onValueChange={(v) => handleFilterChange('capacity', v)}>
          <SelectTrigger id="capacity">
            <SelectValue placeholder="Selecciona capacidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Capacidades</SelectItem>
            {capacityOptions.map((capacity) => (
              <SelectItem key={capacity} value={capacity}>
                {capacity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
