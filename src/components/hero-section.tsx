
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Typewriter from '@/components/ui/typewriter';

export default function HeroSection() {
  return (
    <section className="relative w-full pt-20">
      <div className="absolute inset-0">
        <Image
          src="/img/background.png"
          alt="Modern smartphones and gadgets on a stylized background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          data-ai-hint="technology background"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-gradient-to-r from-indigo-600 to-sky-400 bg-clip-text md:text-6xl">
          MooviTech
        </h1>
        <div className="mt-4 h-16 text-lg text-gray-200 md:h-auto md:text-xl">
          <Typewriter
            phrases={[
              "Descubre smartphones de última generación y lleva tu conectividad al siguiente nivel.",
              "Encuentra accesorios exclusivos diseñados para complementar tu estilo de vida digital.",
              "Explora nuestra selección curada con la mejor tecnología, garantía y soporte para ti.",
            ]}
            className="text-2xl"
          />
        </div>
        <div className="mt-8">
          <Link href="#product-catalog">
            <Button size="lg">Ver Catálogo</Button>
          </Link>
        </div>
      </div>
       <div className="relative z-20 h-48 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
