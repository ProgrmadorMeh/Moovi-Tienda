import { supabase } from "@/lib/supabaseClient"; // Ajusta tu import a la configuración del cliente
import mercadopago from 'mercadopago'; // Importación estándar

// --- Configuración del SDK de Mercado Pago ---
// Se configura una sola vez cuando el módulo se carga.
mercadopago.configure({
  access_token: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN,
});


export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Cuerpo del webhook recibido:", JSON.stringify(body, null, 2));

    const topic = body.topic || body.type;
    const paymentId = body.data?.id;

    if (topic !== 'payment' || !paymentId) {
      console.log("Webhook ignorado: No es de tipo 'payment' o no tiene ID.");
      return new Response("Webhook no procesado.", { status: 200 });
    }

    console.log(`Procesando pago con ID: ${paymentId}`);

    // Obtener el pago de Mercado Pago usando el SDK
    const paymentResult = await mercadopago.payment.findById(paymentId);
    const payment = paymentResult.body;
    console.log("Datos del pago obtenidos de Mercado Pago:", payment);

    // Guardar en Supabase
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