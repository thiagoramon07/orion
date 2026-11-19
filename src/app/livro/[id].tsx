import { router, useLocalSearchParams } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookCover } from '@/components/book-cover';
import { Button } from '@/components/button';
import { Icon, IconName } from '@/components/icon';
import { IconButton } from '@/components/icon-button';
import { Medal } from '@/components/medal';
import { BADGES } from '@/data/badges';
import { getBook, LEVEL_LABEL } from '@/data/books';
import { earnedBadges, isUnlocked, PREVIEW_PAGES, useApp } from '@/store/app-store';
import { colors, fonts, radii, sizes } from '@/theme';
import { goBackOr } from '@/utils/navigation';

export default function LivroScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = getBook(id);
  const { state, actions } = useApp();

  if (!book) {
    return (
      <SafeAreaView style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.h2}>Livro não encontrado.</Text>
        <Button title="Voltar" onPress={() => goBackOr('/explorar')} style={{ marginTop: 16 }} />
      </SafeAreaView>
    );
  }

  const fav = state.favorites.includes(book.id);
  const saved = state.saved.includes(book.id);
  const unlocked = isUnlocked(state, book.id);
  const earned = earnedBadges(state);
  const page = state.progress[book.id] ?? 0;
  const started = page > 0 && !state.finished.includes(book.id);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.top}>
        <IconButton name="back" label="Voltar" color={colors.primary} onPress={() => goBackOr('/explorar')} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.header}>
            <BookCover
              title={book.title}
              background={book.cover.background}
              foreground={book.cover.foreground}
              detail={book.cover.detail}
              motif={book.cover.motif}
              width={120}
              readToMe
            />
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.synopsis}>{book.synopsis}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Chip icon={fav ? 'heart-filled' : 'heart'} label={fav ? 'Favorito' : 'Favoritar'} active={fav} onPress={() => actions.toggleFavorite(book.id)} />
            <Chip icon={saved ? 'check' : 'download'} label={saved ? 'Salvo' : 'Salvar'} active={saved} onPress={() => actions.toggleSaved(book.id)} />
            {book.series ? (
              <Chip
                icon="series"
                label="Ver a série"
                onPress={() => router.push({ pathname: '/buscar', params: { q: book.series } })}
              />
            ) : null}
          </View>

          <Button
            title={started ? 'Continuar lendo' : 'Ler agora'}
            variant="accent"
            onPress={() => router.push({ pathname: '/ler/[id]', params: { id: book.id } })}
          />
          {!unlocked ? (
            <Text style={styles.preview}>
              Prévia grátis: {PREVIEW_PAGES} de {book.pages.length} páginas. Assine para ler tudo.
            </Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.h2}>Ganhe estas medalhas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {BADGES.map((b) => (
              <Medal key={b.id} badge={b} earned={earned.has(b.id)} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.card}>
          <Text style={styles.h2}>Sobre este livro</Text>
          <Info label="Texto" value={book.author} onPress={() => router.push({ pathname: '/buscar', params: { q: book.author } })} />
          <Info label="Ilustrações" value={book.illustrator} onPress={() => router.push({ pathname: '/buscar', params: { q: book.illustrator } })} />
          <View style={styles.facts}>
            <Fact value={`${book.ageMin}–${book.ageMax}`} label="Faixa etária" />
            <Fact value={book.level} label="Nível de leitura" hint={LEVEL_LABEL[book.level]} />
            <Fact value={book.quiz?.length ? 'Sim' : 'Não'} label="Quiz" />
            <Fact value={String(book.pages.length)} label="Páginas" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Chip({ icon, label, active, onPress }: { icon: IconName; label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && { opacity: 0.7 }]}>
      <Icon name={icon} size={20} color={active ? colors.white : colors.primary} />
      <Text style={[styles.chipText, active && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );
}

function Info({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Text style={styles.info}>
      {label}:{' '}
      <Text style={styles.link} onPress={onPress} accessibilityRole="link">
        {value}
      </Text>
    </Text>
  );
}

function Fact({ value, label, hint }: { value: ReactNode; label: string; hint?: string }) {
  return (
    <View style={styles.fact} accessible accessibilityLabel={`${label}: ${hint ?? value}`}>
      <Text style={styles.factValue}>{value}</Text>
      <Text style={styles.factLabel}>{label}</Text>
      {hint ? <Text style={styles.factHint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primarySoft },
  top: { paddingHorizontal: 8 },
  content: { paddingHorizontal: 16, paddingBottom: 40, gap: 16 },
  card: { backgroundColor: colors.white, borderRadius: radii.cardLarge, padding: 18, gap: 14 },
  header: { flexDirection: 'row', gap: 16 },
  title: { fontFamily: fonts.title, fontSize: 22, lineHeight: 26, color: colors.text },
  synopsis: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 21, color: colors.textSecondary },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: sizes.minTouch,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontFamily: fonts.bold, fontSize: 15, color: colors.primary },
  preview: { fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  h2: { fontFamily: fonts.title, fontSize: 20, color: colors.text },
  info: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  link: { color: colors.primary, textDecorationLine: 'underline' },
  facts: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 14 },
  fact: { width: '50%' },
  factValue: { fontFamily: fonts.title, fontSize: 20, color: colors.text },
  factLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary },
  factHint: { fontFamily: fonts.regular, fontSize: 12, color: colors.placeholder },
});
