import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { useReduceMotion } from '@/hooks/use-reduce-motion';

export const BUDDY_COLORS = ['#7BC47F', '#FFB627', '#5B3FA6', '#B8471F', '#3FA7D6', '#F28FB0'];

type Props = { color?: string; hatched?: boolean; size?: number; wiggle?: boolean };

/** Amigo de leitura: um ovo pintado que vira o "Bolota" quando choca. */
export function Buddy({ color, hatched, size = 120, wiggle = true }: Props) {
  const reduceMotion = useReduceMotion();
  const t = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion || !wiggle) return;
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 160, easing: Easing.inOut(Easing.quad) }),
        withTiming(-1, { duration: 320, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 160 }),
        withTiming(0, { duration: 2200 }),
      ),
      -1,
    );
    return () => cancelAnimation(t);
  }, [reduceMotion, wiggle, t]);

  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${t.value * 7}deg` }] }));
  const main = color ?? '#E4E8EE';
  const spot = color ? 'rgba(255,255,255,0.45)' : '#C9CFD8';

  return (
    <Animated.View style={style} accessible accessibilityLabel={hatched ? 'Seu amigo de leitura' : 'Ovo do amigo de leitura'}>
      <Svg width={size} height={size * 1.2} viewBox="0 0 100 120">
        {hatched ? (
          <G>
            <Ellipse cx={50} cy={112} rx={30} ry={5} fill="#000" opacity={0.08} />
            <Path d="M50 18 C78 18 92 44 92 70 C92 96 74 108 50 108 C26 108 8 96 8 70 C8 44 22 18 50 18 Z" fill={main} />
            <Path d="M40 20 C38 8 46 4 50 12 C54 4 62 8 60 20" fill={main} />
            <Ellipse cx={50} cy={82} rx={24} ry={20} fill="#fff" opacity={0.35} />
            <Circle cx={36} cy={58} r={9} fill="#fff" />
            <Circle cx={64} cy={58} r={9} fill="#fff" />
            <Circle cx={37} cy={60} r={5} fill="#1C2333" />
            <Circle cx={63} cy={60} r={5} fill="#1C2333" />
            <Circle cx={39} cy={58} r={1.6} fill="#fff" />
            <Circle cx={65} cy={58} r={1.6} fill="#fff" />
            <Path d="M44 72 Q50 78 56 72" stroke="#1C2333" strokeWidth={3} fill="none" strokeLinecap="round" />
            <Ellipse cx={26} cy={70} rx={6} ry={4} fill="#F2A3A0" opacity={0.8} />
            <Ellipse cx={74} cy={70} rx={6} ry={4} fill="#F2A3A0" opacity={0.8} />
            <Ellipse cx={36} cy={108} rx={10} ry={5} fill={main} />
            <Ellipse cx={64} cy={108} rx={10} ry={5} fill={main} />
          </G>
        ) : (
          <G>
            <Ellipse cx={50} cy={114} rx={28} ry={5} fill="#000" opacity={0.08} />
            <Path d="M50 6 C74 6 90 46 90 72 C90 98 72 112 50 112 C28 112 10 98 10 72 C10 46 26 6 50 6 Z" fill={main} stroke="#fff" strokeWidth={3} />
            <Circle cx={34} cy={44} r={9} fill={spot} />
            <Circle cx={64} cy={36} r={6} fill={spot} />
            <Circle cx={68} cy={74} r={12} fill={spot} />
            <Circle cx={30} cy={84} r={7} fill={spot} />
            <Circle cx={50} cy={60} r={4} fill={spot} />
          </G>
        )}
      </Svg>
    </Animated.View>
  );
}
