'use client';

import Link from 'next/link';
import { Smartphone, ShoppingCart, User, LogOut } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import CartSheet from './cart-sheet';
import FuzzySearch from './fuzzy-search';
import { useAuth } from '@/context/AuthContext';
import { logOut } from '@/lib/funtion/log/logOut';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCartStore();
  const { user, loading } = useAuth();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

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

          {/* Auth Button */}
          {!loading && (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-white/10 text-white hover:text-white">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata.avatar_url} />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {user ? (
                  <>
                    <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <Link href="/login"><DropdownMenuItem>Iniciar Sesión</DropdownMenuItem></Link>
                    <Link href="/signup"><DropdownMenuItem>Registrarse</DropdownMenuItem></Link>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

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
