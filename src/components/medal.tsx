import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import type { Badge } from '@/data/badges';
import { colors, fonts } from '@/theme';

type Props = { badge: Badge; earned: boolean; size?: number; showLabel?: boolean };

const GLYPH: Record<string, string> = {
  'primeiro-livro': '1',
  'cinco-livros': '5',
  'dez-livros': '10',
  quiz: '?',
  ouvinte: '♪',
  coruja: '☾',
  'sete-dias': '7',
};

/** Medalha redonda com fita; cinza enquanto não foi conquistada. */
export function Medal({ badge, earned, size = 72, showLabel = true }: Props) {
  const main = earned ? badge.color : '#C9CFD8';
  const ribbon = earned ? colors.accentShadow : '#B3BAC5';
  return (
    <View
      style={{ width: size + 8, alignItems: 'center' }}
      accessible
      accessibilityLabel={`Medalha ${badge.label}: ${badge.description}. ${earned ? 'Conquistada' : 'Ainda não conquistada'}`}>
      <Svg width={size} height={size} viewBox="0 0 72 72">
        <Path d="M24 44 L16 68 L26 63 L31 71 L36 48 Z" fill={ribbon} />
        <Path d="M48 44 L56 68 L46 63 L41 71 L36 48 Z" fill={ribbon} />
        <Circle cx={36} cy={32} r={27} fill={main} />
        <Circle cx={36} cy={32} r={21} fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={2.5} strokeDasharray="4 4" />
      </Svg>
      <Text style={[styles.glyph, { top: size * 0.24, fontSize: size * 0.3, lineHeight: size * 0.36 }]}>
        {GLYPH[badge.id] ?? '★'}
      </Text>
      {showLabel && (
        <Text style={[styles.label, !earned && { color: colors.placeholder }]} numberOfLines={2}>
          {badge.label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  glyph: { position: 'absolute', color: '#fff', fontFamily: fonts.title, textAlign: 'center' },
  label: { fontFamily: fonts.bold, fontSize: 12, color: colors.text, textAlign: 'center', marginTop: 2 },
});
