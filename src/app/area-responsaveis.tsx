import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { IconButton } from '@/components/icon-button';
import { Keypad } from '@/components/keypad';
import { ProgressSteps } from '@/components/progress-steps';
import { useApp } from '@/store/app-store';
import { colors, fonts, radii, sizes } from '@/theme';

/** Verificação simples de adulto: ano de nascimento (o ano não é armazenado). */
export default function AreaResponsaveisScreen() {
  const { actions } = useApp();
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
    <SafeAreaView style={styles.root}>
      <View style={styles.top}>
        <IconButton name="back" label="Voltar" color={colors.text} onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <ProgressSteps step={2} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.lock}>
          <Icon name="lock" size={34} color={colors.primary} />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          Área dos responsáveis
        </Text>
        <Text style={styles.subtitle}>Para continuar, digite o ano em que você nasceu.</Text>

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

        <Button
          title="Continuar"
          variant="primary"
          disabled={!adult}
          onPress={() => {
            actions.setGuardianVerified();
            router.push('/protecao-dados');
          }}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingRight: sizes.gutter },
  content: { paddingHorizontal: sizes.gutter, paddingTop: 8, paddingBottom: 32, gap: 12 },
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
