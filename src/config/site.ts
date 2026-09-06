import { z } from 'zod'

/**
 * CONFIGURACAO DO CLIENTE — unico arquivo a editar para trocar de cliente.
 *
 * Tudo entre [COLCHETES] ainda e placeholder. O site nao inventa dado:
 * enquanto o valor estiver assim, ele aparece marcado como pendente em vez
 * de exibir informacao falsa.
 *
 * O schema Zod abaixo confere os dados durante o build. Se voce digitar um
 * WhatsApp com letra no meio, o build falha na hora — em vez de o site ir ao
 * ar com um botao quebrado.
 */

/** Marca um valor ainda nao preenchido pelo cliente. */
export const ehPlaceholder = (valor: string): boolean =>
  valor.trim().startsWith('[') && valor.trim().endsWith(']')

/** Aceita o dado real OU um placeholder declarado — nunca lixo silencioso. */
const textoOuPlaceholder = (mensagemSeInvalido: string, regexReal: RegExp) =>
  z.string().refine((v) => ehPlaceholder(v) || regexReal.test(v), {
    message: mensagemSeInvalido,
  })

const siteSchema = z.object({
  /** Nome curto, usado em titulos e no schema.org. */
  nome: z.string().min(1),
  /** Descritivo que acompanha a marca no cabecalho. */
  descritivo: z.string().min(1),
  /** Frase de uma linha usada como meta description padrao. */
  descricao: z.string().min(50).max(300),

  /** So digitos: codigo do pais + DDD + numero. Ex.: 5583999998888 */
  whatsapp: textoOuPlaceholder(
    'WhatsApp deve conter apenas digitos: pais + DDD + numero (ex.: 5583999998888)',
    /^\d{12,13}$/
  ),
  telefone: z.string().min(1),
  email: textoOuPlaceholder('E-mail invalido', /^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  endereco: z.string().min(1),
  bairro: z.string().min(1),
  cidade: z.string().min(1),
  estado: z.string().length(2),
  cep: z.string().min(1),
  cnpj: z.string().min(1),
  horario: z.string().min(1),
  instagram: z.string().min(1),

  /** Area geografica atendida — alimenta o SEO local. */
  regiaoAtendida: z.string().min(1),

  /**
   * Prova social. NUNCA preencher com numero estimado.
   * Enquanto for placeholder, a faixa de numeros nem aparece no site.
   */
  provaSocial: z.object({
    clientes: z.string(),
    processos: z.string(),
    condominios: z.string(),
    notaGoogle: z.string(),
  }),

  /** Depoimentos reais. Lista vazia = secao nao renderiza. */
  depoimentos: z
    .array(z.object({ texto: z.string().min(1), autor: z.string().min(1) }))
    .default([]),

  /** IDs de campanha. Vazio = nenhum script de terceiro e carregado. */
  googleAdsId: z.string().default(''),
  ga4Id: z.string().default(''),
  cloudflareAnalyticsToken: z.string().default(''),
})

export type Site = z.infer<typeof siteSchema>

export const site = siteSchema.parse({
  nome: 'Bradotec',
  descritivo: 'Despachadoria & Soluções Documentais',
  descricao:
    'Despachadoria e soluções documentais em João Pessoa/PB. Regularização de empresas, ' +
    'condomínios e imóveis, licenças, segurança contra incêndio e pânico e documentação ' +
    'veicular, com acompanhamento de processo do início ao fim.',

  whatsapp: '5583981447001',
  telefone: '[TELEFONE]',
  email: 'arcanjoln@gmail.com',
  endereco: '[ENDEREÇO COMPLETO]',
  bairro: '[BAIRRO]',
  cidade: 'João Pessoa',
  estado: 'PB',
  cep: '[CEP]',
  cnpj: '55.626.613/0001-20',
  horario: '[HORÁRIO DE ATENDIMENTO]',
  instagram: '[LINK DO INSTAGRAM]',
  regiaoAtendida: 'João Pessoa e região metropolitana, na Paraíba',

  provaSocial: {
    clientes: '[Nº]',
    processos: '[Nº]',
    condominios: '[Nº]',
    notaGoogle: '[NOTA]',
  },

  depoimentos: [],

  googleAdsId: '',
  ga4Id: '',
  cloudflareAnalyticsToken: '',
} satisfies z.input<typeof siteSchema>)
