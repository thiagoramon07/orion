import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Caca } from '@/components/caca';
import { Icon } from '@/components/icon';
import { IconButton } from '@/components/icon-button';
import { Logo } from '@/components/logo';
import { useApp } from '@/store/app-store';
import { colors, fonts, radii, sizes } from '@/theme';

const PERKS = [
  'Todos os livros liberados, sem limite de páginas',
  'Narração em voz alta com destaque de palavras',
  'Quizzes, medalhas e sequência de dias',
  'Sem anúncios, feito para crianças',
];

/** Tela de assinatura — MOCK. TODO: integrar com compras na App Store / Google Play. */
export default function AssinaturaScreen() {
  const { state, actions } = useApp();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.top}>
        <IconButton name="close" label="Fechar" color={colors.white} onPress={() => router.back()} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Caca variant="head" size={110} style={{ alignSelf: 'center' }} />
        <Logo size={40} />
        <Text style={styles.title}>Leitura ilimitada para a família</Text>
        <View style={styles.card}>
          {PERKS.map((p) => (
            <View key={p} style={styles.perk}>
              <Icon name="check" size={22} color={colors.primary} />
              <Text style={styles.perkText}>{p}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.note}>Área para adultos. A assinatura ainda é uma simulação de teste.</Text>
        {state.subscribed ? (
          <>
            <Text style={styles.ok}>Assinatura de teste ativa ✓</Text>
            <Button title="Cancelar assinatura de teste" variant="outline" onPress={() => actions.setSubscribed(false)} />
          </>
        ) : (
          <Button
            title="Assinar (teste)"
            variant="accent"
            onPress={() => {
              // TODO: fluxo real de compra + verificação de adulto.
              actions.setSubscribed(true);
              router.back();
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },
  top: { alignItems: 'flex-end', paddingHorizontal: 8 },
  content: { padding: sizes.gutter, gap: 16, alignItems: 'center' },
  title: { fontFamily: fonts.title, fontSize: 28, lineHeight: 32, color: colors.white, textAlign: 'center' },
  card: { alignSelf: 'stretch', backgroundColor: colors.white, borderRadius: radii.cardLarge, padding: 18, gap: 12 },
  perk: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  perkText: { flex: 1, fontFamily: fonts.medium, fontSize: 16, color: colors.text },
  note: { fontFamily: fonts.regular, fontSize: 13, color: colors.primaryTint, textAlign: 'center' },
  ok: { fontFamily: fonts.bold, fontSize: 16, color: colors.accentLight },
});
