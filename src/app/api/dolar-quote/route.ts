
import { NextResponse } from 'next/server';

// GET /api/dolar-quote
// Obtiene la tasa de cambio actual de USD a ARS desde DolarAPI.
// La respuesta se cachea por 30 minutos.
export async function GET() {
  try {
    const response = await fetch(`https://dolarapi.com/v1/dolares/oficial`, {
      next: { revalidate: 1800 }, // Cache por 30 minutos
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API Error: DolarAPI devolvió un estado ${response.status}. Body: ${errorBody}`);
      throw new Error(`Error al contactar DolarAPI: ${response.statusText}`);
    }

    const data = await response.json();

    // DolarAPI devuelve un objeto con 'compra' y 'venta'. Usamos 'venta'.
    const rate = data?.venta;

    if (!rate || typeof rate !== 'number') {
      console.error('API Error: No se encontró la tasa de cambio (venta) en la respuesta de DolarAPI.');
      throw new Error('No se encontró la tasa de cambio para ARS.');
    }

    return NextResponse.json({ rate });
  } catch (error: any) {
    console.error('Error en /api/dolar-quote:', error.message);
    // Devolvemos un error genérico al cliente para no exponer detalles internos.
    return NextResponse.json(
      { error: 'No se pudo obtener la cotización del dólar.' },
      { status: 500 }
    );
  }
}
