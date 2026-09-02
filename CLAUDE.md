# Projeto BRADOTEC — instruções para agentes

Site institucional em Astro 7, saída estática, hospedado na Cloudflare Pages.
Leia o `README.md` para visão geral, comandos e o que falta.

## Regras deste projeto

- **Nunca inventar dado institucional.** Telefone, endereço, CNPJ, número de
  clientes, depoimentos e avaliações só entram se vierem do cliente. Enquanto
  não vierem, usar placeholder no formato `[ASSIM]` — o site já os detecta e
  exibe marcados como pendentes.
- **Nunca prometer prazo, aprovação ou resultado** que dependa de órgão público
  ou de profissional habilitado. Isso vale para copy, FAQ e CTA.
- **Cor nova vai para `src/styles/global.css`**, no bloco `@theme`. Não escrever
  cor no meio de componente.
- **Dado da empresa vai para `src/config/site.ts`.** Nada de texto de contato
  espalhado por página.
- **Conteúdo repetido em mais de uma página vira Content Collection.** O FAQ já
  é assim; seguir o mesmo padrão para serviços e divisões.
- **React só onde há interação real.** Componente estático se faz em `.astro`.
  Cada ilha React custa download de biblioteca para o visitante.
- **Sem `any` e sem `@ts-ignore`.** Se precisar, é sinal de que o tipo está
  errado em outro lugar.
- **Não instalar biblioteca nova sem perguntar**, explicando o que resolve e
  qual a alternativa sem ela.

## Antes de dizer que terminou

```sh
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

O `lefthook` já roda lint e typecheck no `git commit`, mas testes e build não.

## Armadilhas conhecidas

- **`astro preview` sobe em segundo plano** e devolve o terminal. Por isso o
  Playwright não usa `webServer` — ver `e2e/servidor.ts`. Parar com
  `pnpm exec astro preview stop`.
- **O Biome só lê o frontmatter dos arquivos `.astro`**, não o template. As
  regras `noUnusedImports` e `noUnusedVariables` estão desligadas para `.astro`
  em `biome.json`, porque a correção automática removeria imports usados no
  HTML e quebraria a página. Quem confere isso é o `pnpm typecheck`.
- **TypeScript está preso na 5.9 de propósito**: o `astro check` ainda rejeita
  a 7. Não atualizar sem testar.
- **pnpm 11 bloqueia scripts de instalação.** Pacote que precise compilar
  binário vai em `allowBuilds`, no `pnpm-workspace.yaml`.
- **O projeto está dentro do OneDrive.** Se o build ficar lento ou travar
  arquivo, o motivo costuma ser a sincronização de `node_modules`.

## Dev server

```sh
astro dev --background
```

Gerenciar com `astro dev stop`, `astro dev status` e `astro dev logs`.

## Documentação

- [Rotas e páginas](https://docs.astro.build/en/guides/routing/)
- [Componentes Astro](https://docs.astro.build/en/basics/astro-components/)
- [Ilhas de framework](https://docs.astro.build/en/guides/framework-components/)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Estilos e Tailwind](https://docs.astro.build/en/guides/styling/)
