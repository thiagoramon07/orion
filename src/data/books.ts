/**
 * Catálogo local de livros ORIGINAIS do Folheia (textos e títulos inventados).
 * TODO: substituir por dados vindos do backend.
 */
import { colors } from '@/theme';
import type { CoverMotif } from '@/components/book-cover';

export type SceneItem = 'sun' | 'moon' | 'stars' | 'cloud' | 'tree' | 'house' | 'waves' | 'flowers' | 'planet' | 'hills';

export type Scene = {
  sky: string;
  ground?: string;
  items?: SceneItem[];
  /** Personagem principal da página (emoji, para protótipo; 'caca' desenha a mascote). */
  hero?: string;
};

export type BookPage = { text: string; scene: Scene };

export type QuizQuestion = { question: string; options: string[]; answer: number };

export type Book = {
  id: string;
  title: string;
  series?: string;
  author: string;
  illustrator: string;
  synopsis: string;
  ageMin: number;
  ageMax: number;
  /** Nível de leitura (A = iniciante … E = fluente). */
  level: 'A' | 'B' | 'C' | 'D' | 'E';
  tags: string[];
  isNew?: boolean;
  /** Popularidade (ordena as sugestões). */
  popularity: number;
  cover: { background: string; foreground?: string; detail?: string; motif: CoverMotif };
  pages: BookPage[];
  quiz?: QuizQuestion[];
};

export const LEVEL_LABEL: Record<Book['level'], string> = {
  A: 'A · primeiras palavras',
  B: 'B · leitor iniciante',
  C: 'C · leitor em progresso',
  D: 'D · leitor confiante',
  E: 'E · leitor fluente',
};

