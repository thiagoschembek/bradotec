# BRADOTEC — SEO local, WhatsApp e estrutura técnica

## 1. SEO local para João Pessoa

Cada página tem um alvo próprio, para não competirem entre si:

| Página | Termo principal | Termos de apoio |
|---|---|---|
| Home | despachante em João Pessoa | despachante documentalista, soluções documentais PB |
| Segurança contra incêndio | segurança contra incêndio João Pessoa | regularização contra incêndio, AVCB João Pessoa |
| Regularizações | regularização de empresa João Pessoa | licenciamento, licenças empresariais, regularização de imóveis |
| Documentação veicular | documentação veicular João Pessoa | transferência, emplacamento, gestão de frotas |
| Empresas | gestão documental João Pessoa | regularização de condomínio, controle de vencimentos |
| Sobre / Contato | despachante Paraíba | — |

### O que já está implementado

- `title` e `meta description` únicos por página, com a cidade no texto e sem
  empilhamento de palavra-chave.
- Um `<h1>` por página, hierarquia de `h2`/`h3` coerente.
- URLs amigáveis (`/seguranca-contra-incendio` funciona sem `.html`).
- `canonical`, `og:*`, `twitter:card` e imagem de compartilhamento.
- Meta `geo.region` (BR-PB) e `geo.placename` (João Pessoa).
- **Schema.org**: `ProfessionalService` com endereço, área atendida e catálogo de
  serviços; `FAQPage` nas páginas com FAQ; `BreadcrumbList` nas páginas internas.
- FAQ real, com respostas que podem virar resultado destacado no Google.
- `sitemap.xml` e `robots.txt`.
- Página 404 com `noindex`.

### O que depende do cliente

1. **Google Meu Negócio** é o que mais move ponteiro em busca local. Sem o perfil
   preenchido e verificado, o site sozinho rende pouco.
2. Trocar `[DOMINIO-DO-CLIENTE]` pelo domínio real no `sitemap.xml`, no `robots.txt`
   e nas tags `canonical`.
3. Preencher endereço, telefone e horário no `config.js` — esses dados alimentam o
   schema e precisam ser **idênticos** aos do Google Meu Negócio.

## 2. Estratégia de WhatsApp

O WhatsApp aparece em: menu, hero, fim de cada bloco de serviço, seção de
diagnóstico, resultado do quiz, formulário, rodapé e botão flutuante.

Cada botão carrega uma **mensagem diferente**, conforme a origem do clique. Isso
economiza a primeira pergunta do atendimento e já qualifica o lead. As mensagens
ficam todas em `config.js` e podem ser reescritas sem mexer no HTML:

| Origem | Mensagem enviada |
|---|---|
| Orçamento | pedido de orçamento para documentação/regularização da empresa |
| Incêndio | dúvida sobre regularização contra incêndio |
| Condomínio | pendências de condomínio |
| Exigência | exigência recebida |
| Veicular / frota | pendência veicular ou gestão de frota |
| Diagnóstico | pedido do Diagnóstico de Regularização |
| Gestão recorrente | interesse na gestão documental contínua |
| Quiz | as 4 respostas do visitante, em lista |
| Formulário | nome, telefone, empresa, perfil, assunto, cidade, urgência e situação |

## 3. Estrutura do formulário

Campos obrigatórios: nome, telefone, perfil, assunto e urgência.
Opcionais: empresa/condomínio, cidade e descrição da situação.

A escolha dos campos é comercial, não burocrática: **perfil + assunto + urgência**
permite priorizar o atendimento antes mesmo de responder. Validação em português,
com mensagem por campo e foco automático no primeiro erro.

## 4. Estrutura técnica

**Stack:** HTML5 semântico, CSS moderno (custom properties, grid, flex) e JavaScript
sem dependências. A escolha é deliberada: para um site institucional de 8 páginas,
React ou Next.js acrescentariam build, deploy e manutenção sem ganho real de
performance ou SEO — e complicariam a entrega e a hospedagem no Cloudflare Pages.

- Zero framework, zero bibliotecas externas, zero requisições de terceiros
  (exceto a fonte, carregada de forma assíncrona e com fallback de sistema).
- CSS único, com nomes de classe curtos e variáveis de tema.
- Imagens com `width`/`height` declarados (evita salto de layout) e `loading="lazy"`
  fora da primeira dobra.
- `_headers` com cache longo para `assets/` e cabeçalhos de segurança
  (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy`).

### Acessibilidade

Link "ir para o conteúdo", foco visível em todos os elementos interativos, botões e
menus com `aria-expanded` / `aria-controls`, ícones decorativos com `aria-hidden`,
FAQ com `<details>` nativo (funciona sem JavaScript), contraste conferido nos textos
sobre fundo escuro e respeito a `prefers-reduced-motion`.

### Medição para campanhas

Eventos disparados no `dataLayer` (e no `gtag`, se houver ID configurado):

- `clique_whatsapp` — com o rótulo da origem do botão
- `quiz_concluido` — com o resumo das respostas
- `form_enviado` — com o assunto escolhido

Basta colar o ID do Google Ads ou do GA4 em `config.js` e marcar esses eventos como
conversão. Sem ID configurado, nenhum script externo é carregado.
