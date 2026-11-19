import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Caca } from '@/components/caca';
import { Icon } from '@/components/icon';
import { IconButton } from '@/components/icon-button';
import { Medal } from '@/components/medal';
import { BookPage as BookPageView } from '@/components/reader/book-page';
import { PlayerBar } from '@/components/reader/player-bar';
import { SettingsPopover } from '@/components/reader/settings-popover';
import { BADGES } from '@/data/badges';
import { Book, BookPage, getBook } from '@/data/books';
import { SPEECH_RATE, useNarration } from '@/hooks/use-narration';
import { useReduceMotion } from '@/hooks/use-reduce-motion';
import { useWebKeys } from '@/hooks/use-web-keys';
import { speakShort, unlockSpeechOnWeb } from '@/utils/voice';
import { isUnlocked, PREVIEW_PAGES, useApp } from '@/store/app-store';
import { colors, fonts } from '@/theme';
import { goBackOr } from '@/utils/navigation';

type Item = { kind: 'page'; page: BookPage; index: number } | { kind: 'end' } | { kind: 'paywall' };

const NIGHT_BG = '#141A26';

export default function LeitorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = getBook(id);
  if (!book) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Text style={styles.endTitle}>Livro não encontrado.</Text>
        <Button title="Voltar" onPress={() => goBackOr('/explorar')} />
      </SafeAreaView>
    );
  }
  return <Reader book={book} />;
}

