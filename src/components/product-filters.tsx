
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


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
  capacity: string[];
  price: string;
  ram: string[];
  os: string[];
  processor: string[];
};

interface ProductFiltersProps {
  brands: string[];
  capacityOptions: string[];
  ramOptions: string[];
  osOptions: string[];
  processorOptions: string[];
  filters: FilterValues;
  setFilters: (filters: FilterValues) => void;
  sort: string;
  setSort: (sort: string) => void;
}

export default function ProductFilters({
  brands = [],
  capacityOptions = [],
  ramOptions = [],
  osOptions = [],
  processorOptions = [],
  filters,
  setFilters,
  sort,
  setSort,
}: ProductFiltersProps) {
  const handleFilterChange = (key: keyof Omit<FilterValues, 'ram' | 'os' | 'processor' | 'capacity'>, value: string) => {
    setFilters({ ...filters, [key]: value });
  };
  
  const handleToggleGroupChange = (key: 'ram' | 'os' | 'processor' | 'capacity', value: string[]) => {
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

      {/* Filtros de Selección Única */}
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
      
      <Separator />

      {/* Filtros de Etiquetas (Selección Múltiple) */}
      {capacityOptions.length > 0 && (
        <div className="space-y-3">
          <Label>Almacenamiento</Label>
          <ToggleGroup type="multiple" value={filters.capacity} onValueChange={(value) => handleToggleGroupChange('capacity', value)} variant="outline" className="flex-wrap justify-start">
            {capacityOptions.map(cap => (
              <ToggleGroupItem key={cap} value={cap}>{cap}</ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}

      {ramOptions.length > 0 && (
        <div className="space-y-3">
          <Label>RAM</Label>
          <ToggleGroup type="multiple" value={filters.ram} onValueChange={(value) => handleToggleGroupChange('ram', value)} variant="outline" className="flex-wrap justify-start">
            {ramOptions.map(ram => (
              <ToggleGroupItem key={ram} value={ram}>{ram}</ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}

      {osOptions.length > 0 && (
        <div className="space-y-3">
          <Label>Sistema Operativo</Label>
          <ToggleGroup type="multiple" value={filters.os} onValueChange={(value) => handleToggleGroupChange('os', value)} variant="outline" className="flex-wrap justify-start">
            {osOptions.map(os => (
              <ToggleGroupItem key={os} value={os}>{os}</ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}

      {processorOptions.length > 0 && (
        <div className="space-y-3">
          <Label>Procesador</Label>
          <ToggleGroup type="multiple" value={filters.processor} onValueChange={(value) => handleToggleGroupChange('processor', value)} variant="outline" className="flex-wrap justify-start">
            {processorOptions.map(proc => (
              <ToggleGroupItem key={proc} value={proc} className="text-xs">{proc}</ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}
    </div>
  );
}
