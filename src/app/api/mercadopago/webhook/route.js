import { supabase } from "@/lib/supabaseServer"; // Ajusta tu import
import mercadopago from "npm:mercadopago";

export async function POST(req) {
  try {
    const body = await req.json();
    const paymentId = body.id || body.data?.id;

    if (!paymentId) {
      return new Response("No payment ID", { status: 400 });
    }

    // Obtener el pago de Mercado Pago
    const result = await mercadopago.payment.get(paymentId);
    const payment = result.body;
    console.log("Datos del pago:", payment);

    // Guardar en Supabase
    const { error } = await supabase.from("orders").insert([
      {
        payment_id: payment.id,                   // ID del pago
        status: payment.status,                   // estado del pago
        amount: payment.transaction_amount,       // monto total
        currency: payment.currency_id,            // moneda
        payer_email: payment.payer?.email,        // email del pagador
        payment_method: payment.payment_method_id,// método de pago
        date_approved: payment.date_approved,     // fecha de aprobación
        payment_data: payment                     // objeto completo como JSON
      }
    ]);

    if (error) {
      console.error("Error guardando en Supabase:", error);
      return new Response("Error guardando el pago", { status: 500 });
    }

    return new Response("Pago recibido y guardado", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error procesando pago", { status: 500 });
  }
}
