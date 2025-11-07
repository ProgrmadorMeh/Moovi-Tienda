
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
    <div className="relative w-full overflow-hidden bg-transparent py-4">
      <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
      
      <div className="group/scroller flex animate-scroll-infinite">
        {duplicatedFeatures.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className={cn(
                'mx-3 flex-shrink-0 rounded-xl p-4 text-center text-white backdrop-blur-sm',
                'w-48 h-36 md:w-64 md:h-40', // Ancho y alto responsivos
                'flex flex-col items-center justify-center space-y-2 md:space-y-3', // Espaciado responsivo
                'transform transition-all duration-300 ease-in-out',
                'hover:scale-105',
                `bg-gradient-to-br ${feature.gradient}`,
                feature.glow
              )}
            >
              <Icon className="h-8 w-8 md:h-10 md:w-10 text-white/90" />
              <p className="text-sm md:text-base font-semibold leading-tight">{feature.text}</p>
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
          animation: scroll-infinite 20s linear infinite;
        }
        .group-hover\/scroller:hover .animate-scroll-infinite {
            animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default AnimatedFeatureCards;