export const BOOKS: Book[] = [
  {
    id: 'boa-noite-lua',
    title: 'Boa Noite, Lua Cheia',
    author: 'Lia Moreira',
    illustrator: 'Duda Campos',
    synopsis: 'A Lua passa de janela em janela dando boa-noite a todos os bichinhos da fazenda.',
    ageMin: 0,
    ageMax: 4,
    level: 'A',
    tags: ['dormir', 'bichos', 'rimas'],
    popularity: 90,
    cover: { background: '#2B3A67', detail: colors.accentLight, motif: 'stars' },
    pages: [
      { text: 'A Lua acordou redonda e brilhante.', scene: { sky: '#2B3A67', ground: '#3E5C3A', items: ['moon', 'stars'], hero: '🌕' } },
      { text: 'Boa noite, vaquinha. Muuu, até amanhã!', scene: { sky: '#2B3A67', ground: '#3E5C3A', items: ['moon', 'stars', 'house'], hero: '🐄' } },
      { text: 'Boa noite, galinha. Có, có, vou dormir!', scene: { sky: '#2B3A67', ground: '#3E5C3A', items: ['stars', 'house'], hero: '🐔' } },
      { text: 'Boa noite, porquinho, quentinho no capim.', scene: { sky: '#2B3A67', ground: '#3E5C3A', items: ['moon', 'stars'], hero: '🐷' } },
      { text: 'E boa noite pra você, que leu até o fim.', scene: { sky: '#1E2A4D', items: ['moon', 'stars'], hero: '😴' } },
    ],
    quiz: [
      { question: 'Quem dá boa-noite aos bichinhos?', options: ['O Sol', 'A Lua', 'O vento'], answer: 1 },
      { question: 'Qual bicho faz "muuu"?', options: ['A vaquinha', 'A galinha', 'O porquinho'], answer: 0 },
    ],
  },
  {
    id: 'cores-da-feira',
    title: 'Cores da Feira',
    author: 'Tomás Brandão',
    illustrator: 'Marina Okada',
    synopsis: 'Um passeio pela feira de domingo para descobrir as cores das frutas e dos legumes.',
    ageMin: 2,
    ageMax: 5,
    level: 'A',
    tags: ['cores', 'comida', 'cotidiano'],
    popularity: 70,
    cover: { background: colors.leaf, foreground: colors.text, detail: colors.accent, motif: 'dots' },
    pages: [
      { text: 'Domingo é dia de feira!', scene: { sky: '#BFE3F2', ground: '#E8D3B0', items: ['sun', 'cloud'], hero: '🧺' } },
      { text: 'Vermelho como o tomate.', scene: { sky: '#BFE3F2', ground: '#E8D3B0', items: ['sun'], hero: '🍅' } },
      { text: 'Amarelo como a banana.', scene: { sky: '#BFE3F2', ground: '#E8D3B0', items: ['sun'], hero: '🍌' } },
      { text: 'Verde como a alface.', scene: { sky: '#BFE3F2', ground: '#E8D3B0', items: ['cloud'], hero: '🥬' } },
      { text: 'Roxo como a uva. Qual cor você mais gosta?', scene: { sky: '#BFE3F2', ground: '#E8D3B0', items: ['sun', 'flowers'], hero: '🍇' } },
    ],
    quiz: [{ question: 'Qual fruta é amarela?', options: ['Uva', 'Banana', 'Tomate'], answer: 1 }],
  },
  {
    id: 'caca-quer-voar',
    title: 'A Capivara que Queria Voar',
    series: 'Aventuras da Cacá',
    author: 'Lia Moreira',
    illustrator: 'Equipe Folheia',
    synopsis: 'Cacá sonha em voar como os passarinhos. Será que um livro pode levá-la até as nuvens?',
    ageMin: 3,
    ageMax: 7,
    level: 'B',
    tags: ['cacá', 'sonhos', 'amizade', 'bichos'],
    isNew: true,
    popularity: 95,
    cover: { background: colors.primary, detail: colors.accentLight, motif: 'hills' },
    pages: [
      { text: 'Cacá olhava o céu todos os dias. Os passarinhos pareciam tão felizes lá em cima!', scene: { sky: '#BFE3F2', ground: colors.leaf, items: ['sun', 'cloud', 'tree'], hero: 'caca' } },
      { text: '"Eu também quero voar", disse Cacá para o bem-te-vi.', scene: { sky: '#BFE3F2', ground: colors.leaf, items: ['cloud', 'tree'], hero: '🐦' } },
      { text: 'Ela tentou pular bem alto. Tchibum! Caiu direto no rio.', scene: { sky: '#BFE3F2', ground: '#4FA3C7', items: ['waves', 'sun'], hero: '💦' } },
      { text: 'Molhada, Cacá encontrou um livro na margem. Na capa, um balão colorido.', scene: { sky: '#FFE7B3', ground: colors.leaf, items: ['sun', 'flowers'], hero: '📖' } },
      { text: 'Página por página, Cacá subiu num balão, atravessou nuvens e viu o mundo lá de cima.', scene: { sky: '#9FD3F0', items: ['cloud', 'sun'], hero: '🎈' } },
      { text: 'Naquele dia ela aprendeu: quem lê pode voar para qualquer lugar.', scene: { sky: '#FFD36E', ground: colors.leaf, items: ['sun', 'tree', 'flowers'], hero: '✨' } },
    ],
    quiz: [
      { question: 'O que Cacá queria fazer?', options: ['Nadar', 'Voar', 'Dormir'], answer: 1 },
      { question: 'O que Cacá encontrou na margem do rio?', options: ['Um livro', 'Uma pedra', 'Um peixe'], answer: 0 },
    ],
  },
  {
    id: 'caca-lixeiras',
    title: 'Cacá e as Lixeiras Coloridas',
    series: 'Aventuras da Cacá',
    author: 'Lia Moreira',
    illustrator: 'Equipe Folheia',
    synopsis: 'No parque, Cacá conhece cinco lixeiras falantes e descobre, rindo muito, para onde vai cada tipo de lixo.',
    ageMin: 4,
    ageMax: 6,
    level: 'B',
    tags: ['cacá', 'meio ambiente', 'reciclagem', 'humor', 'cores', 'natureza'],
    isNew: true,
    popularity: 97,
    cover: { background: '#3FA7D6', detail: colors.accentLight, motif: 'dots' },
    pages: [
      {
        text: 'No parque, Cacá encontrou cinco lixeiras coloridas. E cada uma tinha uma boca bem grande!',
        scene: { sky: '#BFE3F2', ground: colors.leaf, items: ['sun', 'tree', 'cloud'], hero: 'caca' },
      },
      {
        text: 'Oi, Cacá! Eu sou a lixeira azul e adoro comer papel: jornal, caderno velho e caixa de papelão. Nham, nham!',
        scene: { sky: '#CFE6FA', ground: '#3F7FD1', items: ['cloud'], hero: '📦' },
      },
      {
        text: 'A lixeira vermelha deu uma gargalhada: eu fico com o plástico! Garrafinha, copinho e pote de iogurte.',
        scene: { sky: '#FBE1DC', ground: '#D9483B', items: ['sun'], hero: '🧴' },
      },
      {
        text: 'A lixeira verde falou baixinho: eu guardo o vidro. Mas cuidado: vidro quebrado, só um adulto pode pegar!',
        scene: { sky: '#DDF2DE', ground: '#3E9A4E', items: ['flowers'], hero: '🫙' },
      },
      {
        text: 'E eu, a amarela, fico com o metal: latinha de suco e tampinha de pote. Plim, plim!',
        scene: { sky: '#FFF1C7', ground: '#F2B705', items: ['sun'], hero: '🥫' },
      },
      {
        text: 'A lixeira marrom bocejou: casca de banana e resto de comida são comigo. Eu viro adubo para as plantas!',
        scene: { sky: '#F1E3D3', ground: '#8A5A33', items: ['tree', 'flowers'], hero: '🍌' },
      },
      {
        text: 'Cacá separou tudo direitinho. O parque ficou limpinho, e as cinco lixeiras cantaram juntas: separar é cuidar!',
        scene: { sky: '#FFD36E', ground: colors.leaf, items: ['sun', 'tree', 'flowers'], hero: 'caca' },
      },
    ],
    quiz: [
      { question: 'Qual lixeira come papel?', options: ['A azul', 'A vermelha', 'A verde'], answer: 0 },
      { question: 'Onde vai a garrafinha de plástico?', options: ['Na amarela', 'Na vermelha', 'Na marrom'], answer: 1 },
      { question: 'O que acontece com a casca de banana na lixeira marrom?', options: ['Vira adubo', 'Vira papel', 'Vira vidro'], answer: 0 },
      { question: 'Quem pode pegar vidro quebrado?', options: ['Qualquer criança', 'Só um adulto', 'A Cacá'], answer: 1 },
    ],
  },
  {
    id: 'sapo-astronauta',
    title: 'O Sapo Astronauta',
    author: 'Renato Ivo',
    illustrator: 'Bia Salles',
    synopsis: 'Juca, um sapo muito curioso, constrói um foguete de folhas para visitar a Lua.',
    ageMin: 4,
    ageMax: 8,
    level: 'B',
    tags: ['espaço', 'ciência', 'bichos', 'humor'],
    popularity: 92,
    cover: { background: colors.violet, detail: colors.accentLight, motif: 'stars' },
    pages: [
      { text: 'Juca era um sapo diferente. Enquanto os outros caçavam moscas, ele contava estrelas.', scene: { sky: '#2B2350', ground: '#3E5C3A', items: ['stars', 'moon'], hero: '🐸' } },
      { text: 'Um dia, decidiu: "Vou visitar a Lua!"', scene: { sky: '#2B2350', items: ['moon', 'stars'], hero: '🌙' } },
      { text: 'Juntou folhas, gravetos e uma tampinha brilhante. Pronto: um foguete!', scene: { sky: '#BFE3F2', ground: colors.leaf, items: ['tree', 'sun'], hero: '🚀' } },
      { text: 'Três, dois, um... O foguete pulou, pulou e — ploft! — caiu na lagoa.', scene: { sky: '#BFE3F2', ground: '#4FA3C7', items: ['waves'], hero: '💥' } },
      { text: 'Mas na água, Juca viu a Lua refletida, pertinho dele.', scene: { sky: '#2B2350', ground: '#2E5C7A', items: ['moon', 'waves', 'stars'], hero: '🐸' } },
      { text: '"Hoje eu visito a Lua de mentirinha. Amanhã, eu estudo para visitar a de verdade!"', scene: { sky: '#2B2350', items: ['planet', 'stars', 'moon'], hero: '🔭' } },
    ],
    quiz: [
      { question: 'O que Juca gostava de contar?', options: ['Moscas', 'Estrelas', 'Folhas'], answer: 1 },
      { question: 'Onde Juca viu a Lua pertinho?', options: ['Na lagoa', 'No céu', 'Num livro'], answer: 0 },
    ],
  },
  {
    id: 'vovo-pirata',
    title: 'Vovó Pirata',
    author: 'Clara Nunes Vidal',
    illustrator: 'Pedro Lins',
    synopsis: 'A vovó de Nina guarda um baú misterioso no sótão — e um mapa que leva a um tesouro inesperado.',
    ageMin: 5,
    ageMax: 9,
    level: 'C',
    tags: ['aventura', 'família', 'humor'],
    popularity: 88,
    cover: { background: colors.accent, foreground: colors.text, detail: colors.terracotta, motif: 'waves' },
    pages: [
      { text: 'Nas férias, Nina foi passar uns dias na casa da Vovó Celeste, perto do mar.', scene: { sky: '#BFE3F2', ground: '#E8D3B0', items: ['sun', 'house', 'waves'], hero: '👧' } },
      { text: 'No sótão, havia um baú enorme com uma caveira desenhada. "Isso é de pirata!", gritou Nina.', scene: { sky: '#6B4E3D', items: [], hero: '🧰' } },
      { text: 'A vovó piscou um olho e tirou de lá um chapéu de três pontas e um mapa amarelado.', scene: { sky: '#6B4E3D', items: [], hero: '🗺️' } },
      { text: '"Quando eu era menina, eu era a capitã do barco do seu bisavô!", contou a vovó.', scene: { sky: '#9FD3F0', ground: '#2E7DA6', items: ['waves', 'cloud'], hero: '⛵' } },
      { text: 'As duas seguiram o mapa até a praia. Cavaram, cavaram... e acharam uma latinha.', scene: { sky: '#BFE3F2', ground: '#E8D3B0', items: ['sun', 'waves'], hero: '🏖️' } },
      { text: 'Dentro, fotos antigas e um bilhete: "O maior tesouro são as histórias que a gente divide."', scene: { sky: '#FFD36E', ground: '#E8D3B0', items: ['sun'], hero: '💛' } },
    ],
    quiz: [
      { question: 'O que havia no baú da vovó?', options: ['Brinquedos', 'Um chapéu e um mapa', 'Comida'], answer: 1 },
      { question: 'Qual era o maior tesouro?', options: ['Ouro', 'As histórias divididas', 'Uma coroa'], answer: 1 },
    ],
  },
  {
    id: 'misterios-do-quintal',
    title: 'Mistérios do Quintal',
    series: 'Detetives Mirins',
    author: 'Renato Ivo',
    illustrator: 'Marina Okada',
    synopsis: 'Alguém está comendo os morangos da horta. Téo e sua lupa vão descobrir quem é!',
    ageMin: 5,
    ageMax: 9,
    level: 'C',
    tags: ['mistério', 'natureza', 'bichos'],
    popularity: 85,
    cover: { background: colors.terracotta, detail: colors.accentLight, motif: 'dots' },
    pages: [
      { text: 'Toda manhã, faltava um morango na horta da família de Téo.', scene: { sky: '#BFE3F2', ground: '#8BC17A', items: ['sun', 'flowers'], hero: '🍓' } },
      { text: 'Téo pegou sua lupa e seu caderno. "Caso aberto!", anunciou.', scene: { sky: '#BFE3F2', ground: '#8BC17A', items: ['tree'], hero: '🔍' } },
      { text: 'Pista número um: pegadinhas pequenas na terra molhada.', scene: { sky: '#BFE3F2', ground: '#A0784F', items: ['cloud'], hero: '🐾' } },
      { text: 'Pista número dois: um fio de seda brilhando entre as folhas.', scene: { sky: '#BFE3F2', ground: '#8BC17A', items: ['flowers'], hero: '🕸️' } },
      { text: 'De madrugada, Téo ficou de tocaia com a lanterna. E então viu...', scene: { sky: '#2B3A67', ground: '#3E5C3A', items: ['moon', 'stars'], hero: '🔦' } },
      { text: 'Um sabiá! Ele levava os morangos para os filhotes no ninho. Téo decidiu plantar mais um pé, só para eles.', scene: { sky: '#BFE3F2', ground: '#8BC17A', items: ['sun', 'tree'], hero: '🐦' } },
    ],
    quiz: [
      { question: 'O que sumia da horta?', options: ['Morangos', 'Alfaces', 'Cenouras'], answer: 0 },
      { question: 'Quem pegava os morangos?', options: ['Um gato', 'Um sabiá', 'O vizinho'], answer: 1 },
    ],
  },
  {
    id: 'bichos-do-cerrado',
    title: 'Bichos do Cerrado',
    author: 'Ana Paula Freire',
    illustrator: 'Duda Campos',
    synopsis: 'Conheça o lobo-guará, o tamanduá-bandeira e outros moradores do cerrado brasileiro.',
    ageMin: 6,
    ageMax: 10,
    level: 'C',
    tags: ['natureza', 'ciência', 'brasil', 'bichos', 'não ficção'],
    popularity: 80,
    cover: { background: '#C8792B', detail: '#F3D27A', motif: 'hills' },
    pages: [
      { text: 'O cerrado é um dos lugares com mais tipos de plantas e bichos do Brasil.', scene: { sky: '#F6D9A0', ground: '#C8A15A', items: ['sun', 'tree', 'hills'], hero: '🌳' } },
      { text: 'O lobo-guará tem pernas compridas e adora comer uma fruta chamada lobeira.', scene: { sky: '#F6D9A0', ground: '#C8A15A', items: ['sun', 'tree'], hero: '🦊' } },
      { text: 'O tamanduá-bandeira usa a língua comprida para comer formigas e cupins.', scene: { sky: '#F6D9A0', ground: '#C8A15A', items: ['hills'], hero: '🐜' } },
      { text: 'A seriema canta tão alto que dá para ouvir de longe!', scene: { sky: '#BFE3F2', ground: '#C8A15A', items: ['cloud', 'tree'], hero: '🐦' } },
      { text: 'Proteger o cerrado é proteger a água que chega até a nossa casa.', scene: { sky: '#BFE3F2', ground: '#4FA3C7', items: ['waves', 'sun'], hero: '💧' } },
    ],
    quiz: [
      { question: 'Qual fruta o lobo-guará adora?', options: ['Lobeira', 'Maçã', 'Uva'], answer: 0 },
      { question: 'O que o tamanduá-bandeira come?', options: ['Peixes', 'Formigas e cupins', 'Folhas'], answer: 1 },
    ],
  },
  {
    id: 'contos-da-vila',
    title: 'Contos da Vila',
    author: 'Clara Nunes Vidal',
    illustrator: 'Pedro Lins',
    synopsis: 'Na Vila do Sossego, cada morador tem uma história curiosa para contar na praça.',
    ageMin: 7,
    ageMax: 11,
    level: 'D',
    tags: ['contos', 'amizade', 'cotidiano'],
    popularity: 78,
    cover: { background: colors.leaf, foreground: colors.text, detail: colors.primaryDark, motif: 'hills' },
    pages: [
      { text: 'Na Vila do Sossego, toda sexta-feira o povo se reunia na praça para contar histórias.', scene: { sky: '#FFD9A8', ground: '#C9B28A', items: ['house', 'tree', 'sun'], hero: '🏘️' } },
      { text: 'Seu Bento, o padeiro, jurava que seu pão de queijo já tinha ganhado um concurso na capital.', scene: { sky: '#FFD9A8', ground: '#C9B28A', items: ['house'], hero: '🧀' } },
      { text: 'Dona Lurdes contou que seu papagaio sabia cantar o hino da escola inteirinho.', scene: { sky: '#BFE3F2', ground: '#C9B28A', items: ['tree', 'cloud'], hero: '🦜' } },
      { text: 'Mas a melhor história foi a de Lucas, de nove anos, que nunca tinha contado nada.', scene: { sky: '#2B3A67', ground: '#5B4A3A', items: ['stars', 'moon'], hero: '👦' } },
      { text: 'Ele abriu um caderno e leu um conto que ele mesmo escreveu. A praça inteira aplaudiu de pé.', scene: { sky: '#2B3A67', ground: '#5B4A3A', items: ['stars', 'house'], hero: '📓' } },
    ],
    quiz: [{ question: 'Quem contou a melhor história?', options: ['Seu Bento', 'Dona Lurdes', 'Lucas'], answer: 2 }],
  },
  {
    id: 'guardiao-do-rio',
    title: 'O Guardião do Rio',
    author: 'Ana Paula Freire',
    illustrator: 'Bia Salles',
    synopsis: 'Quando o rio da cidade começa a ficar triste, Raí descobre que pode ser seu guardião.',
    ageMin: 9,
    ageMax: 13,
    level: 'D',
    tags: ['natureza', 'aventura', 'brasil'],
    popularity: 74,
    cover: { background: '#1F6F8B', detail: '#9FD3F0', motif: 'waves' },
    pages: [
      { text: 'O rio Piraí sempre foi o lugar favorito de Raí. Ali ele pescava, nadava e pensava na vida.', scene: { sky: '#BFE3F2', ground: '#2E7DA6', items: ['waves', 'tree', 'sun'], hero: '🎣' } },
      { text: 'Mas naquele verão a água estava turva, e os peixes tinham sumido.', scene: { sky: '#C9CED6', ground: '#6B7B6E', items: ['waves', 'cloud'], hero: '😟' } },
      { text: 'Raí seguiu a margem por quilômetros e encontrou um cano despejando sujeira na correnteza.', scene: { sky: '#C9CED6', ground: '#6B7B6E', items: ['waves'], hero: '🚧' } },
      { text: 'Fotografou tudo, escreveu uma carta e levou à prefeitura com a ajuda da professora.', scene: { sky: '#BFE3F2', ground: '#C9B28A', items: ['house', 'sun'], hero: '✉️' } },
      { text: 'Meses depois, o cano foi consertado. Aos poucos, o Piraí voltou a brilhar — e Raí ganhou um apelido: o Guardião do Rio.', scene: { sky: '#BFE3F2', ground: '#2E7DA6', items: ['waves', 'sun', 'tree'], hero: '🐟' } },
    ],
    quiz: [
      { question: 'Por que o rio estava triste?', options: ['Faltava chuva', 'Um cano despejava sujeira', 'Tinha muitos peixes'], answer: 1 },
      { question: 'Como Raí ajudou?', options: ['Escreveu uma carta à prefeitura', 'Mudou de cidade', 'Não fez nada'], answer: 0 },
    ],
  },
  {
    id: 'diario-inventora',
    title: 'Diário de uma Inventora',
    author: 'Tomás Brandão',
    illustrator: 'Marina Okada',
    synopsis: 'Malu anota no diário cada invenção maluca — inclusive as que deram muito errado.',
    ageMin: 9,
    ageMax: 13,
    level: 'E',
    tags: ['ciência', 'humor', 'diário'],
    isNew: true,
    popularity: 76,
    cover: { background: '#E5484D', detail: colors.accentLight, motif: 'dots' },
    pages: [
      { text: 'Segunda-feira. Inventei uma máquina de fazer a cama sozinha. Ela fez a cama... comigo dentro.', scene: { sky: '#FBE7DF', items: ['house'], hero: '🛏️' } },
      { text: 'Terça-feira. Criei um regador automático para as plantas. Agora a cozinha tem um lago.', scene: { sky: '#FBE7DF', ground: '#4FA3C7', items: ['waves', 'flowers'], hero: '🪴' } },
      { text: 'Quarta-feira. Minha mãe disse que errar faz parte de inventar. Anotei isso em letras grandes.', scene: { sky: '#FFF1C7', items: ['sun'], hero: '📝' } },
      { text: 'Quinta-feira. Descobri que toda invenção começa com uma pergunta: "E se...?"', scene: { sky: '#EDE8F8', items: ['stars'], hero: '💡' } },
      { text: 'Sexta-feira. Meu despertador que toca música e acende a luz funcionou de primeira! Próximo projeto: um robô que lê histórias.', scene: { sky: '#FFD36E', items: ['sun', 'stars'], hero: '🤖' } },
    ],
    quiz: [{ question: 'Com que pergunta começa toda invenção?', options: ['"Por quê?"', '"E se...?"', '"Quando?"'], answer: 1 }],
  },
];

