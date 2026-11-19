/**
 * Kit de ilustração — parte 2: pessoas, bichos e cenários para todos os livros.
 * Mesmo estilo do kit.mjs: plano, arredondado, sem contorno preto. Quadro 1200×800.
 */
import { cloud, sparkle, sun } from './kit.mjs';

export const g = (x, y, s, inner, rot = 0, flip = false) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})">${inner}</g>`;

const INK = '#1C2333';
const BLUSH = '#E86F7E';

/* ===================== Cenários ===================== */

export function sky(color = '#BFE3F2') {
  return `<rect width="1200" height="800" fill="${color}"/>`;
}

export function ground(color = '#7BC47F', y = 560, hill = '#9ED49F') {
  return (
    (hill ? `<path d="M0 ${y - 40} Q200 ${y - 140} 420 ${y - 60} Q640 ${y - 140} 860 ${y - 70} Q1040 ${y - 120} 1200 ${y - 80} V800 H0 Z" fill="${hill}"/>` : '') +
    `<path d="M0 ${y} Q600 ${y - 40} 1200 ${y} V800 H0 Z" fill="${color}"/>`
  );
}

export function day({ clouds = true, sunX = 1040 } = {}) {
  return sky('#BFE3F2') + sun(sunX, 120, 64) + (clouds ? cloud(140, 130, 1) + cloud(560, 90, 0.8) : '');
}

export function stars(list = [[80, 60], [210, 140], [360, 50], [520, 120], [700, 70], [860, 150], [960, 60], [1120, 130], [300, 230], [640, 220], [1050, 260]]) {
  return list.map(([x, y], i) => sparkle(x, y, i % 3 === 0 ? 0.7 : 0.45, '#FFF6D5')).join('');
}

export function moon(x = 1000, y = 140, r = 70, face = true) {
  return (
    `<circle cx="${x}" cy="${y}" r="${r + 30}" fill="#FFF3C4" opacity="0.15"/><circle cx="${x}" cy="${y}" r="${r}" fill="#FFF3C4"/>` +
    `<circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.14}" fill="#EADFA8"/><circle cx="${x + r * 0.4}" cy="${y + r * 0.3}" r="${r * 0.1}" fill="#EADFA8"/>` +
    (face
      ? `<path d="M${x - 28} ${y - 4} q10 -10 20 0 M${x + 8} ${y - 4} q10 -10 20 0" stroke="#8A7A3A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${x - 16} ${y + 20} q16 14 32 0" stroke="#8A7A3A" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="${x - 32}" cy="${y + 12}" r="7" fill="${BLUSH}" opacity="0.4"/><circle cx="${x + 32}" cy="${y + 12}" r="7" fill="${BLUSH}" opacity="0.4"/>`
      : '')
  );
}

export function night(bg = '#2B3A67') {
  return sky(bg) + stars();
}

export function river(y = 600, color = '#4FA3C7') {
  return (
    `<path d="M0 ${y} Q300 ${y - 30} 600 ${y} T1200 ${y} V800 H0 Z" fill="${color}"/>` +
    [0, 1, 2].map((i) => `<path d="M${60 + i * 400} ${y + 60 + i * 30} q30 -14 60 0 q30 14 60 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.6"/>`).join('')
  );
}

export function sea(y = 470) {
  return (
    `<rect x="0" y="${y}" width="1200" height="${800 - y}" fill="#2E8BC0"/>` +
    [0, 1, 2, 3].map((i) => `<path d="M${i * 320 + 40} ${y + 40 + (i % 2) * 40} q30 -16 60 0 q30 16 60 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.6"/>`).join('')
  );
}

export function beach(y = 600) {
  return `<path d="M0 ${y} Q600 ${y - 50} 1200 ${y} V800 H0 Z" fill="#F1D9A6"/><path d="M0 ${y} Q600 ${y - 50} 1200 ${y}" stroke="#fff" stroke-width="10" fill="none" opacity="0.7"/>`;
}

export function house(x, y, s = 1, { wall = '#FBE7DF', roof = '#B8471F', door = '#7A5232', window = '#FFD36E' } = {}) {
  return g(x, y, s, `<rect x="-90" y="-150" width="180" height="150" fill="${wall}"/><path d="M-110 -140 L0 -230 L110 -140 Z" fill="${roof}"/><rect x="-24" y="-80" width="48" height="80" rx="6" fill="${door}"/><circle cx="14" cy="-40" r="4" fill="#FFD36E"/><rect x="-74" y="-120" width="40" height="36" rx="4" fill="${window}"/><rect x="34" y="-120" width="40" height="36" rx="4" fill="${window}"/><path d="M-54 -120 V-84 M54 -120 V-84" stroke="${wall}" stroke-width="4"/>`);
}

export function barn(x, y, s = 1) {
  return g(x, y, s, `<rect x="-120" y="-170" width="240" height="170" fill="#C0392B"/><path d="M-140 -160 L0 -260 L140 -160 Z" fill="#8E2B21"/><rect x="-50" y="-110" width="100" height="110" fill="#F4F1EA"/><path d="M-50 -110 L50 0 M50 -110 L-50 0" stroke="#C0392B" stroke-width="10"/><rect x="-20" y="-210" width="40" height="34" fill="#F4F1EA"/>`);
}

export function fence(x1, x2, y) {
  const posts = [];
  for (let x = x1; x <= x2; x += 60) posts.push(`<rect x="${x - 6}" y="${y - 60}" width="12" height="62" rx="4" fill="#C8955A"/>`);
  return `<rect x="${x1}" y="${y - 48}" width="${x2 - x1}" height="10" rx="5" fill="#C8955A"/><rect x="${x1}" y="${y - 24}" width="${x2 - x1}" height="10" rx="5" fill="#C8955A"/>${posts.join('')}`;
}

export function room(wall = '#FBE7DF', floor = '#E8D3B0', floorY = 580) {
  return `<rect width="1200" height="800" fill="${wall}"/><rect y="${floorY}" width="1200" height="${800 - floorY}" fill="${floor}"/><rect y="${floorY - 8}" width="1200" height="12" fill="#000" opacity="0.06"/>`;
}

