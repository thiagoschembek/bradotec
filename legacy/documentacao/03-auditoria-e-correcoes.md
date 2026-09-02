# BRADOTEC — Auditoria de CRO, UX, branding e SEO local

Auditoria da primeira versão do site, feita antes da entrega. Sem elogios: o
objetivo aqui é listar o que estava errado e o que foi corrigido.

---

## Respostas às 25 perguntas da auditoria

| # | Pergunta | Veredito da v1 |
|---|---|---|
| 1 | Entende-se em 5s o que a Bradotec faz? | Parcialmente. A headline era genérica: servia para qualquer despachante do país. |
| 2 | Está claro que atua em João Pessoa? | Fraco. Só um selo pequeno no hero; a subheadline não citava a cidade. |
| 3 | O posicionamento parece premium? | Sim, no visual. Não, na prova: números vazios derrubavam a percepção. |
| 4 | A empresa parece confiável? | **Não.** `[Nº]` e `[DEPOIMENTO 1]` visíveis passavam a impressão de site inacabado. |
| 5 | Parece empresa moderna ou despachante tradicional? | Moderna. Sem stock photo, sem excesso de cor, com painel de vencimentos como elemento visual. |
| 6 | O visitante sabe o que fazer? | Sim, mas com uma só porta: WhatsApp. |
| 7 | Existem CTAs suficientes? | Sim — talvez até repetitivos demais no mesmo tom. |
| 8 | Os CTAs estão nos lugares certos? | Sim: hero, fim de cada bloco, quiz, rodapé e flutuante. |
| 9 | Existe excesso de informação? | A home é longa, mas cada bloco tem função comercial. Aceitável. |
| 10 | Existe seção desnecessária? | Sim: a de prova social vazia, que atrapalhava mais do que ajudava. |
| 11 | Vende serviço ou solução? | Solução na home; a página de regularizações ainda soava a lista de serviços. |
| 12 | O público empresarial está valorizado? | Sim, com seção e página próprias. |
| 13 | Incêndio tem o destaque correto? | Sim na posição, não na argumentação: faltava dizer o custo de não resolver. |
| 14 | A parte veicular rouba atenção? | Não. Aparece em 3º lugar, com CTA visualmente mais discreto. |
| 15 | Transmite autoridade sem prometer demais? | Sim. Nenhuma promessa de prazo ou aprovação; limites declarados. |
| 16 | O WhatsApp está bem usado? | Sim, com mensagem diferente por origem. |
| 17 | O formulário gera lead qualificado? | Sim: perfil, assunto e urgência. Mas só existia em uma página. |
| 18 | O SEO local está adequado? | Boa base técnica; faltava breadcrumb e a pergunta sobre preço no FAQ. |
| 19 | Está pronto para campanhas do Google? | Parcialmente: havia eventos, faltava o carregamento da tag. |
| 20 | Adequado para celular? | Sim. Menu, quiz e formulário testados em 390px. |
| 21 | Performance está adequada? | Sim: sem framework, sem biblioteca, CSS único. |
| 22 | Problemas de acessibilidade? | Poucos, mas reais (`aria-label` em elemento sem papel semântico). |
| 23 | Problemas de hierarquia visual? | Sim: o menu quebrava em 3 linhas em telas de ~1280px. |
| 24 | A copy convence? | Sim, exceto no bloco de prova social. |
| 25 | Dá para aumentar conversão? | Sim: escalonando o compromisso e abrindo uma segunda via ao WhatsApp. |

---

## ETAPA 1 — Os 15 maiores problemas, por impacto

1. **Prova social com placeholder à mostra.** `[Nº] clientes`, `[NOTA]` e três
   depoimentos falsos visíveis. É o pior erro possível numa página que vende
   confiança — e o primeiro que o cliente dele notaria.
2. **Menu quebrando em três linhas no desktop.** Em 1280px o cabeçalho ocupava
   ~100px e empurrava o hero. Quebra imediata da sensação de site profissional.
