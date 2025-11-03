
import React from 'react';
import { cn } from '@/lib/utils';
import { Cpu, ShieldCheck, Truck, TicketPercent, CreditCard, LifeBuoy } from 'lucide-react';

const features = [
  {
    text: "Tecnología Pura: Celulares de Alta Gama",
    icon: Cpu,
    gradient: "from-cyan-500 to-blue-600",
    glow: "shadow-blue-500/50",
  },
  {
    text: "Accesorios Exclusivos: Eleva tu Experiencia",
    icon: LifeBuoy,
    gradient: "from-purple-500 to-indigo-600",
    glow: "shadow-indigo-500/50",
  },
  {
    text: "Envío Ultra Rápido y Seguro: Tu Paz Mental",
    icon: Truck,
    gradient: "from-green-500 to-teal-600",
    glow: "shadow-teal-500/50",
  },
  {
    text: "Ofertas Flash: Siempre un Paso Adelante",
    icon: TicketPercent,
    gradient: "from-pink-500 to-purple-600",
    glow: "shadow-purple-500/50",
  },
  {
    text: "Pago Seguro, Confiable y Flexible",
    icon: CreditCard,
    gradient: "from-yellow-500 to-orange-600",
    glow: "shadow-orange-500/50",
  },
  {
    text: "Soporte VIP: Tu Satisfacción es Nuestra Misión",
    icon: ShieldCheck,
    gradient: "from-sky-500 to-indigo-500",
    glow: "shadow-indigo-500/50",
  },
];

// Duplicamos las características para un bucle infinito y suave
const duplicatedFeatures = [...features, ...features];

const AnimatedFeatureCards = () => {
  return (
    <div className="relative w-full overflow-hidden bg-transparent py-4 group">
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black/80 to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black/80 to-transparent" />
      
      <div className="flex animate-scroll-infinite group-hover:pause">
        {duplicatedFeatures.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className={cn(
                'mx-4 flex-shrink-0 rounded-xl p-6 text-center text-white shadow-lg backdrop-blur-sm',
                'w-72 h-48', // Ancho y alto fijos para las tarjetas
                'flex flex-col items-center justify-center space-y-4',
                'transform transition-all duration-300 ease-in-out',
                'hover:scale-105',
                `bg-gradient-to-br ${feature.gradient}`,
                `shadow-lg hover:shadow-2xl ${feature.glow}`
              )}
            >
              <Icon className="h-8 w-8 text-white/90" />
              <p className="text-lg font-semibold leading-tight">{feature.text}</p>
            </div>
          );
        })}
      </div>
      
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
