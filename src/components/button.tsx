import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, fonts, radii, sizes } from '@/theme';

export type ButtonVariant = 'primary' | 'white' | 'outline' | 'accent';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  /** Cor do texto (ex.: botão branco com o texto na cor do slide; contorno sobre fundo colorido). */
  textColor?: string;
  /** Cor da borda no variant "outline". */
  borderColor?: string;
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

const SHADOW_DEPTH = 5;

const variantStyles: Record<ButtonVariant, { bg: string; fg: string; border?: string; shadow?: string }> = {
  primary: { bg: colors.primary, fg: colors.white },
  white: { bg: colors.white, fg: colors.primary },
  outline: { bg: 'transparent', fg: colors.white, border: 'rgba(255,255,255,0.7)' },
  accent: { bg: colors.accent, fg: colors.text, shadow: colors.accentShadow },
};

/** Botão pill padrão do Folheia. O variant "accent" tem sombra sólida que "afunda" ao toque. */
export function Button({
  title,
  onPress,
  variant = 'primary',
  textColor,
  borderColor,
  disabled,
  icon,
  style,
  accessibilityHint,
}: Props) {
  const v = variantStyles[variant];
  const hasShadow = !!v.shadow && !disabled;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      style={[hasShadow && { paddingBottom: SHADOW_DEPTH }, style]}>
      {({ pressed }) => (
        <View>
          {hasShadow && <View style={[styles.shadow, { backgroundColor: v.shadow }]} />}
          <View
            style={[
              styles.face,
              {
                backgroundColor: disabled && variant !== 'outline' ? colors.border : v.bg,
                borderColor: borderColor ?? v.border ?? 'transparent',
                borderWidth: variant === 'outline' ? 2 : 0,
                transform: [{ translateY: hasShadow && pressed ? SHADOW_DEPTH : 0 }],
                opacity: !hasShadow && pressed ? 0.85 : 1,
              },
            ]}>
            {icon}
            <Text
              style={[styles.label, { color: disabled ? colors.placeholder : (textColor ?? v.fg) }]}
              numberOfLines={1}>
              {title}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: SHADOW_DEPTH,
    height: sizes.buttonHeight,
    borderRadius: radii.pill,
  },
  face: {
    height: sizes.buttonHeight,
    minHeight: sizes.minTouch,
    borderRadius: radii.pill,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 17,
  },
});
