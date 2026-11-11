import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReactNode, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Logo } from '@/components/logo';
import { FanCovers } from '@/components/welcome/fan-covers';
import { Journey } from '@/components/welcome/journey';
import { SafeTablets } from '@/components/welcome/safe-tablets';
import { TITLE_COUNT } from '@/constants';
import { colors, fonts, sizes } from '@/theme';

type Slide = { key: string; color: string; title: string; subtitle: string; art: (active: boolean) => ReactNode };

const SLIDES: Slide[] = [
  {
    key: 'amor',
    color: colors.primary,
    title: 'Desperte o amor pela leitura.',
    subtitle: `Mais de ${TITLE_COUNT} livros infantis em português, na palma da mão.`,
    art: (a) => <FanCovers active={a} />,
  },
  {
    key: 'jornada',
    color: colors.violet,
    title: 'Uma jornada do jeitinho de cada criança.',
    subtitle: 'Amigos de leitura e medalhas mantêm a turma motivada.',
    art: (a) => <Journey active={a} />,
  },
  {
    key: 'seguro',
    color: colors.terracotta,
    title: 'Aprovado por professores e famílias.',
    subtitle: 'Um espaço seguro, feito para aprender e explorar no ritmo de cada um.',
    art: (a) => <SafeTablets active={a} />,
  },
];

function soon(who: string) {
  const msg = `O acesso para ${who} chega em breve!`;
  if (Platform.OS === 'web') console.log(msg);
  else Alert.alert('Em breve', msg);
}

export default function BoasVindasScreen() {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  return (
    <View style={[styles.root, { backgroundColor: slide.color }]}>
      <StatusBar style="light" />
      <FlatList
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.key}
        onScroll={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          if (i !== index && i >= 0 && i < SLIDES.length) setIndex(i);
        }}
        scrollEventThrottle={32}
        renderItem={({ item, index: i }) => (
          <SafeAreaView edges={['top']} style={[styles.slide, { width, backgroundColor: item.color }]}>
            <Logo size={24} />
            <Text style={styles.title} accessibilityRole="header">
              {item.title}
            </Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <View style={styles.art}>{item.art(i === index)}</View>
          </SafeAreaView>
        )}
      />

      <SafeAreaView edges={['bottom']} style={styles.bottom}>
        <View style={styles.dots} accessible accessibilityLabel={`Tela ${index + 1} de ${SLIDES.length}`}>
          {SLIDES.map((s, i) => (
            <View key={s.key} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <Button title="Famílias, comecem a ler" variant="white" textColor={slide.color} onPress={() => router.push('/entrar')} />
        <View style={styles.row}>
          <Button title="Educadores" variant="outline" style={{ flex: 1 }} onPress={() => soon('educadores')} />
          <Button title="Alunos" variant="outline" style={{ flex: 1 }} onPress={() => soon('alunos')} />
        </View>
        <Pressable
          onPress={() => router.push({ pathname: '/entrar', params: { modo: 'login' } })}
          accessibilityRole="button"
          style={styles.login}>
          <Text style={styles.loginText}>
            Já tem conta? <Text style={styles.loginStrong}>Entrar</Text>
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  slide: { flex: 1, paddingHorizontal: sizes.gutter, paddingTop: 12, paddingBottom: 270, gap: 10 },
  title: { fontFamily: fonts.title, fontSize: 34, lineHeight: 38, color: colors.white, marginTop: 14 },
  subtitle: { fontFamily: fonts.medium, fontSize: 17, lineHeight: 24, color: 'rgba(255,255,255,0.88)' },
  art: { flex: 1, justifyContent: 'center' },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: sizes.gutter, paddingBottom: 8, gap: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.45)' },
  dotActive: { width: 26, backgroundColor: colors.accent },
  row: { flexDirection: 'row', gap: 12 },
  login: { minHeight: sizes.minTouch, alignItems: 'center', justifyContent: 'center' },
  loginText: { fontFamily: fonts.medium, fontSize: 16, color: colors.white },
  loginStrong: { fontFamily: fonts.bold, textDecorationLine: 'underline' },
});
