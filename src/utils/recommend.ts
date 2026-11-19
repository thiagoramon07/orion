import { Book, BOOKS } from '@/data/books';
import { INTERESTS } from '@/data/interests';

/**
 * Pontua um livro para uma criança: idade é o que mais pesa; interesses desempatam e sobem livros
 * do gosto dela. Livros já terminados descem um pouco.
 */
export function scoreBook(book: Book, age: number, interests: string[], finished: string[] = []): number {
  const tags = new Set(interests.flatMap((id) => INTERESTS.find((i) => i.id === id)?.tags ?? []));
  const inAge = age >= book.ageMin && age <= book.ageMax;
  const distance = inAge ? 0 : Math.min(Math.abs(age - book.ageMin), Math.abs(age - book.ageMax));
  const matches = book.tags.filter((t) => tags.has(t)).length;
  return (inAge ? 100 : 60 - distance * 15) + matches * 20 + book.popularity / 10 - (finished.includes(book.id) ? 30 : 0);
}

/** Estante "Para você": livros da idade, ordenados pelos interesses. */
export function recommendedFor(age: number, interests: string[], finished: string[] = []): Book[] {
  return [...BOOKS]
    .filter((b) => age >= b.ageMin - 1 && age <= b.ageMax + 1)
    .sort((a, b) => scoreBook(b, age, interests, finished) - scoreBook(a, age, interests, finished));
}

/** Livros de um interesse, para as prateleiras "Porque você gosta de…". */
export function booksForInterest(interestId: string, age: number): Book[] {
  const tags = new Set(INTERESTS.find((i) => i.id === interestId)?.tags ?? []);
  return BOOKS.filter((b) => b.tags.some((t) => tags.has(t))).sort(
    (a, b) => scoreBook(b, age, [interestId]) - scoreBook(a, age, [interestId]),
  );
}
