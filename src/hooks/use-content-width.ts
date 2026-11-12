import { useWindowDimensions } from 'react-native';

/** Largura máxima da coluna do app no computador (no celular ocupa a tela toda). */
export const CONTENT_MAX_WIDTH = 560;

/** Largura útil da coluna central (= largura da janela no celular). */
export function useContentWidth(): number {
  const { width } = useWindowDimensions();
  return Math.min(width, CONTENT_MAX_WIDTH);
}
