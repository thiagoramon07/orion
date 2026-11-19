import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Icon, IconName } from '@/components/icon';
import { IconButton } from '@/components/icon-button';
import { ProgressSteps } from '@/components/progress-steps';
import { useApp } from '@/store/app-store';
import { colors, fonts, radii, sizes } from '@/theme';

const ITEMS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'user',
    title: 'Perfil da criança',
    text: 'Pedimos só o primeiro nome ou apelido e a idade, para sugerir livros certos. Nada de sobrenome, foto ou localização.',
  },
  {
    icon: 'chart',
    title: 'Uso do aplicativo',
    text: 'Registramos livros lidos, páginas e medalhas para mostrar o progresso. Não usamos esses dados para publicidade.',
  },
  {
    icon: 'mail',
    title: 'E-mail do responsável',
    text: 'Usado para acessar a conta, recuperar a senha e enviar avisos importantes. Nunca é vendido nem compartilhado.',
  },
  {
    icon: 'bell',
    title: 'Notificações',
    text: 'Lembretes de leitura e conquistas são opcionais e podem ser desligados a qualquer momento nos ajustes.',
  },
  {
    icon: 'shield',
    title: 'Seus direitos (LGPD)',
    text: 'Você pode ver, corrigir, baixar ou apagar os dados da família quando quiser, direto pela Área dos responsáveis.',
  },
];

export default function ProtecaoDadosScreen() {
  const { actions } = useApp();
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.top}>
        <IconButton name="back" label="Voltar" color={colors.text} onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <ProgressSteps step={3} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          Como cuidamos dos dados da sua família
        </Text>
        {ITEMS.map((it) => (
          <View key={it.title} style={styles.item}>
            <View style={styles.icon}>
              <Icon name={it.icon} size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.itemTitle}>{it.title}</Text>
              <Text style={styles.itemText}>{it.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Concordo e continuar"
          variant="primary"
          onPress={() => {
            actions.acceptPrivacy();
            router.push('/primeiro-livro');
          }}
        />
        <Pressable onPress={() => router.push('/politica')} accessibilityRole="link" style={styles.link}>
          <Text style={styles.linkText}>Ler a política completa</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingRight: sizes.gutter },
  content: { paddingHorizontal: sizes.gutter, paddingTop: 12, paddingBottom: 24, gap: 16 },
  title: { fontFamily: fonts.title, fontSize: 30, lineHeight: 34, color: colors.text, marginBottom: 4 },
  item: { flexDirection: 'row', gap: 14, backgroundColor: colors.primarySoft, borderRadius: radii.card, padding: 16 },
  icon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  itemText: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 21, color: colors.textSecondary },
  footer: {
    paddingHorizontal: sizes.gutter,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.white,
    gap: 4,
  },
  link: { minHeight: sizes.minTouch, alignItems: 'center', justifyContent: 'center' },
  linkText: { fontFamily: fonts.bold, fontSize: 15, color: colors.primary, textDecorationLine: 'underline' },
});
