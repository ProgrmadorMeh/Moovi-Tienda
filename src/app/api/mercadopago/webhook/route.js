import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { cookies } from 'next/headers';

export async function POST(req) {
  const supabase = createPagesServerClient({ cookies });
  try {
    // 1. Instanciar el cliente dentro de la función
    const client = new MercadoPagoConfig({ 
        accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN,
        options: { timeout: 5000 }
    });

    const body = await req.json();
    console.log("Cuerpo del webhook recibido:", JSON.stringify(body, null, 2));

    const topic = body.topic || body.type;
    const paymentId = body.data?.id;

    if (topic !== 'payment' || !paymentId) {
      console.log("Webhook ignorado: No es de tipo 'payment' o no tiene ID.");
      return new Response("Webhook no procesado.", { status: 200 });
    }

    console.log(`Procesando pago con ID: ${paymentId}`);

    // 2. Usar la nueva instancia del cliente para las operaciones
    const paymentInstance = new Payment(client);
    const payment = await paymentInstance.get({ id: paymentId });
    console.log("Datos del pago obtenidos de Mercado Pago:", payment);

    // 3. Guardar en Supabase
    const { error } = await supabase.from("orders").insert([
      {
        payment_id: payment.id,
        status: payment.status,
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        payer_email: payment.payer?.email,
        payment_method: payment.payment_method_id,
        date_approved: payment.date_approved,
        payment_data: payment
      }
    ]);

    if (error) {
      console.error("Error guardando en Supabase:", error);
      return new Response("Error guardando el pago", { status: 500 });
    }

    console.log(`Pago ${paymentId} guardado exitosamente en Supabase.`);
    return new Response("Pago recibido y guardado", { status: 200 });

  } catch (error) {
    console.error("Error crítico procesando el webhook:", error);
    return new Response("Error procesando el pago", { status: 500 });
  }
}
