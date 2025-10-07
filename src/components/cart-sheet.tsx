import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartSheet() {
  // This is a placeholder as the cart is not fully implemented.
  const itemCount = 0;

  if (itemCount > 0) {
    return (
      <div className="flex h-full flex-col justify-between">
        {/* List of items would go here */}
        <div className="p-4">
          <p>Items in your cart:</p>
          {/* Placeholder for cart items */}
        </div>
        <div className="border-t p-4">
          <Button className="w-full">Checkout</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <ShoppingCart className="h-24 w-24 text-muted-foreground" strokeWidth={1} />
      <h3 className="font-headline text-xl font-semibold">Your cart is empty</h3>
      <p className="text-center text-muted-foreground">
        Looks like you haven't added anything to your cart yet.
      </p>
      <Button asChild className="mt-4">
        <Link href="/">Continue Shopping</Link>
      </Button>
    </div>
  );
}
