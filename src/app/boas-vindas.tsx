import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { colors, fonts } from '@/theme';

// TODO: substituir pelo carrossel de boas-vindas (próxima etapa).
export default function BoasVindasPlaceholder() {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>Carrossel de boas-vindas — próxima etapa.</Text>
      <Button title="Voltar" variant="white" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary, justifyContent: 'center', padding: 24, gap: 24 },
  text: { fontFamily: fonts.bold, fontSize: 18, color: colors.white, textAlign: 'center' },
});
