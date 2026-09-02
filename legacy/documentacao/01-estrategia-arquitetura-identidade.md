# BRADOTEC — Estratégia, arquitetura e identidade visual

## 1. Posicionamento adotado

A Bradotec não é apresentada como despachante. É apresentada como **central de
soluções documentais**: uma empresa que assume a coordenação de processos que
normalmente ficam divididos entre contador, síndico, engenheiro, empresa de
manutenção e despachante.

A promessa central do site não é "fazemos seu documento". É **"alguém assume o
processo inteiro e responde por ele"**. Isso é o que sustenta preço maior, contrato
recorrente e público B2B.

Hierarquia estratégica aplicada em todo o site:

1. **Segurança contra incêndio e pânico** (maior criticidade, maior valor)
2. **Regularização de empresas, imóveis e condomínios**
3. **Gestão documental recorrente** (receita previsível)
4. **Documentação veicular** (volume e porta de entrada, nunca protagonista)

## 2. Mapa de páginas

| Página | Papel comercial | Público |
|---|---|---|
| `index.html` | Qualificar e distribuir para as três frentes | Todos |
| `seguranca-contra-incendio.html` | Página mais estratégica, foco em urgência | Condomínios, comércios, instituições |
| `regularizacoes.html` | Licenças, certidões, exigências | Empresas e proprietários |
| `documentacao-veicular.html` | Serviço de entrada + ponte para frota | PF e empresas com frota |
| `empresas.html` | Vender o contrato recorrente | Síndicos, gestores, administradoras |
| `solucoes.html` | Hub de comparação entre as divisões | Indeciso |
| `sobre.html` | Confiança e limites de atuação | Quem pesquisa antes de contratar |
| `contato.html` | Captura estruturada de lead | Quem já decidiu falar |

Estrutura preparada para landing pages de campanha: basta duplicar uma página
interna e registrar a rota em `_redirects`.

## 3. Estratégia de conversão

**Três níveis de compromisso**, para não perder quem ainda não está pronto:

| Nível | Ação | Onde aparece |
|---|---|---|
| Baixo | Quiz de 4 perguntas | Home |
| Médio | Diagnóstico de Regularização | Home, soluções, todas as páginas de serviço |
| Alto | Orçamento pelo WhatsApp / formulário | Cabeçalho, hero, fim de cada seção, rodapé, botão flutuante |

Princípios aplicados:

- Toda seção termina com uma saída. Nunca há um bloco "sem porta".
- A seção "O que você precisa resolver?" abre a home pela **dor do visitante**,
  não pelo catálogo de serviços — quem não sabe o nome do serviço ainda se
  reconhece ali.
- O quiz não entrega diagnóstico técnico. Ele faz **triagem comercial** e monta a
  mensagem de WhatsApp com as respostas, para o atendimento já começar informado.
- O formulário é de qualificação (perfil, assunto, urgência), não só "nome e
  e-mail". Um lead que chega assim já vale mais para o comercial.

## 4. Identidade visual

A logo enviada (escudo, capacete, machado e mangueira) é forte e claramente ligada
ao segmento de incêndio. Ela foi tratada com fundo transparente e usada em fundo
escuro, onde funciona melhor. O restante do sistema visual foi construído para
**equilibrar** essa logo: se tudo no site fosse vermelho e ilustrativo, a empresa
pareceria uma prestadora de manutenção, não uma gestora de processos.

### Paleta

| Uso | Hex |
|---|---|
| Base institucional (fundos escuros, títulos) | `#0B1B2E` / `#08131F` |
| Azul-aço secundário | `#13293F` |
| Texto corrido | `#0F2033` / `#42576D` |
| Fundo claro de seção | `#F6F8FB` |
| Linhas e bordas | `#E3E9F0` |
| **Vermelho da marca** (extraído da logo) | `#D22B26` |
| Divisão Documentos | `#1D4E89` |
| Divisão Auto | `#0E7C86` |

O vermelho é **acento**, não cor de fundo: aparece em CTA principal, na divisão Fire
e em sinalizações de urgência. Isso é o que separa visual premium de visual de
oficina.

### Diferenciação das divisões

As três divisões dividem o mesmo layout, tipografia e espaçamento. Só mudam a cor
da borda superior e da etiqueta. Resultado: leem-se como **áreas da mesma empresa**,
não como três empresas.

### Tipografia

- Família única: **Plus Jakarta Sans** (400, 500, 600, 700, 800), com fallback de
  sistema caso a fonte não carregue.
- Títulos em 800 com entrelinha fechada e leve espaçamento negativo (aspecto
  institucional moderno).
- Corpo em 17px, linha de até ~68 caracteres para leitura confortável.

### Elemento-assinatura

O **"Painel de vencimentos"** do hero. Em vez de foto de banco de imagens, o
primeiro elemento visual mostra exatamente o que a empresa vende: cada documento com
situação e prazo. Ele reaparece na página de empresas, ligando o hero à oferta
recorrente.

## 5. Componentes construídos

Cabeçalho fixo com menu mobile · hero com painel · faixa de confiança · cards de
problema · cards de divisão · bloco de destaque escuro · cards de segmento · bloco
de oferta com passos numerados · quiz interativo · linha do tempo · cards de
diferencial · área de depoimentos condicional · FAQ em acordeão · formulário
qualificado · faixa de CTA · rodapé · botão flutuante de WhatsApp · cabeçalho de
página interna com trilha de navegação.

## 6. Tom de voz

Português brasileiro, direto, sem juridiquês e sem exagero publicitário. Frases
curtas. Verbos ativos. Nenhuma promessa de prazo, aprovação ou resultado que dependa
de órgão público ou de terceiro — isso está dito explicitamente no FAQ, no rodapé e
nas páginas de serviço, e é justamente o que transmite autoridade sem risco.
