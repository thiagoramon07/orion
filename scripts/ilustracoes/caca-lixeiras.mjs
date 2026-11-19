#!/usr/bin/env node
/** Gera as 7 ilustrações de "Cacá e as Lixeiras Coloridas" em public/ilustracoes/caca-lixeiras/. */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { bin, bush, caca, cloud, dustpan, flower, grassTufts, note, obj, park, sparkle, sun, svg, tree, worker } from './kit.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '../../public/ilustracoes/caca-lixeiras');
mkdirSync(OUT, { recursive: true });

/** Ícone branco no corpo de cada lixeira (sem letras): o que ela recebe. */
const ICON = {
  azul: `<rect x="-16" y="-50" width="32" height="28" rx="3" fill="#fff" opacity="0.9"/><rect x="-10" y="-44" width="20" height="3" fill="#3F7FD1"/><rect x="-10" y="-37" width="20" height="3" fill="#3F7FD1"/><rect x="-10" y="-30" width="14" height="3" fill="#3F7FD1"/>`,
  vermelha: `<rect x="-5" y="-54" width="10" height="6" rx="2" fill="#fff"/><path d="M-5 -48 Q-12 -42 -12 -34 V-22 H12 V-34 Q12 -42 5 -48 Z" fill="#fff" opacity="0.9"/>`,
  verde: `<rect x="-12" y="-54" width="24" height="7" rx="2" fill="#fff"/><rect x="-14" y="-46" width="28" height="26" rx="6" fill="#fff" opacity="0.9"/>`,
  amarela: `<rect x="-12" y="-52" width="24" height="32" rx="5" fill="#fff" opacity="0.9"/><rect x="-12" y="-52" width="24" height="5" fill="#C9CED6"/>`,
  marrom: `<path d="M0 -20 C-22 -30 -18 -50 0 -54 C18 -50 22 -30 0 -20Z" fill="#fff" opacity="0.9"/><path d="M0 -22 V-50" stroke="#8A5A33" stroke-width="3"/>`,
};
const B = (x, y, color, s, opts = {}) => bin(x, y, color, s, { icon: ICON[color], ...opts });
const row = (y, s, faces = {}) =>
  ['azul', 'vermelha', 'verde', 'amarela', 'marrom']
    .map((c, i) => B(560 + i * 125, y, c, s, { face: faces[c] ?? 'open', tilt: [-4, 2, -2, 3, -3][i] }))
    .join('');

