import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgeSelect } from '@/components/age-select';
import { BookTile } from '@/components/book-tile';
import { Caca } from '@/components/caca';
import { IconButton } from '@/components/icon-button';
import { popularForAge } from '@/data/books';
import { useApp } from '@/store/app-store';
import { useContentWidth } from '@/hooks/use-content-width';
import { colors, fonts, sizes } from '@/theme';

export default function PrimeiroLivroScreen() {
  const { state } = useApp();
  const [age, setAge] = useState(state.childAge || 6);
  const width = useContentWidth();
  const books = popularForAge(age);
  const tileW = Math.min(150, (width - sizes.gutter * 2 - 24) / 2);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.top}>
        <IconButton
          name="back"
          label="Voltar"
          color={colors.primary}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        />
        <Caca variant="head" size={56} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Vamos achar o primeiro livro para lerem juntos!</Text>

        <View style={styles.pickRow}>
          <Text style={styles.pickLabel}>Escolha um livro popular para</Text>
          <AgeSelect value={age} onChange={setAge} />
        </View>

        <View style={styles.grid}>
          {books.map((b, i) => (
            <Animated.View key={`${age}-${b.id}`} entering={FadeInUp.delay(i * 90).duration(350)}>
              <BookTile
                book={b}
                width={tileW}
                onPress={() => router.push({ pathname: '/nome-crianca', params: { book: b.id, age: String(age) } })}
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primarySoft },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  content: { paddingHorizontal: sizes.gutter, paddingBottom: 40, gap: 20 },
  title: { fontFamily: fonts.title, fontSize: 30, lineHeight: 34, color: colors.primary },
  pickRow: { gap: 8 },
  pickLabel: { fontFamily: fonts.bold, fontSize: 16, color: colors.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'center' },
});
