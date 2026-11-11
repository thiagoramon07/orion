import { FlatList, StyleSheet, Text, View } from 'react-native';

import { BookTile } from '@/components/book-tile';
import type { Book } from '@/data/books';
import { isUnlocked, useApp } from '@/store/app-store';
import { colors, fonts } from '@/theme';

type Props = { title: string; books: Book[]; showProgress?: boolean; empty?: string };

/** Prateleira horizontal de livros. */
export function Shelf({ title, books, showProgress, empty }: Props) {
  const { state } = useApp();
  return (
    <View style={{ gap: 12 }}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {books.length === 0 ? (
        <Text style={styles.empty}>{empty ?? 'Nada por aqui ainda.'}</Text>
      ) : (
        <FlatList
          horizontal
          data={books}
          keyExtractor={(b) => b.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingHorizontal: 20, paddingBottom: 4 }}
          renderItem={({ item }) => (
            <BookTile
              book={item}
              locked={!isUnlocked(state, item.id)}
              progress={showProgress ? ((state.progress[item.id] ?? 0) + 1) / item.pages.length : undefined}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.title, fontSize: 22, color: colors.text, paddingHorizontal: 20 },
  empty: { fontFamily: fonts.medium, fontSize: 15, color: colors.textSecondary, paddingHorizontal: 20 },
});
