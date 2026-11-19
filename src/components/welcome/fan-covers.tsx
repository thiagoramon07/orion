import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';

import { BookCover } from '@/components/book-cover';
import { getBook } from '@/data/books';
import { useReduceMotion } from '@/hooks/use-reduce-motion';

const FAN = [
  { id: 'vovo-pirata', rotate: -14, x: -78, y: 18 },
  { id: 'sapo-astronauta', rotate: 14, x: 78, y: 18 },
  { id: 'misterios-do-quintal', rotate: 0, x: 0, y: 0 },
];

/** Slide 1: três capas em leque entrando com mola. */
export function FanCovers({ active }: { active: boolean }) {
  return (
    <View style={styles.wrap}>
      {FAN.map((f, i) => (
        <FanItem key={f.id} {...f} index={i} active={active} />
      ))}
    </View>
  );
}

function FanItem({ id, rotate, x, y, index, active }: (typeof FAN)[number] & { index: number; active: boolean }) {
  const reduceMotion = useReduceMotion();
  const p = useSharedValue(reduceMotion ? 1 : 0);
  const book = getBook(id)!;

  useEffect(() => {
    if (reduceMotion) {
      p.value = 1;
      return;
    }
    if (active) p.value = withDelay(index * 140, withSpring(1, { damping: 12, stiffness: 120 }));
    else p.value = 0;
  }, [active, reduceMotion, index, p]);

  const style = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [
      { translateX: x * p.value },
      { translateY: y + (1 - p.value) * 80 },
      { rotate: `${rotate * p.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.item, style]}>
      <BookCover
        title={book.title}
        background={book.cover.background}
        foreground={book.cover.foreground}
        detail={book.cover.detail}
        motif={book.cover.motif}
        width={130}
        style={styles.shadow}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 230, alignItems: 'center', justifyContent: 'center' },
  item: { position: 'absolute' },
  shadow: { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
});
