'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore, CartItem } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, X, Tag, ArrowLeft } from 'lucide-react';
import { useState, memo, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { defaultBase } from '@/lib/types';
import { useCurrency } from '@/lib/currency-context';
import { formatPrice } from '@/lib/utils';


// Cupones de ejemplo
const COUPONS = [
  { code: 'PROMO10', discount: 10 },
  { code: 'VERANO20', discount: 20 },
];

export default function CartPage() {
  const { items, coupon, shippingCost, applyCoupon, setShippingCost, getSubtotal } = useCartStore();
  const { currency, rate } = useCurrency();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState('');

  // Reset coupon and shipping on mount if cart has items
  useEffect(() => {
    if (items.length > 0) {
      applyCoupon(null);
      setShippingCost(0);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

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
  
  const subtotal = getSubtotal();

  const discountAmount = useMemo(() => {
    return coupon ? subtotal * (coupon.discount / 100) : 0;
  }, [subtotal, coupon]);

  const total = useMemo(() => {
    return subtotal - discountAmount + shippingCost;
  }, [subtotal, discountAmount, shippingCost]);


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
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal, currency, rate)}</span></div>
                
                {coupon && (
                  <div className="flex justify-between text-green-500">
                    <span>Descuento ({coupon.code})</span>
                    <span>-{formatPrice(discountAmount, currency, rate)}</span>
                  </div>
                )}

                <div className="flex justify-between"><span>Envío</span><span>{shippingCost > 0 ? formatPrice(shippingCost, currency, rate) : 'A calcular'}</span></div>

                <div className="h-px bg-gray-300"></div>

                <div className="flex justify-between text-xl font-bold"><span>Total</span><span>{formatPrice(total, currency, rate)}</span></div>
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

// --- Componente para cada fila de la página de carrito (Memoizado) ---

const CartPageItemRow = memo(function CartPageItemRow({ item }: { item: CartItem }) {
    const { updateQuantity, removeItem } = useCartStore();
    const { currency, rate } = useCurrency();

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity >= 0) {
            updateQuantity(item.id, newQuantity);
        }
    };
    
    const showDiscount = item.discount && item.discount > 0;
    const showOriginalPrice = item.originalPrice && item.originalPrice > item.salePrice;

    // Lógica para asegurar que siempre haya una URL de imagen válida
    let imageSrc = defaultBase.imageUrl as string;
    if (Array.isArray(item.imageUrl) && item.imageUrl.length > 0 && item.imageUrl[0]) {
        imageSrc = item.imageUrl[0];
    } else if (typeof item.imageUrl === 'string' && item.imageUrl) {
        imageSrc = item.imageUrl;
    }

    return (
        <div className="flex flex-col rounded-lg border bg-white/5 p-4 sm:flex-row sm:items-center sm:space-x-6">
            <div className="relative h-[100px] w-[100px] flex-shrink-0 self-start sm:mb-0 mb-4">
                <Image 
                    src={imageSrc} 
                    alt={item.model} 
                    fill 
                    className="rounded-md object-cover"
                />
            </div>
            
            <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.model}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-lg font-semibold">{formatPrice(item.salePrice, currency, rate)}</p>
                  {showOriginalPrice && (
                    <p className="text-sm text-gray-400 line-through">
                      {formatPrice(item.originalPrice!, currency, rate)}
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

                <p className="w-24 text-right font-semibold">{formatPrice(item.salePrice * item.quantity, currency, rate)}</p>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-red-500/10 hover:text-red-500" onClick={() => removeItem(item.id)}><X size={18} /></Button>
            </div>
        </div>
    );
});
