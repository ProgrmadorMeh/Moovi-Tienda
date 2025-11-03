import React from 'react';
import { cn } from '@/lib/utils';

const features = [
  "Tecnología Pura: Celulares de Alta Gama",
  "Accesorios Exclusivos: Eleva tu Experiencia",
  "Envío Ultra Rápido y Seguro: Tu Paz Mental",
  "Ofertas Flash: Siempre un Paso Adelante",
  "Pago Seguro, Confiable y Flexible",
  "Soporte VIP: Tu Satisfacción es Nuestra Misión",
];

// Duplicamos las características para un bucle infinito y suave
const duplicatedFeatures = [...features, ...features];

const AnimatedFeatureCards = () => {
  return (
    <div className="relative w-full overflow-hidden bg-transparent py-4 group">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/0 to-transparent z-10 w-full" />
      <div className="flex animate-scroll-infinite group-hover:pause">
        {duplicatedFeatures.map((text, i) => (
          <div
            key={i}
            className={cn(
              'mx-4 flex-shrink-0 rounded-lg bg-gray-800/60 p-4 text-center text-white shadow-lg backdrop-blur-sm',
              'w-64', // Ancho fijo para las tarjetas
              'transform transition-all duration-500 ease-in-out',
              // Animación de escala y brillo al pasar el cursor
              'hover:scale-110 hover:shadow-purple-500/50'
            )}
          >
            <p className="text-sm font-semibold">{text}</p>
          </div>
        ))}
      </div>
      {/* Definimos la animación de scroll directamente aquí para encapsular el componente */}
      <style jsx global>{`
        @keyframes scroll-infinite {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-infinite {
          animation: scroll-infinite 40s linear infinite;
        }
        .group:hover .animate-scroll-infinite {
            animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default AnimatedFeatureCards;