3. **João Pessoa pouco presente acima da dobra.** Só um selo. Para busca local e
   para o visitante, a cidade precisa aparecer no texto que ele realmente lê.
4. **Uma única via de contato.** Tudo levava ao WhatsApp. Síndico e gestor de
   empresa muitas vezes preferem formulário ou e-mail — e esses são justamente os
   leads de maior valor.
5. **Falta de argumento de risco na área de incêndio.** O site explicava o que a
   Bradotec faz, mas não o que acontece com quem não faz. Em B2B, é o custo da
   inação que move a decisão.
6. **CTAs todos no mesmo nível de compromisso.** "Solicitar orçamento" em quase
   tudo. Quem ainda está pesquisando não tinha um passo pequeno para dar.
7. **Sem FAQ sobre preço.** É a dúvida nº 1 antes do contato. A ausência gera
   desistência silenciosa e leads desqualificados.
8. **Página `/solucoes` órfã.** Ela existia e era boa para quem está comparando,
   mas só era alcançável pelo rodapé. Ninguém que chega na home a encontrava.
9. **Sem `BreadcrumbList` no schema.** Perde o caminho de navegação no resultado
   do Google, que ajuda o clique em busca local.
10. **Tag do Google Ads não carregava.** Os eventos existiam, mas não havia como
    ligar a conversão sem editar código — atrito para quem vai rodar campanha.
11. **`aria-label` em `<div>` sem papel semântico.** Leitores de tela ignoram; o
    painel do hero ficava sem descrição.
12. **404 indexável.** Sem `noindex`, pode entrar no índice do Google.
13. **Rótulos de menu longos demais.** "Documentação veicular" e "Segurança contra
    incêndio" no menu desktop foram o que causou a quebra do item 2.
14. **Botão flutuante cobrindo o fim do conteúdo no celular.** O último item de
    cada página ficava parcialmente escondido.
15. **Sem explicação do que falta para publicar.** O cliente receberia o site sem
    saber que basta editar um arquivo — risco de o projeto travar na entrega.

---

## ETAPA 2 — Como corrigir cada um

1. Remover números e depoimentos falsos. Colocar no lugar um bloco de
   **compromissos verificáveis** (o que a empresa se obriga a fazer), que é
   verdadeiro hoje. Deixar a faixa de números e a área de depoimentos **ocultas por
   padrão**, aparecendo sozinhas quando dados reais forem preenchidos no `config.js`.
2. Encurtar os rótulos do menu desktop e impedir quebra de linha, mantendo os
   rótulos completos no menu mobile e no rodapé (onde há espaço e valor de SEO).
3. Incluir "Em João Pessoa e região" na primeira linha da subheadline, mantendo o
   selo e o `title` da página.
4. Adicionar, na faixa final da home, uma terceira opção — "Prefiro preencher um
   formulário" — apontando para a página de contato.
5. Criar na página de incêndio um bloco "O que está em jogo", listando consequências
   factuais (alvará travado, exigências acumuladas, contratos e seguros, retrabalho),
   sem alarmismo e sem afirmar penalidade específica.
6. Escalonar o compromisso: quiz (baixo) → diagnóstico (médio) → orçamento (alto),
   com o diagnóstico presente como segunda opção em todas as faixas de CTA.
7. Acrescentar ao FAQ a pergunta "Como funciona o orçamento?", explicando por que
   não há tabela e o que o cliente recebe.
8. Criar saída visível para `/solucoes` logo abaixo dos três cards de divisão na
   home ("Comparar as três divisões"), junto de um atalho para o diagnóstico.
9. Gerar `BreadcrumbList` em JSON-LD em todas as páginas internas.
10. Carregar o `gtag` condicionalmente: se houver ID em `config.js`, carrega; se não,
    não carrega nada.
11. Trocar por `role="group"` com `aria-label` no painel do hero.
12. Aplicar `noindex, follow` na 404.
13. Separar rótulo curto (desktop) de rótulo completo (mobile e rodapé) na estrutura
    de navegação.
