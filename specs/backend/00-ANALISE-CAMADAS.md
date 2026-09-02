# Bradotec — Análise em camadas (pré-SPEC)

Status: **análise**, não é SPEC aprovada. Nenhum código de feature foi escrito.
Data: 2026-09-01. Base: conteúdo de `bradotec-site.zip` (27 arquivos, 9 páginas HTML).

---

## 1. O que existe hoje, separado por camada

O site funciona, mas foi escrito como **uma camada só**: conteúdo, dados,
regra de negócio e apresentação moram todos dentro dos mesmos arquivos HTML/JS.
Abaixo, a separação que *deveria* existir e onde cada coisa está hoje.

| # | Camada | Onde está hoje | Isolada? |
|---|---|---|---|
| 0 | Infraestrutura / entrega | `_headers`, `_redirects`, `robots.txt`, `sitemap.xml` | Sim |
| 1 | Apresentação (estilo) | `assets/css/style.css` (23 KB, tokens em `:root`) | Sim |
| 2 | Estrutura / marcação | 9 arquivos `.html`, 1.981 linhas | **Não** |
| 3 | Conteúdo editorial | dentro do HTML | **Não** |
| 4 | Dados da empresa | `assets/js/config.js` (`window.BRADOTEC`) | Parcial |
| 5 | Comportamento (UI) | `assets/js/main.js` (IIFE única, 15 KB) | **Não** |
| 6 | Domínio / regras de negócio | escondido dentro do `main.js` | **Não existe** |
| 7 | Persistência | — | **Não existe** |

### Evidências medidas (não é opinião, é contagem)

- **Header e footer são byte-idênticos nas 9 páginas.** Mudar um link do menu
  hoje = editar 9 arquivos. Não há template nem include.
- **FAQ: 11 perguntas únicas escritas em 33 lugares** no HTML visível — e cada
  uma repetida *de novo* dentro do `<script type="application/ld+json">` da
  mesma página. Na prática, ~66 cópias de 11 textos. Corrigir uma resposta
  exige acertar todas, ou o Google passa a ler uma coisa e o visitante outra.
- **`[DOMINIO-DO-CLIENTE]` aparece 61 vezes** (50 no HTML + sitemap + robots).
  É busca-e-substitui manual em 11 arquivos no dia da publicação.
- **9 outros placeholders** (`[TELEFONE]`, `[CNPJ]`, `[ENDEREÇO]`…) espalhados
  em 13–14 lugares cada — esses pelo menos já são resolvidos pelo `config.js`.
- **`main.js` é uma IIFE com 10 responsabilidades** no mesmo escopo: links de
  WhatsApp, preenchimento de contato, menu mobile, quiz (perguntas + regras +
  render + mensagem), formulário, eventos de conversão, prova social e gtag.

### A regra de negócio que está escondida

Dentro do `main.js` existe domínio de verdade, misturado com manipulação de DOM:

- `decidir()` — roteamento comercial do quiz: veículo → Auto; problema =
  incêndio → Fire; resto → Documentos. **Isso é regra de negócio, não UI.**
- Taxonomia de qualificação do lead: `perfil` (5 valores), `assunto` (8) e
  `urgencia` (3), definidos em três lugares diferentes — `PERGUNTAS` no JS,
  os `<select>` do `contato.html` e as chaves de `mensagens` no `config.js`.
  As três listas não conversam entre si e podem divergir sem ninguém notar.

---

## 2. Onde o backend entra — três fronteiras

O site tem exatamente **três pontos** onde o estático não dá mais conta.
Estão em ordem de esforço crescente e independentes entre si.

### Fronteira A — Captura de lead (hoje o lead evapora)

**Como é hoje:** o formulário e o quiz não enviam nada. Eles montam um texto e
chamam `window.open("https://wa.me/...?text=...")`. Se o atendente não
responder, ou o visitante desistir na tela do WhatsApp, **não sobrou registro
nenhum**. Não há como saber quantos leads o site gerou.

**O que o backend resolve:** `POST /api/leads` grava antes de abrir o WhatsApp.
Passa a existir histórico, origem do clique, taxa de conversão real e
notificação por e-mail para quem não vive no WhatsApp.

