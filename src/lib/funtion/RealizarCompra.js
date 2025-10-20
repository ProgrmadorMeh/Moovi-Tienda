export default async function Preference(email, carrito) {
  const body = { carrito, email };

  try {
    const res = await fetch('/api/mercadopago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.success && data.init_point) {
        // Redirección a Mercado Pago
        window.location.href = data.init_point;
      } else {
        // El servidor respondió OK, pero no se pudo crear la preferencia.
        console.error('API succeeded but preference creation failed:', data);
        alert('Error: No se pudo iniciar el proceso de pago. Por favor, inténtelo de nuevo.');
      }
    } else {
      // El servidor respondió con un error (4xx, 5xx).
      console.error('Error from API route:', data);
      const errorMessage = data.error?.message || data.message || 'Ocurrió un error desconocido.';
      alert(`Error: ${errorMessage}`);
    }
  } catch (err) {
    // Error de red o al procesar el fetch.
    console.error('Error during fetch:', err);
    alert('Ocurrió un error de red. Por favor, revise su conexión e inténtelo de nuevo.');
  }
}