14. Reservar espaço na base da página em telas pequenas, para o botão flutuante não
    cobrir conteúdo.
15. Escrever um `README.md` com o passo a passo de publicação, o que editar e a
    tabela do que ainda falta.

---

## ETAPA 3 — Correções implementadas

Todos os 15 pontos foram aplicados no código entregue. Resumo do que mudou:

| Arquivo | Mudança |
|---|---|
| `index.html` | Saída visível para `/solucoes` sob os cards de divisão; nova faixa de confiança; faixa de números oculta; bloco "O que você pode conferir sobre a Bradotec" no lugar dos depoimentos falsos; subheadline com a cidade; terceira opção de contato na faixa final; `role="group"` no painel; nova pergunta no FAQ |
| `seguranca-contra-incendio.html` | Novo bloco "O que está em jogo"; breadcrumb no schema |
| `regularizacoes.html` | Breadcrumb no schema |
| Demais páginas internas | Breadcrumb em JSON-LD; rótulos de menu ajustados |
| `404.html` | `noindex, follow` |
| `assets/css/style.css` | Menu sem quebra de linha; estilo da faixa de confiança; espaço para o botão flutuante no celular |
| `assets/js/main.js` | Prova social condicional; carregamento condicional do `gtag` |
| `assets/js/config.js` | Campo `depoimentos`; campos `googleAdsId` e `ga4Id` |
| `README.md` | Guia de publicação e lista do que falta |

---

## ETAPA 4 — Revisão após as alterações

O que foi verificado depois das correções, e o resultado:

**Corrigido e confirmado**

- Cabeçalho ocupa uma linha só em 1280px, 1440px e 1024px.
- Quiz percorre as 4 perguntas, valida seleção vazia, permite voltar e gera o link
  de WhatsApp com as respostas.
- Formulário bloqueia envio com campo vazio, marca o campo, mostra a mensagem e
  move o foco para o primeiro erro.
- Nenhum erro de JavaScript no console.
- Mobile em 390px: menu, hero, quiz, cards e formulário sem estouro horizontal.
- Nenhum `[PLACEHOLDER]` aparece mais em posição de credibilidade — os que restam
  estão só em campos de contato do rodapé e da página de contato, onde o cliente
  espera ver dados e entende que faltam preencher.

**Problemas novos que surgiram e foram tratados**

- A faixa de confiança que substituiu os números ficava com texto em duas linhas em
  telas médias. Resolvido com quebra em 2 colunas entre 700px e 1040px.
- Com a faixa de números oculta, a home perdia um separador visual entre o hero e a
  primeira seção. A faixa de compromissos assumiu esse papel, mantendo o ritmo.
- O bloco "O que está em jogo" ficou perto do bloco escuro seguinte na página de
  incêndio. Foi posicionado antes da seção clara, alternando fundo escuro e claro.

**O que continua em aberto — e depende do cliente, não do código**

1. **Número de WhatsApp.** Enquanto for `5583000000000`, nenhum botão funciona de
   verdade. É o item que impede o site de gerar um lead sequer.
2. **Prova social real.** É a maior alavanca de conversão que ainda falta. Três
   depoimentos e a nota do Google mudam mais a taxa de contato do que qualquer
   ajuste de layout adicional.
3. **Google Meu Negócio.** Sem perfil verificado, o SEO local rende bem menos.
4. **Endereço e CNPJ.** Além de confiança, alimentam o schema de negócio local.
5. **Fotos reais da equipe ou de atendimento.** O site foi construído para funcionar
   sem elas, mas com fotos verdadeiras (não banco de imagens) a página "A Bradotec"
   ganha bastante.

**Limitação assumida nesta versão**

Não há back-end. O formulário abre o WhatsApp com os dados organizados em vez de
enviar e-mail. Para a fase de aprovação isso é suficiente e evita custo. Se o cliente
fechar, o envio por e-mail entra sem alterar o layout.
