import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import type { ReaderSettings } from '@/store/app-store';
import { colors, fonts, radii } from '@/theme';

type Props = { settings: ReaderSettings; onChange: (patch: Partial<ReaderSettings>) => void; bottom: number };

const SPEEDS: { key: ReaderSettings['speed']; emoji: string; label: string }[] = [
  { key: 'devagar', emoji: '🐢', label: 'Devagar' },
  { key: 'normal', emoji: '🚲', label: 'Normal' },
  { key: 'rapido', emoji: '🚀', label: 'Rápido' },
];

/** Ajustes do leitor: modo noite, velocidade da narração e destaque de palavras. */
export function SettingsPopover({ settings, onChange, bottom }: Props) {
  return (
    <Animated.View entering={FadeInDown.duration(180)} exiting={FadeOutDown.duration(150)} style={[styles.card, { bottom }]}>
      <View style={styles.row}>
        <Text style={styles.label}>{settings.night ? 'Modo noite' : 'Modo dia'}</Text>
        <Pressable
          onPress={() => onChange({ night: !settings.night })}
          accessibilityRole="switch"
          accessibilityState={{ checked: settings.night }}
          accessibilityLabel="Modo noite"
          style={styles.modeBtn}>
          <Icon name={settings.night ? 'moon' : 'sun'} size={26} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.column}>
        <Text style={styles.label}>Velocidade da leitura</Text>
        <View style={styles.speeds}>
          {SPEEDS.map((s) => {
            const active = settings.speed === s.key;
            return (
              <Pressable
                key={s.key}
                onPress={() => onChange({ speed: s.key })}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Velocidade ${s.label}`}
                style={[styles.speed, active && styles.speedActive]}>
                <Text style={styles.speedEmoji}>{s.emoji}</Text>
                <Text style={[styles.speedText, active && { color: colors.white }]}>{s.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Destacar palavras</Text>
          <Text style={styles.hint}>Acende cada palavra enquanto a história é lida.</Text>
        </View>
        <Switch
          value={settings.highlight}
          onValueChange={(v) => onChange({ highlight: v })}
          trackColor={{ true: colors.primary, false: colors.border }}
          thumbColor={colors.white}
          accessibilityLabel="Destacar palavras"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    right: 16,
    left: 16,
    backgroundColor: colors.white,
    borderRadius: radii.cardLarge,
    padding: 18,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  column: { gap: 10 },
  label: { fontFamily: fonts.bold, fontSize: 16, color: colors.primary },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  modeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speeds: { flexDirection: 'row', gap: 8 },
  speed: {
    flex: 1,
    minHeight: 56,
    borderRadius: radii.card,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  speedActive: { backgroundColor: colors.primary },
  speedEmoji: { fontSize: 20 },
  speedText: { fontFamily: fonts.bold, fontSize: 13, color: colors.primary },
});
