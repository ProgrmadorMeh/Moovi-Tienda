export default async function Preference (email, carrito) {
    const body = { carrito, email }
  
    try {
      const res = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      })
  
      const data = await res.json()
  
      
    // después de recibir la respuesta del fetch
    if (data.success && data.init_point) {
      window.location.href = data.init_point
    } else {
      // mostrar error o manejar
      console.error('Error creating preference:', data);
    }
    } catch (err) {
      console.error('Error en fetch:', err)
    }
  }