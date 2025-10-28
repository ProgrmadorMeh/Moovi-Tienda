
import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

interface UserState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true, // Inicia cargando para esperar la primera verificación de auth
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

    