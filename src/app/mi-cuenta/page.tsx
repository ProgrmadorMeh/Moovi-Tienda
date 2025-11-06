
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import OrderHistory from './order-history';

export const dynamic = 'force-dynamic'; // Asegura que la página se renderice dinámicamente

export default async function MiCuentaPage() {
  
  // 1. Obtener la sesión del usuario del lado del servidor
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const user = session.user;

  // 2. Obtener los pedidos del usuario
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('payer_email', user.email)
    .order('date_approved', { ascending: false });

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
    // Podríamos mostrar un mensaje de error aquí
  }
  
  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Mi Cuenta
        </h1>
        <p className="text-muted-foreground">
          Bienvenido, {user.user_metadata.name || user.email}. Aquí puedes ver tus pedidos y gestionar tu cuenta.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-3">
            <Card>
                <CardHeader>
                    <CardTitle>Historial de Pedidos</CardTitle>
                    <CardDescription>Un resumen de todas tus compras realizadas en MooviTech.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OrderHistory orders={orders ?? []} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
