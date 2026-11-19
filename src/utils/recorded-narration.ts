import { Platform } from 'react-native';

import narration from '@/data/narration.json';

/**
 * Narração gravada (ElevenLabs, voz Amanda) servida como arquivos estáticos em /narracao.
 * Gerada por scripts/generate-narration.mjs. Se a página não tiver áudio (ou o texto mudou
 * depois da gravação), o app volta para a voz do navegador.
 */
export type Recording = { url: string; words: [number, number][]; duration: number };

type Manifest = {
  books: Record<string, ({ file: string; hash: string; v?: string; duration: number; words: [number, number][] } | null)[]>;
};
const MANIFEST = narration as unknown as Manifest;

/** Mesmo hash do script de gravação (FNV-1a 32 bits). */
function textHash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export function getRecording(bookId: string | undefined, pageIndex: number, text: string): Recording | undefined {
  if (Platform.OS !== 'web' || !bookId || !text) return undefined;
  const page = MANIFEST.books[bookId]?.[pageIndex];
  if (!page || page.hash !== textHash(text)) return undefined;
  // ?v=… muda quando o áudio é regravado/ajustado, para o aparelho não tocar a versão antiga do cache.
  const version = page.v ? `?v=${page.v}` : '';
  return { url: `/narracao/${page.file}${version}`, words: page.words, duration: page.duration };
}

/** Velocidade de reprodução do áudio gravado (o tom da voz é preservado). */
export const AUDIO_RATE = { devagar: 0.8, normal: 1, rapido: 1.2 } as const;

let element: HTMLAudioElement | undefined;
let currentUrl = '';

/** Um único player para o app inteiro: o Safari do iPhone só libera o que já tocou num toque. */
export function audioElement(): HTMLAudioElement | undefined {
  if (Platform.OS !== 'web' || typeof Audio === 'undefined') return undefined;
  if (!element) {
    element = new Audio();
    element.preload = 'auto';
  }
  return element;
}

export function setSource(url: string) {
  const el = audioElement();
  if (!el || currentUrl === url) return;
  currentUrl = url;
  el.src = url;
}

/** Áudio mudo de 0,1 s, usado só para "destravar" o player no primeiro toque. */
function silentWav(): string {
  const samples = 800;
  const buf = new ArrayBuffer(44 + samples);
  const v = new DataView(buf);
  const w = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF');
  v.setUint32(4, 36 + samples, true);
  w(8, 'WAVEfmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true);
  v.setUint32(28, 8000, true);
  v.setUint16(32, 1, true);
  v.setUint16(34, 8, true);
  w(36, 'data');
  v.setUint32(40, samples, true);
  for (let i = 0; i < samples; i++) v.setUint8(44 + i, 128);
  let bin = '';
  new Uint8Array(buf).forEach((b) => (bin += String.fromCharCode(b)));
  return `data:audio/wav;base64,${btoa(bin)}`;
}

let unlocked = false;

/** Chame de forma síncrona dentro do toque (play / palavra) para liberar o áudio no iPhone. */
export function unlockAudioOnWeb() {
  const el = audioElement();
  if (!el || unlocked) return;
  unlocked = true;
  if (currentUrl) {
    // Já existe um áudio carregado: tocar e pausar na hora libera o player.
    el.play()
      .then(() => el.pause())
      .catch(() => {});
    return;
  }
  const silent = silentWav();
  el.src = silent;
  el.play()
    .then(() => {
      if (el.src === silent) el.pause();
    })
    .catch(() => {});
}

export function stopRecorded() {
  element?.pause();
}

let wordTimer: ReturnType<typeof setTimeout> | undefined;

/** Toca só o trecho de uma palavra do áudio gravado. */
export function playRecordedWord(rec: Recording, wordIndex: number) {
  const el = audioElement();
  const w = rec.words[wordIndex];
  if (!el || !w) return;
  clearTimeout(wordTimer);
  setSource(rec.url);
  const go = () => {
    el.playbackRate = 0.9;
    el.currentTime = Math.max(0, w[0] - 30) / 1000;
    el.play().catch(() => {});
    wordTimer = setTimeout(() => el.pause(), (w[1] - w[0] + 120) / 0.9);
  };
  if (el.readyState >= 1) go();
  else el.addEventListener('loadedmetadata', go, { once: true });
}
