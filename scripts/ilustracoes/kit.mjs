/**
 * Kit de ilustração vetorial do Folheia: cenário, Cacá e objetos em SVG.
 * Estilo: plano (flat), formas arredondadas, sem contorno preto, cores da marca.
 * Usado pelos scripts de cada livro para gerar public/ilustracoes/<livro>/<página>.svg (1200×800, 3:2).
 */
export const W = 1200;
export const H = 800;

const C = {
  head: '#B97C45', headLight: '#C9925E', ear: '#8A552B', earInner: '#6E4120', muzzle: '#8F5A2F',
  nose: '#3A2414', cheek: '#F2A3A0', belly: '#D2A577', paw: '#8A552B', sprout: '#7BC47F', sproutDark: '#4E9A55',
};

export const BIN = {
  azul: { main: '#3F7FD1', dark: '#2F63A8', light: '#7FA9E4' },
  vermelha: { main: '#D9483B', dark: '#B0382E', light: '#EC8379' },
  verde: { main: '#3E9A4E', dark: '#2F7A3C', light: '#78C186' },
  amarela: { main: '#F2B705', dark: '#C99206', light: '#FFD64D' },
  marrom: { main: '#8A5A33', dark: '#6C4627', light: '#B98A5F' },
};

export function svg(content, { bg = '#BFE3F2' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${bg}"/>${content}</svg>\n`;
}

const g = (x, y, s, inner, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${inner}</g>`;

/* ---------- Cenário ---------- */
export function sun(x = 1040, y = 120, r = 70) {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return `<line x1="${x + Math.cos(a) * (r + 18)}" y1="${y + Math.sin(a) * (r + 18)}" x2="${x + Math.cos(a) * (r + 40)}" y2="${y + Math.sin(a) * (r + 40)}" stroke="#FFD36E" stroke-width="10" stroke-linecap="round"/>`;
  }).join('');
  return `${rays}<circle cx="${x}" cy="${y}" r="${r}" fill="#FFD36E"/><circle cx="${x}" cy="${y}" r="${r - 14}" fill="#FFE08F"/>`;
}

export function cloud(x, y, s = 1) {
  return g(x, y, s, `<ellipse cx="0" cy="0" rx="70" ry="38" fill="#fff"/><ellipse cx="55" cy="-22" rx="55" ry="44" fill="#fff"/><ellipse cx="115" cy="2" rx="60" ry="34" fill="#fff"/><rect x="-40" y="0" width="190" height="34" rx="17" fill="#fff"/>`);
}

export function tree(x, y, s = 1, tone = 0) {
  const leaf = ['#3E8B48', '#4FA35A', '#5DB368'][tone];
  return g(x, y, s, `<rect x="-14" y="-10" width="28" height="140" rx="12" fill="#7A5232"/><path d="M-6 30 Q-40 0 -48 -20" stroke="#7A5232" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="0" cy="-80" r="95" fill="${leaf}"/><circle cx="-70" cy="-30" r="62" fill="${leaf}"/><circle cx="70" cy="-35" r="66" fill="${leaf}"/><circle cx="-25" cy="-120" r="40" fill="#fff" opacity="0.08"/>`);
}

export function bush(x, y, s = 1) {
  return g(x, y, s, `<circle cx="0" cy="0" r="40" fill="#4FA35A"/><circle cx="45" cy="5" r="34" fill="#5DB368"/><circle cx="-42" cy="8" r="30" fill="#5DB368"/>`);
}

export function flower(x, y, color = '#FF8FA3', s = 1) {
  const petals = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 2 * Math.PI) / 5;
    return `<circle cx="${Math.cos(a) * 11}" cy="${Math.sin(a) * 11}" r="9" fill="${color}"/>`;
  }).join('');
  return g(x, y, s, `<path d="M0 0 V46" stroke="#3E8B48" stroke-width="5"/><ellipse cx="9" cy="30" rx="10" ry="5" fill="#4FA35A" transform="rotate(-30 9 30)"/>${petals}<circle cx="0" cy="0" r="7" fill="#FFD36E"/>`);
}

export function park({ hills = true, path = true, trees = true } = {}) {
  return [
    sun(),
    cloud(140, 130, 1),
    cloud(560, 90, 0.8),
    cloud(820, 200, 0.6),
    hills ? `<path d="M0 520 Q200 420 420 500 Q640 420 860 490 Q1040 440 1200 480 V800 H0 Z" fill="#9ED49F"/>` : '',
    trees ? tree(110, 470, 1, 0) + tree(1110, 450, 0.9, 1) : '',
    `<path d="M0 560 Q600 520 1200 560 V800 H0 Z" fill="#7BC47F"/>`,
    path ? `<path d="M380 800 Q560 640 600 560 L700 560 Q700 660 900 800 Z" fill="#E8D3B0" opacity="0.9"/>` : '',
  ].join('');
}

export function grassTufts(xs) {
  return xs.map((x) => `<path d="M${x} 790 l8 -26 l6 26 l8 -20 l6 20" stroke="#5DB368" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
}

export function sparkle(x, y, s = 1, color = '#FFF6D5') {
  return g(x, y, s, `<path d="M0 -22 C3 -6 6 -3 22 0 C6 3 3 6 0 22 C-3 6 -6 3 -22 0 C-6 -3 -3 -6 0 -22Z" fill="${color}"/>`);
}

export function note(x, y, s = 1, color = '#5B3FA6', rot = 0) {
  return g(x, y, s, `<ellipse cx="0" cy="40" rx="16" ry="12" fill="${color}" transform="rotate(-20 0 40)"/><rect x="12" y="-10" width="6" height="52" fill="${color}"/><path d="M18 -10 Q40 0 36 22" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>`, rot);
}

/* ---------- Cacá ---------- */
function cacaHead({ mouth = 'smile', eyes = 'open' } = {}) {
  const eyeEl =
    eyes === 'happy'
      ? `<path d="M64 98 Q73 88 82 98" stroke="${C.nose}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M118 98 Q127 88 136 98" stroke="${C.nose}" stroke-width="5" fill="none" stroke-linecap="round"/>`
      : `<circle cx="73" cy="98" r="7.5" fill="${C.nose}"/><circle cx="127" cy="98" r="7.5" fill="${C.nose}"/><circle cx="75.5" cy="95.5" r="2.6" fill="#fff"/><circle cx="129.5" cy="95.5" r="2.6" fill="#fff"/>`;
  const mouthEl =
    mouth === 'open'
      ? `<path d="M100 136 L100 146" stroke="${C.nose}" stroke-width="3" stroke-linecap="round"/><ellipse cx="100" cy="156" rx="11" ry="9" fill="${C.nose}"/><ellipse cx="100" cy="160" rx="6" ry="4" fill="#E86F7E"/>`
      : mouth === 'laugh'
        ? `<path d="M100 136 L100 146" stroke="${C.nose}" stroke-width="3" stroke-linecap="round"/><path d="M84 148 Q100 172 116 148 Z" fill="${C.nose}"/><path d="M92 158 Q100 166 108 158 Z" fill="#E86F7E"/>`
        : `<path d="M90 152 Q95 158 100 152 Q105 158 110 152" stroke="${C.nose}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M100 136 L100 152" stroke="${C.nose}" stroke-width="3" stroke-linecap="round"/>`;
  return `
<path d="M100 44 C100 34 101 26 104 18" stroke="${C.sproutDark}" stroke-width="4" stroke-linecap="round" fill="none"/>
<path d="M103 22 C92 8 74 10 70 16 C78 26 94 28 103 22 Z" fill="${C.sprout}"/>
<path d="M104 20 C114 4 134 4 138 10 C130 22 114 26 104 20 Z" fill="${C.sprout}"/>
<circle cx="54" cy="56" r="12" fill="${C.ear}"/><circle cx="146" cy="56" r="12" fill="${C.ear}"/>
<circle cx="55" cy="58" r="6" fill="${C.earInner}"/><circle cx="145" cy="58" r="6" fill="${C.earInner}"/>
<rect x="38" y="40" width="124" height="140" rx="58" fill="${C.head}"/>
<ellipse cx="100" cy="66" rx="34" ry="12" fill="${C.headLight}" opacity="0.35"/>
${eyeEl}
<ellipse cx="46" cy="112" rx="9" ry="6" fill="${C.cheek}" opacity="0.75"/><ellipse cx="154" cy="112" rx="9" ry="6" fill="${C.cheek}" opacity="0.75"/>
<rect x="50" y="110" width="100" height="62" rx="26" fill="${C.muzzle}"/>
<rect x="74" y="118" width="52" height="18" rx="9" fill="${C.nose}"/>
<ellipse cx="86" cy="124" rx="5" ry="2.4" fill="#fff" opacity="0.35"/>
${mouthEl}`;
}

/**
 * Cacá de corpo inteiro, sentada, centro da base em (x, y). `arms`: 'down' | 'up' (comemorando) | 'clap' (palmas).
 */
export function caca(x, y, s = 1, { mouth = 'smile', eyes = 'open', arms = 'down', tilt = 0 } = {}) {
  const armsEl =
    arms === 'up'
      ? `<ellipse cx="62" cy="120" rx="13" ry="30" fill="${C.head}" transform="rotate(-35 62 120)"/><ellipse cx="178" cy="120" rx="13" ry="30" fill="${C.head}" transform="rotate(35 178 120)"/><circle cx="48" cy="96" r="11" fill="${C.paw}"/><circle cx="192" cy="96" r="11" fill="${C.paw}"/>`
      : arms === 'clap'
        ? `<ellipse cx="96" cy="196" rx="12" ry="20" fill="${C.head}" transform="rotate(35 96 196)"/><ellipse cx="144" cy="196" rx="12" ry="20" fill="${C.head}" transform="rotate(-35 144 196)"/><circle cx="112" cy="184" r="10" fill="${C.paw}"/><circle cx="128" cy="184" r="10" fill="${C.paw}"/><path d="M88 182 l-16 -6 M86 198 l-16 2 M152 182 l16 -6 M154 198 l16 2" stroke="#FFD36E" stroke-width="4" stroke-linecap="round"/>`
        : `<ellipse cx="92" cy="196" rx="12" ry="16" fill="${C.head}"/><ellipse cx="148" cy="196" rx="12" ry="16" fill="${C.head}"/><ellipse cx="92" cy="210" rx="11" ry="6" fill="${C.paw}"/><ellipse cx="148" cy="210" rx="11" ry="6" fill="${C.paw}"/>`;
  const body = `
<ellipse cx="120" cy="232" rx="70" ry="10" fill="#000" opacity="0.12"/>
<ellipse cx="120" cy="178" rx="66" ry="50" fill="${C.head}"/>
<ellipse cx="120" cy="188" rx="40" ry="32" fill="${C.belly}"/>
<ellipse cx="66" cy="220" rx="20" ry="9" fill="${C.paw}"/><ellipse cx="174" cy="220" rx="20" ry="9" fill="${C.paw}"/>
${arms === 'up' ? '' : ''}
<g transform="translate(30 0) scale(0.9)">${cacaHead({ mouth, eyes })}</g>
${armsEl}`;
  // origem do desenho: 240×240, base em (120, 232)
  return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s}) translate(-120 -232)">${body}</g>`;
}

