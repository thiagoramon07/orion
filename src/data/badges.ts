export type BadgeId = 'primeiro-livro' | 'cinco-livros' | 'dez-livros' | 'quiz' | 'ouvinte' | 'coruja' | 'sete-dias';

export type Badge = { id: BadgeId; label: string; description: string; color: string };

export const BADGES: Badge[] = [
  { id: 'primeiro-livro', label: '1º livro', description: 'Terminou o primeiro livro', color: '#FFB627' },
  { id: 'cinco-livros', label: '5 livros', description: 'Terminou 5 livros', color: '#7BC47F' },
  { id: 'dez-livros', label: '10 livros', description: 'Terminou 10 livros', color: '#5B3FA6' },
  { id: 'quiz', label: 'Quiz', description: 'Acertou um quiz inteiro', color: '#B8471F' },
  { id: 'ouvinte', label: 'Ouvinte', description: 'Ouviu um livro com a narração', color: '#0B6E6E' },
  { id: 'coruja', label: 'Coruja', description: 'Leu no modo noite', color: '#2B3A67' },
  { id: 'sete-dias', label: '7 dias', description: 'Leu 7 dias seguidos', color: '#E5484D' },
];
