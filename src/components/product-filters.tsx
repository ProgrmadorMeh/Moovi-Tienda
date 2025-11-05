
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
import type { FilterState } from "@/hooks/use-product-filters";

// Definimos los rangos de precios
export const priceRanges = [
  { value: "all", label: "Cualquier Precio", min: 0, max: Infinity },
  { value: "0-250000", label: "Menos de $250.000", min: 0, max: 250000 },
  { value: "250000-500000", label: "$250.000 a $500.000", min: 250000, max: 500000 },
  { value: "500000-1000000", label: "$500.000 a $1.000.000", min: 500000, max: 1000000 },
  { value: "1000000-2000000", label: "$1.000.000 a $2.000.000", min: 1000000, max: 2000000 },
  { value: "2000000-99999999", label: "Más de $2.000.000", min: 2000000, max: Infinity },
];

interface ProductFiltersProps {
  brands: string[];
  storageOptions: string[];
  ramOptions: string[];
  osOptions: string[];
  processorOptions: string[];
  filters: FilterState;
  onFilterChange: (key: keyof FilterState | `techSpecs.${string}`, value: any) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  productType: 'cellphones' | 'accessories';
}

// Componente reutilizable para un grupo de filtros de especificaciones técnicas
const TechSpecFilterGroup = ({ label, options, techSpecKey, selectedValues, onValueChange }: {
  label: string;
  options: string[];
  techSpecKey: keyof FilterState['techSpecs'];
  selectedValues: string[];
  onValueChange: (key: keyof FilterState['techSpecs'], value: string[]) => void;
}) => {
  if (options.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <ToggleGroup
        type="multiple"
        variant="outline"
        value={selectedValues}
        onValueChange={(value) => onValueChange(techSpecKey, value)}
        className="flex flex-wrap justify-start gap-2"
      >
        {options.map((option) => (
          <ToggleGroupItem key={option} value={option} className="text-xs">
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default function ProductFilters({
  brands = [],
  storageOptions = [],
  ramOptions = [],
  osOptions = [],
  processorOptions = [],
  filters,
  onFilterChange,
  sort,
  onSortChange,
  productType,
}: ProductFiltersProps) {

  const handleTechSpecChange = (key: keyof FilterState['techSpecs'], value: string[]) => {
    onFilterChange(`techSpecs.${key}`, value);
  };
  
  return (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      <h3 className="font-headline text-2xl font-semibold">Filtros</h3>

      <div className="space-y-4">
        <Label htmlFor="sort">Ordenar por</Label>
        <Select value={sort} onValueChange={onSortChange}>
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
        <Select value={filters.brand} onValueChange={(v) => onFilterChange('brand', v)}>
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
        <Select value={filters.price} onValueChange={(v) => onFilterChange('price', v)}>
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
      
      {productType === 'cellphones' && (
        <>
          <Separator />
          <TechSpecFilterGroup
            label="Almacenamiento"
            options={storageOptions}
            techSpecKey="Almacenamiento"
            selectedValues={filters.techSpecs.Almacenamiento}
            onValueChange={handleTechSpecChange}
          />
          <TechSpecFilterGroup
            label="RAM"
            options={ramOptions}
            techSpecKey="RAM"
            selectedValues={filters.techSpecs.RAM}
            onValueChange={handleTechSpecChange}
          />
          <TechSpecFilterGroup
            label="Sistema Operativo"
            options={osOptions}
            techSpecKey="Sistema Operativo"
            selectedValues={filters.techSpecs['Sistema Operativo']}
            onValueChange={handleTechSpecChange}
          />
          <TechSpecFilterGroup
            label="Procesador"
            options={processorOptions}
            techSpecKey="Procesador"
            selectedValues={filters.techSpecs.Procesador}
            onValueChange={handleTechSpecChange}
          />
        </>
      )}
    </div>
  );
}
