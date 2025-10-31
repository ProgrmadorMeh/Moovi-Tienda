import { create } from 'zustand';

interface ParticlesState {
  showParticles: boolean;
  setShowParticles: (show: boolean) => void;
}

export const useParticlesStore = create<ParticlesState>((set) => ({
  showParticles: false,
  setShowParticles: (show) => set({ showParticles: show }),
}));
