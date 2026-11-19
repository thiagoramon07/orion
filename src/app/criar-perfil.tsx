import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgeSelect } from '@/components/age-select';
import { Button } from '@/components/button';
import { ChildAvatar } from '@/components/child-avatar';
import { Icon } from '@/components/icon';
import { IconButton } from '@/components/icon-button';
import { Input } from '@/components/input';
import { ProgressSteps } from '@/components/progress-steps';
import { AVATAR_COLORS, AVATAR_KINDS } from '@/data/avatars';
import { INTERESTS } from '@/data/interests';
import { Avatar, DEFAULT_AVATAR, MAX_PROFILES, useApp } from '@/store/app-store';
import { colors, fonts, radii, sizes } from '@/theme';
import { goBackOr } from '@/utils/navigation';

type Step = 'dados' | 'avatar' | 'interesses';

/**
 * Criação/edição do perfil da criança em passos.
 * modo=onboarding: vem do "primeiro livro" (já tem nome, idade e livro) → avatar → interesses → abre o livro.
 * modo=novo: adicionar criança (área dos responsáveis) → dados → avatar → interesses.
 * modo=editar&id=…&passo=avatar|interesses: muda só um passo de um perfil existente.
 */
export default function CriarPerfilScreen() {
  const params = useLocalSearchParams<{ modo?: string; nome?: string; idade?: string; livro?: string; id?: string; passo?: Step }>();
  const modo = params.modo ?? 'novo';
  const { state, actions } = useApp();
  const editing = modo === 'editar' ? state.profiles.find((p) => p.id === params.id) : undefined;

  const steps: Step[] =
    modo === 'editar' ? [params.passo ?? 'avatar'] : modo === 'onboarding' ? ['avatar', 'interesses'] : ['dados', 'avatar', 'interesses'];
  const [index, setIndex] = useState(0);
  const step = steps[index];

  const [name, setName] = useState(editing?.name ?? params.nome ?? '');
  const [age, setAge] = useState(editing?.age ?? (Number(params.idade) || 6));
  const [avatar, setAvatar] = useState<Avatar>(editing?.avatar ?? DEFAULT_AVATAR);
  const [interests, setInterests] = useState<string[]>(editing?.interests ?? []);

  const full = modo === 'novo' && state.profiles.length >= MAX_PROFILES;
  const nameOk = name.trim().length >= 2;

  const finish = () => {
    if (editing) {
      actions.updateProfile(editing.id, { avatar, interests });
      goBackOr('/perfil');
      return;
    }
    if (modo === 'onboarding') {
      // Primeiro perfil da família (ou atualiza o ativo, se já existir um vazio).
      if (state.profiles.length === 0) {
        actions.addProfile({ name: name.trim(), age, avatar, interests, firstBookId: params.livro });
      } else {
        actions.setChild(name.trim(), age, params.livro);
        if (state.activeProfileId) actions.updateProfile(state.activeProfileId, { avatar, interests });
      }
      router.dismissAll();
      if (params.livro) router.replace({ pathname: '/ler/[id]', params: { id: params.livro } });
      else router.replace('/explorar');
      return;
    }
    actions.addProfile({ name: name.trim(), age, avatar, interests });
    goBackOr('/pais');
  };

  const next = () => (index < steps.length - 1 ? setIndex(index + 1) : finish());
  const back = () => (index > 0 ? setIndex(index - 1) : goBackOr('/explorar'));

  if (full) {
    return (
      <SafeAreaView style={[styles.root, styles.center]}>
        <Text style={styles.title}>Limite de {MAX_PROFILES} crianças</Text>
        <Text style={styles.subtitle}>Para adicionar outra, apague um perfil na Área dos responsáveis.</Text>
        <Button title="Voltar" onPress={() => goBackOr('/pais')} style={{ alignSelf: 'stretch' }} />
      </SafeAreaView>
    );
  }

  const toggleInterest = (id: string) =>
    setInterests((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.top}>
          <IconButton name="back" label="Voltar" color={colors.text} onPress={back} />
          {steps.length > 1 ? (
            <View style={{ flex: 1 }}>
              <ProgressSteps step={index + 1} total={steps.length} />
            </View>
          ) : null}
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {step === 'dados' && (
            <Animated.View entering={FadeIn} style={{ gap: 16 }}>
              <Text style={styles.title} accessibilityRole="header">
                Quem vai ler?
              </Text>
              <Text style={styles.subtitle}>Só o primeiro nome ou um apelido. Nada de sobrenome.</Text>
              <Input
                label="Nome ou apelido da criança"
                placeholder="Ex.: Bia"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={20}
              />
              <View style={{ gap: 6 }}>
                <Text style={styles.label}>Idade</Text>
                <AgeSelect value={age} onChange={setAge} />
              </View>
            </Animated.View>
          )}

          {step === 'avatar' && (
            <Animated.View entering={FadeIn} style={{ gap: 16 }}>
              <Text style={styles.title} accessibilityRole="header">
                Escolha seu bichinho{name ? `, ${name.trim()}` : ''}!
              </Text>
              <Animated.View key={`${avatar.kind}-${avatar.color}`} entering={ZoomIn.duration(250)} style={{ alignSelf: 'center' }}>
                <ChildAvatar avatar={avatar} size={128} ring />
              </Animated.View>
              <View style={styles.grid}>
                {AVATAR_KINDS.map((k) => {
                  const active = avatar.kind === k.id;
                  return (
                    <Pressable
                      key={k.id}
                      onPress={() => setAvatar((a) => ({ ...a, kind: k.id }))}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={k.label}
                      style={[styles.avatarBtn, active && styles.avatarBtnActive]}>
                      <ChildAvatar avatar={{ kind: k.id, color: avatar.color }} size={60} />
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.label}>Cor do fundo</Text>
              <View style={styles.colors}>
                {AVATAR_COLORS.map((c) => {
                  const active = avatar.color === c;
                  return (
                    <Pressable
                      key={c}
                      onPress={() => setAvatar((a) => ({ ...a, color: c }))}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={`Cor ${c}`}
                      style={[styles.swatch, { backgroundColor: c }, active && styles.swatchActive]}>
                      {active ? <Icon name="check" size={20} color={colors.primary} strokeWidth={3} /> : null}
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>
          )}

          {step === 'interesses' && (
            <Animated.View entering={FadeIn} style={{ gap: 16 }}>
              <Text style={styles.title} accessibilityRole="header">
                Do que você gosta?
              </Text>
              <Text style={styles.subtitle}>Escolha quantos quiser. A estante vai mostrar mais disso.</Text>
              <View style={styles.chips}>
                {INTERESTS.map((it) => {
                  const active = interests.includes(it.id);
                  return (
                    <Pressable
                      key={it.id}
                      onPress={() => toggleInterest(it.id)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: active }}
                      style={[styles.chip, active && styles.chipActive]}>
                      <Text style={styles.chipEmoji}>{it.emoji}</Text>
                      <Text style={[styles.chipText, active && { color: colors.white }]}>{it.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={
              index < steps.length - 1
                ? 'Continuar'
                : modo === 'onboarding'
                  ? 'Começar a ler'
                  : modo === 'editar'
                    ? 'Salvar'
                    : 'Criar perfil'
            }
            variant={index === steps.length - 1 ? 'accent' : 'primary'}
            disabled={step === 'dados' && !nameOk}
            onPress={next}
          />
          {step === 'interesses' && interests.length === 0 && modo !== 'editar' ? (
            <Pressable onPress={next} accessibilityRole="button" style={styles.skip}>
              <Text style={styles.skipText}>Escolher depois</Text>
            </Pressable>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  center: { alignItems: 'center', justifyContent: 'center', padding: sizes.gutter, gap: 16 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingRight: sizes.gutter, minHeight: 52 },
  content: { paddingHorizontal: sizes.gutter, paddingTop: 8, paddingBottom: 24 },
  title: { fontFamily: fonts.title, fontSize: 30, lineHeight: 34, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 24, color: colors.textSecondary },
  label: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  avatarBtn: { padding: 4, borderRadius: 40, borderWidth: 3, borderColor: 'transparent' },
  avatarBtnActive: { borderColor: colors.accent },
  colors: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  swatchActive: { borderColor: colors.primary, borderWidth: 3 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipEmoji: { fontSize: 22 },
  chipText: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  footer: { paddingHorizontal: sizes.gutter, paddingBottom: 12, paddingTop: 8, gap: 4, borderTopWidth: 1, borderTopColor: colors.divider },
  skip: { minHeight: sizes.minTouch, alignItems: 'center', justifyContent: 'center' },
  skipText: { fontFamily: fonts.bold, fontSize: 15, color: colors.textSecondary, textDecorationLine: 'underline' },
});
