import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { Caca } from '@/components/caca';
import { AVATAR_KINDS } from '@/data/avatars';
import type { Avatar } from '@/store/app-store';
import { colors } from '@/theme';

type Props = { avatar: Avatar; size?: number; ring?: boolean; style?: StyleProp<ViewStyle> };

/** Avatar redondo da criança. */
export function ChildAvatar({ avatar, size = 56, ring, style }: Props) {
  const kind = AVATAR_KINDS.find((k) => k.id === avatar.kind) ?? AVATAR_KINDS[0];
  return (
    <View
      accessible
      accessibilityLabel={`Avatar: ${kind.label}`}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: avatar.color,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderWidth: ring ? 3 : 0,
          borderColor: colors.accent,
        },
        style,
      ]}>
      {kind.id === 'caca' ? (
        <Caca variant="head" size={size * 0.86} style={{ marginTop: size * 0.06 }} />
      ) : (
        <Text style={{ fontSize: size * 0.55, lineHeight: size * 0.7 }}>{kind.emoji}</Text>
      )}
    </View>
  );
}
