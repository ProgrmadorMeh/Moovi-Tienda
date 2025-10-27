// src/components/PrivateRoute.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está cargando y no hay usuario, redirigir a login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Mientras carga, mostrar un spinner o un esqueleto
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  // Si hay usuario, renderizar el contenido protegido
  if (user) {
    return <>{children}</>;
  }

  // Si no hay usuario y ya se está redirigiendo, renderiza null para evitar parpadeos
  return null;
}