export function getBook(id: string | undefined): Book | undefined {
  return BOOKS.find((b) => b.id === id);
}

/** Faixas de idade do seletor "Escolha um livro popular para…". */
export const AGE_OPTIONS: { value: number; label: string }[] = [
  { value: 2, label: 'crianças de até 2 anos' },
  ...Array.from({ length: 9 }, (_, i) => ({ value: i + 3, label: `crianças de ${i + 3} anos` })),
  { value: 12, label: 'crianças de 12 anos ou mais' },
];

export function ageLabel(age: number): string {
  return AGE_OPTIONS.find((o) => o.value === age)?.label ?? `${age} anos`;
}

export function booksForAge(age: number): Book[] {
  return BOOKS.filter((b) => age >= b.ageMin && age <= b.ageMax).sort((a, b) => b.popularity - a.popularity);
}

/** Os 3 livros mais populares para a idade (completa com os mais próximos se faltar). */
export function popularForAge(age: number, count = 3): Book[] {
  const exact = booksForAge(age);
  if (exact.length >= count) return exact.slice(0, count);
  const rest = BOOKS.filter((b) => !exact.includes(b)).sort(
    (a, b) => Math.abs((a.ageMin + a.ageMax) / 2 - age) - Math.abs((b.ageMin + b.ageMax) / 2 - age),
  );
  return [...exact, ...rest].slice(0, count);
}

export function seriesBooks(series: string): Book[] {
  return BOOKS.filter((b) => b.series === series);
}

export function searchBooks(query: string): Book[] {
  const q = normalize(query.trim());
  if (!q) return BOOKS;
  return BOOKS.filter((b) =>
    [b.title, b.author, b.illustrator, b.series ?? '', ...b.tags].some((f) => normalize(f).includes(q)),
  );
}

export function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
