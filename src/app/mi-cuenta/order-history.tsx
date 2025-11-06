
'use client';

import { useState } from 'react';
import { format, parseISO, differenceInHours, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Package, Truck, Home, AlertCircle } from 'lucide-react';

// --- Tipos ---
type Order = {
  id: number;
  payment_id: string;
  status: string;
  amount: number;
  currency: string;
  date_approved: string;
  payment_data: any; // Aquí guardamos el JSON completo de MP
};

interface OrderHistoryProps {
  orders: Order[];
}

// --- Componente de la Línea de Tiempo ---
const getShippingStatus = (dateApproved: string) => {
  if (!dateApproved) return { current: 'Pendiente', index: -1 };
  
  const approvalDate = parseISO(dateApproved);
  const now = new Date();
  const daysDiff = differenceInDays(now, approvalDate);

  if (daysDiff >= 4) return { current: 'Entregado', index: 3 };
  if (daysDiff >= 1) return { current: 'Enviado', index: 2 };
  if (differenceInHours(now, approvalDate) >= 1) return { current: 'En Preparación', index: 1 };
  
  return { current: 'Confirmado', index: 0 };
};

const ShippingStatusTimeline = ({ dateApproved }: { dateApproved: string }) => {
  const { index: currentIndex } = getShippingStatus(dateApproved);
  const timelineEvents = [
    { name: 'Confirmado', icon: CheckCircle },
    { name: 'En Preparación', icon: Package },
    { name: 'Enviado', icon: Truck },
    { name: 'Entregado', icon: Home },
  ];

  return (
    <div className="mt-4">
      <div className="relative flex items-center justify-between">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 -translate-y-1/2">
            <div 
              className="h-full bg-green-500 transition-all duration-500" 
              style={{ width: `${(currentIndex / (timelineEvents.length - 1)) * 100}%` }}
            ></div>
        </div>
        
        {timelineEvents.map((event, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${index <= currentIndex ? 'bg-green-500' : 'bg-gray-700'}`}>
              <event.icon className="h-5 w-5 text-white" />
            </div>
            <p className={`mt-2 text-xs sm:text-sm text-center ${index <= currentIndex ? 'font-semibold' : ''}`}>{event.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Componente Principal ---
export default function OrderHistory({ orders }: OrderHistoryProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Aún no has realizado ninguna compra.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {orders.map((order) => {
        const { current: shippingStatusText } = getShippingStatus(order.date_approved);

        return (
          <AccordionItem value={`order-${order.id}`} key={order.id} className="border rounded-lg bg-background/50">
            <AccordionTrigger className="p-4 hover:no-underline">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left">
                <div>
                  <p className="font-bold">Pedido #{order.payment_id}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(order.date_approved), "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <p className="font-semibold text-lg">
                        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: order.currency }).format(order.amount)}
                    </p>
                    <Badge variant={order.status === 'approved' ? 'default' : 'destructive'} className="bg-green-500/80">
                      {order.status === 'approved' ? 'Aprobado' : 'Fallido'}
                    </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              <div>
                <h4 className="font-semibold">Estado del Envío: {shippingStatusText}</h4>
                <ShippingStatusTimeline dateApproved={order.date_approved} />
              </div>
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Resumen de la Compra</h4>
                {order.payment_data?.additional_info?.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm py-1 border-b border-dashed border-gray-700">
                        <span>{item.quantity} x {item.title}</span>
                        <span>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: item.currency_id }).format(item.unit_price * item.quantity)}</span>
                    </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
