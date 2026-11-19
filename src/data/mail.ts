export type MailMessage = { id: string; from: string; title: string; body: string; emoji: string };

/** Mensagens locais da caixa de correio. TODO: vir do backend. */
export function inboxFor(childName: string): MailMessage[] {
  const name = childName || 'leitor';
  return [
    {
      id: 'boas-vindas',
      from: 'Cacá',
      emoji: '🦫',
      title: `Bem-vindo(a), ${name}!`,
      body: 'Que alegria ter você aqui! Toda vez que terminar um livro, você ganha uma medalha nova. Bora ler?',
    },
    {
      id: 'dica-narracao',
      from: 'Cacá',
      emoji: '🔊',
      title: 'Dica: eu leio pra você!',
      body: 'No leitor, toque no botão de play e eu leio a história em voz alta. As palavras vão acendendo enquanto eu leio.',
    },
    {
      id: 'dica-noite',
      from: 'Cacá',
      emoji: '🌙',
      title: 'Hora de dormir?',
      body: 'Use o modo noite no leitor: a tela fica escurinha e confortável para ler antes de dormir.',
    },
  ];
}
