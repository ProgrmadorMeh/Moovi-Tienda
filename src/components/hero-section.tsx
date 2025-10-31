'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Typewriter from './ui/typewriter';

const phrases = [
  "Explora lo último en tecnología móvil con MooviTech.",
  "Encuentra el smartphone perfecto para tu estilo de vida.",
  "Accesorios exclusivos para complementar tu mundo digital.",
];

export default function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center text-white">
      <Image
        src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop"
        alt="Fondo de celulares"
        layout="fill"
        objectFit="cover"
        className="z-0"
        priority
      />
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-gradient-to-r from-indigo-600 to-sky-400 bg-clip-text md:text-6xl">
          MooviTech
        </h1>
        <div className="mt-4 flex min-h-[96px] items-center justify-center text-lg text-gray-200 md:text-xl">
          <Typewriter phrases={phrases} className="text-2xl" />
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