/* ---------- Lixeiras com carinha ---------- */
/**
 * Lixeira de base centrada em (x, y), 150×210 em s=1.
 * face: 'smile' | 'open' | 'laugh' | 'whisper' | 'yawn' | 'sing' | 'surprised'
 */
export function bin(x, y, color, s = 1, { face = 'smile', lidOpen = false, tilt = 0, icon = '' } = {}) {
  const c = BIN[color];
  const eyes = {
    smile: `<circle cx="-28" cy="-150" r="15" fill="#fff"/><circle cx="28" cy="-150" r="15" fill="#fff"/><circle cx="-26" cy="-148" r="8" fill="#1C2333"/><circle cx="30" cy="-148" r="8" fill="#1C2333"/><circle cx="-23" cy="-151" r="3" fill="#fff"/><circle cx="33" cy="-151" r="3" fill="#fff"/>`,
    happy: `<path d="M-42 -146 Q-28 -164 -14 -146" stroke="#1C2333" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M14 -146 Q28 -164 42 -146" stroke="#1C2333" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    side: `<circle cx="-28" cy="-150" r="15" fill="#fff"/><circle cx="28" cy="-150" r="15" fill="#fff"/><circle cx="-20" cy="-150" r="8" fill="#1C2333"/><circle cx="36" cy="-150" r="8" fill="#1C2333"/>`,
    sleepy: `<path d="M-42 -148 Q-28 -140 -14 -148" stroke="#1C2333" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M14 -148 Q28 -140 42 -148" stroke="#1C2333" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    wide: `<circle cx="-28" cy="-150" r="17" fill="#fff"/><circle cx="28" cy="-150" r="17" fill="#fff"/><circle cx="-28" cy="-150" r="7" fill="#1C2333"/><circle cx="28" cy="-150" r="7" fill="#1C2333"/>`,
  };
  const faces = {
    smile: [eyes.smile, `<path d="M-34 -108 Q0 -78 34 -108" stroke="#1C2333" stroke-width="7" fill="none" stroke-linecap="round"/>`],
    open: [eyes.smile, `<path d="M-46 -112 Q0 -40 46 -112 Z" fill="#1C2333"/><path d="M-22 -72 Q0 -60 22 -72 Q12 -86 0 -86 Q-12 -86 -22 -72Z" fill="#E86F7E"/>`],
    laugh: [eyes.happy, `<path d="M-50 -116 Q0 -30 50 -116 Z" fill="#1C2333"/><path d="M-24 -70 Q0 -54 24 -70 Q12 -88 0 -88 Q-12 -88 -24 -70Z" fill="#E86F7E"/>`],
    whisper: [eyes.side, `<ellipse cx="14" cy="-98" rx="9" ry="7" fill="#1C2333"/>`],
    yawn: [eyes.sleepy, `<ellipse cx="0" cy="-90" rx="22" ry="30" fill="#1C2333"/><ellipse cx="0" cy="-72" rx="12" ry="8" fill="#E86F7E"/>`],
    sing: [eyes.happy, `<ellipse cx="0" cy="-96" rx="20" ry="22" fill="#1C2333"/><ellipse cx="0" cy="-84" rx="11" ry="7" fill="#E86F7E"/>`],
    surprised: [eyes.wide, `<ellipse cx="0" cy="-98" rx="14" ry="16" fill="#1C2333"/>`],
  };
  const [eyeEl, mouthEl] = faces[face];
  const lid = lidOpen
    ? `<g transform="rotate(-28 -80 -205)"><rect x="-82" y="-222" width="164" height="30" rx="14" fill="${c.dark}"/><rect x="-22" y="-236" width="44" height="18" rx="9" fill="${c.dark}"/></g>`
    : `<rect x="-82" y="-222" width="164" height="30" rx="14" fill="${c.dark}"/><rect x="-22" y="-236" width="44" height="18" rx="9" fill="${c.dark}"/>`;
  return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s})">
