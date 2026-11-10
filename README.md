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

## Onboarding

- [x] 1. Abertura
- [ ] 2–4. Carrossel de boas-vindas
- [ ] 5. Entrar
- [ ] 6. Criar senha
- [ ] 7. Área dos responsáveis
- [ ] 8. Proteção de dados
