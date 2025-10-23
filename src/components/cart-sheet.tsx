'use client';

import Image from "next/image";
import Link from "next/link";
import { useCartStore, type CartItem as CartItemType } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Trash2, ShoppingCart } from "lucide-react";
import Preference from "@/lib/funtion/pago/RealizarCompra";

export default function CartSheet() {
  const { items, removeFromCart, clearCart } = useCartStore();
  const subtotal = items.reduce(
    (acc, item) => acc + item.salePrice * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (items.length === 0) return;

    const email = "test.user@example.com"; // TODO: Reemplazar con el email del usuario logueado
    const cartItemsForApi = items.map(item => ({
      nombre: `${item.brand} ${item.model}`,
      cantidad: item.quantity,
      precio: item.salePrice,
    }));

    await Preference(email, cartItemsForApi);
  };


  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4 p-4">
        <ShoppingCart
          className="h-24 w-24 text-muted-foreground"
          strokeWidth={1}
        />
        <SheetHeader>
          <SheetTitle className="font-headline text-xl font-semibold">
            Your cart is empty
          </SheetTitle>
        </SheetHeader>
        <p className="text-center text-muted-foreground">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="p-4">
        <SheetTitle className="font-headline text-lg font-semibold">
          Shopping Cart ({items.length})
        </SheetTitle>
      </SheetHeader>
      <ScrollArea className="flex-grow px-4">
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} onRemove={removeFromCart} />
          ))}
        </div>
      </ScrollArea>
      <SheetFooter className="p-4">
        <div className="w-full space-y-4">
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Button className="w-full" onClick={handleCheckout}>Checkout</Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </div>
      </SheetFooter>
    </div>
  );
}

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
}

function CartItem({ item, onRemove }: CartItemProps) {
  const productName = `${item.brand} ${item.model}`;
  return (
    <div className="flex items-center space-x-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-md border">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={productName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-xs text-muted-foreground">No Image</span>
          </div>
        )}
      </div>
      <div className="flex-grow">
        <p className="font-semibold">{productName}</p>
        <p className="text-sm text-muted-foreground">
          Qty: {item.quantity}
        </p>
        <p className="font-bold">${(item.salePrice * item.quantity).toFixed(2)}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
        <Trash2 className="h-5 w-5" />
        <span className="sr-only">Remove</span>
      </Button>
    </div>
  );
}
