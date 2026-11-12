import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { IconButton } from '@/components/icon-button';
import { Input } from '@/components/input';
import { ProgressSteps } from '@/components/progress-steps';
import { createGuardianPassword } from '@/services/auth';
import { colors, fonts, sizes } from '@/theme';

export default function CriarSenhaScreen() {
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const longEnough = password.length >= 8;
  const lettersAndNumbers = /[A-Za-zÀ-ÿ]/.test(password) && /\d/.test(password);
  const canContinue = longEnough && lettersAndNumbers && accepted;

  const continuar = async () => {
    if (!canContinue) return;
    const res = await createGuardianPassword(email, password);
    if (res.ok) router.push('/area-responsaveis');
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.top}>
          <IconButton name="back" label="Voltar" color={colors.text} onPress={() => router.back()} />
          <View style={{ flex: 1 }}>
            <ProgressSteps step={1} />
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title} accessibilityRole="header">
            Crie uma senha
          </Text>
          <Text style={styles.subtitle}>
            para <Text style={{ fontFamily: fonts.bold, color: colors.text }}>{email}</Text>
          </Text>

          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!show}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            autoComplete="new-password"
            right={
              <Pressable
                onPress={() => setShow((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={show ? 'Ocultar senha' : 'Mostrar senha'}
                hitSlop={10}
                style={styles.toggle}>
                <Text style={styles.toggleText}>{show ? 'Ocultar' : 'Mostrar'}</Text>
              </Pressable>
            }
          />

          <View style={{ gap: 8 }}>
            <Requirement ok={longEnough} label="8 caracteres ou mais" />
            <Requirement ok={lettersAndNumbers} label="Letras e números" />
          </View>

          <Pressable
            onPress={() => setAccepted((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: accepted }}
            style={styles.check}>
            <View style={[styles.box, accepted && styles.boxOn]}>
              {accepted ? <Icon name="check" size={18} color={colors.white} strokeWidth={3} /> : null}
            </View>
            <Text style={styles.checkText}>
              Li e concordo com os <Text style={styles.link} onPress={() => router.push('/politica')}>Termos de Uso</Text> e com a{' '}
              <Text style={styles.link} onPress={() => router.push('/politica')}>Política de Privacidade</Text>
            </Text>
          </Pressable>

          <Button title="Continuar" variant="primary" disabled={!canContinue} onPress={continuar} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Requirement({ ok, label }: { ok: boolean; label: string }) {
  return (
    <View style={styles.req} accessible accessibilityLabel={`${label}: ${ok ? 'cumprido' : 'pendente'}`}>
      <View style={[styles.reqDot, ok && { backgroundColor: colors.leaf, borderColor: colors.leaf }]}>
        {ok ? <Icon name="check" size={14} color={colors.white} strokeWidth={3} /> : null}
      </View>
      <Text style={[styles.reqText, ok && { color: '#2E7D3A' }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingRight: sizes.gutter },
  content: { paddingHorizontal: sizes.gutter, paddingTop: 12, paddingBottom: 32, gap: 18 },
  title: { fontFamily: fonts.title, fontSize: 32, lineHeight: 36, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 17, color: colors.textSecondary, marginTop: -8 },
  toggle: { paddingHorizontal: 4, minHeight: 44, justifyContent: 'center' },
  toggleText: { fontFamily: fonts.bold, fontSize: 15, color: colors.primary },
  req: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reqDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqText: { fontFamily: fonts.medium, fontSize: 15, color: colors.textSecondary },
  check: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', minHeight: 44 },
  box: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  boxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkText: { flex: 1, fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.text },
  link: { fontFamily: fonts.bold, color: colors.primary, textDecorationLine: 'underline' },
});
