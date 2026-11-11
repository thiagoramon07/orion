import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Caca } from '@/components/caca';
import { IconButton } from '@/components/icon-button';
import { getBook } from '@/data/books';
import { useApp } from '@/store/app-store';
import { colors, fonts, radii, sizes } from '@/theme';

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = getBook(id);
  const { actions } = useApp();
  const questions = book?.quiz ?? [];
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const done = step >= questions.length;
  const q = questions[step];

  const pick = (i: number) => {
    if (picked !== null || !q) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    const nextStep = step + 1;
    if (nextStep >= questions.length && score === questions.length && book) actions.markQuizPassed(book.id);
    setPicked(null);
    setStep(nextStep);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.top}>
        <Text style={styles.small}>Quiz · {book?.title}</Text>
        <IconButton name="close" label="Fechar quiz" color={colors.primary} onPress={() => router.back()} />
      </View>

      {done ? (
        <View style={styles.center}>
          <Animated.View entering={ZoomIn}>
            <Caca variant="head" size={130} />
          </Animated.View>
          <Text style={styles.title}>
            {score === questions.length ? 'Acertou tudo! 🎉' : 'Muito bem!'}
          </Text>
          <Text style={styles.text}>
            Você acertou {score} de {questions.length} {questions.length === 1 ? 'pergunta' : 'perguntas'}.
          </Text>
          {score === questions.length ? <Text style={styles.text}>Medalha “Quiz” garantida!</Text> : null}
          <View style={{ alignSelf: 'stretch', gap: 10, marginTop: 12 }}>
            <Button title="Voltar" variant="accent" onPress={() => router.back()} />
            {score < questions.length ? (
              <Button
                title="Tentar de novo"
                variant="outline"
                textColor={colors.primary}
                borderColor={colors.primary}
                onPress={() => {
                  setStep(0);
                  setScore(0);
                  setPicked(null);
                }}
              />
            ) : null}
          </View>
        </View>
      ) : q ? (
        <Animated.View key={step} entering={FadeInRight.duration(250)} style={styles.body}>
          <Text style={styles.small}>
            Pergunta {step + 1} de {questions.length}
          </Text>
          <Text style={styles.title}>{q.question}</Text>
          <View style={{ gap: 12 }}>
            {q.options.map((opt, i) => {
              const isRight = picked !== null && i === q.answer;
              const isWrong = picked === i && i !== q.answer;
              return (
                <Pressable
                  key={i}
                  onPress={() => pick(i)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: picked === i }}
                  style={[styles.option, isRight && styles.right, isWrong && styles.wrong]}>
                  <Text style={[styles.optionText, (isRight || isWrong) && { color: colors.white }]}>
                    {opt}
                    {isRight ? '  ✓' : isWrong ? '  ✗' : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {picked !== null ? (
            <Text style={styles.feedback}>
              {picked === q.answer ? 'Isso mesmo!' : `Quase! A resposta é “${q.options[q.answer]}”.`}
            </Text>
          ) : null}
          <View style={{ flex: 1 }} />
          <Button title={step + 1 < questions.length ? 'Próxima' : 'Ver resultado'} variant="accent" disabled={picked === null} onPress={next} />
        </Animated.View>
      ) : (
        <View style={styles.center}>
          <Text style={styles.text}>Este livro ainda não tem quiz.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: sizes.gutter, paddingRight: 8 },
  body: { flex: 1, padding: sizes.gutter, gap: 18 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: sizes.gutter, gap: 10 },
  small: { fontFamily: fonts.bold, fontSize: 14, color: colors.textSecondary },
  title: { fontFamily: fonts.title, fontSize: 28, lineHeight: 32, color: colors.text, textAlign: 'left' },
  text: { fontFamily: fonts.medium, fontSize: 17, color: colors.textSecondary, textAlign: 'center' },
  option: {
    minHeight: 60,
    borderRadius: radii.card,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 18,
    backgroundColor: colors.primarySoft,
  },
  right: { backgroundColor: colors.primary, borderColor: colors.primary },
  wrong: { backgroundColor: colors.terracotta, borderColor: colors.terracotta },
  optionText: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  feedback: { fontFamily: fonts.bold, fontSize: 16, color: colors.primary },
});
