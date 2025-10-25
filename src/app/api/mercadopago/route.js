import dotenv from 'dotenv';
dotenv.config();

const accessToken = process.env.MP_ACCESS_TOKEN;

export async function POST(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { carrito, email } = await req.json();
    const items = carrito.map((item) => ({
      title: item.nombre,
      quantity: Number(item.cantidad) || 1,   // asegurar que es número
      unit_price: Number(item.precio) || 0,   // asegurar que es número
      currency_id: 'ARS',
    }));
    console.log(items)
    
    const preference = {
      items,
      payer: { email },
      back_urls: {
        success: "https://6000-firebase-studio-1759795962538.cluster-ocv3ypmyqfbqysslgd7zlhmxek.cloudworkstations.dev/compra-exitosa",
        failure: "https://6000-firebase-studio-1759795962538.cluster-ocv3ypmyqfbqysslgd7zlhmxek.cloudworkstations.dev/pago-fallido",
        pending: "https://tusitio.com/pending",
      },
      auto_return: "approved",
      sandbox: true,
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    })

    const data = await response.json()

    if (!response.ok) {
        // Si la API de Mercado Pago devuelve un error, lo enviamos al cliente.
        console.error('Error from Mercado Pago API:', data);
        return new Response(
            JSON.stringify({ success: false, message: 'Error from Mercado Pago', error: data }),
            { headers: { 'Content-Type': 'application/json' }, status: response.status }
        );
    }

    // Si todo va bien, devolvemos el init_point.
    return new Response(
      JSON.stringify({
        success: true,
        init_point: data.init_point,
        id: data.id,
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (err) {
    console.error('Internal Server Error:', err)
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}
