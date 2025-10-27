'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore, CartItem } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, X, Tag, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Cupones de ejemplo
const COUPONS = [
  { code: 'PROMO10', discount: 10 },
  { code: 'VERANO20', discount: 20 },
];

export default function CartPage() {
  const { items, coupon, shippingCost, getSubtotal, getTotal, applyCoupon } = useCartStore();
  const subtotal = getSubtotal();
  const total = getTotal();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState(coupon?.code || '');

  const handleApplyCoupon = () => {
    const foundCoupon = COUPONS.find((c) => c.code === couponCode.toUpperCase());
    if (foundCoupon) {
      applyCoupon(foundCoupon);
      toast({ description: '✅ Cupón aplicado con éxito' });
    } else {
      applyCoupon(null);
      toast({ variant: "destructive", description: '❌ Cupón no válido' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl">
        Tu Carrito de Compras
      </h1>

      {items.length === 0 ? (
        <div className="text-center">
          <p className="mb-4 text-lg">No tienes productos en tu carrito.</p>
          <Link href="/">
            <Button> <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la tienda</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Columna de Productos */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <CartPageItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Columna de Resumen */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 rounded-lg border bg-white/10 backdrop-blur-lg p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold">Resumen del Pedido</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span></div>
                
                {coupon && (
                  <div className="flex justify-between text-green-500">
                    <span>Descuento ({coupon.code})</span>
                    <span>-${(subtotal * (coupon.discount / 100)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="flex justify-between"><span>Envío</span><span>${shippingCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span></div>

                <div className="h-px bg-gray-300"></div>

                <div className="flex justify-between text-xl font-bold"><span>Total</span><span>${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span></div>
              </div>

              <div className="mt-6">
                <label htmlFor="coupon" className="mb-2 block text-sm font-medium">¿Tienes un cupón?</label>
                <div className="flex space-x-2">
                  <Input
                    id="coupon"
                    placeholder="Ej: PROMO10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="border-white/20 bg-white/5"
                  />
                  <Button onClick={handleApplyCoupon} variant="outline"><Tag className="mr-2 h-4 w-4" />Aplicar</Button>
                </div>
              </div>

              <Link href="/checkout" className="mt-6 block">
                <Button className="w-full" size="lg">Continuar Compra</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Componente para cada fila de la página de carrito ---

function CartPageItemRow({ item }: { item: CartItem }) {
    const { updateQuantity, removeItem } = useCartStore();

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity >= 0) {
            updateQuantity(item.id, newQuantity);
        }
    };
    
    const showDiscount = item.discount && item.discount > 0;
    const showOriginalPrice = item.originalPrice && item.originalPrice > item.salePrice;

    return (
        <div className="flex flex-col rounded-lg border bg-white/5 p-4 sm:flex-row sm:items-center sm:space-x-6">
            <Image src={item.imageUrl} alt={item.model} width={100} height={100} className="mb-4 rounded-md object-cover sm:mb-0" />
            
            <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.model}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-lg font-semibold">${item.salePrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
                  {showOriginalPrice && (
                    <p className="text-sm text-gray-400 line-through">
                      ${item.originalPrice!.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                  )}
                  {showDiscount && (
                      <Badge variant="destructive">{item.discount}% OFF</Badge>
                  )}
                </div>
            </div>

            <div className="my-4 h-px w-full bg-gray-700 sm:hidden"></div>

            <div className="flex items-center justify-between sm:justify-end sm:space-x-8">
                <div className="flex items-center rounded-md border border-white/20">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16} /></Button>
                    <Input 
                        type="number"
                        value={item.quantity}
                        onChange={handleQuantityChange}
                        className="h-8 w-14 border-x border-y-0 border-white/20 bg-transparent text-center"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16} /></Button>
                </div>

                <p className="w-24 text-right font-semibold">${(item.salePrice * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-red-500/10 hover:text-red-500" onClick={() => removeItem(item.id)}><X size={18} /></Button>
            </div>
        </div>
    );
}
