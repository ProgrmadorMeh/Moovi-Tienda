'use client';

import Link from 'next/link';
import { XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderFailedPage() {
  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center text-center">
      <div className="mb-6">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
      </div>
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">Hubo un problema con tu pago</h1>
      <p className="mb-6 max-w-lg text-lg text-gray-400">
        No se pudo procesar tu pago. Por favor, revisa tus datos o intenta con un método de pago diferente.
      </p>
      <Link href="/checkout">
        <Button size="lg" variant="destructive">
            <RefreshCw className="mr-2 h-4 w-4" /> Reintentar Pago
        </Button>
      </Link>
    </div>
  );
}