export function windowFrame(x, y, w = 220, h = 180, inside = '#BFE3F2', extra = '') {
  return `<rect x="${x - 10}" y="${y - 10}" width="${w + 20}" height="${h + 20}" rx="12" fill="#fff"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${inside}"/>${extra}<path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="#fff" stroke-width="8"/>`;
}

export function cerradoTree(x, y, s = 1) {
  return g(x, y, s, `<path d="M0 0 C-6 -50 18 -80 4 -130 C-4 -160 -40 -170 -60 -200 M8 -110 C30 -140 70 -150 90 -190" stroke="#6B4A2E" stroke-width="18" fill="none" stroke-linecap="round"/><ellipse cx="-70" cy="-215" rx="70" ry="36" fill="#7FA650"/><ellipse cx="100" cy="-205" rx="64" ry="34" fill="#8DB45C"/><ellipse cx="10" cy="-240" rx="60" ry="30" fill="#7FA650"/>`);
}

export function termite(x, y, s = 1) {
  return g(x, y, s, `<path d="M-50 0 Q-50 -60 -20 -110 Q0 -140 20 -110 Q50 -60 50 0 Z" fill="#B5703C"/><path d="M-30 -40 h20 M10 -70 h16 M-10 -90 h14" stroke="#8A552B" stroke-width="5" stroke-linecap="round"/>`);
}

export function stall(x, y, s = 1, stripe = '#E5484D') {
  const stripes = Array.from({ length: 6 }, (_, i) => `<path d="M${-210 + i * 70} -260 h35 v50 q-17 22 -35 0 z" fill="${i % 2 ? '#fff' : stripe}"/>`).join('');
  return g(x, y, s, `<rect x="-200" y="-260" width="10" height="260" fill="#8A5A33"/><rect x="190" y="-260" width="10" height="260" fill="#8A5A33"/>${stripes}<rect x="-220" y="-90" width="440" height="90" rx="10" fill="#C8955A"/><rect x="-220" y="-100" width="440" height="20" rx="8" fill="#A87843"/>`);
}

export function rocketLeaf(x, y, s = 1, rot = 0) {
  return g(x, y, s, `<path d="M0 -150 C40 -110 44 -40 30 10 H-30 C-44 -40 -40 -110 0 -150Z" fill="#7BC47F"/><path d="M0 -150 V10" stroke="#3E8B48" stroke-width="5"/><path d="M0 -110 l22 18 M0 -80 l26 18 M0 -50 l28 18 M0 -110 l-22 18 M0 -80 l-26 18 M0 -50 l-28 18" stroke="#3E8B48" stroke-width="3"/><circle cx="0" cy="-70" r="18" fill="#FFD36E"/><circle cx="0" cy="-70" r="11" fill="#CFE6FA"/><path d="M-30 0 L-56 40 L-24 24 Z M30 0 L56 40 L24 24 Z" fill="#8A5A33"/><path d="M-16 14 Q0 70 16 14" fill="#FFB627"/>`, rot);
}

export function planet(x, y, s = 1, color = '#FFB627') {
  return g(x, y, s, `<circle r="50" fill="${color}"/><ellipse rx="86" ry="18" fill="none" stroke="#FFD36E" stroke-width="8" transform="rotate(-15)"/><circle cx="-14" cy="-12" r="10" fill="#fff" opacity="0.25"/>`);
}

export function telescope(x, y, s = 1) {
  return g(x, y, s, `<path d="M-40 0 L0 -70 L40 0" stroke="#5A6375" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="-70" y="-130" width="150" height="40" rx="14" fill="#5B3FA6" transform="rotate(-28 0 -100)"/><rect x="60" y="-160" width="34" height="50" rx="8" fill="#3D2A75" transform="rotate(-28 0 -100)"/>`);
}

export function balloon(x, y, s = 1) {
  return g(x, y, s, `<path d="M0 -260 C-120 -260 -130 -130 -60 -70 L-36 -40 H36 L60 -70 C130 -130 120 -260 0 -260Z" fill="#E5484D"/><path d="M0 -260 C-40 -230 -46 -120 -20 -40 H20 C46 -120 40 -230 0 -260Z" fill="#FFD36E"/><path d="M-36 -40 L-30 0 M36 -40 L30 0" stroke="#7A5232" stroke-width="4"/><rect x="-40" y="0" width="80" height="54" rx="10" fill="#C8955A"/><rect x="-40" y="0" width="80" height="12" rx="6" fill="#A87843"/>`);
}

export function chest(x, y, s = 1, open = false) {
  return g(x, y, s, `<rect x="-110" y="-110" width="220" height="110" rx="12" fill="#8A5A33"/><rect x="-110" y="-60" width="220" height="12" fill="#6C4627"/><rect x="-16" y="-80" width="32" height="40" rx="6" fill="#FFB627"/>${open ? `<path d="M-110 -110 L-90 -200 H90 L110 -110 Z" fill="#6C4627"/><path d="M-80 -110 Q0 -150 80 -110" fill="#FFD36E" opacity="0.6"/>` : `<path d="M-110 -110 Q0 -170 110 -110 Z" fill="#6C4627"/>`}<path d="M-70 -110 V0 M70 -110 V0" stroke="#FFB627" stroke-width="10"/>`);
}

export function map(x, y, s = 1, rot = 0) {
  return g(x, y, s, `<path d="M-90 -60 L-30 -70 L30 -55 L90 -65 L90 60 L30 70 L-30 55 L-90 65 Z" fill="#F1D9A6"/><path d="M-30 -70 L-30 55 M30 -55 L30 70" stroke="#D8BC86" stroke-width="3"/><path d="M-70 30 q30 -40 50 -10 t50 -20 t40 -30" stroke="#B8471F" stroke-width="5" stroke-dasharray="10 8" fill="none"/><path d="M50 -40 l20 20 M70 -40 l-20 20" stroke="#E5484D" stroke-width="7" stroke-linecap="round"/>`, rot);
}