const pages = {
  // 1. Cacá encontra as cinco lixeiras no parque.
  1: svg(
    park() +
      row(690, 0.78, { azul: 'open', vermelha: 'smile', verde: 'open', amarela: 'smile', marrom: 'open' }) +
      caca(300, 720, 1.25, { mouth: 'open', arms: 'down' }) +
      sparkle(220, 430, 1.1) + sparkle(390, 410, 0.8) +
      flower(70, 700, '#FF8FA3') + flower(130, 720, '#FFD36E', 0.9) + flower(1150, 720, '#C7A6FF') +
      grassTufts([40, 470, 1000, 1180]),
  ),
  // 2. A lixeira azul come papel.
  2: svg(
    park({ path: false }) +
      B(820, 740, 'azul', 1.55, { face: 'open', lidOpen: true, tilt: -4 }) +
      obj.newspaper(560, 300, 1.4, -18) + obj.notebook(680, 220, 1.3, 20) + obj.box(470, 430, 1.2, -10) +
      obj.motion(420, 300, 1, 0) + obj.motion(600, 170, 0.9, 0) +
      caca(250, 740, 1.2, { mouth: 'laugh', eyes: 'happy', arms: 'up' }) +
      sparkle(1050, 380, 0.9) + grassTufts([60, 520, 1100]),
  ),
  // 3. A lixeira vermelha gargalha e fica com o plástico.
  3: svg(
    park({ path: false, trees: false }) + tree(1100, 470, 0.9, 2) +
      B(800, 740, 'vermelha', 1.55, { face: 'laugh', lidOpen: true, tilt: 4 }) +
      obj.bottle(560, 270, 1.4, -25) + obj.cup(660, 170, 1.3, 15) + obj.yogurt(480, 420, 1.3, -8) +
      obj.motion(440, 260, 0.9) +
      caca(240, 740, 1.2, { mouth: 'laugh', eyes: 'happy', arms: 'clap' }) +
      `<text x="0" y="0" fill="none"/>` + grassTufts([60, 520, 1150]),
  ),
  // 4. A lixeira verde guarda o vidro; uma adulta recolhe os cacos com luvas.
  4: svg(
    park({ path: false }) +
      B(560, 740, 'verde', 1.45, { face: 'whisper', tilt: -2 }) +
      obj.jar(400, 700, 1.2, -8) +
      worker(900, 760, 1.05) +
      dustpan(1010, 770, 0.9) + obj.shards(960, 760, 1.1) +
      caca(170, 750, 0.95, { mouth: 'smile', arms: 'down' }) +
      `<path d="M300 560 Q330 540 360 560" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>` +
      grassTufts([40, 1180]),
  ),
  // 5. A lixeira amarela fica com o metal (latinhas e tampinhas brilhando).
  5: svg(
    park({ path: false }) +
      B(780, 740, 'amarela', 1.55, { face: 'open', lidOpen: true, tilt: 3 }) +
      obj.can(560, 260, 1.4, -20, '#E5484D') + obj.can(670, 160, 1.2, 25, '#3F7FD1') + obj.lid(480, 400, 1.3) + obj.lid(560, 470, 1) +
      sparkle(520, 200, 1.1, '#FFF6D5') + sparkle(720, 110, 0.9, '#FFF6D5') + sparkle(440, 340, 0.8, '#FFF6D5') +
      caca(240, 740, 1.2, { mouth: 'laugh', eyes: 'happy', arms: 'clap' }) +
      grassTufts([60, 1120]),
  ),
  // 6. A lixeira marrom boceja; a casca de banana vira adubo para a horta.
  6: svg(
    park({ path: false, trees: false }) + tree(1110, 470, 0.85, 0) +
      `<rect x="860" y="600" width="260" height="70" rx="16" fill="#8A5A33"/><rect x="870" y="590" width="240" height="24" rx="12" fill="#6C4627"/>` +
      obj.sprout(900, 594, 1.3) + obj.sprout(970, 594, 1.6) + obj.sprout(1040, 594, 1.4) + flower(1085, 560, '#FF8FA3', 0.8) +
      B(640, 740, 'marrom', 1.5, { face: 'yawn', tilt: -3 }) +
      obj.banana(470, 690, 1.5, -10) + obj.apple(410, 740, 1.2, 10) + obj.banana(840, 720, 1.1, 15) +
      `<text x="0" y="0" fill="none"/>` +
      `<g opacity="0.7"><path d="M720 380 q16 -12 32 0 q16 12 32 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M748 340 q12 -9 24 0 q12 9 24 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></g>` +
      caca(220, 740, 1.15, { mouth: 'open', arms: 'down' }) +
      grassTufts([60, 560]),
  ),
  // 7. Parque limpinho: Cacá e as cinco lixeiras cantam "separar é cuidar!".
  7: svg(
    sun(1040, 120, 70) + cloud(140, 120) + cloud(560, 80, 0.8) +
      `<path d="M0 520 Q200 420 420 500 Q640 420 860 490 Q1040 440 1200 480 V800 H0 Z" fill="#9ED49F"/>` +
      tree(70, 470, 0.85, 1) + tree(1140, 460, 0.8, 0) + bush(300, 560) + bush(940, 560, 0.9) +
      `<path d="M0 560 Q600 520 1200 560 V800 H0 Z" fill="#7BC47F"/>` +
      [['azul', 115], ['vermelha', 270], ['verde', 425], ['amarela', 830], ['marrom', 985]]
        .map(([c, x], i) => B(x, 730, c, 0.72, { face: 'sing', tilt: [-6, 4, -3, -4, 6][i] }))
        .join('') +
      caca(628, 745, 1.3, { mouth: 'laugh', eyes: 'happy', arms: 'up' }) +
      note(260, 360, 1, '#5B3FA6', -10) + note(480, 300, 0.9, '#E5484D', 8) + note(760, 320, 1.1, '#3F7FD1', -6) + note(980, 360, 0.9, '#3E9A4E', 10) +
      [80, 200, 360, 840, 1000, 1150].map((x, i) => flower(x, 740 + (i % 2) * 20, ['#FF8FA3', '#FFD36E', '#C7A6FF', '#FFFFFF'][i % 4], 0.9)).join('') +
      sparkle(600, 360, 1.2) + sparkle(420, 420, 0.8) + sparkle(800, 420, 0.8),
  ),
};

const BOOK = 'caca-lixeiras';
const MANIFEST = join(dirname(fileURLToPath(import.meta.url)), '../../src/data/illustrations.json');
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
manifest[BOOK] = [];
for (const [n, content] of Object.entries(pages)) {
  const clean = content.replaceAll('<text x="0" y="0" fill="none"/>', '');
  writeFileSync(join(OUT, `${n}.svg`), clean);
  // ?v=… muda quando o desenho muda, para o aparelho não mostrar a versão antiga do cache.
  const v = createHash('sha1').update(clean).digest('hex').slice(0, 8);
  manifest[BOOK][Number(n) - 1] = `${BOOK}/${n}.svg?v=${v}`;
}
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Geradas ${Object.keys(pages).length} ilustrações em ${OUT}`);
