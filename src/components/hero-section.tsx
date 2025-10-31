'use client';

import { useState, useEffect } from 'react';
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Este efecto solo se ejecuta en el cliente, después del montaje.
    setIsClient(true);
  }, []);

  return (
    <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center text-white bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/img/hero-background.png')"}}>
        <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-gradient-to-r from-indigo-600 to-sky-400 bg-clip-text md:text-6xl">
          MooviTech
        </h1>
        <div className="mt-4 flex min-h-[96px] items-center justify-center text-lg text-gray-200 md:text-xl">
          {isClient ? (
            <Typewriter phrases={phrases} className="text-2xl" />
          ) : (
            <span className="text-2xl max-w-full md:max-w-[60ch] whitespace-normal break-words align-middle">
                <span className="inline-block leading-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-400">
                        {phrases[0]}
                    </span>
                </span>
            </span>
          )}
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