Entidade mínima: `lead { id, criado_em, nome, telefone, email?, empresa?,
cidade, perfil, assunto, urgencia, mensagem?, origem, respostas_quiz?,
user_agent, status }`.

Cuidados: LGPD (o site hoje declara "nenhum dado é armazenado neste site" —
essa frase precisa mudar junto com o código), proteção antibot e rate limit.

### Fronteira B — Conteúdo dirigido por dados

**Como é hoje:** conteúdo escrito à mão dentro de cada HTML, com a duplicação
medida na seção 1.

**O que o backend (ou build) resolve:** uma fonte única — `content/faq.json`,
`content/divisoes.json`, `content/paginas.json` — que gera ao mesmo tempo o
HTML visível, o JSON-LD do Google e os links do rodapé. Escreve-se a resposta
uma vez, ela aparece nos 3 lugares certos.

Isso não exige servidor: pode ser um passo de build. Mas exige tirar o
conteúdo de dentro do HTML, e é aí que vira camada.

### Fronteira C — Painel de vencimentos (o produto de verdade)

**O detalhe mais importante desta análise:** o "Painel de vencimentos" que
aparece no hero do `index.html` está marcado como *"exemplo ilustrativo"* —
é um mockup em HTML estático.

Mas ele é **exatamente o serviço que a empresa vende**: gestão documental
recorrente, cada documento com responsável, situação e prazo. O site já promete
isso em texto ("controle de vencimentos", "retorno a cada etapa", "renovação
iniciada com antecedência") sem ter o sistema que entrega.

Esse mockup é o esqueleto do backend real:

```
Cliente ─┬─ Unidade/Edificação ─┬─ Documento ─┬─ Vencimento (data, status)
         │                      │             └─ Anexo (PDF/imagem)
         │                      └─ Processo ──── Exigência (aberta/atendida)
         └─ Usuário (síndico, gestor) ── acesso só à própria carteira
```

Status do documento (`regular`, `vence_em_30d`, `vencido`, `exigencia_aberta`)
já está desenhado na UI — inclusive as cores (`pill--ok`, `pill--warn`,
`pill--due`). O front do painel **já existe visualmente**; falta o dado.

É o que sustenta contrato recorrente em vez de serviço avulso.

---

## 3. Ordem recomendada

1. **A — Captura de lead.** Menor esforço, maior ganho imediato. Sem isso, o
   site não tem como provar que funciona.
2. **B — Conteúdo em dados.** Elimina a duplicação antes que ela cresça e
   evita que o site e o Google contem histórias diferentes.
3. **C — Painel.** É produto, não site. Merece SPEC própria e provavelmente
   app separado.

---

## 4. Decisões que precisam da sua aprovação

| # | Decisão | Recomendação |
|---|---|---|
| D1 | Reescrever o site em React/Vite (stack padrão da constituição)? | **Não.** O site estático está bem feito, é rápido e o SEO local depende disso. Manter HTML/CSS/JS puro no site público e usar React **só no painel** (Fronteira C), como aplicação separada. |
| D2 | Onde roda o backend? | Cloudflare Workers + D1, para ficar junto do Pages que já é o destino do site. |
| D3 | O formulário continua abrindo o WhatsApp? | Sim — grava **e** abre. Não tirar o caminho que já converte. |
| D4 | Quem é a fonte da verdade dos dados da empresa? | `config.js` continua no site; o backend consome os mesmos valores. Uma fonte só. |

**Divergência registrada:** a constituição em `CLAUDE.md` define React 18 +
TypeScript strict + Tailwind + Vite como stack padrão. O site atual não segue
isso e, no meu entender, **não deve seguir**. D1 é sua para decidir.

---

## 5. Próximo passo

Nada aqui é implementável ainda. O passo seguinte do SDD é escrever
`specs/backend/SPEC.md` para **uma** fronteira (recomendo a A), com critérios
de aceite em Given/When/Then, casos de borda e fora de escopo — e você aprovar
antes de qualquer PLAN ou código.
