import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ChildAvatar } from '@/components/child-avatar';
import { Medal } from '@/components/medal';
import { BADGES } from '@/data/badges';
import { getInterest } from '@/data/interests';
import { currentStreak, earnedBadges, minutesToday, useApp } from '@/store/app-store';
import { colors, fonts, radii } from '@/theme';

export default function PerfilScreen() {
  const { state } = useApp();
  const earned = earnedBadges(state);
  const streak = currentStreak(state.readDays);
  const today = minutesToday(state.readingLog);
  const edit = (passo: 'avatar' | 'interesses') =>
    router.push({ pathname: '/criar-perfil', params: { modo: 'editar', id: state.activeProfileId ?? '', passo } });

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <ChildAvatar avatar={state.avatar} size={110} ring />
          <Text style={styles.name}>{state.childName || 'Leitor'}</Text>
          <Text style={styles.sub}>{state.childAge} anos</Text>
          <Button
            title="Trocar meu bichinho"
            variant="outline"
            textColor={colors.primary}
            borderColor={colors.primary}
            onPress={() => edit('avatar')}
            style={{ marginTop: 8 }}
          />
        </View>

        <View style={styles.stats}>
          <Stat value={today} label="min hoje" />
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
          <Text style={styles.h2}>Do que eu gosto</Text>
          {state.interests.length ? (
            <View style={styles.chips}>
              {state.interests.map((id) => {
                const it = getInterest(id);
                return it ? (
                  <View key={id} style={styles.chip}>
                    <Text style={styles.chipText}>
                      {it.emoji} {it.label}
                    </Text>
                  </View>
                ) : null;
              })}
            </View>
          ) : (
            <Text style={styles.sub}>Ainda não escolhi. Assim a estante fica com a minha cara!</Text>
          )}
          <Button title="Escolher interesses" variant="primary" onPress={() => edit('interesses')} />
        </View>

        <View style={styles.card}>
          <Button
            title={state.profiles.length > 1 ? 'Trocar de leitor' : 'Adicionar outra criança'}
            variant="outline"
            textColor={colors.primary}
            borderColor={colors.primary}
            onPress={() => router.push(state.profiles.length > 1 ? '/quem-le' : { pathname: '/pais', params: { acao: 'adicionar' } })}
          />
          <Button title="Área dos responsáveis" variant="primary" onPress={() => router.push('/pais')} />
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
  statValue: { fontFamily: fonts.title, fontSize: 24, color: colors.primary },
  statLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: colors.primaryTint, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 8 },
  chipText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary },
  card: { backgroundColor: colors.white, borderRadius: radii.cardLarge, padding: 18, gap: 12 },
  h2: { fontFamily: fonts.title, fontSize: 20, color: colors.text },
  medals: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
});