function Reader({ book }: { book: Book }) {
  const { state, actions } = useApp();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const settings = state.reader;
  const night = settings.night;

  const unlocked = isUnlocked(state, book.id);
  const readable = unlocked ? book.pages.length : Math.min(PREVIEW_PAGES, book.pages.length);

  const items = useMemo<Item[]>(
    () => [
      ...book.pages.slice(0, readable).map((page, index) => ({ kind: 'page' as const, page, index })),
      unlocked ? { kind: 'end' as const } : { kind: 'paywall' as const },
    ],
    [book, readable, unlocked],
  );

  const startPage = (() => {
    const p = state.progress[book.id] ?? 0;
    return state.finished.includes(book.id) || p >= readable ? 0 : p;
  })();

  const [index, setIndex] = useState(startPage);
  const [playing, setPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const listRef = useRef<FlatList<Item>>(null);

  const current = items[index];
  const pageText = current?.kind === 'page' ? current.page.text : '';
  const onEnd = index >= readable;

  const goTo = useCallback(
    (i: number) => {
      if (!Number.isFinite(i)) return;
      const clamped = Math.max(0, Math.min(items.length - 1, i));
      setIndex(clamped);
      listRef.current?.scrollToIndex({ index: clamped, animated: !reduceMotion });
    },
    [items.length, reduceMotion],
  );

  const { wordIndex } = useNarration({
    text: pageText,
    playing: playing && !onEnd,
    speed: settings.speed,
    onFinished: () => {
      if (index < readable - 1) {
        setTimeout(() => goTo(index + 1), 500);
      } else {
        setPlaying(false);
        setTimeout(() => goTo(readable), 600);
      }
    },
  });

  // Salva progresso e marca o livro como lido ao chegar ao fim.
  useEffect(() => {
    if (index < readable) actions.setProgress(book.id, index);
    else if (unlocked) {
      actions.markFinished(book.id);
      actions.setProgress(book.id, 0);
    }
  }, [index, readable, unlocked, book.id, actions]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  const togglePlay = () => {
    unlockSpeechOnWeb();
    if (onEnd) {
      goTo(0);
      setPlaying(true);
    } else setPlaying((p) => !p);
    actions.markNarrationUsed();
  };

  // Toque numa palavra (com a narração pausada) para ouvir só ela.
  const [tapped, setTapped] = useState(-1);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [tappedPage, setTappedPage] = useState(index);
  if (tappedPage !== index) {
    setTappedPage(index);
    setTapped(-1);
  }
  useEffect(() => () => clearTimeout(tapTimer.current), []);
  const speakWord = (i: number, word: string) => {
    if (playing) return;
    unlockSpeechOnWeb();
    const clean = word.replace(/[^\p{L}\p{N}-]/gu, '');
    if (!clean) return;
    speakShort(clean, SPEECH_RATE[settings.speed] * 0.85);
    setTapped(i);
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => setTapped(-1), 1200);
  };

  // Teclado no computador: ← → viram a página, espaço lê/pausa, Esc fecha.
  useWebKeys((key) => {
    switch (key) {
      case 'ArrowRight':
        goTo(index + 1);
        return true;
      case 'ArrowLeft':
        goTo(index - 1);
        return true;
      case ' ':
        togglePlay();
        return true;
      case 'Escape':
        goBackOr('/explorar');
        return true;
    }
  });
  const showArrows = Platform.OS === 'web' && width >= 600;

  const fav = state.favorites.includes(book.id);
  const saved = state.saved.includes(book.id);
  const playerSpace = 110 + insets.bottom;
  const spread = width >= 700 && width > height;
  const topSpace = insets.top + 52 + (unlocked ? 0 : 30);
  const pageH = Math.max(320, height - topSpace - playerSpace - 32);

  const renderItem = ({ item }: { item: Item }) => {
    if (item.kind === 'page') {
      const active = item.index === index;
      return (
        <View style={[styles.page, { width, paddingBottom: playerSpace }]}>
          <BookPageView
            page={item.page}
            number={item.index + 1}
            width={Math.min(width, 1100)}
            height={pageH}
            spread={spread}
            night={night}
            highlight={settings.highlight || (!playing && tapped >= 0)}
            activeIndex={!active ? -1 : playing ? wordIndex : tapped}
            onWordPress={speakWord}
          />
        </View>
      );
    }
    if (item.kind === 'end') return <EndPage book={book} width={width} bottom={playerSpace} night={night} onRestart={() => goTo(0)} />;
    return <Paywall book={book} width={width} bottom={playerSpace} night={night} />;
  };

  return (
    <View style={[styles.root, night && { backgroundColor: NIGHT_BG }]}>
      <SafeAreaView edges={['top']} style={styles.topBar}>
        <View style={styles.topRow}>
          <IconButton name="more" label="Sobre este livro" color={colors.white} onPress={() => router.push({ pathname: '/livro/[id]', params: { id: book.id } })} />
          <IconButton name={fav ? 'heart-filled' : 'heart'} label={fav ? 'Tirar dos favoritos' : 'Favoritar'} color={colors.white} onPress={() => actions.toggleFavorite(book.id)} />
          <IconButton name={saved ? 'check' : 'download'} label={saved ? 'Salvo' : 'Salvar'} color={colors.white} onPress={() => actions.toggleSaved(book.id)} />
          {book.quiz?.length ? (
            <IconButton name="quiz" label="Fazer o quiz" color={colors.white} onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: book.id } })} />
          ) : null}
          <Text style={styles.topTitle} numberOfLines={1}>
            {book.title}
          </Text>
          <IconButton name="close" label="Fechar livro" color={colors.white} onPress={() => goBackOr('/explorar')} />
        </View>
      </SafeAreaView>
      {!unlocked ? (
        <View style={styles.preview}>
          <Text style={styles.previewText}>PRÉVIA GRÁTIS</Text>
          <Text style={styles.previewPages}>
            (página {Math.min(index + 1, readable)}/{book.pages.length})
          </Text>
        </View>
      ) : null}

      <FlatList
        ref={listRef}
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        extraData={[index, wordIndex, settings, tapped, playing, pageH, spread]}
        initialScrollIndex={startPage}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onMomentumScrollEnd={onScrollEnd}
        onScrollToIndexFailed={() => {}}
      />

      {showArrows ? (
        <>
          {index > 0 ? (
            <IconButton
              name="back"
              label="Página anterior"
              color={colors.primary}
              background={colors.white}
              onPress={() => goTo(index - 1)}
              style={[styles.arrow, { left: 6, top: topSpace + pageH / 2 - 22 }]}
            />
          ) : null}
          {index < items.length - 1 ? (
            <IconButton
              name="chevron-right"
              label="Próxima página"
              color={colors.primary}
              background={colors.white}
              onPress={() => goTo(index + 1)}
              style={[styles.arrow, { right: 6, top: topSpace + pageH / 2 - 22 }]}
            />
          ) : null}
        </>
      ) : null}

      {showSettings ? (
        <SettingsPopover settings={settings} onChange={actions.updateReader} bottom={playerSpace + 4} />
      ) : null}

      <View style={[styles.player, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ width: '100%', maxWidth: 900, alignSelf: 'center' }}>
        <PlayerBar
          playing={playing && !onEnd}
          onTogglePlay={togglePlay}
          page={Math.min(index, readable - 1)}
          total={readable}
          onSeek={(p) => p !== index && goTo(p)}
          onOpenSettings={() => setShowSettings((s) => !s)}
          settingsOpen={showSettings}
          night={night}
        />
        </View>
      </View>
    </View>
  );
}