<ellipse cx="0" cy="4" rx="82" ry="12" fill="#000" opacity="0.12"/>
<path d="M-70 -196 H70 L60 -8 Q58 4 46 4 H-46 Q-58 4 -60 -8 Z" fill="${c.main}"/>
<path d="M30 -196 H70 L60 -8 Q58 4 46 4 H24 Z" fill="${c.dark}" opacity="0.35"/>
<rect x="-48" y="-56" width="96" height="40" rx="12" fill="${c.light}" opacity="0.55"/>
${icon}
${lid}
${eyeEl}${mouthEl}
</g>`;
}

/* ---------- Objetos ---------- */
export const obj = {
  newspaper: (x, y, s = 1, r = 0) => g(x, y, s, `<rect x="-40" y="-28" width="80" height="56" rx="4" fill="#F4F1EA"/><rect x="-32" y="-20" width="30" height="20" fill="#C9CED6"/><rect x="4" y="-20" width="28" height="5" fill="#9AA3B2"/><rect x="4" y="-10" width="28" height="5" fill="#9AA3B2"/><rect x="-32" y="6" width="64" height="5" fill="#9AA3B2"/><rect x="-32" y="15" width="50" height="5" fill="#9AA3B2"/>`, r),
  notebook: (x, y, s = 1, r = 0) => g(x, y, s, `<rect x="-30" y="-38" width="60" height="76" rx="6" fill="#EC8379"/><rect x="-30" y="-38" width="12" height="76" rx="4" fill="#D9483B"/><rect x="-8" y="-24" width="30" height="12" rx="3" fill="#fff" opacity="0.8"/>`, r),
  box: (x, y, s = 1, r = 0) => g(x, y, s, `<path d="M-44 -20 L0 -40 L44 -20 L44 30 L0 50 L-44 30 Z" fill="#C8955A"/><path d="M0 -0 L44 -20 L44 30 L0 50 Z" fill="#A87843"/><path d="M-44 -20 L0 0 L44 -20" stroke="#8B6234" stroke-width="3" fill="none"/><rect x="-6" y="0" width="12" height="50" fill="#E9C99A" opacity="0.6"/>`, r),
  bottle: (x, y, s = 1, r = 0) => g(x, y, s, `<rect x="-10" y="-62" width="20" height="14" rx="4" fill="#3F7FD1"/><path d="M-10 -48 Q-24 -36 -24 -16 V46 Q-24 56 -14 56 H14 Q24 56 24 46 V-16 Q24 -36 10 -48 Z" fill="#9FD3F0" opacity="0.9"/><rect x="-24" y="0" width="48" height="22" fill="#78C186"/><rect x="-14" y="-30" width="6" height="60" rx="3" fill="#fff" opacity="0.6"/>`, r),
  cup: (x, y, s = 1, r = 0) => g(x, y, s, `<path d="M-26 -34 H26 L18 38 H-18 Z" fill="#fff"/><path d="M-24 -18 H24 L22 0 H-22 Z" fill="#EC8379"/><rect x="-30" y="-40" width="60" height="10" rx="5" fill="#E3E7EC"/>`, r),
  yogurt: (x, y, s = 1, r = 0) => g(x, y, s, `<path d="M-28 -30 H28 L22 34 H-22 Z" fill="#FBE7DF"/><rect x="-30" y="-36" width="60" height="10" rx="4" fill="#C7A6FF"/><circle cx="0" cy="4" r="12" fill="#FF8FA3"/>`, r),
  jar: (x, y, s = 1, r = 0) => g(x, y, s, `<rect x="-26" y="-50" width="52" height="16" rx="5" fill="#8A5A33"/><path d="M-30 -34 H30 V36 Q30 50 16 50 H-16 Q-30 50 -30 36 Z" fill="#CFEFE0" opacity="0.85"/><rect x="-20" y="-24" width="8" height="56" rx="4" fill="#fff" opacity="0.7"/>`, r),
  shards: (x, y, s = 1) => g(x, y, s, `<path d="M-30 0 L-18 -14 L-8 2 Z" fill="#CFEFE0"/><path d="M0 4 L10 -12 L20 6 Z" fill="#B9E3CF"/><path d="M26 2 L34 -8 L40 6 Z" fill="#CFEFE0"/>`),
  can: (x, y, s = 1, r = 0, color = '#E5484D') => g(x, y, s, `<rect x="-22" y="-38" width="44" height="76" rx="8" fill="${color}"/><rect x="-22" y="-38" width="44" height="10" rx="5" fill="#C9CED6"/><rect x="-22" y="28" width="44" height="10" rx="5" fill="#C9CED6"/><rect x="-14" y="-20" width="6" height="40" rx="3" fill="#fff" opacity="0.5"/><circle cx="6" cy="-6" r="10" fill="#FFD36E"/>`, r),
  lid: (x, y, s = 1, r = 0) => g(x, y, s, `<ellipse cx="0" cy="0" rx="22" ry="22" fill="#C9CED6"/><ellipse cx="0" cy="0" rx="15" ry="15" fill="#E3E7EC"/>`, r),
  banana: (x, y, s = 1, r = 0) => g(x, y, s, `<path d="M-30 -4 Q0 26 30 -4 Q4 8 -30 -4Z" fill="#FFD64D"/><path d="M-30 -4 Q-40 -20 -46 -14 Q-40 4 -24 6Z" fill="#F2B705"/><path d="M30 -4 Q44 -18 50 -10 Q42 6 26 4Z" fill="#F2B705"/><path d="M-6 6 Q0 -30 6 6" fill="#F2B705"/>`, r),
  apple: (x, y, s = 1, r = 0) => g(x, y, s, `<path d="M-14 -24 Q-24 0 -14 24 H14 Q24 0 14 -24 Z" fill="#FBE7DF"/><path d="M-14 -24 Q0 -32 14 -24" fill="#D9483B"/><path d="M-14 24 Q0 32 14 24" fill="#D9483B"/><rect x="-2" y="-40" width="4" height="14" fill="#7A5232"/>`, r),
  sprout: (x, y, s = 1) => g(x, y, s, `<path d="M0 0 V-34" stroke="#3E8B48" stroke-width="5"/><path d="M0 -24 C-18 -38 -30 -30 -32 -22 C-20 -16 -8 -18 0 -24Z" fill="#7BC47F"/><path d="M0 -30 C16 -46 30 -40 32 -32 C20 -24 8 -24 0 -30Z" fill="#7BC47F"/>`),
  heart: (x, y, s = 1, color = '#FF8FA3') => g(x, y, s, `<path d="M0 12 C-30 -8 -18 -32 0 -16 C18 -32 30 -8 0 12Z" fill="${color}"/>`),
  motion: (x, y, s = 1, r = 0) => g(x, y, s, `<path d="M-30 -14 H10 M-40 0 H20 M-30 14 H10" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.8"/>`, r),
};

