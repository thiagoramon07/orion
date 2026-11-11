import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { colors, fonts } from '@/theme';

// TODO: substituir pelo carrossel de boas-vindas + cadastro do responsável (telas 2–8).
export default function BoasVindasPlaceholder() {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>Carrossel de boas-vindas e cadastro — em construção.</Text>
      <Button title="Continuar" variant="accent" onPress={() => router.push('/primeiro-livro')} />
      <Button title="Voltar" variant="outline" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary, justifyContent: 'center', padding: 24, gap: 16 },
  text: { fontFamily: fonts.bold, fontSize: 18, color: colors.white, textAlign: 'center', marginBottom: 8 },
});
