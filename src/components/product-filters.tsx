"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "./ui/separator";

interface ProductFiltersProps {
  brands: string[];
  storageOptions: string[];
  filters: {
    brand: string;
    storage: string;
    priceRange: number[];
  };
  setFilters: (filters: ProductFiltersProps["filters"]) => void;
  sort: string;
  setSort: (sort: string) => void;
}

export default function ProductFilters({
  brands,
  storageOptions,
  filters,
  setFilters,
  sort,
  setSort,
}: ProductFiltersProps) {
  const handleBrandChange = (value: string) => {
    setFilters({ ...filters, brand: value });
  };

  const handleStorageChange = (value: string) => {
    setFilters({ ...filters, storage: value });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters({ ...filters, priceRange: value });
  }

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      <h3 className="font-headline text-2xl font-semibold">Filters</h3>
      
      <div className="space-y-4">
        <Label htmlFor="sort">Sort by</Label>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger id="sort">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label htmlFor="brand">Marca</Label>
        <Select value={filters.brand} onValueChange={handleBrandChange}>
          <SelectTrigger id="brand">
            <SelectValue placeholder="Select a brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="storage">Almacenamiento</Label>
        <Select value={filters.storage} onValueChange={handleStorageChange}>
          <SelectTrigger id="storage">
            <SelectValue placeholder="Select storage" />
          </Trigger>
          <SelectContent>
            <SelectItem value="all">All Storage</SelectItem>
            {storageOptions.map((storage) => (
              <SelectItem key={storage} value={storage}>
                {storage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <Label>Precio</Label>
          <span className="text-sm text-muted-foreground">
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </span>
        </div>
        <Slider
          min={0}
          max={1500}
          step={50}
          value={filters.priceRange}
          onValueChange={handlePriceChange}
        />
      </div>
    </div>
  );
}
