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

// SVG data URI para el ícono de la carita sonriente
const customIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
  <circle cx="9" cy="9" r=".5" fill="currentColor"/>
  <circle cx="15" cy="9" r=".5" fill="currentColor"/>
</svg>
`;
const encodedIcon = `data:image/svg+xml;base64,${typeof window !== 'undefined' ? window.btoa(customIcon) : ''}`;


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
          theme: {
            button: {
                backgroundColor: '#8B5CF6', // Color primario de la marca (morado)
                iconColor: '#FFFFFF', // Ícono en blanco
                chatButtonIcon: encodedIcon,
            },
          }
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
