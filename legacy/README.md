# Site BRADOTEC — versão para aprovação

Site estático (HTML, CSS e JavaScript puros). Não tem back-end, banco de dados nem
processo de build: é só subir a pasta e o site está no ar.

---

## 1. Como publicar no Cloudflare Pages

1. Entre no painel da Cloudflare → **Workers & Pages** → **Create** → **Pages** →
   **Upload assets**.
2. Arraste a pasta inteira (ou o ZIP descompactado). O arquivo `index.html` precisa
   ficar na raiz.
3. Clique em **Deploy**. Em segundos o site fica disponível em
   `nome-do-projeto.pages.dev`.
4. Para usar o domínio próprio: aba **Custom domains** → **Set up a domain**.

Os arquivos `_headers` e `_redirects` já estão configurados: cache dos arquivos
estáticos, cabeçalhos de segurança e URLs amigáveis (`/contato` funciona sem `.html`).

> Funciona igual em Netlify, Vercel, GitHub Pages ou hospedagem comum via FTP.

---

## 2. O único arquivo que precisa ser editado

**`assets/js/config.js`**

É lá que ficam todos os dados da empresa. Troque o que está entre `[COLCHETES]`
pelos dados reais e o site inteiro se atualiza sozinho — rodapé, página de contato,
botões e mensagens do WhatsApp.

O mais importante é o número do WhatsApp:

```js
whatsapp: "5583999998888",   // 55 + DDD + número, só dígitos
```

Enquanto estiver `5583000000000`, os botões abrem uma conversa com um número
inexistente. **Trocar isso é o primeiro passo antes de divulgar o site.**

### Prova social

Números de clientes, nota do Google e depoimentos **não foram inventados**.
Enquanto os campos tiverem `[Nº]`, o site mostra uma faixa de compromissos no lugar
dos números, e a seção de depoimentos fica invisível. Assim que dados reais forem
preenchidos em `config.js`, tudo aparece automaticamente.

### Google Ads / Analytics

Basta colar o ID em `googleAdsId` ou `ga4Id` no `config.js`. Sem ID, nenhum script
externo é carregado. O site já dispara os eventos `clique_whatsapp`,
`quiz_concluido` e `form_enviado`, que podem virar conversões nas campanhas.

---

## 3. O que ainda falta para o site ir ao ar

| Item | Onde entra |
|---|---|
| Número de WhatsApp | `config.js` |
| Telefone, e-mail, endereço, CEP, CNPJ, horário | `config.js` |
| Link do Instagram | `config.js` |
| Depoimentos e avaliações reais | `config.js` (campo `depoimentos`) |
| Mapa do Google na página de contato | `contato.html` (marcador indicado no código) |
| Histórico/fundação da empresa | `sobre.html` |
| Domínio definitivo | trocar `[DOMINIO-DO-CLIENTE]` em `sitemap.xml`, `robots.txt` e nas tags `canonical` das páginas |

---

## 4. Formulário sem back-end

Nesta versão de avaliação, o formulário da página de contato **não envia e-mail**:
ele valida os campos, monta uma mensagem organizada e abre o WhatsApp já preenchido.
Nenhum dado fica armazenado no site.

Se o cliente quiser recebimento por e-mail, dá para ligar um serviço de formulário
(Cloudflare Worker, Formspree ou similar) sem mexer no layout.

---

## 5. Estrutura de arquivos

```
index.html                       Home
solucoes.html                    Visão geral das três divisões
seguranca-contra-incendio.html   Bradotec Fire
regularizacoes.html              Bradotec Documentos
documentacao-veicular.html       Bradotec Auto
empresas.html                    Público B2B e gestão recorrente
sobre.html                       Institucional
contato.html                     Contato + formulário
404.html                         Página de erro
sitemap.xml / robots.txt         SEO
_headers / _redirects            Configuração Cloudflare
assets/css/style.css             Todo o estilo
assets/js/config.js              DADOS DA EMPRESA (editar aqui)
assets/js/main.js                Menu, WhatsApp, quiz, formulário
assets/img/                      Logo, favicons e imagem de compartilhamento
documentacao/                    Estratégia, identidade visual, SEO e auditoria
```

Para criar landing pages de campanha depois, é só duplicar uma página interna,
trocar o conteúdo e adicionar a rota em `_redirects`.
