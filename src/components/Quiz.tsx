import { useRef, useState } from 'react'
import {
  decidirRota,
  montarMensagemDoQuiz,
  perguntas,
  type Respostas,
  rotuloDaResposta,
} from '@/config/quiz'
import { ehPlaceholder, site } from '@/config/site'

/**
 * Diagnostico de Regularizacao — quatro perguntas, uma por tela.
 *
 * Ilha React porque cada passo depende da resposta anterior e o resultado
 * precisa receber o foco quando aparece. Os dados e a decisao ficam em
 * src/config/quiz.ts, testados sem montar componente.
 *
 * Uma pergunta por vez, e nao as quatro juntas, por um motivo de conversao:
 * quatro perguntas visiveis parecem formulario e afastam; uma parece
 * conversa. E o compromisso de entrada de menor atrito do site.
 */

export default function Quiz() {
  const [passo, setPasso] = useState(0)
  const [respostas, setRespostas] = useState<Respostas>({})
  const [concluido, setConcluido] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const resultadoRef = useRef<HTMLDivElement>(null)

  const pergunta = perguntas[passo]
  const ultima = passo === perguntas.length - 1
  const progresso = Math.round(((concluido ? perguntas.length : passo) / perguntas.length) * 100)

  const responder = (idOpcao: string) => {
    if (!pergunta) return
    setRespostas((atual) => ({ ...atual, [pergunta.id]: idOpcao }))
    setAviso(null)
  }

  const avancar = () => {
    if (!pergunta) return

    if (!respostas[pergunta.id]) {
      setAviso('Escolha uma opção para continuar.')
      return
    }

    if (ultima) {
      setConcluido(true)
      // Leitor de tela precisa ser levado ao resultado; sem isto o foco
      // fica no botao que acabou de sumir.
      window.requestAnimationFrame(() => resultadoRef.current?.focus())
      return
    }

    setPasso((atual) => atual + 1)
  }

  const voltar = () => {
    setAviso(null)
    setPasso((atual) => Math.max(0, atual - 1))
  }

  const refazer = () => {
    setRespostas({})
    setPasso(0)
    setConcluido(false)
    setAviso(null)
  }

  const rota = decidirRota(respostas)
  const mensagem = montarMensagemDoQuiz(respostas)
  const numeroConfigurado = !ehPlaceholder(site.whatsapp)
  const linkWhats = numeroConfigurado
    ? `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`
    : null

  return (
    <div className="rounded-xl border border-line bg-white p-7 shadow-card md:p-8">
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-line-soft"
        role="progressbar"
        aria-valuenow={progresso}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso do diagnóstico"
      >
        <div
          className="h-full rounded-full bg-fire transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${progresso}%` }}
        />
      </div>

      {concluido ? (
        <div ref={resultadoRef} tabIndex={-1} className="mt-6 outline-none">
          <h3 className="text-cartao-lg text-ink">{rota.titulo}</h3>
          <p className="mt-3 text-ink-soft">{rota.texto}</p>

          <div className="mt-5 rounded-lg border border-line bg-canvas p-5">
            <p className="font-bold text-ink">Próximos passos que costumamos seguir</p>
            <ul className="mt-3 flex list-none flex-col gap-2">
              {rota.itens.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-corpo text-ink-soft">
                  <span
                    className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-fire"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <dl className="mt-5 flex flex-col gap-2.5 border-t border-line-soft pt-5">
            {perguntas.map((item) => (
              <div key={item.id} className="text-corpo">
                <dt className="text-rotulo font-bold uppercase tracking-[0.06em] text-steel-500">
                  {item.titulo}
                </dt>
                <dd className="mt-0.5 text-ink-soft">
                  {rotuloDaResposta(item.id, respostas) ?? '—'}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            {linkWhats ? (
              <a
                className="inline-flex min-h-[50px] items-center justify-center rounded-[11px] bg-fire px-6 py-3.5 font-bold text-white no-underline transition-colors hover:bg-fire-dark"
                href={linkWhats}
                target="_blank"
                rel="noopener"
              >
                Enviar minhas respostas no WhatsApp
              </a>
            ) : (
              <a
                className="inline-flex min-h-[50px] items-center justify-center rounded-[11px] bg-fire px-6 py-3.5 font-bold text-white no-underline transition-colors hover:bg-fire-dark"
                href="/contato"
              >
                Falar com um especialista
              </a>
            )}

            <a
              className="inline-flex min-h-[50px] items-center justify-center rounded-[11px] border border-[#c6d2e0] px-6 py-3.5 font-bold text-navy-900 no-underline transition-colors hover:border-navy-900 hover:bg-line-soft"
              href={rota.href}
            >
              Ver essa divisão
            </a>

            <button
              type="button"
              onClick={refazer}
              className="inline-flex min-h-[50px] items-center justify-center rounded-[11px] px-4 py-3.5 font-bold text-navy-900 underline underline-offset-4 transition-colors hover:text-fire"
            >
              Refazer
            </button>
          </div>

          {!numeroConfigurado && (
            <p className="mt-4 rounded-lg border border-[#e9c877] bg-[#fff8e9] p-4 text-apoio text-ink-soft">
              O número de WhatsApp ainda não foi configurado neste site, então o botão leva à página
              de contato.
            </p>
          )}

          <p className="mt-5 text-apoio text-steel-500">
            Este resultado é uma orientação inicial para direcionar o atendimento. A definição do
            que se aplica ao seu caso depende de análise da documentação e, quando necessário, de
            profissional legalmente habilitado.
          </p>
        </div>
      ) : (
        pergunta && (
          <div className="mt-6">
            <p className="text-rotulo font-bold uppercase tracking-[0.08em] text-steel-500">
              Pergunta {passo + 1} de {perguntas.length}
            </p>

            <fieldset className="mt-3 border-0 p-0">
              <legend className="text-cartao-lg text-ink">{pergunta.titulo}</legend>

              <div className="mt-5 flex flex-col gap-2.5">
                {pergunta.opcoes.map((opcao) => {
                  const escolhida = respostas[pergunta.id] === opcao.id
                  return (
                    <label
                      key={opcao.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-corpo transition-colors ${
                        escolhida
                          ? 'border-fire bg-fire-soft text-ink'
                          : 'border-line text-ink-soft hover:border-[#c6d2e0] hover:bg-line-soft'
                      }`}
                    >
                      <input
                        type="radio"
                        name={pergunta.id}
                        value={opcao.id}
                        checked={escolhida}
                        onChange={() => responder(opcao.id)}
                        className="size-4 shrink-0 accent-fire"
                      />
                      {opcao.rotulo}
                    </label>
                  )
                })}
              </div>
            </fieldset>

            {aviso && (
              <p role="alert" className="mt-3 text-apoio font-semibold text-fire">
                {aviso}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {passo > 0 && (
                <button
                  type="button"
                  onClick={voltar}
                  className="inline-flex min-h-[50px] items-center justify-center rounded-[11px] border border-[#c6d2e0] px-6 py-3.5 font-bold text-navy-900 transition-colors hover:border-navy-900 hover:bg-line-soft"
                >
                  Voltar
                </button>
              )}
              <button
                type="button"
                onClick={avancar}
                className="inline-flex min-h-[50px] items-center justify-center rounded-[11px] bg-fire px-6 py-3.5 font-bold text-white transition-colors hover:bg-fire-dark"
              >
                {ultima ? 'Ver o caminho indicado' : 'Continuar'}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  )
}
