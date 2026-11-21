import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Scene } from '@/components/scene';
import type { Scene as SceneData } from '@/data/books';
import illustrations from '@/data/illustrations.json';

// Cada página: caminho da ilustração (svg vetorial ou webp premium) ou null (usa a cena simples).
const MAP = illustrations as Record<string, (string | null)[]>;

/** URL da ilustração da página (ou undefined se o livro ainda não tem ilustração). */
export function illustrationUrl(bookId: string | undefined, pageIndex: number): string | undefined {
  const file = bookId ? MAP[bookId]?.[pageIndex] : undefined;
  return file ? `/ilustracoes/${file}` : undefined;
}

type Props = { bookId?: string; pageIndex: number; scene: SceneData; dim?: boolean; style?: StyleProp<ViewStyle> };

/**
 * Arte da página: a ilustração do livro (public/ilustracoes) quando existir;
 * senão, a cena vetorial montada com formas simples.
 */
export function PageArt({ bookId, pageIndex, scene, dim, style }: Props) {
  const url = illustrationUrl(bookId, pageIndex);
  if (!url) return <Scene scene={scene} dim={dim} style={style} />;
  return (
    <View style={[styles.wrap, { backgroundColor: scene.sky }, style]} accessible={false}>
      <Image source={{ uri: url }} style={StyleSheet.absoluteFill} resizeMode="cover" accessibilityIgnoresInvertColors />
      {dim ? <View style={[StyleSheet.absoluteFill, styles.dim]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
  dim: { backgroundColor: 'rgba(0,0,0,0.35)' },
});
