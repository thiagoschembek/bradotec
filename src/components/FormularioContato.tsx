import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ehPlaceholder, site } from '@/config/site'

/**
 * Formulario de contato — unica ilha React do site.
 *
 * Justificativa para gastar React aqui: validacao campo a campo, mensagens de
 * erro associadas por aria-describedby e montagem da mensagem. Fazer isso em
 * JavaScript solto daria mais codigo e menos acessibilidade.
 *
 * O envio NAO passa por servidor: monta a mensagem e abre o WhatsApp, igual ao
 * site anterior. Nenhum dado e armazenado. Quando o back-end descrito em
 * specs/backend/ existir, basta trocar a funcao `aoEnviar`.
 */

const PERFIS = [
  'Empresa ou comércio',
  'Condomínio ou administradora',
  'Igreja, escola ou instituição',
  'Proprietário de imóvel',
  'Proprietário de veículo ou frota',
] as const

const ASSUNTOS = [
  'Segurança contra incêndio e pânico',
  'Licenças, alvarás e certidões',
  'Regularização de imóvel ou edificação',
  'Exigência ou notificação recebida',
  'Gestão documental recorrente',
  'Documentação veicular ou frota',
  'Diagnóstico de Regularização',
  'Ainda não sei',
] as const

const URGENCIAS = [
  'Imediata — há prazo correndo',
  'Nas próximas semanas',
  'Estou planejando',
] as const

const esquema = z.object({
  nome: z.string().trim().min(2, 'Informe o seu nome.'),
  telefone: z
    .string()
    .trim()
    .min(8, 'Informe um telefone para contato.')
    .regex(/^[\d\s()+-]+$/, 'Use apenas números, espaços, parênteses, + ou -.'),
  cidade: z.string().trim().optional(),
  organizacao: z.string().trim().optional(),
  perfil: z.enum(PERFIS, { message: 'Selecione uma opção.' }),
  assunto: z.enum(ASSUNTOS, { message: 'Selecione um assunto.' }),
  urgencia: z.enum(URGENCIAS, { message: 'Selecione a urgência.' }),
  descricao: z.string().trim().max(1200, 'Máximo de 1200 caracteres.').optional(),
})

type Dados = z.infer<typeof esquema>

/** Monta a mensagem que vai pre-preenchida na conversa. */
function montarMensagem(dados: Dados): string {
  const linhas: (string | null)[] = [
    'Olá! Vim pelo site da Bradotec.',
    '',
    `Nome: ${dados.nome}`,
    `Contato: ${dados.telefone}`,
    dados.cidade ? `Cidade: ${dados.cidade}` : null,
    dados.organizacao ? `Empresa/condomínio: ${dados.organizacao}` : null,
    `Perfil: ${dados.perfil}`,
    `Assunto: ${dados.assunto}`,
    `Urgência: ${dados.urgencia}`,
    dados.descricao ? `\nSituação:\n${dados.descricao}` : null,
  ]
  return linhas.filter((linha): linha is string => linha !== null).join('\n')
}

const rotulo = 'block text-[0.92rem] font-bold text-ink'

const campo =
  'mt-1.5 w-full rounded-[11px] border border-[#c6d2e0] bg-white px-3.5 py-3 text-ink outline-none transition-colors focus-visible:border-navy-900 focus-visible:ring-2 focus-visible:ring-navy-900/25 aria-[invalid=true]:border-fire'

