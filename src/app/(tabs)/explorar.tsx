import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Buddy } from '@/components/buddy';
import { Button } from '@/components/button';
import { Icon, IconName } from '@/components/icon';
import { IconButton } from '@/components/icon-button';
import { Logo } from '@/components/logo';
import { Scene } from '@/components/scene';
import { Shelf } from '@/components/shelf';
import { Book, BOOKS, booksForAge } from '@/data/books';
import { useReduceMotion } from '@/hooks/use-reduce-motion';
import { currentStreak, useApp } from '@/store/app-store';
import { useContentWidth } from '@/hooks/use-content-width';
import { colors, fonts, radii } from '@/theme';

type CategoryId = 'para-voce' | 'novidades' | 'favoritos' | 'leia-pra-mim' | 'videos' | 'audiolivros';

const CATEGORIES: { id: CategoryId; label: string; icon: IconName; color: string }[] = [
  { id: 'para-voce', label: 'Para você', icon: 'thumbs-up', color: colors.primary },
  { id: 'novidades', label: 'Novidades', icon: 'megaphone', color: '#5E9E3C' },
  { id: 'favoritos', label: 'Favoritos', icon: 'heart-filled', color: '#E5484D' },
  { id: 'leia-pra-mim', label: 'Leia pra mim', icon: 'book', color: colors.primaryDark },
  { id: 'videos', label: 'Vídeos', icon: 'video', color: '#D14D8B' },
  { id: 'audiolivros', label: 'Audiolivros', icon: 'headphones', color: colors.violet },
];

const FEATURED = [...BOOKS].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew) || b.popularity - a.popularity).slice(0, 5);

