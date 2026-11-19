import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Keypad } from '@/components/keypad';
import { colors, fonts, radii } from '@/theme';

type Props = {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  onPass: () => void;
};

/** Verificação simples de adulto: ano de nascimento + teclado próprio (o ano não é armazenado). */
export function YearGate({
  title = 'Área dos responsáveis',
  subtitle = 'Para continuar, digite o ano em que você nasceu.',
  buttonLabel = 'Continuar',
  onPass,
}: Props) {
  const [digits, setDigits] = useState('');
  const thisYear = new Date().getFullYear();
  const year = Number(digits);
  const complete = digits.length === 4;
  const plausible = complete && year >= 1900 && year <= thisYear;
  const adult = plausible && thisYear - year >= 18;

  let message = '';
  if (complete && !plausible) message = 'Hmm, esse ano não parece certo. Confira e tente de novo.';
  else if (complete && !adult) message = 'Esta parte é só para adultos. Peça ajuda a um responsável! 😊';

  return (
    <View style={styles.wrap}>
      <View style={styles.lock}>
        <Icon name="lock" size={34} color={colors.primary} />
      </View>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.cells} accessible accessibilityLabel={`Ano digitado: ${digits || 'vazio'}`}>
        {[0, 1, 2, 3].map((i) => {
          const filled = i < digits.length;
          const current = i === digits.length;
          return (
            <View key={i} style={[styles.cell, current && styles.cellCurrent, filled && styles.cellFilled]}>
              <Text style={styles.cellText}>{digits[i] ?? ''}</Text>
            </View>
          );
        })}
      </View>

      <View style={{ minHeight: 44, justifyContent: 'center' }}>
        {message ? (
          <Animated.Text entering={FadeIn} style={styles.message} accessibilityLiveRegion="polite">
            {message}
          </Animated.Text>
        ) : null}
      </View>

      <Keypad
        onDigit={(d) => setDigits((v) => (v.length < 4 ? v + d : v))}
        onDelete={() => setDigits((v) => v.slice(0, -1))}
      />

      <Button title={buttonLabel} variant="primary" disabled={!adult} onPress={onPass} style={{ marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  lock: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: { fontFamily: fonts.title, fontSize: 30, color: colors.text, textAlign: 'center' },
  subtitle: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 24, color: colors.textSecondary, textAlign: 'center' },
  cells: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 8 },
  cell: {
    width: 58,
    height: 66,
    borderRadius: radii.input,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellCurrent: { borderColor: colors.primary },
  cellFilled: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  cellText: { fontFamily: fonts.title, fontSize: 30, color: colors.text },
  message: { fontFamily: fonts.bold, fontSize: 15, color: colors.terracotta, textAlign: 'center' },
});

/** A verificação vale por 10 minutos nesta aba (para não pedir de novo a cada toque). */
let passedUntil = 0;
export const parentGate = {
  isOpen: () => Date.now() < passedUntil,
  open: () => {
    passedUntil = Date.now() + 10 * 60 * 1000;
  },
};
