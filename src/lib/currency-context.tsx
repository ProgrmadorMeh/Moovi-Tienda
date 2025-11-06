
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'ARS' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  rate: number | null;
  isLoading: boolean;
  error: string | null;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('ARS');
  const [rate, setRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/dolar-quote');
        if (!response.ok) {
          // Si la API falla, usamos un valor de respaldo sin mostrar error en UI
          const fallbackRate = 1000;
          setRate(fallbackRate);
          setError(null); // No consideramos esto un error para el usuario
          console.warn(`ADVERTENCIA: No se pudo cargar la cotización real. Usando valor de respaldo: ${fallbackRate}`);
        } else {
          const data = await response.json();
          if (data.rate) {
            setRate(data.rate);
            setError(null);
          } else {
             // Si la API responde OK pero sin 'rate', también usamos respaldo
            const fallbackRate = 1000;
            setRate(fallbackRate);
            setError(null); // No es un error de UI
            console.warn(`ADVERTENCIA: La API no devolvió una cotización válida. Usando valor de respaldo: ${fallbackRate}`);
          }
        }
      } catch (e: any) {
        console.error("Error crítico al buscar cotización:", e);
        // Fallback en caso de error de red u otro problema crítico
        const fallbackRate = 1000;
        setRate(fallbackRate);
        setError(null); // No es un error de UI
        console.warn(`ADVERTENCIA: Error de red al buscar cotización. Usando valor de respaldo: ${fallbackRate}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
  }, []);

  const value = {
    currency,
    rate,
    isLoading,
    error,
    setCurrency: (c: Currency) => setCurrency(c),
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency debe ser usado dentro de un CurrencyProvider');
  }
  return context;
}
