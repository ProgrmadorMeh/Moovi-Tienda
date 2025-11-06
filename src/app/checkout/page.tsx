'use client';

import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Preference from '@/lib/funtion/pago/RealizarCompra.js';
import { useUserStore } from '@/lib/user-store';

// Tipos para las opciones de envío
interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  estimated_days: string;
}

export default function CheckoutPage() {
  const { items, coupon, getSubtotal, getTotal, setShippingCost, shippingCost } = useCartStore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useUserStore();
  const [postalCode, setPostalCode] = useState('');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Si no está cargando y no hay usuario, redirigir
    if (!loading && !user) {
        toast({
            variant: "destructive",
            description: "Necesitas iniciar sesión para continuar.",
            duration: 3000
        });
        router.replace('/login');
    }
    // Si el carrito está vacío, redirigir
    else if (items.length === 0 && !loading) {
      toast({ description: "Tu carrito está vacío. Redirigiendo...", duration: 2000 });
      setTimeout(() => router.replace('/'), 2000);
    }
  }, [user, loading, items, router, toast]);

  // Seteamos el email del usuario si está logueado
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleCalculateShipping = async () => {
    if (postalCode.length < 4) {
      toast({ variant: "destructive", description: "Por favor, introduce un código postal válido." });
      return;
    }

    setIsLoadingShipping(true);
    try {
      // Llamada a la nueva API de cotización
      const response = await fetch('/api/shipping-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postalCode,
          cartItems: items.map(item => ({ id: item.id, quantity: item.quantity, price: item.salePrice, weight: item.weight })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo calcular el envío.');
      }
      
      const options: ShippingOption[] = data.options;
      setShippingOptions(options);

      if (options.length > 0) {
        // Seleccionar la primera opción por defecto
        setSelectedShipping(options[0].id);
        setShippingCost(options[0].cost);
      } else {
        setSelectedShipping(undefined);
        setShippingCost(0);
        toast({ variant: "destructive", description: "No se encontraron opciones de envío para este código postal." });
      }
    } catch (error: any) {
      console.error("Error fetching shipping options:", error);
      toast({ variant: "destructive", description: error.message || "No se pudo calcular el envío." });
      setShippingOptions([]);
      setSelectedShipping(undefined);
      setShippingCost(0);
    } finally {
      setIsLoadingShipping(false);
    }
  };


  const handleShippingChange = (optionId: string) => {
    const selected = shippingOptions.find(opt => opt.id === optionId);
    if (selected) {
      setShippingCost(selected.cost);
      setSelectedShipping(optionId);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedShipping) {
        toast({ variant: "destructive", description: 'Por favor, selecciona un método de envío.' });
        return;
    }

    if (!email) {
      toast({ variant: "destructive", description: 'Por favor, introduce tu dirección de correo electrónico.' });
      return;
    }

    const cartForMP = items.map(item => ({
      nombre: item.model, 
      cantidad: item.quantity,
      precio: item.salePrice,
    }));

    // El costo de envío ya se suma al total, pero MercadoPago lo necesita como un item más
    if (shippingCost > 0 && selectedShipping) {
      const shippingOption = shippingOptions.find(opt => opt.id === selectedShipping);
      cartForMP.push({
          nombre: shippingOption?.name || 'Costo de Envío',
          cantidad: 1,
          precio: shippingCost,
      });
    }

    setIsSubmitting(true);
    try {
      await Preference(email, cartForMP);
      // La redirección a Mercado Pago la maneja la función Preference
    } catch (error) {
      console.error("Error al llamar a la función Preference:", error);
      toast({ variant: "destructive", description: "Ocurrió un error inesperado al iniciar el pago." });
      setIsSubmitting(false);
    }
  };

  if (loading || !user || items.length === 0) {
    return (
        <div className="container mx-auto flex h-screen items-center justify-center">
            <p>Cargando...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <h1 className="mb-8 text-center text-3xl font-bold">Finalizar Compra</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-lg border bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-4">1. Datos de Contacto y Envío</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="tu@email.com" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  readOnly={!!user?.email} // Si el usuario está logueado, no puede cambiar el email
                />
              </div>
              <div><Label htmlFor="nombre">Nombre</Label><Input id="nombre" required /></div>
              <div><Label htmlFor="apellido">Apellido</Label><Input id="apellido" required /></div>
              <div className="md:col-span-2"><Label htmlFor="direccion">Dirección</Label><Input id="direccion" placeholder="Calle, número, piso" required /></div>
              
              <div className="flex items-end space-x-2">
                <div className="flex-grow"><Label htmlFor="cp">Código Postal</Label><Input id="cp" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required /></div>
                <Button type="button" onClick={handleCalculateShipping} disabled={isLoadingShipping}>{isLoadingShipping ? 'Calculando...' : 'Calcular Envío'}</Button>
              </div>

              <div><Label htmlFor="ciudad">Ciudad</Label><Input id="ciudad" required /></div>
              <div><Label htmlFor="provincia">Provincia</Label><Input id="provincia" required /></div>
              <div><Label htmlFor="telefono">Teléfono</Label><Input id="telefono" type="tel" /></div>
            </div>
          </div>

          <div className="rounded-lg border bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-4">2. Método de Envío</h2>
            {isLoadingShipping && <p>Calculando envío...</p>}
            {shippingOptions.length > 0 && (
              <RadioGroup value={selectedShipping} onValueChange={handleShippingChange} className="space-y-2">
                {shippingOptions.map(opt => (
                  <Label 
                    key={opt.id}
                    htmlFor={opt.id}
                    className="flex cursor-pointer items-center justify-between rounded-md border p-4 transition-colors hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={opt.id} id={opt.id} />
                      <div>
                        <span>{opt.name}</span>
                        <p className="text-sm text-muted-foreground">
                          Entrega estimada: {opt.estimated_days}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold">${opt.cost.toFixed(2)}</span>
                  </Label>
                ))}
              </RadioGroup>
            )}
            {postalCode && !isLoadingShipping && shippingOptions.length === 0 && (
              <p className="text-muted-foreground">No hay opciones de envío para el código postal ingresado. Intenta con otro.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
            <div className="sticky top-32 rounded-lg border bg-white/10 backdrop-blur-lg p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold">Resumen del Pedido</h2>
              <div className="space-y-3">
                <div className="flex justify-between"><span>Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
                {coupon && (
                  <div className="flex justify-between text-green-500">
                    <span>Descuento ({coupon.code})</span>
                    <span>-${(getSubtotal() * (coupon.discount / 100)).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between"><span>Envío</span><span>${shippingCost.toFixed(2)}</span></div>
                <div className="h-px bg-gray-300"></div>
                <div className="flex justify-between text-xl font-bold"><span>Total</span><span>${getTotal().toFixed(2)}</span></div>
              </div>
              <Button type="submit" className="w-full mt-6" size="lg" disabled={isSubmitting || !selectedShipping}>{isSubmitting ? 'Procesando...' : 'Ir a Pagar'}</Button>
               <div className="mt-4 text-xs text-gray-400">
                <input type="checkbox" id="billing-same" defaultChecked className="mr-2"/>
                <label htmlFor="billing-same">Usar dirección de envío como dirección de facturación</label>
              </div>
            </div>
        </div>

      </form>
    </div>
  );
}
