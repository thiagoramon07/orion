import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

/**
 * Atalhos de teclado no navegador (computador). Ignora teclas digitadas em campos de texto.
 * O handler recebe `event.key` e devolve true se tratou a tecla (aí evitamos a ação padrão).
 */
export function useWebKeys(handler: (key: string) => boolean | void, enabled = true) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });

  useEffect(() => {
    if (Platform.OS !== 'web' || !enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (ref.current(e.key)) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
