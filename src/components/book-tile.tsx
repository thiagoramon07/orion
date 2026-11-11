import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BookCover } from '@/components/book-cover';
import { Icon } from '@/components/icon';
import type { Book } from '@/data/books';
import { colors, fonts } from '@/theme';

type Props = {
  book: Book;
  width?: number;
  showTitle?: boolean;
  /** Progresso 0–1 (barra abaixo da capa). */
  progress?: number;
  locked?: boolean;
  onPress?: () => void;
};

/** Capa tocável que abre o detalhe do livro. */
export function BookTile({ book, width = 112, showTitle = true, progress, locked, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress ?? (() => router.push({ pathname: '/livro/[id]', params: { id: book.id } }))}
      accessibilityRole="button"
      accessibilityLabel={`${book.title}, de ${book.author}`}
      style={({ pressed }) => [{ width, opacity: pressed ? 0.85 : 1 }]}>
      <View>
        <BookCover
          title={book.title}
          background={book.cover.background}
          foreground={book.cover.foreground}
          detail={book.cover.detail}
          motif={book.cover.motif}
          width={width}
          readToMe
          style={styles.shadow}
        />
        {book.isNew ? <Text style={styles.newTag}>NOVO</Text> : null}
        {locked ? (
          <View style={styles.lock}>
            <Icon name="lock" size={14} color={colors.white} />
          </View>
        ) : null}
      </View>
      {progress !== undefined ? (
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
      ) : null}
      {showTitle ? (
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  newTag: {
    position: 'absolute',
    top: 8,
    right: -4,
    backgroundColor: colors.accent,
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  lock: {
    position: 'absolute',
    bottom: 6,
    left: 10,
    backgroundColor: 'rgba(28,35,51,0.7)',
    borderRadius: 12,
    padding: 4,
  },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.divider, marginTop: 8, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.leaf },
  title: { fontFamily: fonts.bold, fontSize: 13, color: colors.text, marginTop: 6 },
});
