import { StyleProp, Text, TextStyle } from 'react-native';

import type { Word } from '@/hooks/use-narration';
import { colors } from '@/theme';

type Props = {
  text: string;
  words: Word[];
  activeIndex: number;
  highlight: boolean;
  night: boolean;
  style?: StyleProp<TextStyle>;
};

/** Texto da página com a palavra em leitura destacada. */
export function HighlightedText({ text, words, activeIndex, highlight, night, style }: Props) {
  if (!highlight || activeIndex < 0) return <Text style={style}>{text}</Text>;
  return (
    <Text style={style}>
      {words.map((w, i) => {
        const gap = i < words.length - 1 ? text.slice(w.end, words[i + 1].start) : '';
        const active = i === activeIndex;
        return (
          <Text key={i}>
            <Text
              style={
                active
                  ? {
                      backgroundColor: night ? colors.accentShadow : colors.accentLight,
                      color: night ? colors.white : colors.text,
                      borderRadius: 6,
                    }
                  : i < activeIndex
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
