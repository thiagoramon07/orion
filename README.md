# Folheia

App de leitura infantil para o Brasil — "livros que abrem mundos".

**Web app** (roda no navegador do celular, tablet e computador; pode ser instalado na tela inicial).
Stack: Expo (SDK 58, TypeScript) com React Native Web · Expo Router · Reanimated · react-native-svg.

## Rodar no computador

```bash
npm install
npm start            # abre em http://localhost:8081
```

Para ver no celular durante o desenvolvimento, abra no navegador do celular o endereço
que aparece no terminal (mesma rede Wi-Fi).

## Gerar e publicar

```bash
npm run build        # gera o site estático na pasta dist/
npm run preview      # testa o build em http://localhost:4173
```

O app é um site de página única (SPA): o servidor precisa devolver `index.html` para qualquer
endereço (ex.: `/ler/caca-lixeiras`). Já está configurado para:

- **Vercel**: `vercel.json` (importe o repositório; build `npm run build`, saída `dist`).
- **Netlify**: `netlify.toml` e `public/_redirects`.

## Web app instalável (PWA)

- `public/index.html`: HTML base (pt-BR, ícones, cor do tema, ajustes para iPhone).
- `public/manifest.webmanifest` + `public/icons/`: nome, ícones da Cacá, abre em tela cheia.
- No celular: **Compartilhar → Adicionar à Tela de Início** (iPhone) ou **⋮ → Instalar app** (Android/Chrome).

## Teclado (computador)

- Leitor: **← →** viram a página, **espaço** lê/pausa, **Esc** fecha.
- Boas-vindas: **← →** trocam o slide. Área dos responsáveis: digite o ano pelo teclado.

## Estrutura

```
src/
  app/            # rotas (Expo Router) — cada arquivo é uma tela
  theme/          # design tokens (cores, fontes, raios, alturas)
  components/     # Button, Logo, Sparkle, Bookshelf, BookCover, caca/ (mascote)
  hooks/          # useReduceMotion, useContentWidth, useWebKeys, useNarration
  services/       # auth.ts (mocks com TODO)
  utils/          # voz pt-BR, avisos (alert/confirm), navegação
public/           # index.html, manifest e ícones do web app
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
