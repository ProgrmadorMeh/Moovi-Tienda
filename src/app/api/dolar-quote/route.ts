
import { NextResponse } from 'next/server';

// GET /api/dolar-quote
// Obtiene la tasa de cambio actual de USD a ARS.
// La respuesta se cachea por 30 minutos.
export async function GET() {
  const apiKey = process.env.EXCHANGERATE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key no configurada en el servidor' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`, {
      next: { revalidate: 1800 }, // Cache por 30 minutos
    });

    if (!response.ok) {
      throw new Error(`Error al contactar la API externa: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.result === 'error') {
      throw new Error(`Error de la API externa: ${data['error-type']}`);
    }

    const rate = data.conversion_rates.ARS;
    if (!rate) {
      throw new Error('No se encontró la tasa de cambio para ARS.');
    }

    return NextResponse.json({ rate });
  } catch (error) {
    console.error('Error en /api/dolar-quote:', error);
    return NextResponse.json(
      { error: 'No se pudo obtener la cotización del dólar.' },
      { status: 500 }
    );
  }
}
