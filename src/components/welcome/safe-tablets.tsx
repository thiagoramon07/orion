import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { BookCover } from '@/components/book-cover';
import { Icon } from '@/components/icon';
import { getBook } from '@/data/books';
import { useReduceMotion } from '@/hooks/use-reduce-motion';
import { colors } from '@/theme';

/** Slide 3: dois tablets com capas e um escudo com check pulsando. */
export function SafeTablets({ active }: { active: boolean }) {
  const reduceMotion = useReduceMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion || !active) {
      pulse.value = 1;
      return;
    }
    pulse.value = withRepeat(withTiming(1.12, { duration: 700, easing: Easing.inOut(Easing.quad) }), -1, true);
    return () => cancelAnimation(pulse);
  }, [active, reduceMotion, pulse]);

  const shield = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <View style={styles.wrap}>
      <Tablet id="bichos-do-cerrado" style={{ transform: [{ rotate: '-8deg' }], left: 20, top: 20 }} />
      <Tablet id="contos-da-vila" style={{ transform: [{ rotate: '7deg' }], right: 20, top: 0 }} />
      <Animated.View style={[styles.shield, shield]} accessibilityLabel="Ambiente seguro">
        <Icon name="shield" size={52} color={colors.terracotta} strokeWidth={2.4} />
      </Animated.View>
    </View>
  );
}

function Tablet({ id, style }: { id: string; style: object }) {
  const b = getBook(id)!;
  return (
    <View style={[styles.tablet, style]}>
      <BookCover title={b.title} background={b.cover.background} foreground={b.cover.foreground} detail={b.cover.detail} motif={b.cover.motif} width={104} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 230, width: 300, alignSelf: 'center' },
  tablet: {
    position: 'absolute',
    backgroundColor: '#1C2333',
    padding: 10,
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  shield: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    left: 110,
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.terracottaTint,
  },
});
