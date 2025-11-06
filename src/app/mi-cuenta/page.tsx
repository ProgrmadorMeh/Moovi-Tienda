

import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, Shield, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function MiCuentaPage() {
  
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const user = session.user;

  return (
    <div className="container mx-auto px-4 py-12 pt-32 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Mi Cuenta
        </h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal, direcciones y seguridad.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Columna Principal de Contenido */}
        <div className="md:col-span-3 space-y-8">
          
          {/* Tarjeta de Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6" />
                Información de Perfil
              </CardTitle>
              <CardDescription>Tus datos personales principales.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <p className="w-32 font-semibold">Nombre:</p>
                <p className="text-muted-foreground">{user.user_metadata.name || 'No especificado'}</p>
              </div>
              <div className="flex items-center">
                <p className="w-32 font-semibold">Email:</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
               <div className="flex items-center">
                <p className="w-32 font-semibold">Miembro desde:</p>
                <p className="text-muted-foreground">{new Date(user.created_at).toLocaleDateString('es-AR')}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4">Editar Perfil</Button>
            </CardContent>
          </Card>

           {/* Tarjeta de Seguridad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Seguridad
              </CardTitle>
              <CardDescription>Gestiona tu contraseña y la seguridad de tu cuenta.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">Contraseña</p>
                        <p className="text-muted-foreground text-sm">••••••••</p>
                    </div>
                    <Button variant="outline" size="sm">Cambiar Contraseña</Button>
                </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
