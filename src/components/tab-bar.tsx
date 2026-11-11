import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Caca } from '@/components/caca';
import { Icon, IconName } from '@/components/icon';
import { useApp } from '@/store/app-store';
import { colors, fonts } from '@/theme';

const TABS: Record<string, { label: string; icon: IconName }> = {
  explorar: { label: 'Explorar', icon: 'home' },
  buscar: { label: 'Buscar', icon: 'search' },
  perfil: { label: 'Eu', icon: 'home' },
  amigo: { label: 'Meu amigo', icon: 'egg' },
  correio: { label: 'Correio', icon: 'bell' },
};

/** Barra de abas com o perfil da criança em destaque no centro e o aviso de prévia acima. */
export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const app = useApp();

  return (
    <View>
      {!app.state.subscribed ? (
        <View style={styles.banner}>
          <Icon name="unlock" size={22} color={colors.white} />
          <Text style={styles.bannerText} numberOfLines={2}>
            Prévia grátis. Libere a leitura ilimitada!
          </Text>
          <Pressable
            onPress={() => router.push('/assinatura')}
            accessibilityRole="button"
            accessibilityLabel="Assinar agora"
            style={({ pressed }) => [styles.bannerBtn, pressed && { opacity: 0.8 }]}>
            <Text style={styles.bannerBtnText}>Assinar</Text>
          </Pressable>
        </View>
      ) : null}
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const meta = TABS[route.name] ?? { label: route.name, icon: 'home' as IconName };
          const onPress = () => {
            if (!focused) navigateToTab(route.key);
          };
          const color = focused ? colors.primary : colors.textSecondary;

          if (route.name === 'perfil') {
            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={`Perfil de ${app.state.childName || 'criança'}`}
                style={styles.centerWrap}>
                <View style={[styles.center, focused && { borderColor: colors.accent }]}>
                  <Caca variant="head" size={54} />
                </View>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={meta.label}
              style={styles.tab}>
              <Icon name={meta.icon} size={26} color={color} strokeWidth={focused ? 2.6 : 2.2} />
              <Text style={[styles.label, { color }]} numberOfLines={1}>
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bannerText: { flex: 1, fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  bannerBtn: {
    minHeight: 40,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  bannerBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 6,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 52, gap: 2 },
  label: { fontFamily: fonts.bold, fontSize: 11 },
  centerWrap: { flex: 1, alignItems: 'center' },
  center: {
    marginTop: -26,
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryTint,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