/** Pessoa adulta (trabalhadora do parque), estilizada e simples. */
export function worker(x, y, s = 1, { skin = '#8D5524', hair = '#2B1A10', shirt = '#2F7A3C' } = {}) {
  return g(x, y, s, `
<ellipse cx="0" cy="4" rx="70" ry="10" fill="#000" opacity="0.12"/>
<rect x="-34" y="-110" width="26" height="110" rx="12" fill="#3A4458"/>
<rect x="8" y="-110" width="26" height="110" rx="12" fill="#3A4458"/>
<ellipse cx="-20" cy="0" rx="22" ry="9" fill="#1C2333"/><ellipse cx="22" cy="0" rx="22" ry="9" fill="#1C2333"/>
<path d="M-46 -230 Q0 -250 46 -230 L52 -100 H-52 Z" fill="${shirt}"/>
<rect x="-52" y="-170" width="104" height="14" fill="#FFD36E" opacity="0.9"/>
<path d="M44 -220 Q90 -180 96 -120" stroke="${shirt}" stroke-width="26" stroke-linecap="round" fill="none"/>
<circle cx="98" cy="-112" r="16" fill="#FFB627"/>
<path d="M-44 -220 Q-60 -170 -40 -140" stroke="${shirt}" stroke-width="26" stroke-linecap="round" fill="none"/>
<circle cx="-38" cy="-132" r="16" fill="#FFB627"/>
<rect x="-12" y="-262" width="24" height="20" fill="${skin}"/>
<circle cx="0" cy="-296" r="42" fill="${skin}"/>
<path d="M-44 -300 Q-46 -350 0 -350 Q46 -350 44 -300 Q30 -330 0 -328 Q-30 -330 -44 -300Z" fill="${hair}"/>
<circle cx="-34" cy="-318" r="20" fill="${hair}"/>
<rect x="-46" y="-344" width="92" height="22" rx="10" fill="#2F7A3C"/><rect x="0" y="-332" width="56" height="10" rx="5" fill="#2F7A3C"/>
<circle cx="-14" cy="-296" r="5" fill="#1C2333"/><circle cx="14" cy="-296" r="5" fill="#1C2333"/>
<path d="M-12 -278 Q0 -268 12 -278" stroke="#1C2333" stroke-width="4" fill="none" stroke-linecap="round"/>
<ellipse cx="-26" cy="-282" rx="7" ry="4" fill="#E86F7E" opacity="0.5"/><ellipse cx="26" cy="-282" rx="7" ry="4" fill="#E86F7E" opacity="0.5"/>`);
}

/** Pá de lixo com cabo (para recolher os cacos). */
export function dustpan(x, y, s = 1) {
  return g(x, y, s, `<path d="M-40 0 H40 L30 -30 H-30 Z" fill="#3F7FD1"/><rect x="-6" y="-120" width="12" height="96" rx="6" fill="#7A5232"/>`);
}