export function boat(x, y, s = 1) {
  return g(x, y, s, `<path d="M-160 0 H160 L120 70 H-120 Z" fill="#8A5A33"/><rect x="-6" y="-230" width="12" height="230" fill="#6C4627"/><path d="M6 -220 L130 -40 H6 Z" fill="#fff"/><path d="M-6 -200 L-110 -50 H-6 Z" fill="#F4F1EA"/><path d="M6 -230 h50 l-12 14 l12 14 h-50 z" fill="#E5484D"/>`);
}

export function tin(x, y, s = 1, open = true) {
  return g(x, y, s, `<rect x="-60" y="-50" width="120" height="70" rx="10" fill="#9AA3B2"/><rect x="-60" y="-50" width="120" height="14" rx="6" fill="#C9CED6"/>${open ? `<rect x="-50" y="-70" width="34" height="44" rx="4" fill="#fff" transform="rotate(-12 -33 -48)"/><rect x="-10" y="-76" width="34" height="44" rx="4" fill="#fff" transform="rotate(8 7 -54)"/><rect x="-46" y="-64" width="24" height="22" fill="#9FD3F0" transform="rotate(-12 -33 -48)"/><rect x="-6" y="-70" width="24" height="22" fill="#F7C9A0" transform="rotate(8 7 -54)"/>` : ''}`);
}

export function heart(x, y, s = 1, color = '#E5484D') {
  return g(x, y, s, `<path d="M0 30 C-70 -20 -40 -80 0 -42 C40 -80 70 -20 0 30Z" fill="${color}"/>`);
}

export function strawberry(x, y, s = 1) {
  return g(x, y, s, `<path d="M0 34 C-30 10 -26 -18 0 -16 C26 -18 30 10 0 34Z" fill="#E5484D"/><path d="M-14 -18 L0 -30 L14 -18 L6 -12 L0 -20 L-6 -12 Z" fill="#3E9A4E"/><circle cx="-8" cy="0" r="2" fill="#FFD36E"/><circle cx="6" cy="8" r="2" fill="#FFD36E"/><circle cx="-2" cy="16" r="2" fill="#FFD36E"/>`);
}

export function plantBed(x, y, s = 1, berries = 3) {
  const leaves = [-90, -30, 30, 90].map((dx) => `<ellipse cx="${dx}" cy="-30" rx="34" ry="20" fill="#4FA35A"/><ellipse cx="${dx + 10}" cy="-48" rx="24" ry="14" fill="#5DB368"/>`).join('');
  const fruit = [-60, 10, 70].slice(0, berries).map((dx) => strawberry(dx, -10, 0.7)).join('');
  return g(x, y, s, `<rect x="-140" y="-10" width="280" height="40" rx="10" fill="#8A5A33"/>${leaves}${fruit}`);
}

export function footprints(x, y, s = 1) {
  return g(x, y, s, [0, 1, 2, 3].map((i) => `<g transform="translate(${i * 70} ${i % 2 ? 18 : 0})"><ellipse cx="0" cy="0" rx="12" ry="9" fill="#6C4627"/><circle cx="-9" cy="-14" r="4" fill="#6C4627"/><circle cx="0" cy="-17" r="4" fill="#6C4627"/><circle cx="9" cy="-14" r="4" fill="#6C4627"/></g>`).join(''));
}

export function web(x, y, s = 1) {
  return g(x, y, s, `<g stroke="#fff" stroke-width="3" fill="none" opacity="0.9">${[0, 45, 90, 135].map((a) => `<line x1="-90" y1="0" x2="90" y2="0" transform="rotate(${a})"/>`).join('')}<circle r="30"/><circle r="55"/><circle r="80"/></g>${sparkle(40, -40, 0.5, '#fff')}`);
}

export function flashlightBeam(x, y, rot = -20) {
  return g(x, y, 1, `<path d="M0 0 L420 -110 A40 120 0 0 1 420 130 Z" fill="#FFF3C4" opacity="0.35"/>`, rot);
}

export function nest(x, y, s = 1) {
  const chick = (dx) => `<g transform="translate(${dx} -40)"><circle r="20" fill="#FFD64D"/><circle cx="-6" cy="-4" r="3" fill="${INK}"/><circle cx="6" cy="-4" r="3" fill="${INK}"/><path d="M-6 4 L0 16 L6 4Z" fill="#FFB627"/></g>`;
  return g(x, y, s, `${chick(-34)}${chick(0)}${chick(34)}<path d="M-80 -30 Q0 30 80 -30 Q70 10 0 20 Q-70 10 -80 -30Z" fill="#8A5A33"/><path d="M-76 -26 Q0 6 76 -26" stroke="#C8955A" stroke-width="6" fill="none"/>`);
}

export function branch(x1, y1, x2, y2) {
  return `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 30} ${x2} ${y2}" stroke="#7A5232" stroke-width="20" fill="none" stroke-linecap="round"/><ellipse cx="${(x1 + x2) / 2 - 60}" cy="${Math.min(y1, y2) - 40}" rx="40" ry="20" fill="#4FA35A"/><ellipse cx="${x2 - 30}" cy="${y2 - 30}" rx="36" ry="18" fill="#5DB368"/>`;
}

export function pipe(x, y, s = 1) {
  return g(x, y, s, `<rect x="-200" y="-40" width="220" height="80" rx="8" fill="#9AA3B2"/><rect x="10" y="-52" width="40" height="104" rx="10" fill="#7D879B"/><path d="M50 -20 Q120 -20 140 80 Q150 160 120 220 L60 220 Q90 140 70 60 Q60 10 50 10Z" fill="#6E6A4A" opacity="0.85"/>`);
}

export function envelope(x, y, s = 1, rot = 0) {
  return g(x, y, s, `<rect x="-60" y="-40" width="120" height="80" rx="8" fill="#fff"/><path d="M-60 -36 L0 10 L60 -36" stroke="#CBD2DA" stroke-width="5" fill="none"/>${heart(36, 20, 0.18)}`, rot);
}

