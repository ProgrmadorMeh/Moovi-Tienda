import ContactForm from "./contact-form";

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="mb-2 font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Ponte en Contacto
        </h1>
        <p className="text-lg text-muted-foreground md:text-xl">
          Nos encantaría saber de ti. Completa el formulario y te responderemos
          lo antes posible.
        </p>
      </header>
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <ContactForm />
      </div>
    </div>
  );
}
