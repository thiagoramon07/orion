import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Caca } from '@/components/caca';
import { IconButton } from '@/components/icon-button';
import { Input } from '@/components/input';
import { SocialButton } from '@/components/social-button';
import { signIn, signInWithProvider, SocialProvider, startEmailSignUp } from '@/services/auth';
import { useApp } from '@/store/app-store';
import { colors, fonts, sizes } from '@/theme';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function EntrarScreen() {
  const { modo } = useLocalSearchParams<{ modo?: string }>();
  const login = modo === 'login';
  const { actions } = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const valid = EMAIL_RE.test(email.trim());

  const social = async (p: SocialProvider) => {
    setLoading(true);
    const res = await signInWithProvider(p);
    setLoading(false);
    // Login social não precisa de senha: segue para a verificação de adulto.
    if (res.ok) router.push('/area-responsaveis');
  };

  const continuar = async () => {
    if (!valid) return;
    const clean = email.trim().toLowerCase();
    setLoading(true);
    const res = login ? await signIn(clean) : await startEmailSignUp(clean);
    setLoading(false);
    if (!res.ok) return;
    actions.setGuardianEmail(clean);
    router.push(login ? '/area-responsaveis' : { pathname: '/criar-senha', params: { email: clean } });
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.top}>
          <IconButton name="back" label="Voltar" color={colors.text} onPress={() => router.back()} />
          <Caca variant="head" size={64} />
        </View>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title} accessibilityRole="header">
            {login ? 'Que bom te ver de novo' : 'Vamos começar'}
          </Text>
          <Text style={styles.subtitle}>
            {login ? 'Entre com a conta do responsável.' : 'Crie a conta do responsável para montar a estante da criança.'}
          </Text>

          <View style={{ gap: 12 }}>
            <SocialButton provider="apple" onPress={() => social('apple')} />
            <SocialButton provider="google" onPress={() => social('google')} />
            <SocialButton provider="facebook" onPress={() => social('facebook')} />
          </View>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.or}>ou</Text>
            <View style={styles.line} />
          </View>

          <Input
            label="E-mail do responsável"
            placeholder="nome@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={continuar}
          />
          <Button title={loading ? 'Aguarde…' : 'Continuar'} variant="primary" disabled={!valid || loading} onPress={continuar} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12 },
  content: { paddingHorizontal: sizes.gutter, paddingBottom: 32, gap: 18 },
  title: { fontFamily: fonts.title, fontSize: 32, lineHeight: 36, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 24, color: colors.textSecondary, marginTop: -6 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: 1, backgroundColor: colors.divider },
  or: { fontFamily: fonts.medium, fontSize: 15, color: colors.textSecondary },
});
