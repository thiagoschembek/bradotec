import { defineCollection } from 'astro:content'
import { file } from 'astro/loaders'
import { z } from 'zod'

/**
 * CONTENT COLLECTIONS — o conteudo editorial do site.
 *
 * Por que isto existe: no site anterior as 11 perguntas do FAQ estavam
 * escritas em 33 lugares do HTML e repetidas de novo dentro do JSON-LD de
 * cada pagina — cerca de 66 copias dos mesmos 11 textos. Corrigir uma
 * resposta exigia acertar todas; esquecer uma fazia o Google ler uma coisa
 * e o visitante ler outra.
 *
 * Agora a resposta e escrita uma vez. A pagina e o JSON-LD saem da MESMA
 * fonte: por construcao, nao podem divergir.
 *
 * O schema Zod confere o conteudo durante o build. Se alguem escrever uma
 * pergunta sem resposta, ou apontar para uma pagina que nao existe, o build
 * falha — em vez de o site ir ao ar com um bloco vazio.
 */

/** Paginas que podem exibir um FAQ. */
export const paginasComFaq = [
  'home',
  'solucoes',
  'regularizacoes',
  'seguranca-contra-incendio',
  'documentacao-veicular',
  'empresas',
  'avcb',
] as const

export type PaginaComFaq = (typeof paginasComFaq)[number]

const faq = defineCollection({
  loader: file('src/content/faq.json'),
  schema: z.object({
    pergunta: z.string().min(10),
    /**
     * Limite de 60 a 900 caracteres: abaixo disso a resposta nao informa,
     * acima disso o Google costuma cortar no resultado destacado.
     */
    resposta: z.string().min(60).max(900),
    /** Em quais paginas esta pergunta aparece. */
    paginas: z.array(z.enum(paginasComFaq)).min(1),
  }),
})

/** As tres divisoes comerciais. Aparecem em /solucoes e no rodape das paginas. */
export const idsDivisao = ['fire', 'documentos', 'auto'] as const
export type IdDivisao = (typeof idsDivisao)[number]

/**
 * Cores por divisao. Sao chaves, nao classes: o componente traduz para uma
 * classe literal, porque o Tailwind nao enxerga nome de classe montado em
 * tempo de execucao.
 */
const coresDivisao = ['fire', 'doc', 'auto'] as const

const divisoes = defineCollection({
  loader: file('src/content/divisoes.json'),
  schema: z.object({
    /** Nome comercial, ex.: "Bradotec Fire". */
    marca: z.string().min(3),
    titulo: z.string().min(10),
    resumo: z.string().min(30).max(240),
    href: z.string().startsWith('/'),
    cor: z.enum(coresDivisao),
    /** Chave de mensagem em src/config/whatsapp.ts. */
    origemWhatsapp: z.string().min(3),
    ordem: z.number().int().positive(),
  }),
})

/**
 * Servicos de cada divisao, escritos UMA vez. A pagina da divisao mostra
 * titulo e descricao; /solucoes mostra so os titulos. Sem copia entre paginas.
 */
const servicos = defineCollection({
  loader: file('src/content/servicos.json'),
  schema: z.object({
    divisao: z.enum(idsDivisao),
    titulo: z.string().min(5),
    descricao: z.string().min(40).max(400),
    ordem: z.number().int().positive(),
  }),
})

/** Publicos atendidos, exibidos em /empresas. */
const segmentos = defineCollection({
  loader: file('src/content/segmentos.json'),
  schema: z.object({
    titulo: z.string().min(5),
    descricao: z.string().min(40).max(400),
    ordem: z.number().int().positive(),
  }),
})

/**
 * Os oito caminhos da home: "o que voce precisa resolver?".
 *
 * Aparecem so na home, mas moram aqui pelo mesmo motivo do resto — o schema
 * quebra o build se alguem apontar um caminho para uma rota que nao existe,
 * e um link morto na secao de maior conversao passaria despercebido.
 */
const caminhos = defineCollection({
  loader: file('src/content/caminhos.json'),
  schema: z.object({
    titulo: z.string().min(10),
    descricao: z.string().min(30).max(200),
    href: z.string().startsWith('/'),
    ordem: z.number().int().positive(),
  }),
})

/**
 * Conteudo da pagina de AVCB, em tres grupos dentro do mesmo arquivo:
 *
 *   risco   -> o que esta em jogo quando o documento vence
 *   item    -> o que costuma ser exigido para obter o AVCB
 *   cotacao -> o que perguntar a um fornecedor antes de contratar
 *
 * Fica em colecao, e nao escrito na pagina, pelo mesmo motivo do resto: e
 * conteudo editorial que o cliente vai querer revisar, e o schema impede
 * que um item entre sem descricao ou com um grupo que a pagina nao exibe.
 */
const gruposAvcb = ['risco', 'item', 'cotacao'] as const

const avcb = defineCollection({
  loader: file('src/content/avcb.json'),
  schema: z.object({
    grupo: z.enum(gruposAvcb),
    titulo: z.string().min(5),
    descricao: z.string().min(30).max(500),
    ordem: z.number().int().positive(),
  }),
})

export const collections = { faq, divisoes, servicos, segmentos, caminhos, avcb }
