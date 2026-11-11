import * as Speech from 'expo-speech';
import { useEffect, useMemo, useRef, useState } from 'react';

export type Word = { text: string; start: number; end: number };

export function tokenize(text: string): Word[] {
  const out: Word[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push({ text: m[0], start: m.index, end: m.index + m[0].length });
  return out;
}

export const SPEECH_RATE = { devagar: 0.7, normal: 0.95, rapido: 1.25 } as const;
export type SpeedKey = keyof typeof SPEECH_RATE;

/** Duração estimada de uma palavra (fallback quando o aparelho não informa a palavra falada). */
function wordDuration(word: string, rate: number) {
  const pause = /[.!?…]$/.test(word) ? 380 : /[,;:]$/.test(word) ? 200 : 0;
  return (140 + word.length * 62 + pause) / rate;
}

type Options = {
  text: string;
  playing: boolean;
  speed: SpeedKey;
  /** Chamado quando termina de ler o texto inteiro. */
  onFinished: () => void;
};

/**
 * Lê o texto em voz alta (expo-speech, pt-BR) e informa qual palavra está sendo lida.
 * Usa o evento onBoundary quando disponível (iOS/web) e uma estimativa por tempo no restante.
 * Pausar e retomar continua da palavra atual.
 */
export function useNarration({ text, playing, speed, onFinished }: Options) {
  const words = useMemo(() => tokenize(text), [text]);
  const [wordIndex, setWordIndex] = useState(-1);
  const indexRef = useRef(-1);
  const lastText = useRef(text);
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  useEffect(() => {
    const setIndex = (i: number) => {
      indexRef.current = i;
      setWordIndex(i);
    };

    if (lastText.current !== text) {
      lastText.current = text;
      setIndex(-1);
    }
    if (!playing || words.length === 0) {
      Speech.stop();
      return;
    }

    const rate = SPEECH_RATE[speed];
    let cancelled = false;
    let finished = false;
    let gotBoundary = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let safety: ReturnType<typeof setTimeout> | undefined;

    const startAt = indexRef.current > 0 && indexRef.current < words.length ? indexRef.current : 0;
    const offset = words[startAt].start;

    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      clearTimeout(timer);
      clearTimeout(safety);
      setIndex(-1);
      onFinishedRef.current();
    };

    let i = startAt;
    setIndex(i);
    const step = () => {
      timer = setTimeout(() => {
        if (cancelled || gotBoundary) return;
        i += 1;
        if (i >= words.length) {
          // Espera o "fim da fala"; se o aparelho não avisar, segue mesmo assim.
          safety = setTimeout(finish, 2500);
          return;
        }
        setIndex(i);
        step();
      }, wordDuration(words[i].text, rate));
    };
    step();

    Speech.speak(text.slice(offset), {
      language: 'pt-BR',
      rate,
      pitch: 1.05,
      onBoundary: (ev: { charIndex?: number }) => {
        if (cancelled || typeof ev?.charIndex !== 'number') return;
        gotBoundary = true;
        clearTimeout(timer);
        const ci = offset + ev.charIndex;
        const idx = words.findIndex((w) => ci >= w.start && ci < w.end + 1);
        if (idx >= 0) setIndex(idx);
      },
      onDone: finish,
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearTimeout(safety);
      Speech.stop();
    };
  }, [playing, text, speed, words]);

  // Para a fala ao sair da tela.
  useEffect(() => () => void Speech.stop(), []);

  return { words, wordIndex };
}
