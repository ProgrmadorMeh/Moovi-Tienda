
import React from 'react';
import { Cookie, Settings2, MousePointerClick } from 'lucide-react';

const PoliticaDeCookiesPage = () => {
  const sections = [
    {
      icon: <Cookie className="h-8 w-8 text-primary" />,
      title: "1. ¿Qué son las cookies?",
      content: <p>Las cookies son pequeños archivos de texto que los sitios web que visita colocan en su dispositivo para que el sitio web funcione, o funcione de manera más eficiente, así como para proporcionar información a los propietarios del sitio. El uso de cookies es una práctica estándar para la mayoría de los sitios web.</p>
    },
    {
      icon: <Settings2 className="h-8 w-8 text-primary" />,
      title: "2. ¿Cómo y por qué utilizamos cookies?",
      content: (
        <>
          <p>Utilizamos cookies para mejorar la funcionalidad de nuestro sitio web, entender cómo lo utiliza, personalizar su experiencia y para fines de marketing. A continuación se detallan los tipos de cookies que utilizamos:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Cookies estrictamente necesarias:</strong> Esenciales para el funcionamiento del sitio, como las que le permiten iniciar sesión o usar el carrito de compras.</li>
            <li><strong>Cookies analíticas o de rendimiento:</strong> Nos ayudan a entender cómo los visitantes interactúan con el sitio web, permitiéndonos mejorar su funcionamiento.</li>
            <li><strong>Cookies de funcionalidad:</strong> Se utilizan para reconocerlo cuando regresa a nuestro sitio y recordar sus preferencias.</li>
            <li><strong>Cookies de orientación:</strong> Registran su visita y las páginas que ha visto para hacer que la publicidad sea más relevante para usted.</li>
          </ul>
        </>
      )
    },
    {
      icon: <MousePointerClick className="h-8 w-8 text-primary" />,
      title: "3. Cómo gestionar las cookies",
      content: <p>Puede gestionar y/o eliminar las cookies como desee. La mayoría de los navegadores le permiten bloquear o eliminar cookies a través de su configuración. Sin embargo, si lo hace, es posible que deba ajustar manualmente algunas preferencias cada vez que visite un sitio y que algunos servicios y funcionalidades no funcionen. Para más información, puede visitar <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">aboutcookies.org</a>.</p>
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <header className="mb-12 rounded-lg bg-card p-8 text-center shadow-lg">
        <Cookie className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Política de Cookies</h1>
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

export default PoliticaDeCookiesPage;
