import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = Deno.env.get("URL")!;
const supabaseKey = Deno.env.get("SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

const mpAccessToken = Deno.env.get("MP_ACCESS_TOKEN")!;

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const body: any = await req.json();
    const paymentId: string | undefined = body.id || (body.data && body.data.id);
    if (!paymentId) return new Response("No payment ID", { status: 400 });

    // Llamada a Mercado Pago vía fetch
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpAccessToken}` },
    });
    const payment = await res.json();

    // Guardar en Supabase
    await supabase.from("orders").insert([{ payment_id: paymentId, status: payment.status }]);

    return new Response("Webhook recibido", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error procesando webhook", { status: 500 });
  }
});
