#!/usr/bin/env node
/**
 * Gera a narração realista (ElevenLabs) de todas as páginas dos livros.
 *
 *   ELEVENLABS_API_KEY=sua-chave node scripts/generate-narration.mjs [--book <id>] [--force]
 *     → só MOSTRA o que seria gravado, quantos caracteres gastaria e o saldo do plano.
 *   ELEVENLABS_API_KEY=sua-chave node scripts/generate-narration.mjs --confirmar
 *     → grava de verdade (gasta créditos da ElevenLabs).
 *
 * Travas de custo:
 *   - Sem --confirmar, nada é gravado (simulação).
 *   - Consulta o saldo do plano antes; se o total passar do saldo disponível menos a reserva
 *     (RESERVA_MINIMA), não grava nada.
 *   - Se a conta permitir cobrança extra (overage), recusa a gravação.
 *   - Para na hora se a ElevenLabs avisar que a cota acabou.
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

/** Caracteres que sempre ficam livres no plano (margem de segurança). */
const RESERVA_MINIMA = 3000;

const args = process.argv.slice(2);
const confirmed = args.includes('--confirmar');
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
  if (!res.ok) {
    const body = (await res.text()).slice(0, 300);
    if (/quota|credit|limit/i.test(body)) throw new Error(`A ElevenLabs avisou que a cota acabou. Parei aqui. (${body})`);
    throw new Error(`ElevenLabs respondeu ${res.status}: ${body}`);
  }
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

async function getSubscription() {
  const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': apiKey } });
  if (!res.ok) throw new Error(`Não consegui consultar o saldo da ElevenLabs (${res.status}).`);
  return res.json();
}

async function main() {
  const manifest = existsSync(MANIFEST_FILE)
    ? JSON.parse(readFileSync(MANIFEST_FILE, 'utf8'))
    : { voice: 'Amanda Kelly (ElevenLabs)', voiceId: VOICE_ID, model: MODEL_ID, books: {} };
  manifest.voiceId = VOICE_ID;
  manifest.model = MODEL_ID;

  const books = readBooks().filter((b) => !onlyBook || b.id === onlyBook);

  // 1) Planejamento: o que precisa ser gravado.
  const todo = [];
  for (const book of books) {
    const pages = (manifest.books[book.id] ??= []);
    pages.length = book.texts.length;
    for (let i = 0; i < book.texts.length; i++) {
      const text = book.texts[i];
      const hash = textHash(text);
      const file = `${book.id}/${i + 1}.mp3`;
      if (rehashOnly) {
        if (pages[i]) pages[i].hash = hash;
        continue;
      }
      if (!force && pages[i]?.hash === hash && existsSync(join(AUDIO_DIR, file))) continue;
      todo.push({ book, i, text, hash, file });
    }
  }
  if (rehashOnly) {
    writeFileSync(MANIFEST_FILE, JSON.stringify(manifest) + '\n');
    console.log('Hashes atualizados.');
    return;
  }

  const needed = todo.reduce((n, t) => n + t.text.length, 0);
  if (todo.length === 0) {
    console.log('Nada a gravar: todas as páginas já têm narração atualizada.');
    return;
  }

  // 2) Travas de custo.
  const sub = await getSubscription();
  const remaining = sub.character_limit - sub.character_count;
  const available = remaining - RESERVA_MINIMA;
  console.log(`Plano ${sub.tier}: ${sub.character_count} de ${sub.character_limit} caracteres usados (restam ${remaining}).`);
  console.log(`A gravar: ${todo.length} página(s), cerca de ${needed} caracteres.`);
  if (sub.can_extend_character_limit || sub.allowed_to_extend_character_limit) {
    console.error('A conta permite cobrança além do plano (overage). Desligue isso na ElevenLabs antes de gravar.');
    process.exit(1);
  }
  if (needed > available) {
    console.error(`Não gravei nada: passaria do saldo (reserva de ${RESERVA_MINIMA} caracteres).`);
    process.exit(1);
  }
  if (!confirmed) {
    console.log('\nSimulação: nada foi gravado. Rode de novo com --confirmar para gravar.');
    return;
  }

  // 3) Gravação.
  let generated = 0;
  let chars = 0;
  for (const { book, i, text, hash, file } of todo) {
    const pages = manifest.books[book.id];
    const path = join(AUDIO_DIR, file);
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
  writeFileSync(MANIFEST_FILE, JSON.stringify(manifest) + '\n');
  console.log(`\nPronto: ${generated} página(s) gravada(s), ~${chars} caracteres usados.`);
}

main().catch((e) => {
  console.error('\n' + e.message);
  process.exit(1);
});
