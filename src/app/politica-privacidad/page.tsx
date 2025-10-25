
import React from 'react';
import { BookOpen, Database, Settings2, Users, ShieldCheck } from 'lucide-react';

const PoliticaDePrivacidadPage = () => {
  const sections = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "1. Introducción",
      content: <p>En <strong>MooviTech</strong>, respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta política de privacidad le informará sobre cómo cuidamos sus datos personales cuando visita nuestro sitio web y le informará sobre sus derechos de privacidad y cómo la ley lo protege.</p>
    },
    {
      icon: <Database className="h-8 w-8 text-primary" />,
      title: "2. Qué datos recopilamos sobre usted",
      content: (
        <>
          <p>Podemos recopilar, usar, almacenar y transferir diferentes tipos de datos personales sobre usted, que hemos agrupado de la siguiente manera:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Datos de identidad:</strong> incluye nombre, apellido, nombre de usuario o identificador similar.</li>
            <li><strong>Datos de contacto:</strong> incluye dirección de facturación, dirección de entrega, dirección de correo electrónico y números de teléfono.</li>
            <li><strong>Datos financieros:</strong> incluye detalles de la cuenta bancaria y la tarjeta de pago (procesados de forma segura a través de nuestro proveedor de pagos).</li>
            <li><strong>Datos de transacción:</strong> incluye detalles sobre los pagos y las compras que ha realizado.</li>
          </ul>
        </>
      )
    },
    {
      icon: <Settings2 className="h-8 w-8 text-primary" />,
      title: "3. Cómo utilizamos sus datos personales",
      content: (
        <>
          <p>Usaremos sus datos personales en las siguientes circunstancias:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Para procesar y entregar su pedido, incluida la gestión de pagos y la gestión de envíos.</li>
            <li>Para gestionar nuestra relación con usted, lo que puede incluir notificarle sobre cambios en nuestros términos o política de privacidad.</li>
            <li>Cuando sea necesario para nuestros intereses legítimos (o los de un tercero) y sus intereses y derechos fundamentales no prevalezcan sobre esos intereses.</li>
            <li>Para cumplir con una obligación legal o reglamentaria.</li>
          </ul>
        </>
      )
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "4. Divulgación de sus datos personales",
      content: (
        <>
          <p>Es posible que tengamos que compartir sus datos personales con las partes que se establecen a continuación para los fines establecidos en la sección 3 anterior:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Proveedores de servicios de logística y envío.</li>
            <li>Proveedores de pasarelas de pago y servicios financieros.</li>
            <li>Asesores profesionales (abogados, auditores, etc.).</li>
            <li>Autoridades reguladoras y otros organismos gubernamentales, si así lo exige la ley.</li>
          </ul>
        </>
      )
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "5. Seguridad de los datos",
      content: <p>Hemos implementado medidas de seguridad técnicas y organizativas apropiadas para evitar que sus datos personales se pierdan, usen o accedan accidentalmente de forma no autorizada, se alteren o se divulguen. Limitamos el acceso a sus datos personales a aquellos empleados y terceros que tienen una necesidad comercial legítima de conocerlos.</p>
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <header className="mb-12 rounded-lg bg-card p-8 text-center shadow-lg">
        <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Política de Privacidad</h1>
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

export default PoliticaDePrivacidadPage;
