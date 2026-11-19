import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/icon-button';
import { ProgressSteps } from '@/components/progress-steps';
import { parentGate, YearGate } from '@/components/year-gate';
import { useApp } from '@/store/app-store';
import { colors, sizes } from '@/theme';

/** Cadastro (2/3): verificação de adulto. */
export default function AreaResponsaveisScreen() {
  const { actions } = useApp();
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.top}>
        <IconButton name="back" label="Voltar" color={colors.text} onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <ProgressSteps step={2} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <YearGate
          onPass={() => {
            actions.setGuardianVerified();
            parentGate.open();
            router.push('/protecao-dados');
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingRight: sizes.gutter },
  content: { paddingHorizontal: sizes.gutter, paddingTop: 8, paddingBottom: 32 },
});
