
'use client';

import React, { useCallback, useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from "@tsparticles/engine";

export const CardParticles = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particleOptions: ISourceOptions = useMemo(
    () => ({
        background: {
            color: {
                value: 'transparent',
            },
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: 'repulse',
                },
            },
            modes: {
                repulse: {
                    distance: 50,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: '#ffffff',
            },
            links: {
                color: '#ffffff',
                distance: 120,
                enable: true,
                opacity: 0.1,
                width: 1,
            },
            collisions: {
                enable: false,
            },
            move: {
                direction: 'none',
                enable: true,
                outModes: {
                    default: 'out',
                },
                random: false,
                speed: 0.5,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 20,
            },
            opacity: {
                value: 0.1,
            },
            shape: {
                type: 'circle',
            },
            size: {
                value: { min: 1, max: 2 },
            },
        },
        detectRetina: true,
    }),
    []
  );

  return (
    <Particles
      id={`tsparticles-card-${React.useId()}`}
      init={particlesInit}
      options={particleOptions}
      className="absolute inset-0 -z-10"
    />
  );
};
