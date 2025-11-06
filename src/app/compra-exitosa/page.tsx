
'use client';

import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Componente de la línea de tiempo del estado del envío
const ShippingStatusTimeline = () => {
  const timelineEvents = [
    { name: 'Pedido Confirmado', icon: CheckCircle, status: 'completed' },
    { name: 'En Preparación', icon: Package, status: 'pending' },
    { name: 'Enviado', icon: Truck, status: 'pending' },
    { name: 'Entregado', icon: Home, status: 'pending' },
  ];

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-semibold">Estado del Envío</h3>
      <div className="relative flex items-center justify-between">
        {/* Línea de progreso */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 -translate-y-1/2">
            <div className="h-full bg-green-500" style={{ width: '12.5%' }}></div>
        </div>
        
        {/* Iconos de estado */}
        {timelineEvents.map((event, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${event.status === 'completed' ? 'bg-green-500' : 'bg-gray-700'}`}>
              <event.icon className="h-5 w-5 text-white" />
            </div>
            <p className="mt-2 text-xs sm:text-sm text-center">{event.name}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-center text-gray-400">
        Recibirás actualizaciones por correo electrónico a medida que tu pedido avance.
      </p>
    </div>
  );
};


// Componente principal de la página que usa Suspense
const SuccessContent = () => {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);

  // Datos simulados extraídos de la URL
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');
  const merchantOrderId = searchParams.get('merchant_order_id');

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <Card className="w-full max-w-2xl bg-card">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <CardTitle className="text-3xl font-bold">¡Gracias por tu compra!</CardTitle>
          <p className="text-muted-foreground">
            Hemos recibido tu pedido y lo estamos procesando. Recibirás una confirmación por correo electrónico en breve.
          </p>
        </CardHeader>
        <CardContent>
          {paymentId && (
            <div className="mb-6 rounded-md border bg-background/50 p-4 text-left text-sm">
              <h3 className="mb-2 font-semibold">Detalles de tu Pedido:</h3>
              <p><strong>ID de Pago:</strong> {paymentId}</p>
              <p><strong>Estado:</strong> <span className="font-semibold capitalize text-green-500">{status || 'Aprobado'}</span></p>
              {merchantOrderId && <p><strong>ID de Orden:</strong> {merchantOrderId}</p>}
              {externalReference && <p><strong>Referencia:</strong> {externalReference}</p>}
            </div>
          )}
          
          <ShippingStatusTimeline />
          
          <div className="mt-8">
            <Link href="/">
              <Button size="lg">Volver a la Tienda</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function OrderSuccessPage() {
  // Envolvemos el componente principal en Suspense
  // para que useSearchParams funcione correctamente.
  return (
    <Suspense fallback={<div>Cargando detalles de tu compra...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
