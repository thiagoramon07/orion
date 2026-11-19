import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

/** Lombadas decorativas (cores e alturas fixas para o desenho ser estável). */
const SPINES: { color: string; h: number; w: number; band?: string }[] = [
  { color: colors.accent, h: 58, w: 20, band: colors.accentShadow },
  { color: '#E9EEF0', h: 48, w: 16 },
  { color: colors.violet, h: 64, w: 22, band: colors.accentLight },
  { color: colors.leaf, h: 52, w: 18 },
  { color: colors.terracotta, h: 60, w: 20, band: colors.accentLight },
  { color: colors.accentLight, h: 44, w: 16 },
  { color: '#2E8F8F', h: 56, w: 22, band: colors.white },
  { color: colors.accent, h: 50, w: 18 },
  { color: colors.violetTint, h: 62, w: 20, band: colors.violet },
  { color: colors.terracottaTint, h: 46, w: 16 },
  { color: colors.leaf, h: 58, w: 22, band: colors.white },
  { color: colors.terracotta, h: 52, w: 18 },
  { color: colors.accentLight, h: 60, w: 20, band: colors.accentShadow },
  { color: colors.violet, h: 48, w: 16 },
  { color: colors.accent, h: 56, w: 22 },
];

/** Prateleira de lombadas coloridas para o rodapé. */
export function Bookshelf() {
  return (
    <View style={styles.wrap} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.row}>
        {SPINES.map((s, i) => (
          <View
            key={i}
            style={[
              styles.spine,
              { backgroundColor: s.color, height: s.h, width: s.w },
              i % 5 === 3 && styles.leaning,
            ]}>
            {s.band && <View style={[styles.band, { backgroundColor: s.band }]} />}
            {s.band && <View style={[styles.band, { backgroundColor: s.band, top: undefined, bottom: 8 }]} />}
          </View>
        ))}
      </View>
      <View style={styles.plank} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', alignItems: 'center', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, paddingHorizontal: 8 },
  spine: { borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  leaning: { transform: [{ rotate: '-8deg' }], marginLeft: 4, marginRight: 2 },
  band: { position: 'absolute', left: 3, right: 3, top: 8, height: 3, borderRadius: 2 },
  plank: { width: '100%', height: 14, backgroundColor: colors.primaryDark },
});
