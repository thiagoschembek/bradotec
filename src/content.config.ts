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

export const collections = { faq }
