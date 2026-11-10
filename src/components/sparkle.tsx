import { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
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
import Svg, { Path } from 'react-native-svg';

import { useReduceMotion } from '@/hooks/use-reduce-motion';
import { colors } from '@/theme';

type Props = {
  size?: number;
  color?: string;
  /** Atraso (ms) para os brilhos não piscarem todos juntos. */
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
};

/** Brilho de 4 pontas que pisca suavemente (estático com "reduzir movimento"). */
export function Sparkle({ size = 16, color = colors.accentLight, delay = 0, duration = 1400, style }: Props) {
  const reduceMotion = useReduceMotion();
  const t = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      t.value = 1;
      return;
    }
    const ease = Easing.inOut(Easing.quad);
    t.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(0.25, { duration, easing: ease }), withTiming(1, { duration, easing: ease })),
        -1,
      ),
    );
    return () => cancelAnimation(t);
  }, [reduceMotion, delay, duration, t]);

  const animated = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ scale: 0.7 + t.value * 0.3 }],
  }));

  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size }, style, animated]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill={color} />
      </Svg>
    </Animated.View>
  );
}
