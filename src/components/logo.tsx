import { StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/theme';

type Props = { size?: number; color?: string };

/** Logotipo em texto: "folheia" + ponto final manga. */
export function Logo({ size = 28, color = colors.white }: Props) {
  return (
    <Text
      accessibilityRole="header"
      accessibilityLabel="Folheia"
      style={[styles.text, { fontSize: size, lineHeight: size * 1.1, color, letterSpacing: -size * 0.03 }]}>
      folheia<Text style={{ color: colors.accent }}>.</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { fontFamily: fonts.title },
});
