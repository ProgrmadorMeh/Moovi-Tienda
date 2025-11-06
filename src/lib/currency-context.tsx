
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
          throw new Error('No se pudo cargar la cotización.');
        }
        const data = await response.json();
        if (data.rate) {
          setRate(data.rate);
          setError(null);
        } else {
          throw new Error(data.error || 'La API no devolvió una cotización válida.');
        }
      } catch (e: any) {
        console.error(e);
        setError(e.message);
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