export default function FormularioContato() {
  const [mensagemPronta, setMensagemPronta] = useState<string | null>(null)
  const numeroConfigurado = !ehPlaceholder(site.whatsapp)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Dados>({ resolver: zodResolver(esquema), mode: 'onBlur' })

  const aoEnviar = (dados: Dados) => {
    const texto = montarMensagem(dados)

    if (!numeroConfigurado) {
      // Numero ainda e placeholder: em vez de abrir um link quebrado,
      // entrega o texto pronto para a pessoa copiar.
      setMensagemPronta(texto)
      return
    }

    const numero = site.whatsapp.replace(/\D/g, '')
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
    setMensagemPronta(null)
  }

  const erro = (nome: keyof Dados) => {
    const mensagem = errors[nome]?.message
    if (!mensagem) return null
    return (
      <p id={`erro-${nome}`} role="alert" className="mt-1.5 text-[0.87rem] font-semibold text-fire">
        {mensagem}
      </p>
    )
  }

  const aria = (nome: keyof Dados) =>
    errors[nome] ? { 'aria-invalid': true, 'aria-describedby': `erro-${nome}` } : {}

  return (
    <form onSubmit={handleSubmit(aoEnviar)} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={rotulo} htmlFor="nome">
            Nome <span className="text-fire">*</span>
          </label>
          <input id="nome" className={campo} {...aria('nome')} {...register('nome')} />
          {erro('nome')}
        </div>

        <div>
          <label className={rotulo} htmlFor="telefone">
            WhatsApp ou telefone <span className="text-fire">*</span>
          </label>
          <input
            id="telefone"
            type="tel"
            inputMode="tel"
            className={campo}
            {...aria('telefone')}
            {...register('telefone')}
          />
          {erro('telefone')}
        </div>

        <div>
          <label className={rotulo} htmlFor="cidade">
            Cidade <span className="font-normal text-steel-500">(opcional)</span>
          </label>
          <input id="cidade" className={campo} {...register('cidade')} />
        </div>

        <div>
          <label className={rotulo} htmlFor="organizacao">
            Empresa ou condomínio <span className="font-normal text-steel-500">(opcional)</span>
          </label>
          <input id="organizacao" className={campo} {...register('organizacao')} />
        </div>

        <div>
          <label className={rotulo} htmlFor="perfil">
            Você é <span className="text-fire">*</span>
          </label>
          <select
            id="perfil"
            className={campo}
            defaultValue=""
            {...aria('perfil')}
            {...register('perfil')}
          >
            <option value="" disabled>
              Selecione
            </option>
            {PERFIS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {erro('perfil')}
        </div>

        <div>
          <label className={rotulo} htmlFor="urgencia">
            Urgência <span className="text-fire">*</span>
          </label>
          <select
            id="urgencia"
            className={campo}
            defaultValue=""
            {...aria('urgencia')}
            {...register('urgencia')}
          >
            <option value="" disabled>
              Selecione
            </option>
            {URGENCIAS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {erro('urgencia')}
        </div>
      </div>

      <div>
        <label className={rotulo} htmlFor="assunto">
          Assunto <span className="text-fire">*</span>
        </label>
        <select
          id="assunto"
          className={campo}
          defaultValue=""
          {...aria('assunto')}
          {...register('assunto')}
        >
          <option value="" disabled>
            Selecione
          </option>
          {ASSUNTOS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {erro('assunto')}
      </div>

      <div>
        <label className={rotulo} htmlFor="descricao">
          Descreva a situação <span className="font-normal text-steel-500">(opcional)</span>
        </label>
        <textarea id="descricao" rows={5} className={campo} {...register('descricao')} />
        <p className="mt-1.5 text-[0.87rem] text-steel-500">
          Quanto mais específico for o que você contar, mais direto será o retorno.
        </p>
        {erro('descricao')}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-[50px] w-full items-center justify-center rounded-[11px] bg-fire px-6 py-3.5 font-bold text-white transition-colors hover:bg-fire-dark disabled:opacity-60 sm:w-auto"
        >
          {numeroConfigurado ? 'Enviar pelo WhatsApp' : 'Montar mensagem'}
        </button>
        <p className="mt-3 text-[0.87rem] text-steel-500">
          O envio abre o WhatsApp com os dados preenchidos. Nenhum dado é armazenado neste site.
        </p>
      </div>

      {mensagemPronta ? (
        <div role="status" className="rounded-xl border border-[#e9c877] bg-[#fff8e9] p-5">
          <p className="font-bold text-ink">Mensagem montada</p>
          <p className="mt-1.5 text-[0.92rem] text-ink-soft">
            O número de WhatsApp ainda não foi configurado neste site. Copie o texto abaixo e envie
            pelo canal que preferir.
          </p>
          <textarea
            readOnly
            rows={10}
            value={mensagemPronta}
            aria-label="Mensagem pronta para copiar"
            className="mt-3 w-full rounded-[11px] border border-[#e0cfa4] bg-white px-3.5 py-3 text-[0.92rem] text-ink"
          />
        </div>
      ) : null}
    </form>
  )
}
