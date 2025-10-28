
'use client';

import Link from 'next/link';
import { Smartphone, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import CartSheet from './cart-sheet';
import FuzzySearch from './fuzzy-search';

export default function SiteHeader() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { href: '/', label: 'Productos' },
    { href: '/contact', label: 'Contacto' },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Smartphone className="h-6 w-6 text-white" />
          <span className="font-headline text-xl font-bold text-white">
            MooviTech
          </span>
        </Link>
        <nav className="hidden flex-1 items-center space-x-6 text-sm font-medium md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'transition-colors hover:text-white',
                pathname === href ? 'text-white' : 'text-gray-300'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden w-full max-w-sm md:flex">
            <FuzzySearch />
          </div>

          {/* Cart Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/10 hover:text-white"
              >
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Abrir carrito de compras</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <CartSheet />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="border-t border-white/10 p-2 md:hidden">
        <FuzzySearch />
      </div>
    </header>
  );
}