export function cityHall(x, y, s = 1) {
  const cols = [-100, -50, 0, 50, 100].map((dx) => `<rect x="${dx - 10}" y="-160" width="20" height="150" fill="#F4F1EA"/>`).join('');
  return g(x, y, s, `<rect x="-150" y="-10" width="300" height="20" fill="#C9CED6"/><rect x="-140" y="-170" width="280" height="160" fill="#E3E7EC"/>${cols}<path d="M-160 -170 L0 -250 L160 -170 Z" fill="#C9CED6"/><rect x="-24" y="-80" width="48" height="70" fill="#7A5232"/><circle cx="0" cy="-205" r="18" fill="#FFD36E"/>`);
}

export function fish(x, y, s = 1, color = '#FF8A3D', flip = false) {
  return g(x, y, s, `<ellipse rx="40" ry="24" fill="${color}"/><path d="M34 0 L66 -22 L66 22 Z" fill="${color}"/><circle cx="-18" cy="-6" r="6" fill="#fff"/><circle cx="-19" cy="-6" r="3" fill="${INK}"/><path d="M-30 8 q6 4 10 0" stroke="${INK}" stroke-width="2" fill="none"/>`, 0, flip);
}

export function bed(x, y, s = 1, blanket = '#5B3FA6') {
  return g(x, y, s, `<rect x="-200" y="-150" width="30" height="160" rx="10" fill="#8A5A33"/><rect x="170" y="-90" width="30" height="100" rx="10" fill="#8A5A33"/><rect x="-180" y="-80" width="360" height="60" rx="16" fill="#fff"/><rect x="-60" y="-96" width="250" height="80" rx="24" fill="${blanket}"/><rect x="-170" y="-100" width="100" height="40" rx="18" fill="#F4F1EA"/>`);
}

export function counter(x, y, w = 600) {
  return `<rect x="${x}" y="${y}" width="${w}" height="200" fill="#C8955A"/><rect x="${x - 10}" y="${y - 16}" width="${w + 20}" height="22" rx="6" fill="#E3E7EC"/><rect x="${x + 30}" y="${y + 40}" width="${w / 2 - 50}" height="130" rx="10" fill="#A87843"/><rect x="${x + w / 2 + 20}" y="${y + 40}" width="${w / 2 - 50}" height="130" rx="10" fill="#A87843"/>`;
}

export function lightbulb(x, y, s = 1) {
  return g(x, y, s, `<circle r="90" fill="#FFF3C4" opacity="0.35"/><path d="M0 -60 C-40 -60 -50 -20 -34 6 C-24 22 -20 30 -20 44 H20 C20 30 24 22 34 6 C50 -20 40 -60 0 -60Z" fill="#FFD36E"/><rect x="-20" y="44" width="40" height="24" rx="6" fill="#9AA3B2"/><path d="M-10 30 V0 L0 10 L10 0 V30" stroke="#C99206" stroke-width="4" fill="none"/>`);
}

export function alarmClock(x, y, s = 1) {
  return g(x, y, s, `<circle cx="-46" cy="-56" r="20" fill="#E5484D"/><circle cx="46" cy="-56" r="20" fill="#E5484D"/><circle r="64" fill="#E5484D"/><circle r="50" fill="#fff"/><path d="M0 0 V-34 M0 0 L22 12" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-40 60 L-50 76 M40 60 L50 76" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`);
}

export function robot(x, y, s = 1, { book = false } = {}) {
  return g(x, y, s, `<ellipse cx="0" cy="6" rx="70" ry="10" fill="#000" opacity="0.12"/><rect x="-50" y="-150" width="100" height="120" rx="20" fill="#9AA3B2"/><rect x="-36" y="-30" width="20" height="30" rx="6" fill="#7D879B"/><rect x="16" y="-30" width="20" height="30" rx="6" fill="#7D879B"/><rect x="-44" y="-240" width="88" height="80" rx="20" fill="#C9CED6"/><circle cx="-18" cy="-202" r="12" fill="#9FD3F0"/><circle cx="18" cy="-202" r="12" fill="#9FD3F0"/><path d="M-14 -178 q14 10 28 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><line x1="0" y1="-240" x2="0" y2="-270" stroke="#7D879B" stroke-width="5"/><circle cx="0" cy="-276" r="9" fill="#E5484D"/><circle cx="0" cy="-90" r="14" fill="#FFD36E"/>${book ? `<rect x="-70" y="-110" width="140" height="70" rx="8" fill="#E5484D"/><path d="M0 -110 V-40" stroke="#fff" stroke-width="4"/>` : ''}`);
}

export function puddle(x, y, w = 260) {
  return `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${w / 8}" fill="#4FA3C7" opacity="0.8"/><path d="M${x - w / 4} ${y - 4} q20 -10 40 0" stroke="#fff" stroke-width="4" fill="none" opacity="0.7"/>`;
}

export function bubbles(x, y) {
  return `<circle cx="${x}" cy="${y}" r="10" fill="#fff" opacity="0.6"/><circle cx="${x + 24}" cy="${y - 30}" r="7" fill="#fff" opacity="0.6"/><circle cx="${x - 10}" cy="${y - 54}" r="5" fill="#fff" opacity="0.6"/>`;
}

export function splash(x, y, s = 1) {
  return g(x, y, s, `<path d="M-90 0 Q-70 -80 -40 -20 Q-20 -120 0 -30 Q20 -120 40 -20 Q70 -80 90 0 Z" fill="#9FD3F0"/><circle cx="-80" cy="-90" r="10" fill="#9FD3F0"/><circle cx="70" cy="-110" r="12" fill="#9FD3F0"/><circle cx="10" cy="-140" r="8" fill="#9FD3F0"/>`);
}

