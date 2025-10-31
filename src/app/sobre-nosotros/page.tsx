'use client';

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Smartphone, Target, Eye, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutUsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 pt-32">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Sobre MooviTech
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Conectando personas con la tecnología que aman.
        </p>
      </header>

      <div className="relative mb-16 h-80 w-full overflow-hidden rounded-lg shadow-lg">
        <Image
          src="https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=1974&auto=format&fit=crop"
          alt="Equipo de MooviTech"
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <section className="space-y-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-3 font-headline text-3xl font-bold">
              <Target className="h-8 w-8 text-primary" />
              Nuestra Misión
            </h2>
            <p className="mt-4 text-muted-foreground">
              Nuestra misión es hacer que la tecnología móvil de vanguardia sea
              accesible para todos. Creemos que un smartphone es más que un
              dispositivo; es una herramienta para la creatividad, la
              productividad y la conexión. Nos esforzamos por ofrecer una
              selección curada de los mejores productos, respaldada por un
              servicio al cliente excepcional y precios justos.
            </p>
          </div>
          <div>
            <h2 className="flex items-center gap-3 font-headline text-3xl font-bold">
              <Eye className="h-8 w-8 text-primary" />
              Nuestra Visión
            </h2>
            <p className="mt-4 text-muted-foreground">
              Aspiramos a ser la tienda de tecnología móvil de referencia en la
              región, reconocida por nuestra integridad, innovación y compromiso
              con la satisfacción del cliente. Queremos construir una comunidad
              de entusiastas de la tecnología y ser el primer lugar en el que
              piensen cuando busquen actualizar su vida digital.
            </p>
          </div>
        </div>

        <div>
          <h2 className="flex items-center justify-center gap-3 font-headline text-3xl font-bold">
            <Users className="h-8 w-8 text-primary" />
            Nuestro Equipo
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            Somos un equipo de apasionados por la tecnología, dedicados a
            encontrar y ofrecerte los mejores dispositivos del mercado. Desde
            nuestros expertos en productos hasta nuestro equipo de soporte,
            todos compartimos el mismo objetivo: brindarte una experiencia de
            compra inigualable.
          </p>
        </div>
      </section>
    </div>
  );
}
