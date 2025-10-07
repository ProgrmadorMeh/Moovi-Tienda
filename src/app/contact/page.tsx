import ContactForm from "./contact-form";

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="mb-2 font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Get in Touch
        </h1>
        <p className="text-lg text-muted-foreground md:text-xl">
          We'd love to hear from you. Fill out the form below and we'll get
          back to you as soon as possible.
        </p>
      </header>
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <ContactForm />
      </div>
    </div>
  );
}
