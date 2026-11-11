import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/icon-button';
import { colors, fonts, sizes } from '@/theme';

// TODO: substituir pelo texto jurídico final (Termos de Uso e Política de Privacidade).
export default function PoliticaScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.top}>
        <IconButton name="close" label="Fechar" color={colors.text} onPress={() => router.back()} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Termos de Uso e Política de Privacidade</Text>
        <Text style={styles.text}>
          Versão provisória. O texto completo, revisado juridicamente e de acordo com a LGPD (Lei nº 13.709/2018) e o
          Estatuto da Criança e do Adolescente, será publicado aqui antes do lançamento.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  top: { alignItems: 'flex-end', paddingHorizontal: 8 },
  content: { padding: sizes.gutter, gap: 16 },
  title: { fontFamily: fonts.title, fontSize: 26, lineHeight: 30, color: colors.text },
  text: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.textSecondary },
});
