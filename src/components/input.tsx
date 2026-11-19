import { ReactNode, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors, fonts, radii, sizes } from '@/theme';

type Props = TextInputProps & { label?: string; right?: ReactNode; error?: string };

/** Campo de texto padrão (56 de altura, raio 14). */
export function Input({ label, right, error, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.box,
          { borderColor: error ? colors.terracotta : focused ? colors.primary : colors.inputBorder },
          focused && { borderWidth: 2 },
        ]}>
        <TextInput
          placeholderTextColor={colors.placeholder}
          accessibilityLabel={label}
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[styles.input, style]}
        />
        {right}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  box: {
    height: sizes.inputHeight,
    borderRadius: radii.input,
    borderWidth: 1.5,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  input: { flex: 1, height: '100%', fontFamily: fonts.medium, fontSize: 17, color: colors.text },
  error: { fontFamily: fonts.medium, fontSize: 13, color: colors.terracotta },
});
