#!/usr/bin/env node
/**
 * Gera a narração realista (ElevenLabs) de todas as páginas dos livros.
 *
 *   ELEVENLABS_API_KEY=sua-chave node scripts/generate-narration.mjs [--force] [--book <id>]
 *
 * Saída:
 *   public/narracao/<livro>/<página>.mp3   áudio de cada página
 *   src/data/narration.json                tempos de cada palavra (para o destaque) e hash do texto
 *
 * Só grava páginas novas ou com texto alterado (compara o hash), para não gastar cota à toa.
 * A chave nunca vai para o app: o áudio é gerado uma vez e servido como arquivo estático.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BOOKS_FILE = join(ROOT, 'src/data/books.ts');
const MANIFEST_FILE = join(ROOT, 'src/data/narration.json');
const AUDIO_DIR = join(ROOT, 'public/narracao');

/** Voz "Amanda Kelly - Sweet, Warm and Clear" (biblioteca da ElevenLabs, pt-BR). */
const VOICE_ID = 'oi8rgjIfLgJRsQ6rbZh3';
const MODEL_ID = 'eleven_multilingual_v2';
const VOICE_SETTINGS = { stability: 0.45, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true };
const OUTPUT_FORMAT = 'mp3_44100_96';

const args = process.argv.slice(2);
const force = args.includes('--force');
/** Só recalcula os hashes do manifesto (sem gravar nada). */
const rehashOnly = args.includes('--rehash');
const onlyBook = args.includes('--book') ? args[args.indexOf('--book') + 1] : undefined;
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey && !rehashOnly) {
  console.error('Defina ELEVENLABS_API_KEY com a chave da ElevenLabs.');
  process.exit(1);
}

/** Mesmo critério de palavras do app (src/hooks/use-narration.ts → tokenize). */
function tokenize(text) {
  const out = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(text))) out.push({ start: m.index, end: m.index + m[0].length });
  return out;
}

/** Hash FNV-1a (32 bits) do texto — o app calcula o mesmo para saber se o áudio está atualizado. */
function textHash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/** Lê id e textos das páginas de cada livro direto do books.ts (sem precisar compilar TS). */
function readBooks() {
  const src = readFileSync(BOOKS_FILE, 'utf8');
  const start = src.indexOf('export const BOOKS');
  const body = src.slice(start);
  const blocks = body.split(/\n  \{\n    id: '/).slice(1);
  return blocks.map((block) => {
    const id = block.slice(0, block.indexOf("'"));
    const pagesSection = block.slice(block.indexOf('pages: ['), block.indexOf('\n    ],'));
    const texts = [...pagesSection.matchAll(/text:\s*'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1].replace(/\\'/g, "'"));
    if (!id || texts.length === 0) throw new Error(`Não consegui ler as páginas do livro "${id}".`);
    return { id, texts };
  });
}

async function synthesize(text, previousText, nextText) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=${OUTPUT_FORMAT}`,
    {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        language_code: 'pt',
        voice_settings: VOICE_SETTINGS,
        // Contexto das páginas vizinhas: deixa a entonação contínua entre as páginas.
        previous_text: previousText,
        next_text: nextText,
      }),
    },
  );
  if (!res.ok) throw new Error(`ElevenLabs respondeu ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

/** Converte o tempo de cada letra no tempo de cada palavra (em ms). */
function wordTimings(text, alignment) {
  const chars = alignment.characters;
  const starts = alignment.character_start_times_seconds;
  const ends = alignment.character_end_times_seconds;
  if (chars.join('') !== text) throw new Error('O alinhamento não bate com o texto enviado.');
  return tokenize(text).map((w) => [Math.round(starts[w.start] * 1000), Math.round(ends[w.end - 1] * 1000)]);
}

async function main() {
  const manifest = existsSync(MANIFEST_FILE)
    ? JSON.parse(readFileSync(MANIFEST_FILE, 'utf8'))
    : { voice: 'Amanda Kelly (ElevenLabs)', voiceId: VOICE_ID, model: MODEL_ID, books: {} };
  manifest.voiceId = VOICE_ID;
  manifest.model = MODEL_ID;

  const books = readBooks().filter((b) => !onlyBook || b.id === onlyBook);
  let generated = 0;
  let chars = 0;

  for (const book of books) {
    const pages = (manifest.books[book.id] ??= []);
    pages.length = book.texts.length;
    for (let i = 0; i < book.texts.length; i++) {
      const text = book.texts[i];
      const hash = textHash(text);
      const file = `${book.id}/${i + 1}.mp3`;
      const path = join(AUDIO_DIR, file);
      if (rehashOnly) {
        if (pages[i]) pages[i].hash = hash;
        continue;
      }
      if (!force && pages[i]?.hash === hash && existsSync(path)) continue;

      process.stdout.write(`🎙️  ${book.id} p.${i + 1}… `);
      const data = await synthesize(text, book.texts[i - 1], book.texts[i + 1]);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, Buffer.from(data.audio_base64, 'base64'));
      const words = wordTimings(text, data.alignment);
      pages[i] = { file, hash, duration: words.at(-1)?.[1] ?? 0, words };
      generated++;
      chars += text.length;
      console.log(`ok (${(pages[i].duration / 1000).toFixed(1)} s)`);
      writeFileSync(MANIFEST_FILE, JSON.stringify(manifest) + '\n');
    }
  }
  writeFileSync(MANIFEST_FILE, JSON.stringify(manifest) + '\n');
  console.log(`\nPronto: ${generated} página(s) gravada(s), ~${chars} caracteres usados.`);
}

main().catch((e) => {
  console.error('\n' + e.message);
  process.exit(1);
});
