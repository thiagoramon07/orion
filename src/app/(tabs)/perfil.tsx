import { router } from 'expo-router';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Caca } from '@/components/caca';
import { Medal } from '@/components/medal';
import { BADGES } from '@/data/badges';
import { ageLabel } from '@/data/books';
import { currentStreak, earnedBadges, useApp } from '@/store/app-store';
import { colors, fonts, radii } from '@/theme';

export default function PerfilScreen() {
  const { state, actions } = useApp();
  const earned = earnedBadges(state);
  const streak = currentStreak(state.readDays);

  const resetAll = () => {
    const go = () => {
      actions.reset();
      router.replace('/');
    };
    if (Platform.OS === 'web') go();
    else
      Alert.alert('Recomeçar do zero?', 'Isso apaga o perfil e o progresso salvos neste aparelho.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Apagar', style: 'destructive', onPress: go },
      ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Caca variant="head" size={110} />
          <Text style={styles.name}>{state.childName || 'Leitor'}</Text>
          <Text style={styles.sub}>{ageLabel(state.childAge).replace('crianças de ', '')}</Text>
        </View>

        <View style={styles.stats}>
          <Stat value={state.finished.length} label={state.finished.length === 1 ? 'livro lido' : 'livros lidos'} />
          <Stat value={streak} label={streak === 1 ? 'dia seguido' : 'dias seguidos'} />
          <Stat value={earned.size} label={earned.size === 1 ? 'medalha' : 'medalhas'} />
        </View>

        <View style={styles.card}>
          <Text style={styles.h2}>Minhas medalhas</Text>
          <View style={styles.medals}>
            {BADGES.map((b) => (
              <Medal key={b.id} badge={b} earned={earned.has(b.id)} size={64} />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.h2}>Para os adultos</Text>
          <Button title={state.subscribed ? 'Assinatura (teste) ativa' : 'Conhecer a assinatura'} variant="primary" onPress={() => router.push('/assinatura')} />
          <Button title="Recomeçar do zero (teste)" variant="outline" textColor={colors.terracotta} borderColor={colors.terracotta} onPress={resetAll} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${value} ${label}`}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primarySoft },
  content: { padding: 20, gap: 16 },
  hero: { alignItems: 'center', gap: 4 },
  name: { fontFamily: fonts.title, fontSize: 30, color: colors.text },
  sub: { fontFamily: fonts.medium, fontSize: 16, color: colors.textSecondary },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, backgroundColor: colors.white, borderRadius: radii.card, padding: 14, alignItems: 'center' },
  statValue: { fontFamily: fonts.title, fontSize: 28, color: colors.primary },
  statLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  card: { backgroundColor: colors.white, borderRadius: radii.cardLarge, padding: 18, gap: 12 },
  h2: { fontFamily: fonts.title, fontSize: 20, color: colors.text },
  medals: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
});
