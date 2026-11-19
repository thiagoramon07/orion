import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChildAvatar } from '@/components/child-avatar';
import { Icon } from '@/components/icon';
import { Logo } from '@/components/logo';
import { MAX_PROFILES, useApp } from '@/store/app-store';
import { colors, fonts, radii, sizes } from '@/theme';

/** Escolha de quem vai ler agora (aparece quando a família tem mais de uma criança). */
export default function QuemLeScreen() {
  const { state, actions } = useApp();

  const pick = (id: string) => {
    actions.switchProfile(id);
    router.replace('/explorar');
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Logo size={32} />
        <Text style={styles.title} accessibilityRole="header">
          Quem vai ler agora?
        </Text>
        <View style={styles.grid}>
          {state.profiles.map((p, i) => (
            <Animated.View key={p.id} entering={FadeInUp.delay(i * 80)}>
              <Pressable
                onPress={() => pick(p.id)}
                accessibilityRole="button"
                accessibilityLabel={`Ler como ${p.name}`}
                style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.97 }] }]}>
                <ChildAvatar avatar={p.avatar} size={96} ring={p.id === state.activeProfileId} />
                <Text style={styles.name} numberOfLines={1}>
                  {p.name}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
          {state.profiles.length < MAX_PROFILES ? (
            <Pressable
              onPress={() => router.push({ pathname: '/pais', params: { acao: 'adicionar' } })}
              accessibilityRole="button"
              accessibilityLabel="Adicionar criança"
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}>
              <View style={styles.add}>
                <Text style={styles.plus}>+</Text>
              </View>
              <Text style={styles.name}>Adicionar</Text>
            </Pressable>
          ) : null}
        </View>
        <Pressable onPress={() => router.push('/pais')} accessibilityRole="button" style={styles.parents}>
          <Icon name="lock" size={18} color={colors.white} />
          <Text style={styles.parentsText}>Área dos responsáveis</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },
  content: { padding: sizes.gutter, alignItems: 'center', gap: 24, paddingTop: 40 },
  title: { fontFamily: fonts.title, fontSize: 30, color: colors.white, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20, maxWidth: 420 },
  card: { width: 130, alignItems: 'center', gap: 10, padding: 8, borderRadius: radii.cardLarge },
  name: { fontFamily: fonts.bold, fontSize: 17, color: colors.white },
  add: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: { fontFamily: fonts.title, fontSize: 44, color: colors.white, lineHeight: 50 },
  parents: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: sizes.minTouch, paddingHorizontal: 12 },
  parentsText: { fontFamily: fonts.bold, fontSize: 15, color: colors.white, textDecorationLine: 'underline' },
});
