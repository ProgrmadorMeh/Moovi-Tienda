// src/app/mis-compras/pedidos/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { format, parseISO, differenceInHours, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, Package, Truck, Home, MapPin, User, Mail, Phone } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';


export const dynamic = 'force-dynamic';

// --- Lógica de Estado de Envío (reutilizada) ---
const getShippingStatus = (dateApproved: string) => {
  if (!dateApproved) return { current: 'Pendiente', index: -1, progress: 0 };
  
  const approvalDate = parseISO(dateApproved);
  const now = new Date();
  const daysDiff = differenceInDays(now, approvalDate);

  if (daysDiff >= 4) return { current: 'Entregado', index: 3, progress: 100 };
  if (daysDiff >= 1) return { current: 'Enviado', index: 2, progress: 66 };
  if (differenceInHours(now, approvalDate) >= 1) return { current: 'En Preparación', index: 1, progress: 33 };
  
  return { current: 'Confirmado', index: 0, progress: 5 };
};

// --- Línea de Tiempo Visual ---
const ShippingTimeline = ({ dateApproved }: { dateApproved: string }) => {
  const { index: currentIndex, progress } = getShippingStatus(dateApproved);
  const events = [
    { name: 'Confirmado', icon: CheckCircle },
    { name: 'En Preparación', icon: Package },
    { name: 'Enviado', icon: Truck },
    { name: 'Entregado', icon: Home },
  ];

  return (
    <div className="my-6">
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 -translate-y-1/2"></div>
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
        <div className="relative flex justify-between">
          {events.map((event, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${index <= currentIndex ? 'bg-primary border-primary-foreground/50' : 'bg-card border-border'}`}>
                <event.icon className={`h-5 w-5 ${index <= currentIndex ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              </div>
              <p className={`mt-2 text-xs sm:text-sm ${index <= currentIndex ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{event.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- Página Principal ---
export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id: paymentId } = params;

  // 1. Validar sesión de usuario
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  // 2. Obtener el pedido de la base de datos
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('payment_id', paymentId)
    .eq('payer_email', session.user.email) // Asegurar que el pedido pertenezca al usuario
    .single();

  if (error || !order) {
    notFound();
  }

  const { current: shippingStatusText } = getShippingStatus(order.date_approved);
  const payerInfo = order.payment_data?.payer || {};
  const shippingInfo = order.payment_data?.shipments || {};
  const items = order.payment_data?.additional_info?.items || [];
  
  // Lógica para obtener una URL de mapa simulada
  let mapUrl = `https://images.unsplash.com/photo-1594180923539-234a415a456d?q=80&w=800&h=400&fit=crop&auto=format`; // Mapa por defecto
  
  if (shippingStatusText === 'Enviado' || shippingStatusText === 'Entregado') {
      mapUrl = `https://images.unsplash.com/photo-1594180923539-234a415a456d?q=80&w=800&h=400&fit=crop&auto=format&seed=route`;
  }


  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 pt-32">
      <Link href="/mis-compras" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        Volver a Mis Compras
      </Link>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <div>
              <CardTitle className="text-2xl">Detalle del Pedido</CardTitle>
              <CardDescription>ID de Pago: {order.payment_id}</CardDescription>
            </div>
            <Badge className={`mt-2 sm:mt-0 text-base ${order.status === 'approved' ? 'bg-green-600' : 'bg-red-600'}`}>
              {order.status === 'approved' ? 'Pago Aprobado' : 'Pago Fallido'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
              Realizado el {format(parseISO(order.date_approved), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Timeline de Envío */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Estado del Envío: {shippingStatusText}</h3>
            <ShippingTimeline dateApproved={order.date_approved} />
          </div>

          <Separator />
          
          {/* Mapa de seguimiento */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Seguimiento del Paquete</h3>
            <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                <Image src={mapUrl} alt="Mapa de seguimiento simulado" layout="fill" objectFit="cover" />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute top-4 left-4 p-3 bg-background/80 backdrop-blur-sm rounded-lg text-sm">
                    <p className="font-bold">Ubicación Estimada:</p>
                    <p>{shippingStatusText === 'Entregado' ? 'Tu domicilio' : 'En tránsito'}</p>
                </div>
            </div>
          </div>
          
          <Separator />

          {/* Detalles del Pedido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">Resumen de la Compra</h3>
                <div className="space-y-2">
                    {items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm py-1 border-b border-dashed border-border">
                            <span>{item.quantity} x {item.title}</span>
                            <span className="font-medium">{new Intl.NumberFormat('es-AR', { style: 'currency', currency: item.currency_id }).format(parseFloat(item.unit_price) * parseInt(item.quantity))}</span>
                        </div>
                    ))}
                    <div className="flex justify-between font-bold pt-2">
                        <span>Total del Pedido:</span>
                        <span>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: order.currency }).format(order.amount)}</span>
                    </div>
                </div>
            </div>
            
             <div>
                <h3 className="text-lg font-semibold mb-4">Información de Contacto y Envío</h3>
                <div className="space-y-3 text-sm">
                    {payerInfo.first_name && <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> {payerInfo.first_name} {payerInfo.last_name}</p>}
                    <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {order.payer_email}</p>
                    {payerInfo.phone?.number && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {payerInfo.phone.area_code} {payerInfo.phone.number}</p>}
                    {shippingInfo.receiver_address && (
                        <p className="flex items-start gap-2 pt-2"><MapPin className="h-4 w-4 text-muted-foreground mt-1" /> 
                            <span>
                                {shippingInfo.receiver_address.street_name} {shippingInfo.receiver_address.street_number}, {shippingInfo.receiver_address.zip_code} {shippingInfo.receiver_address.city_name}, {shippingInfo.receiver_address.state_name}
                            </span>
                        </p>
                    )}
                </div>
            </div>

          </div>

        </CardContent>
      </Card>
    </div>
  );
}
