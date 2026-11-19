#!/usr/bin/env node
/**
 * Gera as ilustrações de todos os livros (exceto "caca-lixeiras", que tem script próprio).
 *   node scripts/ilustracoes/livros.mjs            → todos
 *   node scripts/ilustracoes/livros.mjs vovo-pirata → só um livro
 * Saída: public/ilustracoes/<livro>/<página>.svg e o registro src/data/illustrations.json.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { caca, flower, grassTufts, note, obj, sparkle, svg, tree } from './kit.mjs';
import {
  alarmClock, anteater, ant, balloon, barn, beach, bed, bird, boat, branch, bread, bubbles, cerradoTree, chest,
  chicken, cityHall, cloud, counter, cow, day, envelope, fence, fish, flashlightBeam, footprints, frog, g, ground,
  heart, house, lightbulb, map, moon, nest, night, person, photo, pig, pipe, planet, plantBed, puddle, river,
  robot, rocketLeaf, room, sea, SKIN, splash, stall, stars, strawberry, sun, telescope, termite, tin, web, wolf,
  windowFrame,
} from './kit2.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = join(ROOT, 'public/ilustracoes');
const MANIFEST = join(ROOT, 'src/data/illustrations.json');

/* ---------- elementos locais ---------- */
const tomato = (x, y, s = 1) => g(x, y, s, `<circle r="44" fill="#E5484D"/><circle cx="-14" cy="-14" r="10" fill="#fff" opacity="0.3"/><path d="M-18 -42 L0 -52 L18 -42 L8 -36 L0 -46 L-8 -36Z" fill="#3E9A4E"/>`);
const bananas = (x, y, s = 1, r = 0) => g(x, y, s, [0, 1, 2].map((i) => `<path d="M-60 ${-10 + i * 18} Q0 ${50 + i * 18} 60 ${-10 + i * 18} Q10 ${24 + i * 18} -60 ${-10 + i * 18}Z" fill="${i % 2 ? '#FFD64D' : '#F2B705'}"/>`).join('') + `<rect x="54" y="-24" width="20" height="30" rx="6" fill="#7A5232"/>`, r);
const lettuce = (x, y, s = 1) => g(x, y, s, `<circle cx="-30" cy="0" r="36" fill="#5DB368"/><circle cx="30" cy="0" r="36" fill="#5DB368"/><circle cx="0" cy="-22" r="40" fill="#7BC47F"/><circle cx="0" cy="8" r="34" fill="#A8DB9E"/><path d="M0 -40 V30 M-20 -10 L0 10 L20 -10" stroke="#4FA35A" stroke-width="4" fill="none"/>`);
const grapes = (x, y, s = 1) => g(x, y, s, [[0, 0], [-24, -6], [24, -6], [-12, 18], [12, 18], [0, 38], [-36, -28], [0, -30], [36, -28]].map(([dx, dy]) => `<circle cx="${dx}" cy="${dy}" r="16" fill="#7B4CC2"/><circle cx="${dx - 5}" cy="${dy - 5}" r="4" fill="#fff" opacity="0.35"/>`).join('') + `<path d="M0 -46 V-62 q14 -6 24 4" stroke="#7A5232" stroke-width="6" fill="none"/><ellipse cx="24" cy="-60" rx="18" ry="10" fill="#4FA35A"/>`);
const basket = (x, y, s = 1, fill = '') => g(x, y, s, `${fill}<path d="M-70 -50 Q0 -150 70 -50" stroke="#A87843" stroke-width="10" fill="none"/><path d="M-80 -50 H80 L64 30 H-64Z" fill="#C8955A"/><path d="M-72 -20 H72 M-68 6 H68" stroke="#A87843" stroke-width="6"/>`);
const lilyPad = (x, y, s = 1) => g(x, y, s, `<path d="M0 0 A120 40 0 1 1 1 0 L0 -30Z" fill="#3E8B48" transform="scale(1 1)"/><ellipse rx="120" ry="38" fill="#3E8B48"/><path d="M0 0 L60 -30" stroke="#2F7A3C" stroke-width="5"/>`);
const shovel = `<g transform="rotate(30)"><rect x="-4" y="-80" width="8" height="90" rx="3" fill="#7A5232"/><path d="M-18 8 H18 L12 40 Q0 50 -12 40Z" fill="#9AA3B2"/></g>`;
const magnifier = `<g transform="rotate(-30)"><circle cx="0" cy="-30" r="22" fill="#CFE6FA" opacity="0.7" stroke="#5A6375" stroke-width="7"/><rect x="-5" y="-8" width="10" height="34" rx="4" fill="#5A6375"/></g>`;
const notebookHeld = `<rect x="-26" y="-30" width="52" height="64" rx="5" fill="#FFD36E"/><rect x="-26" y="-30" width="10" height="64" rx="3" fill="#F2B705"/>`;
const flashlight = `<rect x="-8" y="-14" width="44" height="22" rx="6" fill="#5A6375"/><rect x="34" y="-18" width="12" height="30" rx="4" fill="#FFD36E"/>`;
const rod = `<path d="M0 0 L150 -170" stroke="#7A5232" stroke-width="7" stroke-linecap="round"/><path d="M150 -170 Q200 -60 210 60" stroke="#fff" stroke-width="2" fill="none" opacity="0.8"/>`;
const tray = `<rect x="-60" y="-8" width="120" height="14" rx="6" fill="#9AA3B2"/>${[-36, 0, 36].map((dx) => g(dx, -20, 0.55, `<ellipse rx="34" ry="26" fill="#F2C46D"/><ellipse cx="-8" cy="-8" rx="12" ry="7" fill="#FBE3A6"/>`)).join('')}`;
const letter = envelope(0, 0, 0.6);
const tomatoHeld = tomato(0, -10, 0.5);
const lampPost = (x) => `<rect x="${x - 6}" y="380" width="12" height="190" fill="#3A4458"/><circle cx="${x}" cy="370" r="24" fill="#FFF3C4"/><circle cx="${x}" cy="370" r="60" fill="#FFF3C4" opacity="0.18"/>`;
const bench = (x, y) => `<rect x="${x - 80}" y="${y - 50}" width="160" height="14" rx="6" fill="#C8955A"/><rect x="${x - 80}" y="${y - 84}" width="160" height="12" rx="6" fill="#C8955A"/><rect x="${x - 70}" y="${y - 40}" width="10" height="40" fill="#7A5232"/><rect x="${x + 60}" y="${y - 40}" width="10" height="40" fill="#7A5232"/>`;
const lobeira = (x, y, s = 1) => g(x, y, s, `<circle r="26" fill="#9CC46A"/><circle cx="-8" cy="-8" r="7" fill="#fff" opacity="0.3"/><path d="M0 -26 v-12" stroke="#6B4A2E" stroke-width="5"/>`);
const drops = (x, y) => `<path d="M${x} ${y} q-8 14 0 18 q8 -4 0 -18Z" fill="#9FD3F0"/><path d="M${x + 30} ${y - 20} q-6 10 0 13 q6 -3 0 -13Z" fill="#9FD3F0"/><path d="M${x - 26} ${y + 10} q-6 10 0 13 q6 -3 0 -13Z" fill="#9FD3F0"/>`;
const attic = () => room('#C8955A', '#A87843', 600) + `<path d="M0 0 L600 -120 L1200 0" fill="none"/><path d="M0 120 L600 -60 L1200 120 V0 H0Z" fill="#8A5A33"/>` + [150, 450, 750, 1050].map((x) => `<rect x="${x}" y="200" width="16" height="400" fill="#8A5A33" opacity="0.5"/>`).join('') + `<circle cx="600" cy="250" r="90" fill="#FFF3C4" opacity="0.25"/><rect x="560" y="190" width="80" height="80" rx="40" fill="#FFF3C4" opacity="0.6"/>`;
const hay = (x, y, s = 1) => g(x, y, s, `<ellipse rx="170" ry="50" fill="#E9C46A"/>${[-120, -60, 0, 60, 120].map((dx) => `<path d="M${dx} -30 l10 -24 M${dx + 20} -24 l-6 -28" stroke="#C99206" stroke-width="5" stroke-linecap="round"/>`).join('')}`);
const zzz = (x, y, c = '#FFF3C4') => `<path d="M${x} ${y} h24 l-24 26 h24 M${x + 34} ${y - 40} h18 l-18 20 h18" stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const gear = (x, y, s = 1, c = '#9AA3B2') => g(x, y, s, `${Array.from({ length: 8 }, (_, i) => `<rect x="-8" y="-46" width="16" height="20" rx="3" fill="${c}" transform="rotate(${i * 45})"/>`).join('')}<circle r="34" fill="${c}"/><circle r="12" fill="#fff" opacity="0.6"/>`);

const kid = (o) => ({ kid: true, ...o });
const NINA = kid({ skin: SKIN.morena, hair: '#2B1A10', style: 'pigtails', shirt: '#E5484D', pants: '#3F7FD1' });
const VOVO = { kid: false, skin: SKIN.morena, style: 'gray-bun', shirt: '#5B3FA6', skirt: true, glasses: true };
const TEO = kid({ skin: SKIN.clara, hair: '#C8742C', style: 'short', shirt: '#3E9A4E', pants: '#3A4458' });
const LUCAS = kid({ skin: SKIN.escura, hair: '#1C2333', style: 'curly', shirt: '#F2B705', pants: '#3A4458' });
const RAI = kid({ skin: SKIN.morena, hair: '#1C2333', style: 'short', shirt: '#FF8A3D', pants: '#2F63A8' });
const MALU = kid({ skin: SKIN.media, hair: '#3A2414', style: 'long', shirt: '#5B3FA6', pants: '#E5484D', glasses: true });
const MOM = { kid: false, skin: SKIN.media, hair: '#3A2414', style: 'bun', shirt: '#3E9A4E', skirt: true };

/* ---------- livros ---------- */
const BOOKS = {
  'boa-noite-lua': [
    night('#2B3A67') + moon(820, 250, 110) + ground('#3E5C3A', 600, '#4A6B45') + barn(240, 600, 0.9) + fence(500, 1180, 640) + tree(1120, 560, 0.7, 0),
    night('#2B3A67') + moon(1000, 140, 70) + ground('#3E5C3A', 600, '#4A6B45') + fence(0, 1200, 600) + cow(640, 720, 1.25, { sleepy: true }) + zzz(820, 430),
    night('#2B3A67') + moon(160, 140, 60) + ground('#3E5C3A', 600, '#4A6B45') + barn(900, 610, 1) + hay(560, 720, 0.8) + chicken(560, 690, 1.4, { sleepy: true }) + zzz(640, 470),
    night('#2B3A67') + moon(1000, 140, 70) + ground('#3E5C3A', 600, '#4A6B45') + hay(600, 700, 1.4) + pig(600, 690, 1.3, { sleepy: true }) + zzz(760, 470),
    room('#3B4A7A', '#2B3A67', 620) + windowFrame(760, 120, 300, 240, '#1E2A4D', moon(910, 240, 60, true) + stars([[800, 160], [1020, 330], [990, 150]])) + bed(480, 720, 1.4, '#5B3FA6') + g(310, 600, 1, `<circle r="46" fill="${SKIN.media}"/><path d="M-46 -6 Q-46 -54 0 -52 Q46 -54 46 -6 Q30 -30 0 -28 Q-30 -30 -46 -6Z" fill="#3A2414"/><path d="M-22 4 q8 6 16 0 M6 4 q8 6 16 0" stroke="#1C2333" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-8 22 q8 6 16 0" stroke="#1C2333" stroke-width="3" fill="none"/>`) + zzz(380, 470),
  ],
  'cores-da-feira': [
    day() + ground('#E8D3B0', 600, '#9ED49F') + stall(600, 640, 1.2, '#E5484D') + tomato(430, 520, 0.6) + tomato(480, 530, 0.6) + bananas(620, 530, 0.7) + grapes(770, 520, 0.6) + lettuce(870, 530, 0.5) + person(200, 760, 1, { ...MOM, arms: 'hold', hold: basket(20, 30, 0.5) }) + person(1050, 760, 1, kid({ skin: SKIN.escura, hair: '#1C2333', style: 'curly', shirt: '#F2B705', arms: 'wave', mouth: 'laugh' })),
    day({ clouds: false }) + ground('#E8D3B0', 600, null) + stall(600, 700, 1.4, '#E5484D') + [420, 520, 620, 720, 820].map((x, i) => tomato(x, 560 - (i % 2) * 20, 0.9)).join('') + tomato(600, 190, 1.6),
    day({ clouds: false }) + ground('#E8D3B0', 600, null) + stall(600, 700, 1.4, '#F2B705') + bananas(470, 560, 1) + bananas(740, 560, 1, 10) + bananas(600, 190, 1.8, -8),
    day({ clouds: false }) + ground('#E8D3B0', 600, null) + stall(600, 700, 1.4, '#3E9A4E') + lettuce(460, 560, 0.9) + lettuce(740, 560, 0.9) + lettuce(600, 200, 1.5),
    day() + ground('#E8D3B0', 600, '#9ED49F') + stall(600, 660, 1.3, '#5B3FA6') + tomato(400, 540, 0.6) + bananas(520, 550, 0.6) + lettuce(680, 545, 0.5) + grapes(800, 530, 0.7) + grapes(600, 190, 1.4) + person(140, 770, 1, kid({ skin: SKIN.clara, hair: '#C8742C', style: 'pigtails', shirt: '#7B4CC2', arms: 'up', mouth: 'laugh' })),
  ],
  'caca-quer-voar': [
    day() + ground() + tree(1060, 560, 0.9, 1) + bird(400, 220, 0.8, { flying: true }) + bird(560, 160, 0.6, { flying: true, body: '#3F7FD1', belly: '#CFE6FA', wing: '#2F63A8', flip: true }) + bird(700, 260, 0.5, { flying: true }) + caca(320, 740, 1.3, { mouth: 'open' }) + flower(140, 720, '#FF8FA3') + grassTufts([80, 600, 1150]),
    day() + ground() + tree(950, 640, 1.3, 0) + branch(700, 380, 1000, 400) + bird(800, 330, 1, { body: '#7A5232', belly: '#FFD64D', wing: '#5C3D22', mask: true, open: true }) + caca(380, 740, 1.3, { mouth: 'open' }) + grassTufts([80, 620]),
    day() + ground('#7BC47F', 520, '#9ED49F') + river(560) + splash(600, 640, 1.6) + caca(600, 620, 1, { mouth: 'open', arms: 'up', tilt: -18 }) + bubbles(760, 640) + tree(110, 470, 0.8, 0),
    `<rect width="1200" height="800" fill="#FFE7B3"/>` + sun(1040, 120, 64) + ground() + river(680) + caca(330, 650, 1.15, { mouth: 'open' }) + drops(250, 380) + g(700, 610, 1.1, `<rect x="-110" y="-70" width="220" height="140" rx="10" fill="#FFF8EC"/><path d="M0 -70 V70" stroke="#E7DCC6" stroke-width="4"/><rect x="-104" y="-64" width="98" height="128" rx="6" fill="#5B3FA6"/>${balloon(-55, 40, 0.35)}`, -6) + flower(900, 600, '#FFD36E') + flower(960, 620, '#FF8FA3'),
    `<rect width="1200" height="800" fill="#9FD3F0"/>` + sun(1040, 120, 64) + cloud(80, 560, 1.4) + cloud(820, 620, 1.6) + cloud(400, 700, 1.2) + cloud(160, 180, 0.8) + balloon(600, 620, 1.6) + caca(600, 600, 0.55, { mouth: 'laugh', eyes: 'happy', arms: 'up' }) + bird(900, 280, 0.6, { flying: true, flip: true }),
    `<rect width="1200" height="800" fill="#FFD36E"/>` + `<circle cx="600" cy="560" r="300" fill="#FFB627" opacity="0.5"/>` + ground() + tree(1080, 560, 0.9, 1) + caca(600, 740, 1.4, { mouth: 'laugh', eyes: 'happy', arms: 'up' }) + sparkle(420, 330, 1.2) + sparkle(780, 300, 1) + sparkle(600, 200, 1.4) + [120, 240, 900, 980].map((x, i) => flower(x, 720 + (i % 2) * 20, ['#FF8FA3', '#C7A6FF', '#FFFFFF', '#FF8FA3'][i])).join(''),
  ],
  'sapo-astronauta': [
    night('#2B2350') + moon(1000, 150, 70, false) + ground('#3E5C3A', 560, '#4A6B45') + river(600, '#2E5C7A') + lilyPad(520, 680, 1.2) + frog(520, 680, 1.1, { mouth: 'open' }) + sparkle(380, 300, 0.6, '#FFF6D5'),
    night('#2B2350') + moon(860, 220, 140, true) + ground('#3E5C3A', 600, '#4A6B45') + frog(330, 720, 1.3, { mouth: 'open', eyes: 'open' }) + `<path d="M420 560 L620 360" stroke="#7BC47F" stroke-width="16" stroke-linecap="round"/>`,
    day() + ground() + tree(130, 520, 0.8, 0) + rocketLeaf(720, 690, 2.2) + frog(420, 720, 1.1, { mouth: 'laugh' === 'x' ? 'open' : 'smile', eyes: 'happy' }) + g(980, 720, 1, `<rect x="-60" y="-10" width="120" height="14" rx="6" fill="#7A5232" transform="rotate(-10)"/><rect x="-40" y="-30" width="100" height="12" rx="6" fill="#7A5232" transform="rotate(14)"/><circle cx="40" cy="-50" r="16" fill="#C9CED6"/>`),
    day() + ground('#7BC47F', 520, '#9ED49F') + river(560) + splash(640, 650, 1.5) + rocketLeaf(640, 660, 1.4, 160) + frog(380, 360, 0.8, { mouth: 'open' }) + `<path d="M440 300 q60 -40 120 20" stroke="#fff" stroke-width="5" fill="none" stroke-dasharray="10 10" opacity="0.8"/>`,
    night('#2B2350') + moon(900, 150, 60, false) + ground('#3E5C3A', 540, '#4A6B45') + river(560, '#2E5C7A') + `<ellipse cx="760" cy="680" rx="70" ry="22" fill="#FFF3C4" opacity="0.8"/><path d="M700 690 q30 -8 60 0 q30 8 60 0" stroke="#FFF3C4" stroke-width="4" fill="none" opacity="0.6"/>` + lilyPad(400, 650, 1) + frog(400, 650, 1, { mouth: 'smile', eyes: 'open' }),
    night('#2B2350') + planet(880, 230, 1.4) + moon(300, 150, 50, false) + ground('#3E5C3A', 620, '#4A6B45') + telescope(640, 680, 1.4) + frog(420, 720, 1.1, { helmet: true, eyes: 'happy' }) + stars([[700, 100], [1100, 380], [540, 250], [160, 300]]),
  ],
  'vovo-pirata': [
    day() + sea(470) + beach(600) + house(220, 600, 1.1) + person(620, 760, 1.05, { ...VOVO, arms: 'wave' }) + person(820, 760, 1, { ...NINA, arms: 'wave', mouth: 'laugh' }) + bird(950, 200, 0.5, { flying: true, body: '#fff', belly: '#fff', wing: '#C9CED6', flip: true }),
    attic() + chest(600, 700, 1.6) + person(1000, 770, 1, { ...NINA, arms: 'up', mouth: 'open' }) + g(600, 540, 1, `<circle r="26" fill="#fff"/><circle cx="-9" cy="-4" r="6" fill="#1C2333"/><circle cx="9" cy="-4" r="6" fill="#1C2333"/><rect x="-10" y="14" width="20" height="10" rx="3" fill="#fff"/><path d="M-30 30 l60 0" stroke="#fff" stroke-width="0"/>`),
    attic() + chest(380, 700, 1.2, true) + person(700, 770, 1.05, { ...VOVO, hat: 'pirate', arms: 'hold', hold: map(30, 0, 0.6), mouth: 'laugh' }) + person(980, 770, 1, { ...NINA, arms: 'up', mouth: 'open' }) + sparkle(380, 470, 1),
    day() + sea(500) + boat(600, 560, 1.4) + person(560, 520, 0.7, { kid: false, skin: SKIN.morena, hair: '#1C2333', style: 'long', shirt: '#E5484D', pants: '#1C2333', hat: 'pirate', arms: 'point', mouth: 'laugh' }) + bird(220, 200, 0.5, { flying: true, body: '#fff', belly: '#fff', wing: '#C9CED6' }) + bird(320, 260, 0.4, { flying: true, body: '#fff', belly: '#fff', wing: '#C9CED6' }),
    day() + sea(440) + beach(560) + `<ellipse cx="600" cy="680" rx="110" ry="34" fill="#C9A66B"/>` + tin(600, 690, 1, false) + person(380, 770, 1, { ...NINA, arms: 'hold', hold: shovel, mouth: 'open' }) + person(840, 770, 1.05, { ...VOVO, hat: 'pirate', arms: 'point' }) + map(1060, 690, 0.7, 12),
    `<rect width="1200" height="800" fill="#FFD36E"/><circle cx="600" cy="420" r="320" fill="#FFB627" opacity="0.4"/>` + beach(640) + tin(600, 690, 1.3, true) + photo(330, 360, 1.1, -12, '#9FD3F0') + photo(880, 340, 1.1, 10, '#F7C9A0') + heart(600, 230, 1.2) + person(200, 780, 0.95, { ...NINA, arms: 'up', mouth: 'laugh' }) + person(1010, 780, 1, { ...VOVO, arms: 'up', mouth: 'laugh' }),
  ],
  'misterios-do-quintal': [
    day() + ground('#8BC17A', 560, '#9ED49F') + house(1000, 560, 0.9, { wall: '#EDE8F8', roof: '#5B3FA6' }) + fence(0, 760, 600) + plantBed(380, 700, 1.4, 2) + g(470, 660, 1, `<path d="M0 0 v-20" stroke="#3E9A4E" stroke-width="4"/><circle cx="0" cy="-22" r="5" fill="#3E9A4E"/>`) + g(470, 610, 1, `<text x="0" y="0" font-size="1" fill="none">?</text><circle r="34" fill="#fff"/><path d="M-10 -10 q10 -14 20 0 q0 10 -10 14 v8" stroke="#5B3FA6" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="0" cy="22" r="4" fill="#5B3FA6"/>`),
    day() + ground('#8BC17A', 560, '#9ED49F') + plantBed(880, 700, 1.1, 2) + person(480, 770, 1.15, { ...TEO, arms: 'hold', hold: magnifier, mouth: 'open' }) + g(412, 690, 0.9, notebookHeld),
    day({ clouds: false }) + ground('#A0784F', 520, null) + puddle(300, 640, 300) + footprints(500, 650, 1.3) + plantBed(1000, 690, 0.9, 1) + g(240, 380, 2.4, magnifier),
    `<rect width="1200" height="800" fill="#CDEBCF"/>` + `<circle cx="300" cy="600" r="260" fill="#5DB368"/><circle cx="900" cy="560" r="300" fill="#4FA35A"/><circle cx="620" cy="760" r="200" fill="#3E8B48"/>` + web(620, 380, 2.2) + sparkle(520, 300, 0.8, '#fff') + sparkle(720, 450, 0.6, '#fff') + person(160, 790, 1, { ...TEO, arms: 'hold', hold: magnifier }),
    night('#1E2A4D') + moon(1060, 120, 50, false) + ground('#2F4A3A', 560, null) + flashlightBeam(330, 520, -6) + plantBed(860, 690, 1, 3) + person(260, 770, 1.05, { ...TEO, arms: 'hold', hold: flashlight, mouth: 'open' }),
    day() + ground('#8BC17A', 560, '#9ED49F') + tree(980, 600, 1.2, 1) + nest(980, 420, 1) + bird(800, 300, 0.9, { body: '#8A7A6A', belly: '#E8925A', wing: '#6E6155', flying: true }) + strawberry(745, 345, 0.7) + plantBed(420, 720, 1.2, 3) + person(180, 770, 1, { ...TEO, arms: 'wave', mouth: 'laugh' }),
  ],
  'bichos-do-cerrado': [
    `<rect width="1200" height="800" fill="#F6D9A0"/>` + sun(1040, 120, 64) + ground('#C8A15A', 560, '#D9B36C') + cerradoTree(240, 640, 1.2) + cerradoTree(900, 620, 1) + termite(600, 640, 1.4) + termite(1100, 660, 0.8) + bird(480, 240, 0.5, { flying: true, body: '#7A5232', belly: '#FFD64D', wing: '#5C3D22' }),
    `<rect width="1200" height="800" fill="#F6D9A0"/>` + sun(1040, 120, 64) + ground('#C8A15A', 560, null) + cerradoTree(1000, 640, 1.1) + lobeira(940, 410, 1) + lobeira(1030, 430, 0.9) + wolf(560, 720, 1.25) + lobeira(380, 700, 1),
    `<rect width="1200" height="800" fill="#F6D9A0"/>` + ground('#C8A15A', 540, null) + termite(320, 680, 1.8) + anteater(760, 720, 1.2) + [[430, 640], [470, 660], [500, 630], [380, 700]].map(([x, y], i) => ant(x, y, 1.1, i * 30)).join(''),
    `<rect width="1200" height="800" fill="#BFE3F2"/>` + sun(1040, 120, 64) + ground('#C8A15A', 560, '#D9B36C') + cerradoTree(1020, 640, 0.9) + bird(500, 560, 1.4, { body: '#C9B49A', belly: '#F4F1EA', wing: '#9C8B78', beak: '#E5484D', legs: true, open: true, crest: `<path d="M-30 -66 l-6 -30 M-22 -66 l2 -30 M-14 -64 l10 -26" stroke="#9C8B78" stroke-width="6" stroke-linecap="round"/>` }) + note(300, 260, 1.1, '#5B3FA6', -10) + note(220, 380, 0.9, '#E5484D', 6) + note(380, 200, 0.8, '#3F7FD1'),
    day() + ground('#C8A15A', 520, '#D9B36C') + river(560) + fish(500, 680, 1.2, '#FF8A3D') + fish(780, 720, 1, '#FFD36E', true) + bubbles(560, 640) + cerradoTree(160, 560, 0.8) + g(980, 420, 1.4, `<path d="M0 -60 C-36 -10 -36 30 0 40 C36 30 36 -10 0 -60Z" fill="#4FA3C7"/><circle cx="-10" cy="10" r="8" fill="#fff" opacity="0.5"/>`),
  ],
  'contos-da-vila': [
    `<rect width="1200" height="800" fill="#FFD9A8"/>` + sun(1060, 120, 60) + ground('#C9B28A', 600, null) + house(160, 600, 0.9, { wall: '#FBE7DF', roof: '#B8471F' }) + house(420, 600, 0.8, { wall: '#EDE8F8', roof: '#5B3FA6' }) + house(1050, 600, 0.9, { wall: '#E3F1F0', roof: '#0B6E6E' }) + tree(760, 600, 0.9, 1) + bench(760, 720) + person(640, 780, 0.8, { ...LUCAS }) + person(860, 780, 0.9, { kid: false, skin: SKIN.clara, hair: '#3A2414', style: 'short', shirt: '#E5484D', mouth: 'open', arms: 'wave' }) + person(300, 780, 0.85, { ...MOM, skin: SKIN.escura, shirt: '#F2B705' }),
    `<rect width="1200" height="800" fill="#FFD9A8"/>` + ground('#C9B28A', 600, null) + house(950, 600, 1.2, { wall: '#FBE7DF', roof: '#B8471F', window: '#F2C46D' }) + person(480, 780, 1.15, { kid: false, skin: SKIN.media, hair: '#1C2333', style: 'bald', shirt: '#fff', pants: '#3A4458', hat: 'chef', arms: 'hold', hold: tray, mouth: 'laugh' }) + bread(200, 700, 1.2) + bread(260, 720, 1) + sparkle(640, 300, 0.9),
    day() + ground('#C9B28A', 600, null) + house(1000, 600, 1, { wall: '#E3F1F0', roof: '#0B6E6E' }) + person(420, 780, 1.1, { kid: false, skin: SKIN.clara, style: 'gray-bun', shirt: '#E5484D', skirt: true, glasses: true, arms: 'hold', mouth: 'laugh' }) + bird(560, 420, 1, { body: '#3E9A4E', belly: '#7BC47F', wing: '#E5484D', beak: '#F2B705', open: true }) + note(700, 300, 1, '#5B3FA6') + note(780, 380, 0.8, '#E5484D', 8),
    night('#2B3A67') + moon(1000, 140, 60, false) + ground('#5B4A3A', 600, null) + house(200, 600, 0.9, { wall: '#C9CED6', roof: '#5A6375', window: '#FFD36E' }) + house(980, 600, 0.9, { wall: '#C9CED6', roof: '#5A6375', window: '#FFD36E' }) + lampPost(780) + person(560, 780, 1.1, { ...LUCAS, arms: 'down', mouth: 'smile' }),
    night('#2B3A67') + ground('#5B4A3A', 600, null) + lampPost(1080) + person(600, 760, 1.15, { ...LUCAS, arms: 'hold', hold: notebookHeld, mouth: 'open' }) + [180, 330, 870, 1010].map((x, i) => person(x, 790, 0.8, { kid: i % 2 === 0, skin: [SKIN.clara, SKIN.escura, SKIN.morena, SKIN.media][i], hair: ['#C8742C', '#1C2333', '#3A2414', '#2B1A10'][i], style: ['short', 'curly', 'long', 'bun'][i], shirt: ['#3E9A4E', '#E5484D', '#3F7FD1', '#FF8A3D'][i], arms: 'up', mouth: 'laugh' })).join('') + sparkle(600, 300, 1.4) + sparkle(460, 360, 0.8) + sparkle(740, 360, 0.8),
  ],
  'guardiao-do-rio': [
    day() + ground('#7BC47F', 520, '#9ED49F') + river(580, '#2E7DA6') + fish(800, 720, 1, '#FF8A3D') + fish(1000, 680, 0.8, '#FFD36E', true) + person(300, 572, 1, { ...RAI, arms: 'hold', hold: rod }) + tree(110, 520, 0.8, 1),
    `<rect width="1200" height="800" fill="#C9CED6"/>` + cloud(140, 130, 1).replaceAll('#fff', '#E3E7EC') + cloud(700, 100, 1).replaceAll('#fff', '#E3E7EC') + ground('#6B7B6E', 520, '#7D8C7F') + river(580, '#7D7A5A') + person(300, 572, 1, { ...RAI, arms: 'down', mouth: 'open' }) + `<path d="M760 700 q20 -8 40 0" stroke="#5A5640" stroke-width="5" fill="none"/>`,
    `<rect width="1200" height="800" fill="#C9CED6"/>` + ground('#6B7B6E', 520, null) + river(600, '#7D7A5A') + pipe(780, 470, 1.2) + person(280, 590, 1, { ...RAI, arms: 'point', mouth: 'open' }),
    day() + ground('#C9B28A', 600, null) + cityHall(800, 610, 1.2) + person(330, 780, 1.05, { ...RAI, arms: 'hold', hold: letter, mouth: 'smile' }) + person(530, 780, 1.1, { kid: false, skin: SKIN.escura, hair: '#1C2333', style: 'curly', shirt: '#5B3FA6', skirt: true, glasses: true, arms: 'wave' }),
    day() + ground('#7BC47F', 520, '#9ED49F') + river(580, '#2E7DA6') + fish(700, 620, 1.2, '#FF8A3D') + fish(900, 700, 1, '#FFD36E', true) + g(1040, 590, 1, splash(0, 0, 0.6)) + fish(1040, 560, 0.9, '#E5484D') + person(320, 572, 1, { ...RAI, arms: 'up', mouth: 'laugh' }) + tree(110, 520, 0.8, 1) + sparkle(600, 300, 1),
  ],
  'diario-inventora': [
    room('#FBE7DF', '#E8D3B0', 600) + windowFrame(820, 120, 260, 200) + bed(560, 720, 1.5, '#E5484D') + g(330, 600, 1.05, `<circle r="46" fill="${SKIN.media}"/><path d="M-46 0 Q-50 -54 0 -52 Q50 -54 46 0 Q30 -30 0 -28 Q-30 -30 -46 0Z" fill="#3A2414"/><circle cx="-16" cy="0" r="12" fill="none" stroke="#1C2333" stroke-width="3"/><circle cx="16" cy="0" r="12" fill="none" stroke="#1C2333" stroke-width="3"/><circle cx="-16" cy="0" r="4" fill="#1C2333"/><circle cx="16" cy="0" r="4" fill="#1C2333"/><ellipse cx="0" cy="24" rx="8" ry="7" fill="#1C2333"/>`) + `<path d="M820 560 Q900 420 1000 440" stroke="#9AA3B2" stroke-width="18" fill="none" stroke-linecap="round"/><circle cx="1000" cy="440" r="20" fill="#9AA3B2"/>` + gear(900, 640, 1) + gear(980, 690, 0.6, '#C9CED6'),
    room('#E3F1F0', '#CFE6FA', 600) + counter(600, 420, 520) + puddle(500, 700, 700) + `<rect x="0" y="640" width="1200" height="160" fill="#4FA3C7" opacity="0.5"/>` + robot(300, 640, 1, {}) + g(380, 520, 1, `<path d="M0 0 h50 l20 -30" stroke="#9AA3B2" stroke-width="10" fill="none" stroke-linecap="round"/>`) + drops(460, 470) + flower(760, 410, '#FF8FA3') + `<rect x="720" y="400" width="80" height="20" rx="6" fill="#C8955A"/>` + fish(900, 720, 0.6, '#FF8A3D'),
    room('#FFF1C7', '#E8D3B0', 600) + windowFrame(820, 110, 240, 190) + person(420, 780, 1.1, { ...MOM, arms: 'point', mouth: 'smile' }) + person(720, 780, 1, { ...MALU, arms: 'hold', hold: notebookHeld, mouth: 'laugh' }),
    `<rect width="1200" height="800" fill="#EDE8F8"/>` + stars([[200, 120], [1000, 140], [1100, 400], [120, 420]]).replaceAll('#FFF6D5', '#C7A6FF') + lightbulb(600, 220, 1.5) + person(600, 780, 1.15, { ...MALU, arms: 'up', mouth: 'open' }) + g(300, 520, 1, gear(0, 0, 0.8, '#C7A6FF')) + g(900, 520, 1, gear(0, 0, 0.6, '#C7A6FF')),
    `<rect width="1200" height="800" fill="#FFD36E"/>` + room('#FFE9A8', '#E8D3B0', 620) + windowFrame(800, 100, 260, 200, '#FFF3C4', sun(930, 200, 40)) + alarmClock(260, 520, 1.1) + note(160, 360, 0.8, '#5B3FA6') + note(360, 340, 0.7, '#E5484D', 10) + robot(560, 760, 1, { book: true }) + person(860, 780, 1.05, { ...MALU, arms: 'up', mouth: 'laugh' }),
  ],
};

/* ---------- escrita ---------- */
const only = process.argv[2];
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
for (const [book, pages] of Object.entries(BOOKS)) {
  if (only && only !== book) continue;
  mkdirSync(join(OUT, book), { recursive: true });
  manifest[book] = pages.map((content, i) => {
    const file = svg(content.replace(/<text[^>]*>[^<]*<\/text>/g, ''));
    writeFileSync(join(OUT, book, `${i + 1}.svg`), file);
    const v = createHash('sha1').update(file).digest('hex').slice(0, 8);
    return `${book}/${i + 1}.svg?v=${v}`;
  });
  console.log(`${book}: ${pages.length} ilustrações`);
}
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
