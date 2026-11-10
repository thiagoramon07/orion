import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Bookshelf } from '@/components/bookshelf';
import { Button } from '@/components/button';
import { Caca } from '@/components/caca';
import { Logo } from '@/components/logo';
import { Sparkle } from '@/components/sparkle';
import { useReduceMotion } from '@/hooks/use-reduce-motion';
import { colors, fonts, sizes } from '@/theme';

/** Posições dos brilhos em % da área superior. */
const SPARKLES = [
  { top: '8%', left: '12%', size: 18, delay: 0 },
  { top: '14%', left: '80%', size: 14, delay: 500 },
  { top: '30%', left: '6%', size: 12, delay: 900 },
  { top: '38%', left: '86%', size: 20, delay: 250 },
  { top: '4%', left: '52%', size: 10, delay: 1200 },
  { top: '52%', left: '18%', size: 10, delay: 700 },
  { top: '50%', left: '76%', size: 12, delay: 1500 },
] as const;

export default function AberturaScreen() {
  const reduceMotion = useReduceMotion();
  const float = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      float.value = 0;
      return;
    }
    float.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => cancelAnimation(float);
  }, [reduceMotion, float]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -10 * float.value }, { rotate: `${(float.value - 0.5) * 3}deg` }],
  }));

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        {SPARKLES.map((s, i) => (
          <Sparkle
            key={i}
            size={s.size}
            delay={s.delay}
            color={i % 2 ? colors.white : colors.accentLight}
            style={{ top: s.top, left: s.left }}
          />
        ))}

        <View style={styles.hero}>
          <Animated.View entering={FadeIn.duration(600)} style={floatStyle}>
            <Caca variant="full" size={220} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).duration(500)} style={styles.brand}>
            <Logo size={56} />
            <Text style={styles.slogan}>livros que abrem mundos</Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(450).duration(500)} style={styles.cta}>
          <Button
            title="Vamos ler!"
            variant="accent"
            onPress={() => router.push('/boas-vindas')}
            accessibilityHint="Abre a apresentação do Folheia"
          />
        </Animated.View>
      </SafeAreaView>

      <Bookshelf />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },
  safe: { flex: 1, paddingHorizontal: sizes.gutter },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  brand: { alignItems: 'center', gap: 6 },
  slogan: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: colors.primaryTint,
  },
  cta: { paddingBottom: 28 },
});
