# Folheia

App de leitura infantil para o Brasil — "livros que abrem mundos".

Stack: React Native + Expo (SDK 58, TypeScript) · Expo Router · Reanimated · react-native-svg.

## Rodar

```bash
npm install
npx expo start        # escaneie o QR code com o Expo Go
```

## Estrutura

```
src/
  app/            # rotas (Expo Router) — cada arquivo é uma tela
  theme/          # design tokens (cores, fontes, raios, alturas)
  components/     # Button, Logo, Sparkle, Bookshelf, BookCover, caca/ (mascote)
  hooks/          # useReduceMotion
  services/       # auth.ts (mocks com TODO)
```

## Telas

- [x] Abertura → carrossel de boas-vindas (3 slides)
- [x] Entrar (Apple / Google / Facebook simulados + e-mail)
- [x] Criar senha (1/3) · Área dos responsáveis (2/3) · Proteção de dados (3/3)
- [x] Primeiro livro por idade → nome da criança
- [x] Leitor em formato de livro: narração pt-BR, destaque de palavras, toque na palavra para ouvir,
      modo noite, velocidade, 2 páginas lado a lado em tela larga
- [x] Detalhe do livro, quiz, medalhas, sequência de dias
- [x] Abas: Explorar, Buscar, Perfil, Meu amigo, Correio · assinatura simulada

## Pendências marcadas com TODO

- `src/constants.ts`: número real de títulos do catálogo (hoje "500", provisório)
- `src/services/auth.ts`: login social e backend
- `src/app/assinatura.tsx`: compra real
- `src/app/politica.tsx`: texto jurídico final
