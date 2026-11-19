/** Interesses que a criança escolhe; cada um aponta para tags dos livros (src/data/books.ts). */
export type Interest = { id: string; label: string; emoji: string; tags: string[] };

export const INTERESTS: Interest[] = [
  { id: 'bichos', label: 'Bichos', emoji: '🐾', tags: ['bichos'] },
  { id: 'natureza', label: 'Natureza', emoji: '🌳', tags: ['natureza', 'meio ambiente', 'reciclagem'] },
  { id: 'aventura', label: 'Aventura', emoji: '🗺️', tags: ['aventura', 'sonhos'] },
  { id: 'espaco', label: 'Espaço', emoji: '🚀', tags: ['espaço'] },
  { id: 'ciencia', label: 'Ciência', emoji: '🔬', tags: ['ciência', 'não ficção'] },
  { id: 'humor', label: 'Histórias engraçadas', emoji: '😂', tags: ['humor'] },
  { id: 'misterio', label: 'Mistério', emoji: '🔍', tags: ['mistério'] },
  { id: 'familia', label: 'Família e amigos', emoji: '🤗', tags: ['família', 'amizade', 'cotidiano'] },
  { id: 'brasil', label: 'Brasil', emoji: '🇧🇷', tags: ['brasil'] },
  { id: 'dormir', label: 'Hora de dormir', emoji: '🌙', tags: ['dormir', 'rimas'] },
  { id: 'cores', label: 'Cores e comidas', emoji: '🎨', tags: ['cores', 'comida'] },
  { id: 'contos', label: 'Contos e diários', emoji: '📜', tags: ['contos', 'diário'] },
];

export function getInterest(id: string): Interest | undefined {
  return INTERESTS.find((i) => i.id === id);
}
