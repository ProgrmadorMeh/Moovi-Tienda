
import React from 'react';
import { cn } from '@/lib/utils';
import { Cpu, ShieldCheck, Truck, TicketPercent, CreditCard, LifeBuoy } from 'lucide-react';

const features = [
  {
    text: "Tecnología Pura: Celulares de Alta Gama",
    icon: Cpu,
    gradient: "from-cyan-500/80 to-blue-600/80",
    glow: "shadow-lg hover:shadow-2xl shadow-blue-500/60 hover:shadow-blue-400/70",
  },
  {
    text: "Accesorios Exclusivos: Eleva tu Experiencia",
    icon: LifeBuoy,
    gradient: "from-purple-500/80 to-indigo-600/80",
    glow: "shadow-lg hover:shadow-2xl shadow-indigo-500/60 hover:shadow-indigo-400/70",
  },
  {
    text: "Envío Ultra Rápido y Seguro: Tu Paz Mental",
    icon: Truck,
    gradient: "from-green-500/80 to-teal-600/80",
    glow: "shadow-lg hover:shadow-2xl shadow-teal-500/60 hover:shadow-teal-400/70",
  },
  {
    text: "Ofertas Flash: Siempre un Paso Adelante",
    icon: TicketPercent,
    gradient: "from-pink-500/80 to-purple-600/80",
    glow: "shadow-lg hover:shadow-2xl shadow-purple-500/60 hover:shadow-purple-400/70",
  },
  {
    text: "Pago Seguro, Confiable y Flexible",
    icon: CreditCard,
    gradient: "from-yellow-500/80 to-orange-600/80",
    glow: "shadow-lg hover:shadow-2xl shadow-orange-500/60 hover:shadow-orange-400/70",
  },
  {
    text: "Soporte VIP: Tu Satisfacción es Nuestra Misión",
    icon: ShieldCheck,
    gradient: "from-sky-500/80 to-indigo-500/80",
    glow: "shadow-lg hover:shadow-2xl shadow-indigo-500/60 hover:shadow-indigo-400/70",
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
                'mx-4 flex-shrink-0 rounded-xl p-6 text-center text-white backdrop-blur-sm',
                'w-64 h-40', // Ancho y alto fijos para las tarjetas
                'flex flex-col items-center justify-center space-y-3',
                'transform transition-all duration-300 ease-in-out',
                'hover:scale-105',
                `bg-gradient-to-br ${feature.gradient}`,
                feature.glow
              )}
            >
              <Icon className="h-8 w-8 text-white/90" />
              <p className="text-base font-semibold leading-tight">{feature.text}</p>
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
          animation: scroll-infinite 30s linear infinite;
        }
        .group:hover .animate-scroll-infinite {
            animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default AnimatedFeatureCards;
