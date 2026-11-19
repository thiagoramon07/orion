import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { BadgeId } from '@/data/badges';

/**
 * Estado local do app, salvo no aparelho (AsyncStorage).
 * Uma família (responsável) tem até MAX_PROFILES perfis de criança; cada perfil guarda o próprio
 * progresso, medalhas, interesses e registro de leitura.
 * TODO: sincronizar com o backend quando existir conta real (Fase 2).
 */
export type ReaderSettings = {
  night: boolean;
  speed: 'devagar' | 'normal' | 'rapido';
  highlight: boolean;
};

export type Avatar = { kind: string; color: string };

export type ChildProfile = {
  id: string;
  name: string;
  age: number;
  avatar: Avatar;
  /** Ids de interesse (src/data/interests.ts). */
  interests: string[];
  /** Meta diária de leitura, em minutos. */
  dailyGoalMin: number;
  firstBookId?: string;
  buddyColor?: string;
  buddyTipDismissed: boolean;
  favorites: string[];
  saved: string[];
  /** Última página lida de cada livro. */
  progress: Record<string, number>;
  finished: string[];
  quizzesPassed: string[];
  /** Dias (AAAA-MM-DD) em que houve leitura. */
  readDays: string[];
  /** Segundos de leitura por dia (AAAA-MM-DD). */
  readingLog: Record<string, number>;
  usedNarration: boolean;
  usedNight: boolean;
  createdAt: string;
};

type Family = {
  /** E-mail do responsável (cadastro). */
  guardianEmail: string;
  /** Passou pela verificação de adulto (ano de nascimento — o ano em si não é guardado). */
  guardianVerified: boolean;
  /** Data (ISO) em que aceitou a proteção de dados. */
  privacyAcceptedAt?: string;
  subscribed: boolean;
  reader: ReaderSettings;
};

type Stored = { version: 2; family: Family; profiles: ChildProfile[]; activeProfileId?: string };

/** Visão "achatada" usada pelas telas: dados da família + do perfil ativo. */
export type AppState = Family &
  Omit<ChildProfile, 'id' | 'name' | 'age' | 'createdAt'> & {
    childName: string;
    childAge: number;
    profiles: ChildProfile[];
    activeProfileId?: string;
  };

export const MAX_PROFILES = 4;
export const DEFAULT_GOAL_MIN = 10;
/** Páginas liberadas em livros que não são o primeiro escolhido (sem assinatura). */
export const PREVIEW_PAGES = 3;

const STORAGE_KEY = 'folheia:estado:v2';
const LEGACY_KEY = 'folheia:estado:v1';

const DEFAULT_READER: ReaderSettings = { night: false, speed: 'normal', highlight: true };
const EMPTY_FAMILY: Family = { guardianEmail: '', guardianVerified: false, subscribed: false, reader: DEFAULT_READER };
const EMPTY_STORED: Stored = { version: 2, family: EMPTY_FAMILY, profiles: [] };

export const DEFAULT_AVATAR: Avatar = { kind: 'caca', color: '#E3F1F0' };

