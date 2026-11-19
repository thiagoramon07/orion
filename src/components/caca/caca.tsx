import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Ellipse, G, Path } from 'react-native-svg';

import { CacaHeadShape } from './caca-head';
import { cacaPalette as c } from './palette';
import { colors } from '@/theme';

export type CacaVariant = 'full' | 'head';

type Props = {
  /** "full": corpo inteiro sentada num livro aberto. "head": só a cabeça. */
  variant?: CacaVariant;
  /** Largura em px; a altura segue a proporção do desenho. */
  size?: number;
  /** Cor da capa do livro (variant "full"). */
  bookColor?: string;
  style?: StyleProp<ViewStyle>;
};

const RATIO: Record<CacaVariant, number> = { head: 200 / 200, full: 270 / 240 };

/** Cacá, a capivara mascote do Folheia. */
export function Caca({ variant = 'full', size = 200, bookColor = colors.accent, style }: Props) {
  const label = variant === 'full' ? 'Cacá, a capivara, sentada num livro aberto' : 'Cacá, a capivara';

  if (variant === 'head') {
    return (
      <Svg width={size} height={size * RATIO.head} viewBox="0 0 200 200" style={style} accessibilityLabel={label}>
        <CacaHeadShape />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size * RATIO.full} viewBox="0 0 240 270" style={style} accessibilityLabel={label}>
      {/* livro aberto: capa */}
      <Path
        d="M14 222 Q66 204 120 218 Q174 204 226 222 L226 262 Q174 246 120 262 Q66 246 14 262 Z"
        fill={bookColor}
      />
      <Path d="M14 256 Q66 240 120 256 Q174 240 226 256 L226 262 Q174 246 120 262 Q66 246 14 262 Z" fill={colors.accentShadow} />
      {/* páginas */}
      <Path d="M24 216 Q72 198 120 212 L120 252 Q72 238 24 252 Z" fill="#FFF8EC" />
      <Path d="M216 216 Q168 198 120 212 L120 252 Q168 238 216 252 Z" fill="#FFFDF7" />
      <Path d="M120 212 L120 252" stroke="#E7DCC6" strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <G key={i}>
          <Path d={`M40 ${228 + i * 7} Q72 ${218 + i * 7} 104 ${226 + i * 7}`} stroke="#E7DCC6" strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d={`M136 ${226 + i * 7} Q168 ${218 + i * 7} 200 ${228 + i * 7}`} stroke="#E7DCC6" strokeWidth={2} fill="none" strokeLinecap="round" />
        </G>
      ))}

      {/* corpo sentado */}
      <Ellipse cx={120} cy={178} rx={66} ry={50} fill={c.head} />
      <Ellipse cx={120} cy={188} rx={40} ry={32} fill={c.belly} />
      {/* patinhas da frente */}
      <Ellipse cx={92} cy={196} rx={12} ry={16} fill={c.head} />
      <Ellipse cx={148} cy={196} rx={12} ry={16} fill={c.head} />
      <Ellipse cx={92} cy={210} rx={11} ry={6} fill={c.paw} />
      <Ellipse cx={148} cy={210} rx={11} ry={6} fill={c.paw} />
      {/* patas traseiras apoiadas nas páginas */}
      <Ellipse cx={66} cy={220} rx={20} ry={9} fill={c.paw} />
      <Ellipse cx={174} cy={220} rx={20} ry={9} fill={c.paw} />

      {/* cabeça */}
      <G transform="translate(30 0) scale(0.9)">
        <CacaHeadShape />
      </G>
    </Svg>
  );
}
