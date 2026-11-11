import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { BadgeId } from '@/data/badges';

/**
 * Estado local do app, salvo no aparelho (AsyncStorage).
 * TODO: sincronizar com o backend quando existir conta real.
 */
export type ReaderSettings = {
  night: boolean;
  speed: 'devagar' | 'normal' | 'rapido';
  highlight: boolean;
};

export type AppState = {
  /** E-mail do responsável (cadastro). */
  guardianEmail: string;
  /** Passou pela verificação de adulto (ano de nascimento — o ano em si não é guardado). */
  guardianVerified: boolean;
  /** Data (ISO) em que aceitou a proteção de dados. */
  privacyAcceptedAt?: string;
  childName: string;
  childAge: number;
  firstBookId?: string;
  buddyColor?: string;
  buddyTipDismissed: boolean;
  subscribed: boolean;
  favorites: string[];
  saved: string[];
  /** Última página lida de cada livro. */
  progress: Record<string, number>;
  finished: string[];
  quizzesPassed: string[];
  /** Dias (AAAA-MM-DD) em que houve leitura. */
  readDays: string[];
  usedNarration: boolean;
  usedNight: boolean;
  reader: ReaderSettings;
};

const INITIAL: AppState = {
  guardianEmail: '',
  guardianVerified: false,
  childName: '',
  childAge: 6,
  buddyTipDismissed: false,
  subscribed: false,
  favorites: [],
  saved: [],
  progress: {},
  finished: [],
  quizzesPassed: [],
  readDays: [],
  usedNarration: false,
  usedNight: false,
  reader: { night: false, speed: 'normal', highlight: true },
};

const STORAGE_KEY = 'folheia:estado:v1';
/** Páginas liberadas em livros que não são o primeiro escolhido (sem assinatura). */
export const PREVIEW_PAGES = 3;

type Actions = {
  setGuardianEmail: (email: string) => void;
  setGuardianVerified: () => void;
  acceptPrivacy: () => void;
  setChild: (name: string, age: number, firstBookId?: string) => void;
  toggleFavorite: (bookId: string) => void;
  toggleSaved: (bookId: string) => void;
  setProgress: (bookId: string, page: number) => void;
  markFinished: (bookId: string) => void;
  markQuizPassed: (bookId: string) => void;
  markNarrationUsed: () => void;
  updateReader: (patch: Partial<ReaderSettings>) => void;
  setBuddyColor: (color: string) => void;
  dismissBuddyTip: () => void;
  /** TODO: integrar com loja (assinatura real). */
  setSubscribed: (value: boolean) => void;
  reset: () => void;
};

type Ctx = { state: AppState; ready: boolean; actions: Actions };

const AppContext = createContext<Ctx | null>(null);

function today(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AppState>;
          setState({ ...INITIAL, ...parsed, reader: { ...INITIAL.reader, ...parsed.reader } });
        }
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  const actions = useMemo<Actions>(
    () => ({
      setGuardianEmail: (guardianEmail) => setState((s) => ({ ...s, guardianEmail })),
      setGuardianVerified: () => setState((s) => ({ ...s, guardianVerified: true })),
      acceptPrivacy: () => setState((s) => ({ ...s, privacyAcceptedAt: new Date().toISOString() })),
      setChild: (childName, childAge, firstBookId) =>
        setState((s) => ({ ...s, childName, childAge, firstBookId: firstBookId ?? s.firstBookId })),
      toggleFavorite: (id) => setState((s) => ({ ...s, favorites: toggle(s.favorites, id) })),
      toggleSaved: (id) => setState((s) => ({ ...s, saved: toggle(s.saved, id) })),
      setProgress: (id, page) =>
        setState((s) => {
          const day = today();
          return {
            ...s,
            progress: { ...s.progress, [id]: page },
            readDays: s.readDays.includes(day) ? s.readDays : [...s.readDays, day],
            usedNight: s.usedNight || s.reader.night,
          };
        }),
      markFinished: (id) =>
        setState((s) => (s.finished.includes(id) ? s : { ...s, finished: [...s.finished, id] })),
      markQuizPassed: (id) =>
        setState((s) => (s.quizzesPassed.includes(id) ? s : { ...s, quizzesPassed: [...s.quizzesPassed, id] })),
      markNarrationUsed: () => setState((s) => (s.usedNarration ? s : { ...s, usedNarration: true })),
      updateReader: (patch) =>
        setState((s) => ({
          ...s,
          reader: { ...s.reader, ...patch },
          usedNight: s.usedNight || !!patch.night,
        })),
      setBuddyColor: (buddyColor) => setState((s) => ({ ...s, buddyColor, buddyTipDismissed: true })),
      dismissBuddyTip: () => setState((s) => ({ ...s, buddyTipDismissed: true })),
      setSubscribed: (subscribed) => setState((s) => ({ ...s, subscribed })),
      reset: () => setState(INITIAL),
    }),
    [],
  );

  const value = useMemo(() => ({ state, ready, actions }), [state, ready, actions]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp precisa estar dentro de <AppProvider>');
  return ctx;
}

/** Dias seguidos de leitura terminando hoje (ou ontem). */
export function currentStreak(days: string[]): number {
  const set = new Set(days);
  const d = new Date();
  const key = (x: Date) =>
    `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
  if (!set.has(key(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(key(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function earnedBadges(s: AppState): Set<BadgeId> {
  const out = new Set<BadgeId>();
  if (s.finished.length >= 1) out.add('primeiro-livro');
  if (s.finished.length >= 5) out.add('cinco-livros');
  if (s.finished.length >= 10) out.add('dez-livros');
  if (s.quizzesPassed.length >= 1) out.add('quiz');
  if (s.usedNarration) out.add('ouvinte');
  if (s.usedNight) out.add('coruja');
  if (currentStreak(s.readDays) >= 7) out.add('sete-dias');
  return out;
}

/** O livro está liberado por inteiro? (primeiro livro escolhido é grátis) */
export function isUnlocked(s: AppState, bookId: string): boolean {
  return s.subscribed || s.firstBookId === bookId;
}

