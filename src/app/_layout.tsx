import { BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque/800ExtraBold';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_500Medium } from '@expo-google-fonts/dm-sans/500Medium';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans/700Bold';
import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { getBook } from '@/data/books';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CONTENT_MAX_WIDTH } from '@/hooks/use-content-width';
import { AppProvider, useApp } from '@/store/app-store';
import { getBestPtBrVoice } from '@/utils/voice';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();
// Carrega a lista de vozes cedo (no navegador ela chega com atraso).
getBestPtBrVoice();

/** No computador o app fica numa coluna central; o leitor usa a tela inteira. */
const column = {
  width: '100%' as const,
  maxWidth: CONTENT_MAX_WIDTH,
  alignSelf: 'center' as const,
  backgroundColor: colors.white,
  ...(Platform.OS === 'web' ? { boxShadow: '0 0 40px rgba(8,79,79,0.12)' } : null),
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    BricolageGrotesque_800ExtraBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.primaryTint }}>
      <SafeAreaProvider>
        <AppProvider>
          <RootStack />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const THEME = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.primaryTint } };

const TITLES: Record<string, string> = {
  '/': 'Folheia · livros que abrem mundos',
  '/boas-vindas': 'Boas-vindas',
  '/entrar': 'Entrar',
  '/criar-senha': 'Crie uma senha',
  '/area-responsaveis': 'Área dos responsáveis',
  '/protecao-dados': 'Proteção de dados',
  '/primeiro-livro': 'Primeiro livro',
  '/nome-crianca': 'Nome da criança',
  '/explorar': 'Explorar',
  '/buscar': 'Buscar',
  '/perfil': 'Meu perfil',
  '/amigo': 'Meu amigo',
  '/correio': 'Correio',
  '/assinatura': 'Assinatura',
  '/politica': 'Termos e privacidade',
};

/** Título da aba do navegador conforme a tela. */
function useDocumentTitle() {
  const pathname = usePathname();
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const [, section, id] = pathname.split('/');
    const book = id ? getBook(id) : undefined;
    let title = TITLES[pathname];
    if (book && section === 'ler') title = `Lendo: ${book.title}`;
    else if (book && section === 'livro') title = book.title;
    else if (book && section === 'quiz') title = `Quiz: ${book.title}`;
    document.title = !title ? 'Folheia' : pathname === '/' ? title : `${title} · Folheia`;
  }, [pathname]);
}

function RootStack() {
  const { ready } = useApp();
  useDocumentTitle();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <ThemeProvider value={THEME}>
      <Stack screenOptions={{ headerShown: false, contentStyle: column }}>
        {/* O leitor usa a tela inteira (livro aberto em duas páginas no computador). */}
        <Stack.Screen name="ler/[id]" options={{ animation: 'fade', contentStyle: { backgroundColor: '#EFE6D6' } }} />
      </Stack>
    </ThemeProvider>
  );
}
