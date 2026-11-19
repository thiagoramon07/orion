import * as Speech from 'expo-speech';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AUDIO_RATE, audioElement, getRecording, Recording, setSource, stopRecorded } from '@/utils/recorded-narration';
import { getBestPtBrVoice } from '@/utils/voice';

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
  /** Livro e página: usados para achar a narração gravada. */
  bookId?: string;
  pageIndex?: number;
  text: string;
  playing: boolean;
  speed: SpeedKey;
  /** Chamado quando termina de ler o texto inteiro. */
  onFinished: () => void;
  /** O navegador bloqueou o áudio (ex.: sem toque do usuário). */
  onBlocked?: () => void;
};

/**
 * Lê o texto em voz alta e informa qual palavra está sendo lida.
 * 1º) Narração gravada (voz real, ElevenLabs) com o tempo exato de cada palavra.
 * 2º) Sem gravação, usa a voz do sistema (expo-speech, pt-BR) com onBoundary ou estimativa.
 * Pausar e retomar continua da palavra atual.
 */
export function useNarration({ bookId, pageIndex = 0, text, playing, speed, onFinished, onBlocked }: Options) {
  const words = useMemo(() => tokenize(text), [text]);
  const recording = useMemo(() => getRecording(bookId, pageIndex, text), [bookId, pageIndex, text]);
  const onBlockedRef = useRef(onBlocked);
  useEffect(() => {
    onBlockedRef.current = onBlocked;
  });
  const [wordIndex, setWordIndex] = useState(-1);
  const indexRef = useRef(-1);
  const lastText = useRef(text);
  const onFinishedRef = useRef(onFinished);
  useEffect(() => {
    onFinishedRef.current = onFinished;
  });

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
      stopRecorded();
      return;
    }

    if (recording) return playRecording(recording);

    function playRecording(rec: Recording) {
      const el = audioElement()!;
      let stopped = false;
      let raf = 0;
      const startAt = indexRef.current > 0 && indexRef.current < rec.words.length ? indexRef.current : 0;

      const tick = () => {
        if (stopped) return;
        const t = el.currentTime * 1000 + 40;
        let i = indexRef.current < 0 ? 0 : indexRef.current;
        while (i + 1 < rec.words.length && rec.words[i + 1][0] <= t) i++;
        while (i > 0 && rec.words[i][0] > t) i--;
        if (i !== indexRef.current) setIndex(i);
        raf = requestAnimationFrame(tick);
      };
      const ended = () => {
        if (stopped) return;
        stopped = true;
        cancelAnimationFrame(raf);
        setIndex(-1);
        onFinishedRef.current();
      };
      const begin = () => {
        if (stopped) return;
        el.playbackRate = AUDIO_RATE[speed];
        el.currentTime = startAt > 0 ? Math.max(0, rec.words[startAt][0] - 60) / 1000 : 0;
        setIndex(startAt);
        el.play()
          .then(() => {
            raf = requestAnimationFrame(tick);
          })
          .catch(() => {
            if (!stopped) onBlockedRef.current?.();
          });
      };

      setSource(rec.url);
      el.addEventListener('ended', ended);
      if (el.readyState >= 1) begin();
      else el.addEventListener('loadedmetadata', begin, { once: true });

      return () => {
        stopped = true;
        cancelAnimationFrame(raf);
        el.removeEventListener('ended', ended);
        el.removeEventListener('loadedmetadata', begin);
        el.pause();
      };
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

    getBestPtBrVoice().then((voice) => {
      if (cancelled) return;
      Speech.speak(text.slice(offset), {
        language: 'pt-BR',
        voice,
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
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearTimeout(safety);
      Speech.stop();
    };
  }, [playing, text, speed, words, recording]);

  // Para a fala ao sair da tela.
  useEffect(
    () => () => {
      Speech.stop();
      stopRecorded();
    },
    [],
  );

  return { words, wordIndex, recording };
}
