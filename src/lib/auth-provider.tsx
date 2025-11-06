"use client";

import { useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "./user-store";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const supabase = createClient();
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    // Inicia con estado de carga
    setLoading(true);

    // Escucha los cambios de estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);
      }
    );

    // Limpia el listener cuando el componente se desmonta
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, setLoading, supabase.auth]);

  return <>{children}</>;
}
