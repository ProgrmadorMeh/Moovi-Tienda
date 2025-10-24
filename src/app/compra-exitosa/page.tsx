'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import ParticlesComponent from '@/app/Js/animacion_particula.jsx'; // RUTA Y NOMBRE CORREGIDOS

export default function OrderSuccessPage() {
  // Al llegar a esta página, el pago fue exitoso, así que limpiamos el carrito.
  useEffect(() => {
    useCartStore.getState().clearCart();
  }, []);

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center text-center">
      {/* El componente de partículas ahora se renderiza directamente */}
      <ParticlesComponent /> 
      <div className="mb-6">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      </div>
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">¡Gracias por tu compra!</h1>
      <p className="mb-6 max-w-lg text-lg text-gray-400">
        Hemos recibido tu pedido y lo estamos procesando. Recibirás una confirmación por correo electrónico en breve.
      </p>
      <Link href="/">
        <Button size="lg">Volver a la Tienda</Button>
      </Link>
    </div>
  );
}
