'use client';

import { Button } from '@/components/ui/button';
import AnimatedFeatureCards from './ui/animated-feature-cards';
import Typewriter from './ui/typewriter';

const phrases = [
  "Explora lo último en tecnología móvil con MooviTech.",
  "Encuentra el smartphone perfecto para tu estilo de vida.",
  "Accesorios exclusivos para complementar tu mundo digital.",
];

export default function HeroSection() {

  const handleScrollToCatalog = () => {
    const catalogElement = document.getElementById('product-catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[75vh] min-h-[600px] flex flex-col items-center justify-center text-white bg-hero-background bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60 z-0"></div>
       {/* Degradado para transición suave */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent z-10"></div>
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-gradient-to-r from-indigo-600 to-sky-400 bg-clip-text md:text-6xl">
          MooviTech
        </h1>
        <div className="mt-4 flex min-h-[96px] items-center justify-center text-lg text-gray-200 md:text-xl">
          <Typewriter phrases={phrases} className="text-2xl" />
        </div>
      </div>
    </section>
  );
}
