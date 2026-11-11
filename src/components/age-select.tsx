import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { AGE_OPTIONS, ageLabel } from '@/data/books';
import { colors, fonts, radii } from '@/theme';

type Props = { value: number; onChange: (age: number) => void };

/** Seletor de faixa de idade (abre uma lista em modal). */
export function AgeSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Idade: ${ageLabel(value)}. Toque para mudar`}
        style={styles.select}>
        <Text style={styles.value}>{ageLabel(value)}</Text>
        <Icon name="chevron-down" size={20} color={colors.primary} />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} accessibilityLabel="Fechar">
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Escolha a idade</Text>
            <FlatList
              data={AGE_OPTIONS}
              keyExtractor={(o) => String(o.value)}
              renderItem={({ item }) => {
                const active = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    style={[styles.option, active && styles.optionActive]}>
                    <Text style={[styles.optionText, active && { color: colors.white }]}>{item.label}</Text>
                    {active && <Icon name="check" size={20} color={colors.white} />}
                  </Pressable>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  select: {
    minHeight: 48,
    borderRadius: radii.input,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: colors.white,
  },
  value: { fontFamily: fonts.bold, fontSize: 16, color: colors.primary },
  backdrop: { flex: 1, backgroundColor: 'rgba(28,35,51,0.45)', justifyContent: 'center', padding: 24 },
  sheet: { backgroundColor: colors.white, borderRadius: radii.cardLarge, paddingVertical: 16, maxHeight: '80%' },
  sheetTitle: { fontFamily: fonts.title, fontSize: 20, color: colors.text, paddingHorizontal: 20, marginBottom: 8 },
  option: {
    minHeight: 48,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionActive: { backgroundColor: colors.primary },
  optionText: { fontFamily: fonts.bold, fontSize: 16, color: colors.primary },
});
