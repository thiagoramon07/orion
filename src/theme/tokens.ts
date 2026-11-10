/** Design tokens do Folheia. Fonte única de verdade para cores, tipografia e medidas. */
export const colors = {
  primary: '#0B6E6E',
  primaryDark: '#084F4F',
  primaryTint: '#E3F1F0',
  primarySoft: '#F4F8F8',

  accent: '#FFB627',
  accentShadow: '#C98A0E',
  accentLight: '#FFD36E',

  violet: '#5B3FA6',
  violetTint: '#EDE8F8',

  terracotta: '#B8471F',
  terracottaTint: '#FBE7DF',

  text: '#1C2333',
  textSecondary: '#5A6375',
  placeholder: '#6B7383',

  border: '#D5DAE1',
  inputBorder: '#CBD2DA',
  divider: '#E3E7EC',

  leaf: '#7BC47F',
  white: '#FFFFFF',
} as const;

export const fonts = {
  title: 'BricolageGrotesque_800ExtraBold',
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  bold: 'DMSans_700Bold',
} as const;

export const radii = {
  pill: 999,
  input: 14,
  card: 14,
  key: 20,
  cardLarge: 22,
} as const;

export const sizes = {
  buttonHeight: 56,
  inputHeight: 56,
  minTouch: 44,
  gutter: 24,
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
