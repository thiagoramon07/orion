import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Buddy, BUDDY_COLORS } from '@/components/buddy';
import { Icon } from '@/components/icon';
import { useApp } from '@/store/app-store';
import { colors, fonts, radii } from '@/theme';

export default function AmigoScreen() {
  const { state, actions } = useApp();
  const hatched = state.finished.length >= 1 && !!state.buddyColor;

  let message: string;
  if (!state.buddyColor) message = 'Escolha uma cor para pintar o seu ovo!';
  else if (!hatched) message = 'Termine um livro para o seu amigo sair do ovo!';
  else message = `Oba! Eu sou o Bolota. Vamos ler mais um, ${state.childName || 'amigo'}?`;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Meu amigo de leitura</Text>
        <View style={styles.stage}>
          <Animated.View key={`${state.buddyColor}-${hatched}`} entering={ZoomIn.duration(350)}>
            <Buddy color={state.buddyColor} hatched={hatched} size={170} />
          </Animated.View>
          <View style={styles.say}>
            <Text style={styles.sayText}>{message}</Text>
          </View>
        </View>

        <Text style={styles.h2}>{hatched ? 'Trocar de cor' : 'Escolha a cor'}</Text>
        <View style={styles.swatches}>
          {BUDDY_COLORS.map((c) => {
            const active = state.buddyColor === c;
            return (
              <Pressable
                key={c}
                onPress={() => actions.setBuddyColor(c)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Cor ${c}`}
                style={[styles.swatch, { backgroundColor: c }, active && styles.swatchActive]}>
                {active && <Icon name="check" size={26} color={colors.white} strokeWidth={3} />}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardText}>
            📚 Livros lidos: <Text style={{ color: colors.primary }}>{state.finished.length}</Text>
          </Text>
          <Text style={styles.hint}>A cada livro terminado seu amigo fica mais feliz. Em breve: roupinhas e acessórios!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.violetTint },
  content: { padding: 20, gap: 18 },
  title: { fontFamily: fonts.title, fontSize: 30, color: colors.violet },
  stage: { alignItems: 'center', gap: 12, paddingVertical: 12 },
  say: { backgroundColor: colors.white, borderRadius: radii.cardLarge, padding: 16, maxWidth: 320 },
  sayText: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 23, color: colors.text, textAlign: 'center' },
  h2: { fontFamily: fonts.title, fontSize: 20, color: colors.text },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  swatch: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.white },
  swatchActive: { borderColor: colors.text, transform: [{ scale: 1.08 }] },
  card: { backgroundColor: colors.white, borderRadius: radii.cardLarge, padding: 18, gap: 6 },
  cardText: { fontFamily: fonts.bold, fontSize: 17, color: colors.text },
  hint: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary },
});
