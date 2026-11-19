import { StyleSheet, Text, View } from 'react-native';

import { HighlightedText } from '@/components/reader/highlighted-text';
import { Scene } from '@/components/scene';
import type { BookPage as BookPageData } from '@/data/books';
import { colors, fonts } from '@/theme';

type Props = {
  page: BookPageData;
  number: number;
  width: number;
  height: number;
  /** Duas páginas lado a lado (tablet / celular deitado). */
  spread: boolean;
  night: boolean;
  highlight: boolean;
  activeIndex: number;
  onWordPress: (index: number, word: string) => void;
};

const PAPER = '#FFFBF2';
const PAPER_NIGHT = '#1F2738';

/** Página no formato de livro: papel, lombada e número de página. */
export function BookPage({ page, number, width, height, spread, night, highlight, activeIndex, onWordPress }: Props) {
  const paper = night ? PAPER_NIGHT : PAPER;
  const text = (
    <HighlightedText
      text={page.text}
      activeIndex={activeIndex}
      highlight={highlight}
      night={night}
      onWordPress={onWordPress}
      style={[styles.text, spread && { fontSize: 28, lineHeight: 42 }, night && { color: colors.primarySoft }]}
    />
  );
  const footer = (
    <Text style={[styles.number, night && { color: '#7D879B' }]} accessibilityLabel={`Página ${number}`}>
      — {number} —
    </Text>
  );

  if (spread) {
    return (
      <View style={[styles.book, { width: width - 32, height }]}>
        <View style={[styles.leaf, styles.leftLeaf, { backgroundColor: paper }]}>
          <Scene scene={page.scene} dim={night} style={styles.sceneSpread} />
          <View style={[styles.gutterShade, { right: 0 }]} />
        </View>
        <View style={styles.spine} />
        <View style={[styles.leaf, styles.rightLeaf, { backgroundColor: paper }]}>
          <View style={[styles.gutterShade, { left: 0, transform: [{ scaleX: -1 }] }]} />
          <View style={styles.textArea}>{text}</View>
          {footer}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.single, { width: width - 32, height, backgroundColor: paper }]}>
      <Scene scene={page.scene} dim={night} style={[styles.sceneSingle, { height: Math.min(height * 0.5, width * 0.75) }]} />
      <View style={styles.textArea}>{text}</View>
      {footer}
      <View style={styles.edgeShade} pointerEvents="none" />
    </View>
  );
}

const shadow = {
  shadowColor: '#3A2414',
  shadowOpacity: 0.18,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
};

const styles = StyleSheet.create({
  single: { borderRadius: 18, padding: 14, gap: 14, overflow: 'hidden', ...shadow },
  sceneSingle: { borderRadius: 14 },
  textArea: { flex: 1, paddingHorizontal: 8 },
  text: { fontFamily: fonts.medium, fontSize: 24, lineHeight: 36, color: colors.text },
  number: { fontFamily: fonts.bold, fontSize: 13, color: '#B8A88C', textAlign: 'center' },
  edgeShade: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: 'rgba(58,36,20,0.07)',
  },
  book: { flexDirection: 'row', ...shadow },
  leaf: { flex: 1, padding: 18, overflow: 'hidden' },
  leftLeaf: { borderTopLeftRadius: 18, borderBottomLeftRadius: 18 },
  rightLeaf: { borderTopRightRadius: 18, borderBottomRightRadius: 18, justifyContent: 'center', gap: 12 },
  sceneSpread: { flex: 1, borderRadius: 14 },
  spine: { width: 4, backgroundColor: '#D9CBB0' },
  gutterShade: { position: 'absolute', top: 0, bottom: 0, width: 18, backgroundColor: 'rgba(58,36,20,0.08)' },
});