export function newProfile(name: string, age: number, extra: Partial<ChildProfile> = {}): ChildProfile {
  return {
    id: `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    name,
    age,
    avatar: DEFAULT_AVATAR,
    interests: [],
    dailyGoalMin: DEFAULT_GOAL_MIN,
    buddyTipDismissed: false,
    favorites: [],
    saved: [],
    progress: {},
    finished: [],
    quizzesPassed: [],
    readDays: [],
    readingLog: {},
    usedNarration: false,
    usedNight: false,
    createdAt: new Date().toISOString(),
    ...extra,
  };
}

/** Converte o formato antigo (um perfil só, v1) para o novo. */
function migrateV1(raw: Record<string, unknown>): Stored {
  const v1 = raw as Partial<AppState> & { childName?: string; childAge?: number };
  const family: Family = {
    guardianEmail: v1.guardianEmail ?? '',
    guardianVerified: !!v1.guardianVerified,
    privacyAcceptedAt: v1.privacyAcceptedAt,
    subscribed: !!v1.subscribed,
    reader: { ...DEFAULT_READER, ...(v1.reader ?? {}) },
  };
  if (!v1.childName) return { version: 2, family, profiles: [] };
  const profile = newProfile(v1.childName, v1.childAge ?? 6, {
    firstBookId: v1.firstBookId,
    buddyColor: v1.buddyColor,
    buddyTipDismissed: !!v1.buddyTipDismissed,
    favorites: v1.favorites ?? [],
    saved: v1.saved ?? [],
    progress: v1.progress ?? {},
    finished: v1.finished ?? [],
    quizzesPassed: v1.quizzesPassed ?? [],
    readDays: v1.readDays ?? [],
    usedNarration: !!v1.usedNarration,
    usedNight: !!v1.usedNight,
  });
  return { version: 2, family, profiles: [profile], activeProfileId: profile.id };
}

export function todayKey(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

type Actions = {
  setGuardianEmail: (email: string) => void;
  setGuardianVerified: () => void;
  acceptPrivacy: () => void;
  /** Cria um perfil novo e o deixa ativo (ignorado se já houver MAX_PROFILES). Devolve o id. */
  addProfile: (p: { name: string; age: number; avatar?: Avatar; interests?: string[]; firstBookId?: string }) => string;
  updateProfile: (id: string, patch: Partial<Omit<ChildProfile, 'id'>>) => void;
  removeProfile: (id: string) => void;
  switchProfile: (id: string) => void;
  /** Compatibilidade: cria/atualiza o perfil ativo (fluxo do primeiro livro). */
  setChild: (name: string, age: number, firstBookId?: string) => void;
  toggleFavorite: (bookId: string) => void;
  toggleSaved: (bookId: string) => void;
  setProgress: (bookId: string, page: number) => void;
  markFinished: (bookId: string) => void;
  markQuizPassed: (bookId: string) => void;
  markNarrationUsed: () => void;
  /** Soma segundos de leitura no dia de hoje do perfil ativo. */
  addReadingTime: (seconds: number) => void;
  updateReader: (patch: Partial<ReaderSettings>) => void;
  setBuddyColor: (color: string) => void;
  dismissBuddyTip: () => void;
  /** TODO: integrar com pagamento real (Fase 3). */
  setSubscribed: (value: boolean) => void;
  reset: () => void;
};

type Ctx = { state: AppState; stored: Stored; ready: boolean; actions: Actions };

const AppContext = createContext<Ctx | null>(null);

function flatten(s: Stored): AppState {
  const active = s.profiles.find((p) => p.id === s.activeProfileId) ?? s.profiles[0];
  const base = active ?? newProfile('', 6);
  const { id: _id, name, age, createdAt: _c, ...rest } = base;
  return {
    ...s.family,
    ...rest,
    childName: active ? name : '',
    childAge: age,
    profiles: s.profiles,
    activeProfileId: active?.id,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<Stored>(EMPTY_STORED);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Stored;
          setStored({
            ...EMPTY_STORED,
            ...parsed,
            family: { ...EMPTY_FAMILY, ...parsed.family, reader: { ...DEFAULT_READER, ...parsed.family?.reader } },
            profiles: (parsed.profiles ?? []).map((p) => ({ ...newProfile(p.name, p.age), ...p })),
          });
        } else {
          const legacy = await AsyncStorage.getItem(LEGACY_KEY);
          if (legacy) setStored(migrateV1(JSON.parse(legacy)));
        }
      } catch {
        // dados corrompidos: começa do zero
      } finally {
        loaded.current = true;
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stored)).catch(() => {});
  }, [stored]);

  const actions = useMemo<Actions>(() => {
    /** Aplica uma mudança só no perfil ativo. */
    const onActive = (fn: (p: ChildProfile, family: Family) => ChildProfile) =>
      setStored((s) => {
        const id = s.activeProfileId ?? s.profiles[0]?.id;
        if (!id) return s;
        return { ...s, profiles: s.profiles.map((p) => (p.id === id ? fn(p, s.family) : p)) };
      });

    return {
      setGuardianEmail: (guardianEmail) => setStored((s) => ({ ...s, family: { ...s.family, guardianEmail } })),
      setGuardianVerified: () => setStored((s) => ({ ...s, family: { ...s.family, guardianVerified: true } })),
      acceptPrivacy: () =>
        setStored((s) => ({ ...s, family: { ...s.family, privacyAcceptedAt: new Date().toISOString() } })),
      addProfile: ({ name, age, avatar, interests, firstBookId }) => {
        const profile = newProfile(name, age, {
          avatar: avatar ?? DEFAULT_AVATAR,
          interests: interests ?? [],
          firstBookId,
        });
        setStored((s) =>
          s.profiles.length >= MAX_PROFILES
            ? s
            : { ...s, profiles: [...s.profiles, profile], activeProfileId: profile.id },
        );
        return profile.id;
      },
      updateProfile: (id, patch) =>
        setStored((s) => ({ ...s, profiles: s.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      removeProfile: (id) =>
        setStored((s) => {
          const profiles = s.profiles.filter((p) => p.id !== id);
          return { ...s, profiles, activeProfileId: s.activeProfileId === id ? profiles[0]?.id : s.activeProfileId };
        }),
      switchProfile: (id) => setStored((s) => (s.profiles.some((p) => p.id === id) ? { ...s, activeProfileId: id } : s)),
      setChild: (name, age, firstBookId) =>
        setStored((s) => {
          const id = s.activeProfileId ?? s.profiles[0]?.id;
          if (!id) {
            const profile = newProfile(name, age, { firstBookId });
            return { ...s, profiles: [profile], activeProfileId: profile.id };
          }
          return {
            ...s,
            profiles: s.profiles.map((p) => (p.id === id ? { ...p, name, age, firstBookId: firstBookId ?? p.firstBookId } : p)),
          };
        }),
      toggleFavorite: (id) => onActive((p) => ({ ...p, favorites: toggle(p.favorites, id) })),
      toggleSaved: (id) => onActive((p) => ({ ...p, saved: toggle(p.saved, id) })),
      setProgress: (id, page) =>
        onActive((p, family) => {
          const day = todayKey();
          return {
            ...p,
            progress: { ...p.progress, [id]: page },
            readDays: p.readDays.includes(day) ? p.readDays : [...p.readDays, day],
            usedNight: p.usedNight || family.reader.night,
          };
        }),
      markFinished: (id) => onActive((p) => (p.finished.includes(id) ? p : { ...p, finished: [...p.finished, id] })),
      markQuizPassed: (id) =>
        onActive((p) => (p.quizzesPassed.includes(id) ? p : { ...p, quizzesPassed: [...p.quizzesPassed, id] })),
      markNarrationUsed: () => onActive((p) => (p.usedNarration ? p : { ...p, usedNarration: true })),
      addReadingTime: (seconds) =>
        onActive((p) => {
          const day = todayKey();
          return {
            ...p,
            readingLog: { ...p.readingLog, [day]: (p.readingLog[day] ?? 0) + seconds },
            readDays: p.readDays.includes(day) ? p.readDays : [...p.readDays, day],
          };
        }),
      updateReader: (patch) =>
        setStored((s) => {
          const family = { ...s.family, reader: { ...s.family.reader, ...patch } };
          if (!patch.night) return { ...s, family };
          const id = s.activeProfileId;
          return { ...s, family, profiles: s.profiles.map((p) => (p.id === id ? { ...p, usedNight: true } : p)) };
        }),
      setBuddyColor: (buddyColor) => onActive((p) => ({ ...p, buddyColor, buddyTipDismissed: true })),
      dismissBuddyTip: () => onActive((p) => ({ ...p, buddyTipDismissed: true })),
      setSubscribed: (subscribed) => setStored((s) => ({ ...s, family: { ...s.family, subscribed } })),
      reset: () => setStored(EMPTY_STORED),
    };
  }, []);

  const state = useMemo(() => flatten(stored), [stored]);
  const value = useMemo(() => ({ state, stored, ready, actions }), [state, stored, ready, actions]);
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
  if (!set.has(todayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(todayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/** Minutos lidos hoje (arredondado para baixo). */
export function minutesToday(log: Record<string, number>): number {
  return Math.floor((log[todayKey()] ?? 0) / 60);
}

/** Minutos por dia nos últimos `days` dias (do mais antigo para hoje). */
export function lastDaysMinutes(log: Record<string, number>, days = 7): { day: string; minutes: number }[] {
  const out: { day: string; minutes: number }[] = [];
  const d = new Date();
  d.setDate(d.getDate() - (days - 1));
  for (let i = 0; i < days; i++) {
    const key = todayKey(d);
    out.push({ day: key, minutes: Math.round((log[key] ?? 0) / 60) });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

type BadgeSource = Pick<ChildProfile, 'finished' | 'quizzesPassed' | 'usedNarration' | 'usedNight' | 'readDays'>;

export function earnedBadges(s: BadgeSource): Set<BadgeId> {
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
export function isUnlocked(s: Pick<AppState, 'subscribed' | 'firstBookId'>, bookId: string): boolean {
  return s.subscribed || s.firstBookId === bookId;
}
