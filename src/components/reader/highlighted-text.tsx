import { useMemo } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { tokenize } from '@/hooks/use-narration';
import { colors } from '@/theme';

type Props = {
  text: string;
  /** Índice da palavra em destaque (-1 = nenhuma). */
  activeIndex: number;
  highlight: boolean;
  night: boolean;
  /** Toque numa palavra (ex.: para ouvir só ela). */
  onWordPress?: (index: number, word: string) => void;
  style?: StyleProp<TextStyle>;
};

/** Texto da página palavra por palavra, com a palavra em leitura destacada. */
export function HighlightedText({ text, activeIndex, highlight, night, onWordPress, style }: Props) {
  const words = useMemo(() => tokenize(text), [text]);
  return (
    <Text style={style}>
      {words.map((w, i) => {
        const gap = i < words.length - 1 ? text.slice(w.end, words[i + 1].start) : '';
        const active = highlight && i === activeIndex;
        return (
          <Text key={i}>
            <Text
              onPress={onWordPress ? () => onWordPress(i, w.text) : undefined}
              suppressHighlighting
              style={
                active
                  ? {
                      backgroundColor: night ? colors.accentShadow : colors.accentLight,
                      color: night ? colors.white : colors.text,
                      borderRadius: 6,
                    }
                  : highlight && activeIndex >= 0 && i < activeIndex
                    ? { opacity: 0.75 }
                    : undefined
              }>
              {w.text}
            </Text>
            {gap}
          </Text>
        );
      })}
    </Text>
  );
}
