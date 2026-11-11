import { Pressable, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { SocialProvider } from '@/services/auth';
import { colors, fonts, radii, sizes } from '@/theme';

const LABEL: Record<SocialProvider, string> = { apple: 'Apple', google: 'Google', facebook: 'Facebook' };

function Glyph({ provider }: { provider: SocialProvider }) {
  if (provider === 'apple')
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Path
          d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.9C6.9 7.3 5.4 8.2 4.6 9.7c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.4 2.9 2.4 1.2-.1 1.6-.8 3-.8s1.8.8 3 .7c1.3 0 2-1.2 2.8-2.3.9-1.3 1.2-2.6 1.3-2.7-.1 0-2.4-.9-2.4-4ZM14.2 5.8c.6-.8 1.1-1.8 1-2.8-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.7-1 2.7 1 .1 2-.5 2.6-1.3Z"
          fill="#000"
        />
      </Svg>
    );
  if (provider === 'google')
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z" fill="#4285F4" />
        <Path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" fill="#34A853" />
        <Path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z" fill="#FBBC05" />
        <Path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.7 9.4 6 12 6Z" fill="#EA4335" />
      </Svg>
    );
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path d="M12 2a10 10 0 0 0-1.6 19.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 12 2Z" fill="#1877F2" />
    </Svg>
  );
}

/** Botão "Continuar com …" (card com borda e ícone à esquerda). */
export function SocialButton({ provider, onPress }: { provider: SocialProvider; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Continuar com ${LABEL[provider]}`}
      style={({ pressed }) => [styles.btn, pressed && { backgroundColor: colors.primarySoft }]}>
      <Glyph provider={provider} />
      <Text style={styles.text}>Continuar com {LABEL[provider]}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: sizes.buttonHeight,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 14,
    backgroundColor: colors.white,
  },
  text: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
});