export default function ExplorarScreen() {
  const { state, actions } = useApp();
  const [category, setCategory] = useState<CategoryId>('para-voce');
  const streak = currentStreak(state.readDays);

  const inProgress = BOOKS.filter((b) => (state.progress[b.id] ?? 0) > 0 && !state.finished.includes(b.id));
  const forAge = booksForAge(state.childAge);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32, gap: 24 }}>
        <View style={styles.header}>
          <View>
            <Logo size={26} color={colors.primary} />
            <Text style={styles.hello}>Oi, {state.childName || 'leitor'}! 👋</Text>
          </View>
          <View style={styles.streak} accessible accessibilityLabel={`${streak} dias seguidos lendo`}>
            <Text style={styles.streakText}>🔥 {streak} {streak === 1 ? 'dia' : 'dias'}</Text>
          </View>
        </View>

        <Featured books={FEATURED} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cats}>
          {CATEGORIES.map((c) => {
            const active = c.id === category;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCategory(c.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                style={[styles.cat, active && { backgroundColor: c.color, borderColor: c.color }]}>
                <Icon name={c.icon} size={22} color={active ? colors.white : c.color} />
                <Text style={[styles.catText, { color: active ? colors.white : colors.text }]}>{c.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {category === 'para-voce' && (
          <>
            {inProgress.length > 0 && <Shelf title="Continue lendo" books={inProgress} showProgress />}
            <Shelf title={`Para quem tem ${state.childAge} anos`} books={forAge} />
            <Shelf title="Aventuras da Cacá" books={BOOKS.filter((b) => b.series === 'Aventuras da Cacá')} />
            <Shelf title="Natureza e bichos" books={BOOKS.filter((b) => b.tags.includes('bichos') || b.tags.includes('natureza'))} />
            <Shelf title="Toda a biblioteca" books={BOOKS} />
          </>
        )}
        {category === 'novidades' && <Shelf title="Acabaram de chegar" books={BOOKS.filter((b) => b.isNew)} />}
        {category === 'favoritos' && (
          <Shelf
            title="Seus favoritos"
            books={BOOKS.filter((b) => state.favorites.includes(b.id))}
            empty="Toque no coração de um livro para guardá-lo aqui."
          />
        )}
        {category === 'leia-pra-mim' && (
          <Shelf title="Livros que a Cacá lê pra você" books={BOOKS} />
        )}
        {(category === 'videos' || category === 'audiolivros') && (
          <View style={styles.soon}>
            <Text style={styles.soonTitle}>Em breve! 🎬</Text>
            <Text style={styles.soonText}>
              Estamos preparando {category === 'videos' ? 'vídeos' : 'audiolivros'} fresquinhos para você.
            </Text>
          </View>
        )}
      </ScrollView>

      {!state.buddyTipDismissed && (
        <Animated.View entering={FadeInDown.delay(600)} exiting={FadeOut} style={styles.tip}>
          <Pressable onPress={() => router.push('/amigo')} accessibilityRole="button" accessibilityLabel="Abrir meu amigo de leitura">
            <Buddy size={70} />
          </Pressable>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>
              Oi! Sou seu novo amigo de leitura. <Text style={{ color: colors.violet }}>Toque em mim para escolher uma cor.</Text>
            </Text>
            <IconButton
              name="close"
              label="Fechar dica"
              size={16}
              color={colors.white}
              background={colors.primary}
              onPress={actions.dismissBuddyTip}
              style={styles.bubbleClose}
            />
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

function Featured({ books }: { books: Book[] }) {
  const width = useContentWidth();
  const reduceMotion = useReduceMotion();
  const [active, setActive] = useState(0);
  const listRef = useRef<FlatList<Book>>(null);
  const cardW = width - 40;

  // Passa sozinho a cada 6 s (desligado com "reduzir movimento").
  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => {
      setActive((a) => {
        const next = (a + 1) % books.length;
        listRef.current?.scrollToOffset({ offset: next * (cardW + 12), animated: true });
        return next;
      });
    }, 6000);
    return () => clearInterval(t);
  }, [reduceMotion, books.length, cardW]);

  return (
    <View style={{ gap: 10 }}>
      <FlatList
        ref={listRef}
        horizontal
        data={books}
        keyExtractor={(b) => b.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardW + 12}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        onMomentumScrollEnd={(e) => setActive(Math.round(e.nativeEvent.contentOffset.x / (cardW + 12)))}
        renderItem={({ item }) => (
          <View style={[styles.feat, { width: cardW, backgroundColor: item.cover.background }]}>
            <Scene scene={item.pages[0].scene} style={StyleSheet.absoluteFill} />
            <View style={styles.featShade} />
            {item.isNew ? <Text style={styles.featTag}>NOVO NO FOLHEIA</Text> : <Text style={styles.featTag}>FAVORITO DA TURMA</Text>}
            <View style={styles.featBottom}>
              <Text style={styles.featTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Button
                title="Começar a ler"
                variant="white"
                style={{ alignSelf: 'flex-start' }}
                onPress={() => router.push({ pathname: '/livro/[id]', params: { id: item.id } })}
              />
            </View>
          </View>
        )}
      />
      <View style={styles.dots}>
        {books.map((b, i) => (
          <Pressable
            key={b.id}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Destaque ${i + 1}: ${b.title}`}
            onPress={() => {
              setActive(i);
              listRef.current?.scrollToOffset({ offset: i * (cardW + 12), animated: true });
            }}>
            <View style={[styles.dot, i === active && styles.dotActive]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primarySoft },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8 },
  hello: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginTop: 2 },
  streak: { backgroundColor: colors.white, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: colors.border },
  streakText: { fontFamily: fonts.bold, fontSize: 15, color: colors.terracotta },
  feat: { height: 220, borderRadius: radii.cardLarge, overflow: 'hidden', justifyContent: 'space-between', padding: 16 },
  featShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(8,79,79,0.35)' },
  featTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  featBottom: { gap: 10 },
  featTitle: {
    fontFamily: fonts.title,
    fontSize: 28,
    lineHeight: 32,
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 6,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 24, backgroundColor: colors.accent },
  cats: { paddingHorizontal: 20, gap: 10 },
  cat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  catText: { fontFamily: fonts.bold, fontSize: 15 },
  soon: { marginHorizontal: 20, backgroundColor: colors.white, borderRadius: radii.cardLarge, padding: 24, gap: 6, alignItems: 'center' },
  soonTitle: { fontFamily: fonts.title, fontSize: 24, color: colors.text },
  soonText: { fontFamily: fonts.medium, fontSize: 16, color: colors.textSecondary, textAlign: 'center' },
  tip: { position: 'absolute', left: 12, right: 12, bottom: 12, flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  bubble: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.cardLarge,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
    paddingRight: 28,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  bubbleText: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: colors.text },
  bubbleClose: { position: 'absolute', top: -16, right: -10, width: 36, height: 36 },
});