export function photo(x, y, s = 1, rot = 0, tint = '#9FD3F0') {
  return g(x, y, s, `<rect x="-50" y="-60" width="100" height="120" rx="6" fill="#fff"/><rect x="-40" y="-50" width="80" height="80" fill="${tint}"/><circle cx="0" cy="-20" r="14" fill="#F7C9A0"/><rect x="-18" y="-6" width="36" height="30" rx="10" fill="#E5484D"/>`, rot);
}

export function bread(x, y, s = 1) {
  return g(x, y, s, `<ellipse rx="34" ry="26" fill="#F2C46D"/><ellipse cx="-8" cy="-8" rx="12" ry="7" fill="#FBE3A6"/><circle cx="12" cy="6" r="4" fill="#E0A94F"/>`);
}

export function speechNotes(x, y, s = 1, color = '#5B3FA6') {
  return g(x, y, s, `<ellipse cx="0" cy="40" rx="14" ry="10" fill="${color}" transform="rotate(-20 0 40)"/><rect x="10" y="-8" width="5" height="48" fill="${color}"/><path d="M15 -8 Q36 0 32 20" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>`);
}

/* ===================== Pessoas ===================== */

const SKIN = { clara: '#F7C9A0', media: '#D99A6C', morena: '#B9784A', escura: '#8D5524' };

/**
 * Pessoa estilizada com os pés em (x, y).
 * opts: skin, hair (cor), style: 'short'|'long'|'bun'|'curly'|'pigtails'|'gray-bun'|'bald',
 * shirt, pants, kid, arms: 'down'|'up'|'hold'|'wave'|'point', mouth: 'smile'|'open'|'laugh',
 * hat: 'pirate'|'cap'|'chef'|null, glasses, skirt, hold (svg na mão direita).
 */