function EndPage({ book, width, bottom, night, onRestart }: { book: Book; width: number; bottom: number; night: boolean; onRestart: () => void }) {
  const { state } = useApp();
  const firstBadge = BADGES[0];
  return (
    <View style={[styles.page, styles.center, { width, paddingBottom: bottom }]}>
      <Animated.View entering={ZoomIn.duration(400)}>
        <Caca variant="head" size={120} />
      </Animated.View>
      <Text style={[styles.endTitle, night && { color: colors.white }]}>Fim! Que leitura incrível!</Text>
      <Text style={[styles.endText, night && { color: colors.primaryTint }]}>
        {state.childName ? `${state.childName}, você` : 'Você'} terminou “{book.title}”.
      </Text>
      {state.finished.length <= 1 ? (
        <Animated.View entering={FadeIn.delay(300)} style={{ alignItems: 'center' }}>
          <Medal badge={firstBadge} earned size={84} />
          <Text style={[styles.endText, night && { color: colors.primaryTint }]}>Nova medalha: {firstBadge.description}!</Text>
        </Animated.View>
      ) : null}
      <View style={styles.endButtons}>
        {book.quiz?.length ? (
          <Button title="Fazer o quiz" variant="accent" onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: book.id } })} />
        ) : null}
        <Button title="Ler de novo" variant="primary" onPress={onRestart} />
        <Button title="Voltar para a estante" variant="outline" textColor={colors.primary} borderColor={colors.primary} onPress={() => goBackOr('/explorar')} />
      </View>
    </View>
  );
}

function Paywall({ book, width, bottom, night }: { book: Book; width: number; bottom: number; night: boolean }) {
  return (
    <View style={[styles.page, styles.center, { width, paddingBottom: bottom }]}>
      <View style={styles.lockCircle}>
        <Icon name="lock" size={40} color={colors.primary} />
      </View>
      <Text style={[styles.endTitle, night && { color: colors.white }]}>Gostou da prévia?</Text>
      <Text style={[styles.endText, night && { color: colors.primaryTint }]}>
        Peça para um adulto liberar a leitura completa de “{book.title}” e de toda a biblioteca.
      </Text>
      <View style={styles.endButtons}>
        <Button title="Liberar leitura completa" variant="accent" onPress={() => router.push('/assinatura')} />
        <Button title="Voltar para a estante" variant="outline" textColor={colors.primary} borderColor={colors.primary} onPress={() => goBackOr('/explorar')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EFE6D6' },
  topBar: { backgroundColor: colors.primary },
  topRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 4, gap: 2 },
  topTitle: { flex: 1, fontFamily: fonts.bold, fontSize: 15, color: colors.primaryTint, textAlign: 'right', paddingHorizontal: 6 },
  preview: { backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 6 },
  previewText: { fontFamily: fonts.title, fontSize: 15, color: colors.text },
  previewPages: { fontFamily: fonts.bold, fontSize: 13, color: colors.text },
  page: { paddingHorizontal: 16, paddingTop: 16, gap: 14, alignItems: 'center' },
  center: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  arrow: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  player: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 12 },
  endTitle: { fontFamily: fonts.title, fontSize: 28, lineHeight: 32, color: colors.primary, textAlign: 'center' },
  endText: { fontFamily: fonts.medium, fontSize: 17, lineHeight: 24, color: colors.textSecondary, textAlign: 'center' },
  endButtons: { alignSelf: 'stretch', gap: 10, marginTop: 8 },
  lockCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
});
