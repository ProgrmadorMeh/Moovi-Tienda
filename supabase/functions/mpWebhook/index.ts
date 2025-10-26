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
    const paymentId = body.data?.id ?? body.id;

    if (!paymentId) return new Response("Falta el ID de pago", { status: 400 });

    // Consultar Mercado Pago
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpAccessToken}` },
    });
    const payment = await res.json();

    // Insert seguro en Supabase
    const { error } = await supabase.from("orders").insert([{
      payment_id: payment.id ?? paymentId,
      status: payment.status ?? body.action ?? null,
      amount: payment.transaction_amount ?? null,
      currency: payment.currency_id ?? null,
      payer_email: payment.payer?.email ?? null,
      payment_method: payment.payment_method_id ?? null,
      date_approved: payment.date_approved ?? null,
      payment_data: payment ?? null
    }]);

    if (error) throw error;

    return new Response("Webhook recibido correctamente", { status: 200 });
  } catch (err) {
    console.error("Error procesando webhook:", err);
    return new Response("Error procesando webhook", { status: 500 });
  }
});


// npx supabase functions deploy mpWebhook
// npx supabase functions serve mpWebhook --env-file .env.local --no-verify-jwt
/* $bodyJson = '{"id":"123456"}'
Invoke-RestMethod -Uri "http://127.0.0.1:54321/functions/v1/mpWebhook" -Method POST -Body $bodyJson -ContentType "application/json"
 */