export function person(x, y, s = 1, o = {}) {
  const {
    skin = SKIN.media, hair = '#2B1A10', style = 'short', shirt = '#3F7FD1', pants = '#3A4458', kid = true,
    arms = 'down', mouth = 'smile', hat = null, glasses = false, skirt = false, hold = '', eyes = 'open',
  } = o;
  const k = kid ? 0.78 : 1;
  const legH = 110 * k;
  const bodyH = 130 * k;
  const top = -(legH + bodyH);
  const headY = top - 44;
  const R = 46;
  const legs = skirt
    ? `<path d="M-50 ${-legH - 6} H50 L62 ${-legH + 50} H-62 Z" fill="${shirt}"/><rect x="-26" y="${-legH + 40}" width="18" height="${legH - 40}" rx="8" fill="${skin}"/><rect x="8" y="${-legH + 40}" width="18" height="${legH - 40}" rx="8" fill="${skin}"/>`
    : `<rect x="-32" y="${-legH}" width="26" height="${legH}" rx="12" fill="${pants}"/><rect x="6" y="${-legH}" width="26" height="${legH}" rx="12" fill="${pants}"/>`;
  const shoes = `<ellipse cx="-20" cy="0" rx="22" ry="9" fill="${INK}"/><ellipse cx="20" cy="0" rx="22" ry="9" fill="${INK}"/>`;
  const body = `<path d="M-46 ${top + 10} Q0 ${top - 8} 46 ${top + 10} L50 ${-legH + 4} H-50 Z" fill="${shirt}"/>`;
  const sh = top + 20;
  const armPath = {
    down: [`M-44 ${sh} Q-62 ${sh + 50} -54 ${sh + 100}`, `M44 ${sh} Q62 ${sh + 50} 54 ${sh + 100}`, [-54, sh + 100], [54, sh + 100]],
    up: [`M-44 ${sh} Q-80 ${sh - 30} -84 ${sh - 90}`, `M44 ${sh} Q80 ${sh - 30} 84 ${sh - 90}`, [-84, sh - 90], [84, sh - 90]],
    wave: [`M-44 ${sh} Q-62 ${sh + 50} -54 ${sh + 100}`, `M44 ${sh} Q80 ${sh - 30} 84 ${sh - 90}`, [-54, sh + 100], [84, sh - 90]],
    hold: [`M-44 ${sh} Q-62 ${sh + 50} -54 ${sh + 100}`, `M44 ${sh} Q90 ${sh + 30} 96 ${sh + 20}`, [-54, sh + 100], [96, sh + 20]],
    point: [`M-44 ${sh} Q-62 ${sh + 50} -54 ${sh + 100}`, `M44 ${sh} Q100 ${sh - 10} 120 ${sh - 30}`, [-54, sh + 100], [120, sh - 30]],
    both: [`M-44 ${sh} Q-70 ${sh + 30} -40 ${sh + 60}`, `M44 ${sh} Q70 ${sh + 30} 40 ${sh + 60}`, [-40, sh + 60], [40, sh + 60]],
  }[arms];
  const armsEl = `<path d="${armPath[0]}" stroke="${shirt}" stroke-width="24" stroke-linecap="round" fill="none"/><path d="${armPath[1]}" stroke="${shirt}" stroke-width="24" stroke-linecap="round" fill="none"/><circle cx="${armPath[2][0]}" cy="${armPath[2][1]}" r="13" fill="${skin}"/><circle cx="${armPath[3][0]}" cy="${armPath[3][1]}" r="13" fill="${skin}"/>`;
  const holdEl = hold ? `<g transform="translate(${armPath[3][0]} ${armPath[3][1]})">${hold}</g>` : '';
  const neck = `<rect x="-12" y="${top - 12}" width="24" height="20" fill="${skin}"/>`;
  const hairBack = {
    long: `<path d="M${-R - 6} ${headY} Q${-R - 10} ${headY + 80} ${-R + 10} ${headY + 90} H${R - 10} Q${R + 10} ${headY + 80} ${R + 6} ${headY}Z" fill="${hair}"/>`,
    pigtails: `<circle cx="${-R - 14}" cy="${headY + 10}" r="22" fill="${hair}"/><circle cx="${R + 14}" cy="${headY + 10}" r="22" fill="${hair}"/>`,
    bun: '', short: '', curly: '', 'gray-bun': '', bald: '',
  }[style] ?? '';
  const hairFront = {
    short: `<path d="M${-R} ${headY - 4} Q${-R} ${headY - R - 8} 0 ${headY - R - 6} Q${R} ${headY - R - 8} ${R} ${headY - 4} Q${R - 10} ${headY - 30} 10 ${headY - 26} Q-20 ${headY - 34} ${-R} ${headY - 4}Z" fill="${hair}"/>`,
    long: `<path d="M${-R} ${headY} Q${-R} ${headY - R - 8} 0 ${headY - R - 6} Q${R} ${headY - R - 8} ${R} ${headY} Q${R - 6} ${headY - 30} 0 ${headY - 30} Q${-R + 6} ${headY - 30} ${-R} ${headY}Z" fill="${hair}"/>`,
    pigtails: `<path d="M${-R} ${headY} Q${-R} ${headY - R - 8} 0 ${headY - R - 6} Q${R} ${headY - R - 8} ${R} ${headY} Q${R - 6} ${headY - 30} 0 ${headY - 30} Q${-R + 6} ${headY - 30} ${-R} ${headY}Z" fill="${hair}"/>`,
    bun: `<circle cx="0" cy="${headY - R - 14}" r="22" fill="${hair}"/><path d="M${-R} ${headY} Q${-R} ${headY - R - 8} 0 ${headY - R - 6} Q${R} ${headY - R - 8} ${R} ${headY} Q${R - 6} ${headY - 30} 0 ${headY - 30} Q${-R + 6} ${headY - 30} ${-R} ${headY}Z" fill="${hair}"/>`,
    'gray-bun': `<circle cx="0" cy="${headY - R - 14}" r="22" fill="#D5DAE1"/><path d="M${-R} ${headY} Q${-R} ${headY - R - 8} 0 ${headY - R - 6} Q${R} ${headY - R - 8} ${R} ${headY} Q${R - 6} ${headY - 30} 0 ${headY - 30} Q${-R + 6} ${headY - 30} ${-R} ${headY}Z" fill="#D5DAE1"/>`,
    curly: [-36, -18, 0, 18, 36].map((dx, i) => `<circle cx="${dx}" cy="${headY - R + (i % 2 ? -4 : 6)}" r="20" fill="${hair}"/>`).join('') + `<circle cx="${-R + 2}" cy="${headY - 14}" r="16" fill="${hair}"/><circle cx="${R - 2}" cy="${headY - 14}" r="16" fill="${hair}"/>`,
    bald: '',
  }[style] ?? '';
  const eyesEl =
    eyes === 'happy'
      ? `<path d="M-24 ${headY + 2} q8 -10 16 0 M8 ${headY + 2} q8 -10 16 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`
      : eyes === 'closed'
        ? `<path d="M-24 ${headY + 2} q8 6 16 0 M8 ${headY + 2} q8 6 16 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`
        : `<circle cx="-16" cy="${headY}" r="5" fill="${INK}"/><circle cx="16" cy="${headY}" r="5" fill="${INK}"/><circle cx="-14" cy="${headY - 2}" r="1.6" fill="#fff"/><circle cx="18" cy="${headY - 2}" r="1.6" fill="#fff"/>`;
  const mouthEl =
    mouth === 'open'
      ? `<ellipse cx="0" cy="${headY + 22}" rx="9" ry="8" fill="${INK}"/>`
      : mouth === 'laugh'
        ? `<path d="M-14 ${headY + 16} Q0 ${headY + 36} 14 ${headY + 16}Z" fill="${INK}"/><path d="M-7 ${headY + 24} Q0 ${headY + 30} 7 ${headY + 24}Z" fill="${BLUSH}"/>`
        : `<path d="M-12 ${headY + 18} Q0 ${headY + 28} 12 ${headY + 18}" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const glassesEl = glasses
    ? `<circle cx="-16" cy="${headY}" r="12" fill="none" stroke="${INK}" stroke-width="3"/><circle cx="16" cy="${headY}" r="12" fill="none" stroke="${INK}" stroke-width="3"/><path d="M-4 ${headY} H4" stroke="${INK}" stroke-width="3"/>`
    : '';
  const hatEl = {
    pirate: `<path d="M-70 ${headY - 30} Q0 ${headY - 70} 70 ${headY - 30} Q40 ${headY - 110} 0 ${headY - 100} Q-40 ${headY - 110} -70 ${headY - 30}Z" fill="#1C2333"/><circle cx="0" cy="${headY - 66}" r="10" fill="#fff"/><path d="M-8 ${headY - 56} l16 -10 M8 ${headY - 56} l-16 -10" stroke="#fff" stroke-width="3"/>`,
    cap: `<path d="M${-R} ${headY - 18} Q0 ${headY - 76} ${R} ${headY - 18}Z" fill="#E5484D"/><rect x="0" y="${headY - 24}" width="66" height="12" rx="6" fill="#E5484D"/>`,
    chef: `<rect x="-36" y="${headY - 70}" width="72" height="34" fill="#fff"/><circle cx="-22" cy="${headY - 76}" r="22" fill="#fff"/><circle cx="0" cy="${headY - 88}" r="24" fill="#fff"/><circle cx="22" cy="${headY - 76}" r="22" fill="#fff"/>`,
  }[hat] ?? '';
  const head = `<circle cx="0" cy="${headY}" r="${R}" fill="${skin}"/><circle cx="${-R + 2}" cy="${headY + 4}" r="9" fill="${skin}"/><circle cx="${R - 2}" cy="${headY + 4}" r="9" fill="${skin}"/><ellipse cx="-26" cy="${headY + 14}" rx="8" ry="5" fill="${BLUSH}" opacity="0.45"/><ellipse cx="26" cy="${headY + 14}" rx="8" ry="5" fill="${BLUSH}" opacity="0.45"/>`;
  return g(
    x,
    y,
    s,
    `<ellipse cx="0" cy="4" rx="60" ry="10" fill="#000" opacity="0.12"/>${hairBack}${legs}${shoes}${body}${armsEl}${neck}${head}${hairFront}${eyesEl}${mouthEl}${glassesEl}${hatEl}${holdEl}`,
  );
}
export { SKIN };

/* ===================== Bichos ===================== */

const eye = (x, y, r = 8) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.35}" fill="#fff"/>`;

export function frog(x, y, s = 1, { mouth = 'smile', helmet = false, eyes = 'open' } = {}) {
  const eyesEl =
    eyes === 'happy'
      ? `<path d="M-54 -122 q14 -14 28 0 M26 -122 q14 -14 28 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`
      : `${eye(-40, -122, 10)}${eye(40, -122, 10)}`;
  const m = mouth === 'open' ? `<ellipse cx="0" cy="-62" rx="26" ry="16" fill="${INK}"/><ellipse cx="0" cy="-56" rx="14" ry="6" fill="${BLUSH}"/>` : `<path d="M-50 -70 Q0 -36 50 -70" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  return g(x, y, s, `<ellipse cx="0" cy="6" rx="100" ry="12" fill="#000" opacity="0.12"/><ellipse cx="-62" cy="-10" rx="40" ry="22" fill="#4E9A55"/><ellipse cx="62" cy="-10" rx="40" ry="22" fill="#4E9A55"/><ellipse cx="0" cy="-70" rx="86" ry="70" fill="#7BC47F"/><ellipse cx="0" cy="-40" rx="56" ry="36" fill="#CDEBCF"/><circle cx="-40" cy="-122" r="26" fill="#7BC47F"/><circle cx="40" cy="-122" r="26" fill="#7BC47F"/><circle cx="-40" cy="-122" r="17" fill="#fff"/><circle cx="40" cy="-122" r="17" fill="#fff"/>${eyesEl}${m}<ellipse cx="-62" cy="-74" rx="10" ry="6" fill="${BLUSH}" opacity="0.5"/><ellipse cx="62" cy="-74" rx="10" ry="6" fill="${BLUSH}" opacity="0.5"/>${helmet ? `<path d="M-96 -80 A96 96 0 0 1 96 -80" fill="#CFE6FA" opacity="0.45" stroke="#fff" stroke-width="5"/>` : ''}`);
}

export function bird(x, y, s = 1, { body = '#7A5232', belly = '#FFD64D', wing = '#5C3D22', beak = '#FFB627', mask = false, flying = false, open = false, flip = false, legs = false, crest = '' } = {}) {
  const wingEl = flying
    ? `<path d="M-10 -30 Q-60 -110 -100 -70 Q-60 -50 -20 -10Z" fill="${wing}"/><path d="M10 -30 Q60 -110 100 -70 Q60 -50 20 -10Z" fill="${wing}"/>`
    : `<ellipse cx="18" cy="-4" rx="30" ry="22" fill="${wing}"/>`;
  return g(x, y, s, `${legs ? `<path d="M-10 30 V120 M14 30 V120" stroke="#E0A94F" stroke-width="6"/>` : `<path d="M-8 34 v14 M10 34 v14" stroke="#E0A94F" stroke-width="5"/>`}<ellipse cx="0" cy="0" rx="50" ry="44" fill="${body}"/><ellipse cx="-6" cy="10" rx="34" ry="28" fill="${belly}"/>${wingEl}<path d="M40 10 L74 22 L44 30Z" fill="${wing}"/><circle cx="-22" cy="-36" r="30" fill="${body}"/>${crest}${mask ? `<rect x="-52" y="-50" width="60" height="12" rx="6" fill="#fff"/>` : ''}${eye(-30, -40, 6)}${open ? `<path d="M-50 -30 L-80 -38 L-52 -22Z M-50 -26 L-78 -16 L-52 -18Z" fill="${beak}"/>` : `<path d="M-50 -34 L-76 -26 L-50 -20Z" fill="${beak}"/>`}`, 0, flip);
}

export function cow(x, y, s = 1, { sleepy = false } = {}) {
  return g(x, y, s, `<ellipse cx="0" cy="6" rx="140" ry="12" fill="#000" opacity="0.12"/><rect x="-110" y="-60" width="22" height="66" rx="10" fill="#F4F1EA"/><rect x="-60" y="-60" width="22" height="66" rx="10" fill="#F4F1EA"/><rect x="40" y="-60" width="22" height="66" rx="10" fill="#F4F1EA"/><rect x="90" y="-60" width="22" height="66" rx="10" fill="#F4F1EA"/><rect x="-130" y="-150" width="260" height="110" rx="50" fill="#F4F1EA"/><ellipse cx="-50" cy="-110" rx="34" ry="24" fill="#3A2414"/><ellipse cx="60" cy="-80" rx="26" ry="20" fill="#3A2414"/><path d="M130 -110 q30 10 24 50" stroke="#F4F1EA" stroke-width="8" fill="none"/><g transform="translate(-150 -150)"><ellipse cx="-18" cy="-36" rx="22" ry="10" fill="#F4F1EA" transform="rotate(-30 -18 -36)"/><ellipse cx="62" cy="-36" rx="22" ry="10" fill="#F4F1EA" transform="rotate(30 62 -36)"/><path d="M0 -40 l-10 -24 M44 -40 l10 -24" stroke="#E0C08A" stroke-width="8" stroke-linecap="round"/><rect x="-10" y="-50" width="74" height="90" rx="34" fill="#F4F1EA"/><ellipse cx="22" cy="24" rx="38" ry="24" fill="#F7B5BD"/><circle cx="10" cy="24" r="5" fill="#B0566A"/><circle cx="34" cy="24" r="5" fill="#B0566A"/>${sleepy ? `<path d="M2 -14 q8 6 16 0 M28 -14 q8 6 16 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>` : `${eye(10, -14, 6)}${eye(36, -14, 6)}`}</g>`);
}

export function chicken(x, y, s = 1, { sleepy = false } = {}) {
  return g(x, y, s, `<ellipse cx="0" cy="6" rx="60" ry="9" fill="#000" opacity="0.12"/><path d="M-8 10 v-26 M12 10 v-26" stroke="#FFB627" stroke-width="6"/><ellipse cx="0" cy="-50" rx="58" ry="46" fill="#fff"/><path d="M50 -70 q30 -30 26 10 q-10 10 -26 6Z" fill="#fff"/><ellipse cx="14" cy="-46" rx="28" ry="18" fill="#F4F1EA"/><circle cx="-36" cy="-96" r="28" fill="#fff"/><path d="M-50 -122 q6 -18 14 -4 q6 -16 14 0 q8 -14 12 4Z" fill="#E5484D"/><path d="M-62 -94 L-82 -88 L-62 -82Z" fill="#FFB627"/><ellipse cx="-58" cy="-74" rx="6" ry="9" fill="#E5484D"/>${sleepy ? `<path d="M-48 -100 q6 5 12 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>` : eye(-42, -100, 5)}`);
}

export function pig(x, y, s = 1, { sleepy = false } = {}) {
  return g(x, y, s, `<ellipse cx="0" cy="6" rx="110" ry="11" fill="#000" opacity="0.12"/><rect x="-80" y="-40" width="20" height="44" rx="8" fill="#F29BA8"/><rect x="60" y="-40" width="20" height="44" rx="8" fill="#F29BA8"/><ellipse cx="0" cy="-70" rx="110" ry="64" fill="#F7B5BD"/><path d="M106 -84 q24 -10 14 14 q-6 10 6 16" stroke="#F29BA8" stroke-width="6" fill="none"/><circle cx="-90" cy="-90" r="52" fill="#F7B5BD"/><path d="M-120 -134 l-14 -26 l30 10Z M-60 -134 l14 -26 l-30 10Z" fill="#F29BA8"/><ellipse cx="-104" cy="-74" rx="26" ry="18" fill="#F29BA8"/><circle cx="-112" cy="-74" r="5" fill="#B0566A"/><circle cx="-96" cy="-74" r="5" fill="#B0566A"/>${sleepy ? `<path d="M-120 -104 q8 6 16 0 M-84 -104 q8 6 16 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>` : `${eye(-112, -104, 5)}${eye(-76, -104, 5)}`}`);
}

export function wolf(x, y, s = 1, { flip = false } = {}) {
  // lobo-guará: pernas longas e pretas, pelo laranja, orelhas grandes, crina escura
  return g(x, y, s, `<ellipse cx="0" cy="6" rx="130" ry="10" fill="#000" opacity="0.12"/><rect x="-90" y="-130" width="14" height="134" rx="6" fill="#2B1A10"/><rect x="-56" y="-130" width="14" height="134" rx="6" fill="#2B1A10"/><rect x="50" y="-130" width="14" height="134" rx="6" fill="#2B1A10"/><rect x="84" y="-130" width="14" height="134" rx="6" fill="#2B1A10"/><ellipse cx="0" cy="-150" rx="120" ry="46" fill="#D9762B"/><path d="M-60 -194 Q0 -206 60 -192 L60 -170 Q0 -176 -60 -170Z" fill="#2B1A10"/><path d="M116 -160 q50 -10 60 30 q-30 -4 -54 -14Z" fill="#D9762B"/><path d="M168 -136 q8 6 4 14" stroke="#fff" stroke-width="10" stroke-linecap="round"/><g transform="translate(-130 -190)"><path d="M-20 -40 L-10 -110 L20 -50Z M30 -50 L54 -110 L60 -36Z" fill="#D9762B"/><path d="M-8 -54 L-6 -94 L12 -54Z M38 -52 L52 -94 L54 -48Z" fill="#2B1A10"/><ellipse cx="20" cy="-20" rx="44" ry="38" fill="#D9762B"/><path d="M-20 -10 L-70 6 Q-74 18 -60 22 L-14 14Z" fill="#D9762B"/><path d="M-60 22 Q-40 30 -14 14 L-20 0Z" fill="#fff"/><circle cx="-68" cy="10" r="7" fill="${INK}"/>${eye(4, -30, 6)}</g>`, 0, flip);
}

export function anteater(x, y, s = 1) {
  return g(x, y, s, `<ellipse cx="0" cy="6" rx="170" ry="11" fill="#000" opacity="0.12"/><path d="M90 -80 Q210 -200 200 -40 Q160 -10 90 -40Z" fill="#7D6E5D"/><path d="M110 -70 Q190 -160 190 -50" stroke="#5E5244" stroke-width="10" fill="none"/><rect x="-80" y="-60" width="26" height="64" rx="10" fill="#5E5244"/><rect x="50" y="-60" width="26" height="64" rx="10" fill="#5E5244"/><ellipse cx="0" cy="-90" rx="120" ry="58" fill="#9C8B78"/><path d="M-100 -110 L90 -50 L80 -30 L-110 -86Z" fill="#2B1A10"/><path d="M-90 -104 L80 -52" stroke="#fff" stroke-width="8"/><path d="M-110 -110 Q-180 -96 -250 -70 Q-250 -58 -240 -56 Q-170 -70 -104 -76Z" fill="#9C8B78"/><path d="M-250 -66 q-14 6 -28 22" stroke="${BLUSH}" stroke-width="5" fill="none" stroke-linecap="round"/>${eye(-150, -96, 5)}<ellipse cx="-122" cy="-114" rx="10" ry="8" fill="#7D6E5D"/>`);
}

export function ant(x, y, s = 1, rot = 0) {
  return g(x, y, s, `<circle cx="-14" cy="0" r="7" fill="${INK}"/><circle cx="0" cy="0" r="6" fill="${INK}"/><ellipse cx="16" cy="0" rx="10" ry="8" fill="${INK}"/><path d="M-4 0 l-6 10 M2 0 l0 11 M8 0 l6 10 M-18 -4 l-6 -8" stroke="${INK}" stroke-width="2" fill="none"/>`, rot);
}

export { sparkle, cloud, sun };
