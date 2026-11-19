import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookTile } from '@/components/book-tile';
import { Button } from '@/components/button';
import { IconButton } from '@/components/icon-button';
import { Input } from '@/components/input';
import { getBook } from '@/data/books';
import { useApp } from '@/store/app-store';
import { colors, fonts, sizes } from '@/theme';

export default function NomeCriancaScreen() {
  const { book: bookId, age } = useLocalSearchParams<{ book: string; age: string }>();
  const book = getBook(bookId);
  const { actions } = useApp();
  const [name, setName] = useState('');
  const valid = name.trim().length >= 2;

  const start = () => {
    if (!valid || !book) return;
    actions.setChild(name.trim(), Number(age) || 6, book.id);
    // Abre o livro direto; ao fechar o leitor, a criança cai na estante (Explorar).
    router.dismissAll();
    router.replace({ pathname: '/ler/[id]', params: { id: book.id } });
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <IconButton name="back" label="Voltar" color={colors.primary} onPress={() => router.back()} style={styles.back} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {book ? (
            <Animated.View entering={ZoomIn.duration(350)} style={{ alignSelf: 'center' }}>
              <BookTile book={book} width={140} showTitle={false} onPress={() => {}} />
            </Animated.View>
          ) : null}
          <Text style={styles.title}>Ótima escolha! Só falta um passo para começar.</Text>
          <Text style={styles.subtitle}>Conte o nome da criança para deixarmos tudo com a cara dela.</Text>

          <Input
            label="Nome ou apelido da criança"
            placeholder="Ex.: Bia"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={20}
            returnKeyType="go"
            onSubmitEditing={start}
          />
          <View style={{ marginTop: 8 }}>
            <Button title="Começar a ler" variant="accent" disabled={!valid} onPress={start} />
          </View>
          <Text style={styles.note}>Usamos só o primeiro nome ou apelido. Nada de sobrenome.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  back: { marginLeft: 12, marginTop: 4 },
  content: { paddingHorizontal: sizes.gutter, paddingBottom: 40, gap: 16 },
  title: { fontFamily: fonts.title, fontSize: 28, lineHeight: 32, color: colors.primary, textAlign: 'center' },
  subtitle: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 24, color: colors.textSecondary, textAlign: 'center' },
  note: { fontFamily: fonts.regular, fontSize: 13, color: colors.placeholder, textAlign: 'center' },
});
