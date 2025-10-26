// Supabase Edge Function: mpWebhook
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Variables de entorno
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const mpAccessToken = Deno.env.get("MP_ACCESS_TOKEN")!;

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Servir función
Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const body = await req.json();
    const paymentId = body.id || body.data?.id;

    if (!paymentId) {
      return new Response("Falta el ID de pago", { status: 400 });
    }

    // Consultar a Mercado Pago
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${mpAccessToken}`,
      },
    });
    const payment = await res.json();

    console.log("Pago recibido:", payment);

    // Guardar en Supabase
    const { error } = await supabase
      .from("orders")
      .insert([{ payment_id: paymentId, status: payment.status }]);

    if (error) throw error;

    return new Response("Webhook recibido correctamente", { status: 200 });
  } catch (err) {
    console.error("Error procesando webhook:", err);
    return new Response("Error procesando webhook", { status: 500 });
  }
});


// deno run --allow-net --allow-env index.ts
// npx supabase functions serve mpWebhook --env-file .env.local --no-verify-jwt
// curl -X POST http://localhost:8000 -H "Content-Type: application/json" -d '{"id":"1234567890"}'