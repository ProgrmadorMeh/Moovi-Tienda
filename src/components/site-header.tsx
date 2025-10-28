
'use client';

import Link from 'next/link';
import { Smartphone, ShoppingCart, Menu } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import CartSheet from './cart-sheet';
import FuzzySearch from './fuzzy-search';
import { useState } from 'react';

export default function SiteHeader() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/#product-catalog', label: 'Productos' },
    { href: '/contact', label: 'Contacto' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Smartphone className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">
            MooviTech
          </span>
        </Link>
        
        {/* Menú de Escritorio */}
        <nav className="hidden flex-1 items-center space-x-6 text-sm font-medium md:flex">
          {navLinks.slice(1).map(({ href, label }) => ( // Omitir 'Inicio' en desktop
            <Link
              key={href}
              href={href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === href ? 'text-primary' : 'text-foreground'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden w-full max-w-xs lg:flex">
            <FuzzySearch />
          </div>

          {/* Botón de Carrito */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground hover:bg-accent hover:text-accent-foreground"
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

          {/* Menú Móvil */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col p-6">
                    <Link href="/" className="mb-8 flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Smartphone className="h-6 w-6 text-primary" />
                        <span className="font-headline text-xl font-bold">MooviTech</span>
                    </Link>
                    <nav className="flex flex-col space-y-4">
                        {navLinks.map(({ href, label }) => (
                            <SheetClose asChild key={href}>
                                <Link
                                    href={href}
                                    className={cn(
                                        'text-lg transition-colors hover:text-primary',
                                        pathname === href ? 'text-primary font-semibold' : 'text-foreground'
                                    )}
                                >
                                    {label}
                                </Link>
                            </SheetClose>
                        ))}
                    </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <div className="border-t border-border/40 p-2 lg:hidden">
        <FuzzySearch />
      </div>
    </header>
  );
}
