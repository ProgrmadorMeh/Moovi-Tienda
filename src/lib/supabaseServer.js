import mercadopago from "npm:mercadopago";
import { supabase } from "../../../src/lib/supabaseServer"

// Configurar Mercado Pago
mercadopago.configurations.setAccessToken(Deno.env.get("MP_ACCESS_TOKEN"));

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const paymentId = body.id || (body.data && body.data.id);

    if (!paymentId) return new Response("No payment ID", { status: 400 });

    // Consultar el pago en Mercado Pago
    const payment = await mercadopago.payment.get(paymentId);
    console.log("Datos del pago recibidos:", payment.body);

    // Guardar en Supabase
    await supabase.from("orders").insert([
      { payment_id: paymentId, status: payment.body.status }
    ]);

    return new Response("Webhook recibido", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error procesando webhook", { status: 500 });
  }
});
