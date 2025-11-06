
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Currency } from "./currency-context";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
}

export function formatPrice(
  priceInArs: number,
  currency: Currency,
  rate: number | null
) {
  if (currency === 'USD' && rate) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInArs / rate);
  }

  // Fallback to ARS if rate is not available or currency is ARS
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(priceInArs);
}
