import { Smartphone } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            <span className="font-headline font-semibold">MooviTech</span> -
            Tu portal al futuro.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {new Date().getFullYear()} MooviTech. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
