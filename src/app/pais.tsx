import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ChildAvatar } from '@/components/child-avatar';
import { IconButton } from '@/components/icon-button';
import { parentGate, YearGate } from '@/components/year-gate';
import { getBook } from '@/data/books';
import { getInterest } from '@/data/interests';
import {
  ChildProfile,
  currentStreak,
  earnedBadges,
  lastDaysMinutes,
  MAX_PROFILES,
  minutesToday,
  useApp,
} from '@/store/app-store';
import { colors, fonts, radii, sizes } from '@/theme';
import { goBackOr } from '@/utils/navigation';
import { confirmAsync } from '@/utils/notify';

const GOALS = [5, 10, 15, 20, 30];
const WEEKDAY = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

/** Área dos responsáveis: acompanhamento de cada criança e gestão dos perfis. */
export default function PaisScreen() {
  const { acao } = useLocalSearchParams<{ acao?: string }>();
  const [open, setOpen] = useState(parentGate.isOpen());
  const { state, actions } = useApp();

  if (!open) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.top}>
          <IconButton name="close" label="Fechar" color={colors.text} onPress={() => goBackOr('/explorar')} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <YearGate
            onPass={() => {
              parentGate.open();
              if (acao === 'adicionar') router.replace({ pathname: '/criar-perfil', params: { modo: 'novo' } });
              else setOpen(true);
            }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const resetAll = async () => {
    const ok = await confirmAsync(
      'Apagar tudo?',
      'Isso apaga todos os perfis e o progresso salvos neste navegador.',
      'Apagar tudo',
    );
    if (!ok) return;
    actions.reset();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.top}>
        <IconButton name="close" label="Fechar" color={colors.text} onPress={() => goBackOr('/explorar')} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          Área dos responsáveis
        </Text>
        {state.guardianEmail ? <Text style={styles.sub}>Conta: {state.guardianEmail}</Text> : null}

        {state.profiles.map((p) => (
          <ChildCard
            key={p.id}
            profile={p}
            active={p.id === state.activeProfileId}
            onGoal={(m) => actions.updateProfile(p.id, { dailyGoalMin: m })}
            onRemove={async () => {
              const ok = await confirmAsync(
                `Apagar o perfil de ${p.name}?`,
                'O progresso, as medalhas e o histórico de leitura deste perfil serão apagados.',
                'Apagar',
              );
              if (!ok) return;
              actions.removeProfile(p.id);
              // Sem nenhuma criança, volta para o começo do app.
              if (state.profiles.length === 1) router.replace('/');
            }}
          />
        ))}

        {state.profiles.length < MAX_PROFILES ? (
          <Button
            title={`Adicionar criança (${state.profiles.length}/${MAX_PROFILES})`}
            variant="primary"
            onPress={() => router.push({ pathname: '/criar-perfil', params: { modo: 'novo' } })}
          />
        ) : (
          <Text style={styles.sub}>Limite de {MAX_PROFILES} crianças por família.</Text>
        )}

        <View style={styles.card}>
          <Text style={styles.h2}>Assinatura e dados</Text>
          <Button
            title={state.subscribed ? 'Assinatura (teste) ativa' : 'Conhecer a assinatura'}
            variant="outline"
            textColor={colors.primary}
            borderColor={colors.primary}
            onPress={() => router.push('/assinatura')}
          />
          <Button
            title="Termos e privacidade"
            variant="outline"
            textColor={colors.primary}
            borderColor={colors.primary}
            onPress={() => router.push('/politica')}
          />
          <Button
            title="Apagar todos os dados (teste)"
            variant="outline"
            textColor={colors.terracotta}
            borderColor={colors.terracotta}
            onPress={resetAll}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ChildCard({
  profile: p,
  active,
  onGoal,
  onRemove,
}: {
  profile: ChildProfile;
  active: boolean;
  onGoal: (m: number) => void;
  onRemove: () => void;
}) {
  const week = lastDaysMinutes(p.readingLog, 7);
  const weekTotal = week.reduce((n, d) => n + d.minutes, 0);
  const today = minutesToday(p.readingLog);
  const max = Math.max(p.dailyGoalMin, ...week.map((d) => d.minutes), 1);
  const streak = currentStreak(p.readDays);
  const badges = earnedBadges(p).size;
  const recent = [...p.finished].reverse().slice(0, 3).map((id) => getBook(id)?.title).filter(Boolean);

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <ChildAvatar avatar={p.avatar} size={56} ring={active} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{p.name}</Text>
          <Text style={styles.sub}>
            {p.age} anos{active ? ' · lendo agora' : ''}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <Stat value={`${today}/${p.dailyGoalMin}`} label="min hoje" />
        <Stat value={String(weekTotal)} label="min na semana" />
        <Stat value={String(p.finished.length)} label={p.finished.length === 1 ? 'livro lido' : 'livros lidos'} />
        <Stat value={String(streak)} label={streak === 1 ? 'dia seguido' : 'dias seguidos'} />
      </View>

      <View
        style={styles.chart}
        accessible
        accessibilityLabel={`Minutos lidos nos últimos 7 dias: ${week.map((d) => d.minutes).join(', ')}. Meta diária de ${p.dailyGoalMin} minutos.`}>
        <View style={[styles.goalLine, { bottom: 18 + (p.dailyGoalMin / max) * 80 }]} />
        {week.map((d) => {
          const met = d.minutes >= p.dailyGoalMin;
          const wd = WEEKDAY[new Date(`${d.day}T12:00:00`).getDay()];
          return (
            <View key={d.day} style={styles.barCol}>
              <Text style={styles.barValue}>{d.minutes || ''}</Text>
              <View
                style={[
                  styles.bar,
                  { height: Math.max(3, (d.minutes / max) * 80), backgroundColor: met ? colors.leaf : colors.primaryTint },
                ]}
              />
              <Text style={styles.barLabel}>{wd}</Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.small}>Linha tracejada: meta diária. Verde: meta cumprida.</Text>

      <Text style={styles.label}>Meta diária</Text>
      <View style={styles.goals}>
        {GOALS.map((m) => {
          const sel = p.dailyGoalMin === m;
          return (
            <Pressable
              key={m}
              onPress={() => onGoal(m)}
              accessibilityRole="radio"
              accessibilityState={{ selected: sel }}
              accessibilityLabel={`${m} minutos por dia`}
              style={[styles.goal, sel && styles.goalActive]}>
              <Text style={[styles.goalText, sel && { color: colors.white }]}>{m} min</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.small}>
        {badges} {badges === 1 ? 'medalha' : 'medalhas'} · {p.quizzesPassed.length}{' '}
        {p.quizzesPassed.length === 1 ? 'quiz acertado' : 'quizzes acertados'}
        {p.interests.length ? ` · gosta de ${p.interests.map((i) => getInterest(i)?.label.toLowerCase()).filter(Boolean).join(', ')}` : ''}
      </Text>
      {recent.length ? <Text style={styles.small}>Últimos lidos: {recent.join(' · ')}</Text> : null}

      <View style={styles.actions}>
        <Pressable
          onPress={() => router.push({ pathname: '/criar-perfil', params: { modo: 'editar', id: p.id, passo: 'avatar' } })}
          accessibilityRole="button"
          style={styles.link}>
          <Text style={styles.linkText}>Trocar avatar</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push({ pathname: '/criar-perfil', params: { modo: 'editar', id: p.id, passo: 'interesses' } })}
          accessibilityRole="button"
          style={styles.link}>
          <Text style={styles.linkText}>Interesses</Text>
        </Pressable>
        <Pressable onPress={onRemove} accessibilityRole="button" style={styles.link}>
          <Text style={[styles.linkText, { color: colors.terracotta }]}>Apagar perfil</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${value} ${label}`}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primarySoft },
  top: { alignItems: 'flex-end', paddingHorizontal: 8 },
  content: { padding: sizes.gutter, paddingTop: 0, gap: 16, paddingBottom: 40 },
  title: { fontFamily: fonts.title, fontSize: 30, color: colors.text },
  h2: { fontFamily: fonts.title, fontSize: 20, color: colors.text },
  sub: { fontFamily: fonts.medium, fontSize: 15, color: colors.textSecondary },
  card: { backgroundColor: colors.white, borderRadius: radii.cardLarge, padding: 18, gap: 12 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  name: { fontFamily: fonts.title, fontSize: 22, color: colors.text },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, backgroundColor: colors.primarySoft, borderRadius: radii.card, paddingVertical: 10, alignItems: 'center' },
  statValue: { fontFamily: fonts.title, fontSize: 20, color: colors.primary },
  statLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.textSecondary, textAlign: 'center' },
  chart: { height: 120, flexDirection: 'row', alignItems: 'flex-end', gap: 6, paddingTop: 12 },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.accentShadow,
  },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  bar: { width: '70%', borderRadius: 6 },
  barValue: { fontFamily: fonts.bold, fontSize: 11, color: colors.textSecondary },
  barLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.textSecondary },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.textSecondary },
  label: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  goals: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  goal: {
    minHeight: sizes.minTouch,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
  },
  goalActive: { backgroundColor: colors.primary },
  goalText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  link: { minHeight: sizes.minTouch, justifyContent: 'center', paddingHorizontal: 8 },
  linkText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary, textDecorationLine: 'underline' },
});
