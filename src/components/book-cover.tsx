import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Icon } from '@/components/icon';
import { colors, fonts } from '@/theme';

export type CoverMotif = 'waves' | 'stars' | 'dots' | 'hills';

type Props = {
  title: string;
  author?: string;
  background: string;
  foreground?: string;
  /** Cor dos detalhes decorativos. */
  detail?: string;
  motif?: CoverMotif;
  width?: number;
  /** Mostra a faixa "Leia pra mim" no canto inferior. */
  readToMe?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Capa de livro genérica (títulos inventados) com um padrão decorativo simples. */
export function BookCover({
  title,
  author,
  background,
  foreground = colors.white,
  detail = colors.accentLight,
  motif = 'dots',
  width = 110,
  readToMe,
  style,
}: Props) {
  const height = width * 1.4;
  return (
    <View
      accessible
      accessibilityLabel={`Livro: ${title}`}
      style={[styles.cover, { width, height, backgroundColor: background }, style]}>
      <Svg width={width} height={height} viewBox="0 0 100 140" style={StyleSheet.absoluteFill}>
        <Motif motif={motif} color={detail} />
      </Svg>
      <View style={styles.spine} />
      <Text style={[styles.title, { color: foreground, fontSize: width * 0.13 }]} numberOfLines={3}>
        {title}
      </Text>
      {author ? (
        <Text style={[styles.author, { color: foreground, fontSize: width * 0.075 }]} numberOfLines={1}>
          {author}
        </Text>
      ) : null}
      {readToMe ? (
        <View style={styles.ribbon}>
          <Icon name="speaker" size={Math.max(11, width * 0.09)} color={colors.white} strokeWidth={2.4} />
          <Text style={[styles.ribbonText, { fontSize: Math.max(9, width * 0.07) }]}>Leia pra mim</Text>
        </View>
      ) : null}
    </View>
  );
}

function Motif({ motif, color }: { motif: CoverMotif; color: string }) {
  switch (motif) {
    case 'waves':
      return (
        <>
          <Path d="M0 110 Q25 98 50 110 T100 110 V140 H0 Z" fill={color} opacity={0.9} />
          <Path d="M0 122 Q25 112 50 122 T100 122 V140 H0 Z" fill={color} opacity={0.6} />
        </>
      );
    case 'stars':
      return (
        <>
          {[
            [20, 92, 5],
            [74, 84, 7],
            [50, 112, 4],
            [84, 120, 3],
            [14, 124, 3],
          ].map(([x, y, r], i) => (
            <Path
              key={i}
              d={`M${x} ${y - r * 2} L${x + r * 0.5} ${y - r * 0.5} L${x + r * 2} ${y} L${x + r * 0.5} ${y + r * 0.5} L${x} ${y + r * 2} L${x - r * 0.5} ${y + r * 0.5} L${x - r * 2} ${y} L${x - r * 0.5} ${y - r * 0.5} Z`}
              fill={color}
            />
          ))}
        </>
      );
    case 'hills':
      return (
        <>
          <Path d="M0 116 Q30 92 60 112 Q80 100 100 108 V140 H0 Z" fill={color} opacity={0.75} />
          <Circle cx={76} cy={88} r={9} fill={color} />
        </>
      );
    default:
      return (
        <>
          {Array.from({ length: 12 }).map((_, i) => (
            <Circle key={i} cx={12 + (i % 4) * 25} cy={96 + Math.floor(i / 4) * 16} r={3.5} fill={color} opacity={0.85} />
          ))}
        </>
      );
  }
}

const styles = StyleSheet.create({
  cover: {
    borderRadius: 10,
    overflow: 'hidden',
    paddingTop: 14,
    paddingLeft: 16,
    paddingRight: 10,
  },
  spine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  title: { fontFamily: fonts.title, lineHeight: undefined },
  ribbon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderTopLeftRadius: 10,
  },
  ribbonText: { color: colors.white, fontFamily: fonts.bold },
  author: { fontFamily: fonts.medium, marginTop: 4, opacity: 0.85 },
});
