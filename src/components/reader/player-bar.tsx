import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { colors, fonts, radii } from '@/theme';

type Props = {
  playing: boolean;
  onTogglePlay: () => void;
  page: number;
  total: number;
  onSeek: (page: number) => void;
  onOpenSettings: () => void;
  settingsOpen: boolean;
  night: boolean;
};

/** Barra inferior: play/pausa, linha do tempo por página e engrenagem de ajustes. */
export function PlayerBar({ playing, onTogglePlay, page, total, onSeek, onOpenSettings, settingsOpen, night }: Props) {
  const [trackW, setTrackW] = useState(0);
  const ratio = total > 1 ? page / (total - 1) : 0;

  const seekTo = (x: number | undefined) => {
    if (!trackW || total < 1 || typeof x !== 'number' || Number.isNaN(x)) return;
    const p = Math.round((Math.min(Math.max(x, 0), trackW) / trackW) * (total - 1));
    onSeek(p);
  };

  return (
    <View style={[styles.bar, night && styles.barNight]}>
      <Pressable
        onPress={onTogglePlay}
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Pausar leitura' : 'Ler em voz alta'}
        style={({ pressed }) => [styles.play, pressed && { transform: [{ scale: 0.95 }] }]}>
        <Icon name={playing ? 'pause' : 'play'} size={28} color={colors.white} />
      </Pressable>

      <View style={{ flex: 1, gap: 6 }}>
        <View
          onLayout={(e: LayoutChangeEvent) => setTrackW(e.nativeEvent.layout.width)}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={(e) => seekTo(e.nativeEvent.locationX)}
          onResponderMove={(e) => seekTo(e.nativeEvent.locationX)}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel="Linha do livro"
          accessibilityValue={{ min: 1, max: total, now: page + 1, text: `Página ${page + 1} de ${total}` }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={(e) =>
            onSeek(Math.min(total - 1, Math.max(0, page + (e.nativeEvent.actionName === 'increment' ? 1 : -1))))
          }
          style={styles.trackHit}>
          <View pointerEvents="none" style={[styles.track, night && { backgroundColor: '#3A4458' }]}>
            <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
          </View>
          <View pointerEvents="none" style={[styles.thumb, { left: Math.max(0, ratio * trackW - 12) }]} />
        </View>
        <Text style={[styles.pages, night && { color: colors.primaryTint }]}>
          Página {page + 1} de {total}
        </Text>
      </View>

      <Pressable
        onPress={onOpenSettings}
        accessibilityRole="button"
        accessibilityLabel="Ajustes de leitura"
        accessibilityState={{ expanded: settingsOpen }}
        style={[styles.gear, settingsOpen && { backgroundColor: colors.primaryTint }]}>
        <Icon name="gear" size={26} color={night ? colors.primaryTint : colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: radii.cardLarge,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  barNight: { backgroundColor: '#252D40' },
  play: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: colors.primaryDark,
  },
  trackHit: { height: 32, justifyContent: 'center' },
  track: { height: 10, borderRadius: 5, backgroundColor: colors.divider, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.accent },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  pages: { fontFamily: fonts.bold, fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  gear: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
});
