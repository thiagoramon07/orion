import { Pressable, StyleProp, ViewStyle } from 'react-native';

import { Icon, IconName } from '@/components/icon';
import { colors, sizes } from '@/theme';

type Props = {
  name: IconName;
  label: string;
  onPress?: () => void;
  color?: string;
  size?: number;
  background?: string;
  style?: StyleProp<ViewStyle>;
};

/** Botão só com ícone, com alvo de toque ≥ 44. */
export function IconButton({ name, label, onPress, color = colors.text, size = 24, background, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [
        {
          width: sizes.minTouch,
          height: sizes.minTouch,
          borderRadius: sizes.minTouch / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: background,
          opacity: pressed ? 0.6 : 1,
        },
        style,
      ]}>
      <Icon name={name} size={size} color={color} />
    </Pressable>
  );
}
