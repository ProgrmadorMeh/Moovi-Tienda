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
        window.location.href = data.init_point;
      } else {
        // Handle case where success is false or init_point is missing
        console.error('API succeeded but preference creation failed:', data);
        alert('Error: Could not start the payment process. Please try again.');
      }
    } else {
      // Handle non-ok responses (e.g., 4xx, 5xx)
      console.error('Error from API route:', data);
      alert(`Error: ${data.message || 'An unknown error occurred.'}`);
    }
  } catch (err) {
    console.error('Error during fetch:', err);
    alert('A network error occurred. Please check your connection and try again.');
  }
}
