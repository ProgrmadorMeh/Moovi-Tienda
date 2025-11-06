
'use client';

import { useCurrency } from '@/lib/currency-context';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';

export function CurrencyToggle() {
  const { currency, setCurrency, isLoading, error } = useCurrency();

  if (isLoading) {
    return <Skeleton className="h-10 w-24" />;
  }

  if (error) {
    return <div className="text-red-500 text-sm">Error de cotización</div>;
  }

  return (
    <div>
      <p className="text-sm font-medium mb-2">Moneda</p>
      <ToggleGroup
        type="single"
        value={currency}
        onValueChange={(value) => {
          if (value) setCurrency(value as 'ARS' | 'USD');
        }}
        aria-label="Seleccionar Moneda"
      >
        <ToggleGroupItem value="ARS" aria-label="Pesos Argentinos">
          ARS
        </ToggleGroupItem>
        <ToggleGroupItem value="USD" aria-label="Dólares Americanos">
          USD
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
