import { NextResponse } from 'next/server';

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  weight: number;
}

const ORIGIN_POSTAL_CODE = 'C1425'; // Código postal del almacén (ej. Palermo)

/**
 * Simula la distancia basada en el código postal.
 * @param destPostalCode - Código postal de destino.
 * @returns Un factor de distancia (ej. 1 para cerca, 2 para medio, 3 para lejos).
 */
const getDistanceFactor = (destPostalCode: string): number => {
  const originPrefix = parseInt(ORIGIN_POSTAL_CODE.substring(1, 2), 10); // Ej: 1
  const destPrefix = parseInt(destPostalCode.substring(0, 1), 10);

  const diff = Math.abs(originPrefix - destPrefix);

  if (diff <= 1) return 1.2;   // Misma región o aledañas
  if (diff <= 4) return 1.8;   // Regiones intermedias
  return 2.5;                // Regiones lejanas
};

export async function POST(req: Request) {
  try {
    const { postalCode, cartItems } = await req.json();

    if (!postalCode || !/^\d{4}$/.test(postalCode)) {
      return NextResponse.json({ error: 'El código postal es inválido.' }, { status: 400 });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío.' }, { status: 400 });
    }
    
    // Simular que ciertas zonas no tienen cobertura
    if (postalCode.startsWith('94')) {
        return NextResponse.json({ error: 'Zona de entrega no cubierta.' }, { status: 400 });
    }

    // --- Lógica de Cálculo de Costos ---
    const totalWeight = cartItems.reduce((acc: number, item: CartItem) => acc + (item.weight * item.quantity), 0);
    const declaredValue = cartItems.reduce((acc: number, item: CartItem) => acc + (item.price * item.quantity), 0);
    const totalItems = cartItems.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

    const distanceFactor = getDistanceFactor(postalCode);

    // 1. Tarifa Base
    const baseRate = 1500; // $1500 ARS

    // 2. Costo por Peso (ej. $500 por cada kg)
    const weightCost = totalWeight * 500;

    // 3. Costo por Volumen (simulado)
    const volumeCost = totalItems > 5 ? 800 : 0; // Costo extra si son muchos productos

    // 4. Seguro (ej. 1% del valor declarado)
    const insuranceCost = declaredValue * 0.01;

    // --- Calcular Opciones de Envío ---
    
    // Envío Estándar
    const standardCost = (baseRate * distanceFactor) + weightCost + volumeCost + insuranceCost;
    const standardOption = {
      id: 'standard',
      name: 'Envío Estándar',
      cost: parseFloat(standardCost.toFixed(2)),
      estimated_days: '5-7 días hábiles',
    };

    // Envío Express
    const expressCost = standardCost * 1.6; // 60% más caro
    const expressOption = {
      id: 'express',
      name: 'Envío Express',
      cost: parseFloat(expressCost.toFixed(2)),
      estimated_days: '1-3 días hábiles',
    };

    return NextResponse.json({ options: [standardOption, expressOption] });

  } catch (error) {
    console.error('Error en /api/shipping-quote:', error);
    return NextResponse.json(
      { error: 'No se pudo calcular el envío en este momento.' },
      { status: 500 }
    );
  }
}
