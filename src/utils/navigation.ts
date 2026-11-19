import { Href, router } from 'expo-router';

/**
 * Volta para a tela anterior; se não houver (ex.: link aberto direto no navegador
 * ou página recarregada), vai para `fallback`.
 */
export function goBackOr(fallback: Href = '/explorar') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}
