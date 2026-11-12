import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookTile } from '@/components/book-tile';
import { Icon } from '@/components/icon';
import { Input } from '@/components/input';
import { searchBooks } from '@/data/books';
import { isUnlocked, useApp } from '@/store/app-store';
import { useContentWidth } from '@/hooks/use-content-width';
import { colors, fonts } from '@/theme';

const SUGGESTIONS = ['bichos', 'espaço', 'mistério', 'natureza', 'humor', 'Cacá', 'família'];

export default function BuscarScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? '');
  const { state } = useApp();
  const width = useContentWidth();

  // Quando outra tela abre a busca com um termo (ex.: "Ver a série"), usa esse termo.
  const [lastParam, setLastParam] = useState(params.q);
  if (params.q !== lastParam) {
    setLastParam(params.q);
    if (params.q) setQuery(params.q);
  }

  const results = searchBooks(query);
  const cols = 3;
  const tileW = (width - 40 - 16 * (cols - 1)) / cols;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.head}>
        <Text style={styles.title}>Buscar</Text>
        <Input
          placeholder="Título, autor ou assunto"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Buscar livros"
          right={
            query ? (
              <Pressable onPress={() => setQuery('')} accessibilityLabel="Limpar busca" hitSlop={10}>
                <Icon name="close" size={20} color={colors.placeholder} />
              </Pressable>
            ) : (
              <Icon name="search" size={20} color={colors.placeholder} />
            )
          }
        />
        <FlatList
          horizontal
          data={SUGGESTIONS}
          keyExtractor={(s) => s}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => setQuery(item)} style={styles.sugg} accessibilityRole="button">
              <Text style={styles.suggText}>{item}</Text>
            </Pressable>
          )}
        />
      </View>
      <FlatList
        data={results}
        key={cols}
        numColumns={cols}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ padding: 20, gap: 20 }}
        columnWrapperStyle={{ gap: 16 }}
        ListHeaderComponent={
          <Text style={styles.count}>
            {results.length} {results.length === 1 ? 'livro encontrado' : 'livros encontrados'}
          </Text>
        }
        ListEmptyComponent={<Text style={styles.empty}>Não achamos nada. Que tal outra palavra?</Text>}
        renderItem={({ item }) => <BookTile book={item} width={tileW} locked={!isUnlocked(state, item.id)} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primarySoft },
  head: { paddingHorizontal: 20, paddingTop: 8, gap: 12 },
  title: { fontFamily: fonts.title, fontSize: 30, color: colors.text },
  sugg: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 999, backgroundColor: colors.primaryTint },
  suggText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary },
  count: { fontFamily: fonts.bold, fontSize: 14, color: colors.textSecondary },
  empty: { fontFamily: fonts.medium, fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginTop: 32 },
});
