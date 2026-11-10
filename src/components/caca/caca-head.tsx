import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { cacaPalette as c } from './palette';

/**
 * Cabeça da Cacá desenhada num quadro de 200×200 (inclui o broto).
 * Use dentro de um <Svg> ou <G transform> — não tem Svg próprio.
 */
export function CacaHeadShape() {
  return (
    <G>
      {/* broto */}
      <Path d="M100 44 C100 34 101 26 104 18" stroke={c.sproutDark} strokeWidth={4} strokeLinecap="round" fill="none" />
      <Path d="M103 22 C92 8 74 10 70 16 C78 26 94 28 103 22 Z" fill={c.sprout} />
      <Path d="M104 20 C114 4 134 4 138 10 C130 22 114 26 104 20 Z" fill={c.sprout} />
      <Path d="M104 20 C114 13 124 10 132 10" stroke={c.sproutDark} strokeWidth={1.6} strokeLinecap="round" fill="none" opacity={0.6} />

      {/* orelhas */}
      <Circle cx={54} cy={56} r={12} fill={c.ear} />
      <Circle cx={146} cy={56} r={12} fill={c.ear} />
      <Circle cx={55} cy={58} r={6} fill={c.earInner} />
      <Circle cx={145} cy={58} r={6} fill={c.earInner} />

      {/* cabeça (focinho largo de capivara) */}
      <Rect x={38} y={40} width={124} height={140} rx={58} fill={c.head} />
      <Ellipse cx={100} cy={66} rx={34} ry={12} fill={c.headLight} opacity={0.35} />

      {/* olhos */}
      <Circle cx={73} cy={98} r={7.5} fill={c.nose} />
      <Circle cx={127} cy={98} r={7.5} fill={c.nose} />
      <Circle cx={75.5} cy={95.5} r={2.6} fill={c.eyeShine} />
      <Circle cx={129.5} cy={95.5} r={2.6} fill={c.eyeShine} />

      {/* bochechas */}
      <Ellipse cx={46} cy={112} rx={9} ry={6} fill={c.cheek} opacity={0.75} />
      <Ellipse cx={154} cy={112} rx={9} ry={6} fill={c.cheek} opacity={0.75} />

      {/* focinho */}
      <Rect x={50} y={110} width={100} height={62} rx={26} fill={c.muzzle} />
      {/* nariz */}
      <Rect x={74} y={118} width={52} height={18} rx={9} fill={c.nose} />
      <Ellipse cx={86} cy={124} rx={5} ry={2.4} fill={c.eyeShine} opacity={0.35} />
      {/* boquinha */}
      <Path
        d="M90 152 Q95 158 100 152 Q105 158 110 152"
        stroke={c.nose}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M100 136 L100 152" stroke={c.nose} strokeWidth={3} strokeLinecap="round" />
    </G>
  );
}
