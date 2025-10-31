
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Typewriter from './ui/typewriter';

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src="/img/hero-background.webp"
          alt="Modern smartphones and gadgets on a stylized background"
          fill
          sizes="100vw"
          className="object-cover"
          data-ai-hint="technology background"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-gradient-to-r from-indigo-600 to-sky-400 bg-clip-text md:text-6xl">
          MooviTech
        </h1>
        <div className="mt-4 flex min-h-[96px] items-center justify-center text-lg text-gray-200 md:text-xl">
           <Typewriter
            phrases={[
              "Explora lo último en tecnología móvil con MooviTech.",
              "Encuentra el smartphone perfecto para tu estilo de vida.",
              "Accesorios exclusivos para complementar tu mundo digital.",
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
    </section>
  );
}
