import type React from "react";
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Caca } from '@/components/caca';
import { Medal } from '@/components/medal';
import { BADGES } from '@/data/badges';
import { useReduceMotion } from '@/hooks/use-reduce-motion';
import { colors, fonts, radii } from '@/theme';

const SHOWN = [
  { badge: BADGES.find((b) => b.id === 'primeiro-livro')!, label: '1º livro' },
  { badge: BADGES.find((b) => b.id === 'dez-livros')!, label: '10 livros' },
  { badge: BADGES.find((b) => b.id === 'sete-dias')!, label: '7 dias seguidos' },
];

/** Slide 2: Cacá com balão + card de medalhas saltitando e barra de progresso. */
export function Journey({ active }: { active: boolean }) {
  const reduceMotion = useReduceMotion();
  const fill = useSharedValue(reduceMotion ? 0.7 : 0);

  useEffect(() => {
    if (reduceMotion) {
      fill.value = 0.7;
      return;
    }
    if (!active) {
      fill.value = 0;
      return;
    }
    fill.value = withRepeat(
      withSequence(withTiming(0.7, { duration: 1600, easing: Easing.out(Easing.cubic) }), withDelay(1400, withTiming(0, { duration: 0 }))),
      -1,
    );
    return () => cancelAnimation(fill);
  }, [active, reduceMotion, fill]);

  const barStyle = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));

  return (
    <View style={styles.wrap}>
      <View style={styles.cacaRow}>
        <Caca variant="head" size={90} />
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>Bora ler mais um capítulo?</Text>
          <View style={styles.bubbleTail} />
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.medals}>
          {SHOWN.map((m, i) => (
            <Hop key={m.label} index={i} active={active}>
              <Medal badge={{ ...m.badge, label: m.label }} earned size={58} />
            </Hop>
          ))}
        </View>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, barStyle]} />
        </View>
        <Text style={styles.caption}>Rumo à próxima medalha!</Text>
      </View>
    </View>
  );
}

function Hop({ index, active, children }: { index: number; active: boolean; children: React.ReactNode }) {
  const reduceMotion = useReduceMotion();
  const y = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion || !active) {
      y.value = 0;
      return;
    }
    y.value = withDelay(
      index * 180,
      withRepeat(withSequence(withTiming(-10, { duration: 260 }), withTiming(0, { duration: 260 }), withTiming(0, { duration: 900 })), -1),
    );
    return () => cancelAnimation(y);
  }, [active, reduceMotion, index, y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 12 },
  cacaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bubble: { backgroundColor: colors.white, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, maxWidth: 170 },
  bubbleText: { fontFamily: fonts.bold, fontSize: 15, color: colors.violet },
  bubbleTail: {
    position: 'absolute',
    left: -6,
    top: 18,
    width: 14,
    height: 14,
    backgroundColor: colors.white,
    transform: [{ rotate: '45deg' }],
  },
  card: { backgroundColor: colors.white, borderRadius: radii.cardLarge, padding: 16, gap: 10, width: 290 },
  medals: { flexDirection: 'row', justifyContent: 'space-around' },
  track: { height: 12, borderRadius: 6, backgroundColor: colors.violetTint, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.accent, borderRadius: 6 },
  caption: { fontFamily: fonts.bold, fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
});
