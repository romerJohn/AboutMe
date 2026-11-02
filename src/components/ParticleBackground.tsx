import React, { useMemo } from 'react';
import { Particles, ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, ISourceOptions } from '@tsparticles/engine';

interface ParticleBackgroundProps {
  className?: string;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  className = 'absolute inset-0 overflow-hidden pointer-events-none'
}) => {
  const initEngine = async (engine: Engine) => {
    await loadSlim(engine);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false, zIndex: 0 },
      background: {
        color: { value: 'transparent' }
      },
      fpsLimit: 60,
      particles: {
        number: {
          value: 45,
          density: {
            enable: true,
            width: 1200,
            height: 800
          }
        },
        color: {
          value: ['#00E5FF', '#8B5CF6', '#38BDF8']
        },
        shape: {
          type: 'circle'
        },
        opacity: {
          value: { min: 0.2, max: 0.55 },
          animation: {
            enable: true,
            speed: 0.8,
            sync: false
          }
        },
        size: {
          value: { min: 1.5, max: 3 }
        },
        links: {
          enable: true,
          distance: 135,
          color: '#00E5FF',
          opacity: 0.2,
          width: 1,
          triangles: {
            enable: true,
            opacity: 0.03,
            color: '#8B5CF6'
          }
        },
        move: {
          enable: true,
          speed: 0.7,
          direction: 'none',
          random: false,
          straight: false,
          outModes: {
            default: 'bounce'
          }
        }
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'grab'
          },
          onClick: {
            enable: true,
            mode: 'push'
          }
        },
        modes: {
          grab: {
            distance: 160,
            links: {
              opacity: 0.55,
              color: '#00E5FF'
            }
          },
          push: {
            quantity: 3
          }
        }
      },
      detectRetina: true
    }),
    []
  );

  return (
    <div className={className} aria-hidden="true">
      <ParticlesProvider init={initEngine}>
        <Particles
          id="tsparticles-neural-network"
          className="w-full h-full"
          options={options}
        />
      </ParticlesProvider>
    </div>
  );
};
