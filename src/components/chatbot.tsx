'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/lib/user-store';

// Extend the Window interface to include `chatbase`
declare global {
  interface Window {
    chatbase?: {
      q?: any[];
      (...args: any[]): void;
    } & ((action: string, payload?: any) => void);
  }
}

const CHATBOT_ID = 'u_4VPr96mgZyhNEllc_h_';

export default function Chatbot() {
  const { user } = useUserStore();

  useEffect(() => {
    // 1. Cargar el script de Chatbase
    if (document.getElementById(CHATBOT_ID)) return; // Evitar cargar el script múltiples veces

    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.id = CHATBOT_ID;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
       // Configuración inicial del chatbot una vez que el script está cargado
      if (window.chatbase) {
        window.chatbase('init', {
          chatId: CHATBOT_ID,
        });
      }
    };
  }, []);

  useEffect(() => {
    // 2. Identificar al usuario cuando el estado de autenticación cambie
    const identifyUser = async () => {
      // Si hay un usuario, obtener el token de nuestra API segura
      if (user && window.chatbase) {
        try {
          const response = await fetch('/api/chat-identify');
          if (response.ok) {
            const { token } = await response.json();
            // Identificar al usuario en Chatbase
            window.chatbase('identify', { token });
          }
        } catch (error) {
          console.error('Error identifying user with chatbot:', error);
        }
      }
    };

    // Esperar un poco para asegurar que el script de chatbase se haya inicializado
    const timeoutId = setTimeout(identifyUser, 2000);
    
    return () => clearTimeout(timeoutId);

  }, [user]); // Este efecto se ejecuta cada vez que el `user` cambia

  return null; // Este componente no renderiza nada visible
}
