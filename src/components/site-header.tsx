'use client';

import Link from 'next/link';
import { Smartphone, ShoppingCart, Menu, User, LogOut } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import CartSheet from './cart-sheet';
import FuzzySearch from './fuzzy-search';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/user-store';
import { logout } from '@/lib/funtion/log/logout';
import { useToast } from '@/hooks/use-toast';


export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isHomePage = pathname === '/';
  
  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/#product-catalog', label: 'Productos' },
    { href: '/contact', label: 'Contacto' },
    { href: '/faq', label: 'FAQ' },
  ];

  const handleLogout = async () => {
    await logout();
    toast({ description: 'Has cerrado sesión.' });
    router.push('/');
    router.refresh();
  };

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-sm",
        isHomePage ? 'border-transparent' : 'border-border/40 bg-background/80'
    )}>
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Smartphone className="h-6 w-6 text-primary" />
          <span className={cn(
              "font-headline text-xl font-bold",
              isHomePage && "text-white"
          )}>
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
                pathname === href ? 'text-primary' : (isHomePage ? 'text-white' : 'text-foreground')
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

          {/* Menú de Usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("relative hover:bg-accent", isHomePage ? "text-white hover:text-accent-foreground" : "text-foreground")}>
                <User className="h-5 w-5" />
                <span className="sr-only">Abrir menú de usuario</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuLabel>
                    Hola, {user.user_metadata?.name || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/mi-cuenta">Mi Cuenta</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Iniciar Sesión</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Registrarse</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Botón de Carrito */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("relative hover:bg-accent", isHomePage ? "text-white hover:text-accent-foreground" : "text-foreground")}
              >
                {hasMounted && totalItems > 0 && (
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
                  className={cn("hover:bg-accent", isHomePage ? "text-white hover:text-accent-foreground" : "text-foreground")}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                   <SheetTitle>Menú Principal</SheetTitle>
                </SheetHeader>
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
