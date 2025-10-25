
import React from 'react';
import { FileText, ShoppingCart, CreditCard, Truck, RotateCw, Shield, Landmark } from 'lucide-react';

const TerminosYCondicionesPage = () => {
  const sections = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "1. Información General y Aceptación",
      content: (
        <>
          <p>Este documento establece los términos y condiciones que rigen el uso del sitio web de comercio electrónico <strong>MooviTech</strong> (en adelante, "el Sitio") y la compra de sus productos. Al utilizar el Sitio y realizar un pedido, usted acepta plenamente estos Términos y Condiciones. Si no está de acuerdo con alguno de ellos, no debe utilizar este Sitio.</p>
          <div className="mt-4 rounded-lg border bg-card p-4">
            <h3 className="font-semibold">Datos del Propietario:</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong>Razón Social:</strong> MooviTech S.A. (Ejemplo)</li>
              <li><strong>Domicilio:</strong> Av. Siempreviva 742, Springfield</li>
              <li><strong>Email:</strong> <a href="mailto:contacto@moovitech.com" className="text-primary hover:underline">contacto@moovitech.com</a></li>
              <li><strong>Identificación Fiscal (CUIT):</strong> 30-12345678-9</li>
            </ul>
          </div>
        </>
      )
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-primary" />,
      title: "2. Proceso de Compra y Precios",
      content: (
        <>
          <p><strong>Aceptación del Pedido:</strong> Todos los pedidos están sujetos a la disponibilidad del producto y a la aceptación por nuestra parte. Una vez realizado el pedido, recibirá una confirmación por correo electrónico.</p>
          <p><strong>Precios:</strong> Los precios de los productos son los indicados en el Sitio, están expresados en Pesos Argentinos (ARS) e incluyen IVA. Nos reservamos el derecho de modificar los precios en cualquier momento sin previo aviso, salvo en los pedidos ya confirmados.</p>
          <p><strong>Errores:</strong> En caso de un error evidente en el precio de un producto, nos reservamos el derecho de cancelar el pedido y realizar el reembolso correspondiente.</p>
        </>
      )
    },
    {
        icon: <CreditCard className="h-8 w-8 text-primary" />,
        title: "3. Pagos y Seguridad",
        content: (
            <>
                <p>Aceptamos los siguientes métodos de pago: Tarjetas de crédito/débito (Visa, Mastercard), Transferencia bancaria y plataformas de pago como Mercado Pago.</p>
                <p>El cargo en su tarjeta o cuenta se realizará al momento de la confirmación del pedido. Todas las transacciones se realizan bajo un sistema de seguridad SSL/TLS para proteger sus datos.</p>
            </>
        )
    },
    {
        icon: <Truck className="h-8 w-8 text-primary" />,
        title: "4. Envío y Entrega",
        content: (
            <>
                <p><strong>Plazos de Entrega:</strong> El plazo de entrega habitual es de 3 a 7 días hábiles para el Área Metropolitana de Buenos Aires (AMBA) y de 5 a 10 días hábiles para el resto del país.</p>
                <p><strong>Costo de Envío:</strong> Los costos de envío se calcularán automáticamente al momento de la compra en función de la dirección de destino.</p>
                <p><strong>Riesgo:</strong> El riesgo de pérdida o daño de los productos se transmite al cliente en el momento de la entrega en el domicilio especificado.</p>
            </>
        )
    },
    {
        icon: <RotateCw className="h-8 w-8 text-primary" />,
        title: "5. Cambios, Devoluciones y Derecho de Desistimiento",
        content: (
            <>
                <p><strong>Derecho de Desistimiento:</strong> El cliente tiene derecho a desistir de la compra en un plazo de 10 días naturales a partir de la recepción del producto, sin necesidad de justificación (Ley 24.240 de Defensa del Consumidor).</p>
                <p><strong>Condiciones:</strong> Para ser elegible para una devolución, el artículo debe estar sin usar, en las mismas condiciones en que lo recibió y en su embalaje original con todos sus accesorios.</p>
                <p><strong>Proceso:</strong> El cliente deberá notificar su decisión al correo electrónico <a href="mailto:soporte@moovitech.com" className="text-primary hover:underline">soporte@moovitech.com</a> y seguir las instrucciones proporcionadas. Los costos de envío de la devolución correrán a cargo del cliente, salvo que el producto presente una falla de fábrica.</p>
            </>
        )
    },
    {
        icon: <Shield className="h-8 w-8 text-primary" />,
        title: "6. Propiedad Intelectual",
        content: <p>Todo el contenido del Sitio, incluyendo textos, gráficos, logotipos, íconos, imágenes, y software, son propiedad de <strong>MooviTech S.A.</strong> o de sus proveedores de contenido y están protegidos por las leyes de propiedad intelectual de Argentina e internacionales.</p>
    },
    {
        icon: <Landmark className="h-8 w-8 text-primary" />,
        title: "7. Ley Aplicable y Jurisdicción",
        content: <p>Estos Términos y Condiciones se rigen e interpretan de acuerdo con las leyes de la República Argentina. Cualquier disputa será sometida a la jurisdicción de los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.</p>
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <header className="mb-12 rounded-lg bg-card p-8 text-center shadow-lg">
        <FileText className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Términos y Condiciones</h1>
        <p className="mt-4 text-lg text-muted-foreground">Última actualización: 16 de Octubre de 2025</p>
      </header>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <section key={index} className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              {section.icon}
              <h2 className="text-2xl font-semibold">{section.title}</h2>
            </div>
            <div className="prose prose-invert mt-4 max-w-none lg:prose-xl">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-12 border-t pt-8 text-center">
        <p>&copy; {new Date().getFullYear()} MooviTech. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default TerminosYCondicionesPage;
