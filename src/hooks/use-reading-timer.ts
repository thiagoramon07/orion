import { useCallback, useEffect, useRef } from 'react';
import { AppState as RNAppState, Platform } from 'react-native';

const TICK_SECONDS = 5;
/** Sem narração tocando, só conta se houve interação (virar página, tocar) nos últimos 2 minutos. */
const IDLE_LIMIT_MS = 2 * 60 * 1000;

function pageVisible(): boolean {
  if (Platform.OS === 'web') return typeof document === 'undefined' || document.visibilityState === 'visible';
  return RNAppState.currentState === 'active';
}

/**
 * Conta o tempo de leitura enquanto o leitor está aberto e a criança está lendo de verdade.
 * Retorna `touch()`, para avisar que houve interação (ex.: virou a página).
 */
export function useReadingTimer({ active, playing, onTick }: { active: boolean; playing: boolean; onTick: (seconds: number) => void }) {
  const lastInteraction = useRef(0);
  const playingRef = useRef(playing);
  const onTickRef = useRef(onTick);
  useEffect(() => {
    playingRef.current = playing;
    onTickRef.current = onTick;
  });

  useEffect(() => {
    if (!active) return;
    lastInteraction.current = Date.now();
    const t = setInterval(() => {
      const recentlyActive = Date.now() - lastInteraction.current < IDLE_LIMIT_MS;
      if (pageVisible() && (playingRef.current || recentlyActive)) onTickRef.current(TICK_SECONDS);
    }, TICK_SECONDS * 1000);
    return () => clearInterval(t);
  }, [active]);

  const touch = useCallback(() => {
    lastInteraction.current = Date.now();
  }, []);
  return { touch };
}
