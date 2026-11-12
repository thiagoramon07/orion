import * as Speech from 'expo-speech';

let cached: Promise<string | undefined> | undefined;

/** Vozes pt-BR mais naturais primeiro (nomes comuns no Chrome, Edge, Safari e Android). */
const PREFERRED = ['natural', 'google', 'francisca', 'thalita', 'luciana', 'maria', 'felipe'];

/**
 * Escolhe a melhor voz em português do Brasil disponível no navegador/aparelho.
 * Sem voz pt-BR instalada, devolve undefined e o sistema usa a voz padrão do idioma.
 */
export function getBestPtBrVoice(): Promise<string | undefined> {
  if (!cached) {
    cached = Speech.getAvailableVoicesAsync()
      .then((voices) => {
        const pt = voices.filter((v) => v.language?.toLowerCase().replace('_', '-').startsWith('pt-br'));
        if (pt.length === 0) return undefined;
        const score = (name: string) => {
          const n = name.toLowerCase();
          const i = PREFERRED.findIndex((p) => n.includes(p));
          return i === -1 ? PREFERRED.length : i;
        };
        pt.sort((a, b) => score(a.name) - score(b.name));
        return pt[0].identifier;
      })
      .catch(() => undefined);
  }
  return cached;
}

/** Fala uma palavra ou frase curta com a melhor voz pt-BR. */
export async function speakShort(text: string, rate: number) {
  const voice = await getBestPtBrVoice();
  Speech.stop();
  Speech.speak(text, { language: 'pt-BR', rate, voice });
}

let unlocked = false;

/**
 * Safari (iPhone/iPad) só libera a voz se a primeira fala acontecer dentro de um toque.
 * Chame isto de forma síncrona no toque do botão de play.
 */
export function unlockSpeechOnWeb() {
  if (unlocked || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  unlocked = true;
  try {
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    window.speechSynthesis.speak(u);
  } catch {
    // ignora: navegador sem suporte a voz
  }
}
