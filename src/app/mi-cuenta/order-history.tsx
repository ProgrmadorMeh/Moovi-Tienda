
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, parseISO, differenceInHours, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Package, Truck, Home, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

// --- Lógica de Estado de Envío ---
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
    <div className="space-y-4">
      {orders.map((order) => {
        const { current: shippingStatusText } = getShippingStatus(order.date_approved);

        return (
          <Card key={order.id} className="bg-background/50 hover:bg-accent/50 transition-colors">
            <Link href={`/mi-cuenta/pedidos/${order.payment_id}`} className="block p-4">
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
                        <div className="hidden sm:flex items-center gap-2 text-sm">
                            <span>{shippingStatusText}</span>
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
