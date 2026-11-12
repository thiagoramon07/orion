import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { useWebKeys } from '@/hooks/use-web-keys';
import { colors, fonts, radii } from '@/theme';

type Props = { onDigit: (d: string) => void; onDelete: () => void };

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'del'],
];

/** Teclado numérico próprio (teclas quadradas arredondadas em tint). */
export function Keypad({ onDigit, onDelete }: Props) {
  // No computador, aceita também o teclado físico.
  useWebKeys((key) => {
    if (/^\d$/.test(key)) {
      onDigit(key);
      return true;
    }
    if (key === 'Backspace' || key === 'Delete') {
      onDelete();
      return true;
    }
  });

  return (
    <View style={styles.grid}>
      {ROWS.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((k, c) => {
            if (!k) return <View key={c} style={styles.key} />;
            const del = k === 'del';
            return (
              <Pressable
                key={c}
                onPress={() => (del ? onDelete() : onDigit(k))}
                accessibilityRole="button"
                accessibilityLabel={del ? 'Apagar' : k}
                style={({ pressed }) => [styles.key, styles.keyBg, pressed && styles.pressed]}>
                {del ? <Icon name="backspace" size={28} color={colors.primary} /> : <Text style={styles.digit}>{k}</Text>}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  key: { flex: 1, height: 60, borderRadius: radii.key, alignItems: 'center', justifyContent: 'center' },
  keyBg: { backgroundColor: colors.primaryTint },
  pressed: { backgroundColor: colors.primary, transform: [{ scale: 0.96 }] },
  digit: { fontFamily: fonts.title, fontSize: 26, color: colors.primary },
});
