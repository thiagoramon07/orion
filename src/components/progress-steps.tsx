import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { colors, fonts } from '@/theme';

type Props = { step: number; total?: number };

/** Barra de progresso em passos (ex.: 1/3) do cadastro do responsável. */
export function ProgressSteps({ step, total = 3 }: Props) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Passo ${step} de ${total}`}
      accessibilityValue={{ min: 1, max: total, now: step }}
      style={styles.wrap}>
      <View style={styles.row}>
        {Array.from({ length: total }, (_, i) => (
          <Segment key={i} filled={i < step} />
        ))}
      </View>
      <Text style={styles.label}>
        {step}/{total}
      </Text>
    </View>
  );
}

function Segment({ filled }: { filled: boolean }) {
  const style = useAnimatedStyle(() => ({ width: withTiming(filled ? '100%' : '0%', { duration: 400 }) }));
  return (
    <View style={styles.seg}>
      <Animated.View style={[styles.fill, style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  row: { flex: 1, flexDirection: 'row', gap: 6 },
  seg: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.divider, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  label: { fontFamily: fonts.bold, fontSize: 14, color: colors.textSecondary },
});
