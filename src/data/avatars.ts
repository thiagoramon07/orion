/** Avatares da criança: bichos (a maioria da fauna brasileira) sobre um fundo colorido. */
export type AvatarKind = { id: string; label: string; emoji?: string };

export const AVATAR_KINDS: AvatarKind[] = [
  { id: 'caca', label: 'Cacá, a capivara' },
  { id: 'arara', label: 'Arara', emoji: '🦜' },
  { id: 'onca', label: 'Onça', emoji: '🐆' },
  { id: 'tartaruga', label: 'Tartaruga', emoji: '🐢' },
  { id: 'macaco', label: 'Mico', emoji: '🐒' },
  { id: 'coruja', label: 'Coruja', emoji: '🦉' },
  { id: 'sapo', label: 'Sapo', emoji: '🐸' },
  { id: 'boto', label: 'Boto', emoji: '🐬' },
  { id: 'borboleta', label: 'Borboleta', emoji: '🦋' },
  { id: 'lobo', label: 'Lobo-guará', emoji: '🦊' },
  { id: 'abelha', label: 'Abelha', emoji: '🐝' },
  { id: 'tucano', label: 'Passarinho', emoji: '🐦' },
];

export const AVATAR_COLORS = ['#E3F1F0', '#FFD36E', '#EDE8F8', '#FBE7DF', '#CDEBCF', '#CFE6FA'];
