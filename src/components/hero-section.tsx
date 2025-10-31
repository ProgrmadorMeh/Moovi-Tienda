
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

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
          {/* Usamos un SVG para el texto para mejorar el LCP y evitar el layout shift del Typewriter */}
          <svg width="100%" viewBox="0 0 800 100" xmlns="http://www.w3.org/2000/svg" className="max-w-xl">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'hsl(200 100% 50%)', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="url(#gradient)"
              className="text-2xl md:text-3xl font-body"
            >
              Explora lo último en tecnología móvil con MooviTech.
            </text>
          </svg>
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
