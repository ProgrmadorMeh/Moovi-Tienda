'use client';

import Link from 'next/link';
import { Smartphone, ShoppingCart } from 'lucide-react';
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

export default function SiteHeader() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { href: '/', label: 'Productos' },
    { href: '/contact', label: 'Contacto' },
  ];

  return (
    <header className="top-0 z-50 fixed bg-white/10 backdrop-blur-lg border-white/20 border-b w-full">
      <div className="flex items-center h-16 container">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <Smartphone className="w-6 h-6 text-white" />
          <span className="font-headline font-bold text-white text-xl">
            MooviTech
          </span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center space-x-6 font-medium text-sm">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'hover:text-white transition-colors',
                pathname === href ? 'text-white' : 'text-gray-300'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 justify-end items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-white/10 text-white hover:text-white"
              >
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
                <ShoppingCart className="w-5 h-5" />
                <span className="sr-only">Abrir carrito de compras</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <CartSheet />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
