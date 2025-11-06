import Link from "next/link";
import { Smartphone } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/95 text-foreground">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        {/* --- Información Legal --- */}
        <section>
          <h4 className="mb-4 font-headline text-lg font-semibold">
            Información Legal
          </h4>
          <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <Link href="/politica-privacidad" className="hover:text-primary">
              Política de Privacidad
            </Link>
            <Link href="/terminos-condiciones" className="hover:text-primary">
              Términos y Condiciones
            </Link>
            <div className="mt-2">
              <p className="font-semibold">Pagos Seguros</p>
            </div>
          </nav>
        </section>

        {/* --- Enlaces Rápidos y Contacto --- */}
        <section>
          <h4 className="mb-4 font-headline text-lg font-semibold">
            Enlaces Rápidos
          </h4>
          <nav
            aria-label="Navegación secundaria"
            className="flex flex-col space-y-2 text-sm text-muted-foreground"
          >
            <Link href="/sobre-nosotros" className="hover:text-primary">
              Sobre Nosotros
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contacto
            </Link>
            <Link href="/faq" className="hover:text-primary">
              Preguntas Frecuentes
            </Link>
          </nav>
          <div className="mt-6">
            <h4 className="mb-2 font-headline text-lg font-semibold">
              Contáctanos
            </h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                Email:{" "}
                <a
                  href="mailto:Moovi@cmail.com"
                  className="hover:text-primary"
                >
                  Moovi@cmail.com
                </a>
              </p>
              <p>Tel: (+54) 11-3635-8044</p>
            </div>
          </div>
        </section>

        {/* --- Redes Sociales y Newsletter --- */}
        <section>
          <h4 className="mb-4 font-headline text-lg font-semibold">
            Síguenos
          </h4>
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold">GitHub:</p>
            <div className="flex flex-wrap gap-x-2">
              <a
                href="https://github.com/Lisandro-bordeta"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Lisandro-bordeta
              </a>
              <a
                href="https://github.com/ProgrmadorMeh"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Hugo-medina
              </a>
              <a
                href="https://github.com/fed-ean"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Fede-nuñez
              </a>
              <a
                href="https://github.com/tobi-gonzalez"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Tobias-Gonzales
              </a>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-2">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Instagram
              </a>
              <span>|</span>
              <a
                href="https://linkedin.com/company/tuempresa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="mb-2 font-headline text-lg font-semibold">
              Newsletter
            </h4>
            <form action="/subscribe" method="POST" className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                required
                className="flex-grow"
              />
              <Button type="submit">Suscribirse</Button>
            </form>
          </div>
        </section>
      </div>

      {/* --- Copyright --- */}
      <div className="border-t border-border/40 py-6">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                <p className="text-center text-sm font-semibold text-muted-foreground md:text-left">
                    MooviTech
                </p>
            </div>
            <p className="text-center text-sm text-muted-foreground md:text-left">
                &copy; {new Date().getFullYear()} MooviTech. Todos los derechos reservados.
            </p>
        </div>
      </div>
    </footer>
  );
}
