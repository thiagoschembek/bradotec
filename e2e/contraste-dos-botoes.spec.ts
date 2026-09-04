import { expect, test } from '@playwright/test'
import { razaoDeContraste } from '../src/lib/contraste'

/**
 * Contraste de todo botao do site.
 *
 * Existe porque o mesmo defeito passou duas vezes.
 *
 * A variante padrao do BotaoLink e `contorno`: texto escuro sobre fundo
 * transparente. Sobre fundo claro esta certa. Sobre o cabecalho escuro o
 * texto fica quase na cor do fundo, e o botao vira uma caixa vazia.
 *
 * Da primeira vez apareceu em oito paginas, quando os CTAs de cabecalho
 * passaram de WhatsApp para link. Da segunda, no proprio cabecalho do site,
 * e so foi notado porque uma foto de fundo tornou obvio.
 *
 * Nenhum teste pegava isso: a trava unitaria da paleta confere pares de cor
 * escolhidos a mao, e ninguem tinha escolhido este par porque ele nao era
 * intencional. Aqui a varredura e cega, entao alcanca o que ninguem pensou
 * em conferir.
 *
 * Como mede: fotografa a pagina uma vez e, para cada texto de botao, le a
 * cor dominante da faixa logo abaixo da borda de cima, onde nao chega glifo.
 * Essa faixa e fundo por construcao.
 *
 * A primeira versao deste teste subia a arvore lendo background-color, e
 * errou duas vezes: nao enxerga gradiente nem foto, que sao background-image,
 * e acabava reportando o branco do corpo como fundo de um botao que esta
 * sobre o cabecalho escuro. Pixel nao mente.
 */

const rotas = [
  '/',
  '/solucoes',
  '/seguranca-contra-incendio',
  '/avcb',
  '/treinamentos',
  '/regularizacoes',
  '/documentacao-veicular',
  '/empresas',
  '/sobre',
  '/contato',
  '/diagnostico',
  '/404',
]

const MINIMO = 4.5

test.describe('Contraste dos botões', () => {
  for (const rota of rotas) {
    test(`todo botão de ${rota} é legível`, async ({ page }) => {
      await page.goto(rota)
      await page.waitForLoadState('networkidle')

      const trechos = await page.evaluate(() => {
        const emHex = (canais: number[]) =>
          `#${canais
            .map((v) =>
              Math.max(0, Math.min(255, Math.round(v)))
                .toString(16)
                .padStart(2, '0')
            )
            .join('')}`

        const alvos = document.querySelectorAll<HTMLElement>(
          'a[class*="min-h-"], button[class*="min-h-"], button[class*="rounded"]'
        )

        const saida: {
          texto: string
          frente: string
          caixa: { x: number; y: number; width: number; height: number }
        }[] = []

        for (const alvo of alvos) {
          if (alvo.offsetParent === null) continue
          const caixa = alvo.getBoundingClientRect()
          if (caixa.width < 8 || caixa.height < 8) continue

          /*
           * A cor que importa e a do elemento que CONTEM o texto, nao a do
           * botao. O link da logo herda a cor escura do corpo, mas o texto
           * visivel esta em filhos com text-white: medir o pai daria um
           * falso positivo de 1.01:1.
           */
          const caminhante = document.createTreeWalker(alvo, NodeFilter.SHOW_TEXT)
          const vistos = new Set<Element>()

          for (let no = caminhante.nextNode(); no; no = caminhante.nextNode()) {
            const conteudo = (no.textContent ?? '').trim()
            if (conteudo.length < 2) continue

            const dono = no.parentElement
            if (!dono || vistos.has(dono)) continue
            vistos.add(dono)

            const canais = getComputedStyle(dono)
              .color.match(/[\d.]+/g)
              ?.map(Number) ?? [0, 0, 0]

            /*
             * A caixa medida e a DO TEXTO, nao a do botao.
             *
             * Medir a caixa do botao errou duas vezes: no link do rodape, que
             * ocupa a coluna inteira em volta de uma etiqueta pequena, o fundo
             * dominante virava o grafite do rodape em vez do amarelo da
             * etiqueta; e num botao sobre foto, onde o fundo varia pixel a
             * pixel, a moda acabava caindo na propria cor do texto.
             */
            const caixaDoTexto = dono.getBoundingClientRect()

            saida.push({
              texto: conteudo.slice(0, 40),
              frente: emHex(canais.slice(0, 3)),
              caixa: {
                x: (caixaDoTexto.width > 4 ? caixaDoTexto.x : caixa.x) + window.scrollX,
                y: (caixaDoTexto.height > 4 ? caixaDoTexto.y : caixa.y) + window.scrollY,
                width: caixaDoTexto.width > 4 ? caixaDoTexto.width : caixa.width,
                height: caixaDoTexto.height > 4 ? caixaDoTexto.height : caixa.height,
              },
            })
          }
        }
        return saida
      })

      expect(trechos.length, `nenhum texto de botão encontrado em ${rota}`).toBeGreaterThan(0)

      const captura = (await page.screenshot({ fullPage: true })).toString('base64')

      const fundos = await page.evaluate(
        async ({ dados, caixas }) => {
          const imagem = new Image()
          imagem.src = `data:image/png;base64,${dados}`
          await imagem.decode()

          const tela = document.createElement('canvas')
          tela.width = imagem.width
          tela.height = imagem.height
          const contexto = tela.getContext('2d')
          if (!contexto) return []
          contexto.drawImage(imagem, 0, 0)

          // A captura sai no devicePixelRatio da pagina, entao converte.
          const escala = imagem.width / document.documentElement.scrollWidth

          return caixas.map((c) => {
            const pixels = contexto.getImageData(
              Math.max(0, Math.round(c.x * escala)),
              Math.max(0, Math.round(c.y * escala)),
              Math.max(1, Math.round(c.width * escala)),
              Math.max(1, Math.round(c.height * escala))
            ).data

            /*
             * Amostra so a FAIXA DE CIMA da caixa, logo abaixo da borda.
             *
             * Ali nao chega glifo: entre o topo do bloco e o topo das letras
             * ha a borda mais o respiro interno. Entao o que estiver nessa
             * faixa e fundo, por construcao.
             *
             * A tentativa anterior era descartar os pixels da cor do texto, e
             * ela quebrava exatamente no caso que este teste existe para
             * pegar: quando o texto tem a MESMA cor do fundo, o filtro
             * descartava o fundo inteiro e o defeito passava.
             */
            const larguraPx = Math.max(1, Math.round(c.width * escala))
            const alturaPx = Math.max(1, Math.round(c.height * escala))
            const inicio = Math.min(2, Math.max(0, alturaPx - 1))
            const fim = Math.min(alturaPx, inicio + Math.max(2, Math.round(alturaPx * 0.18)))

            const conta = new Map<string, number>()
            for (let linha = inicio; linha < fim; linha++) {
              for (let coluna = 0; coluna < larguraPx; coluna++) {
                const i = (linha * larguraPx + coluna) * 4
                const chave = `${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`
                conta.set(chave, (conta.get(chave) ?? 0) + 1)
              }
            }

            let maisComum = '255,255,255'
            let maior = -1
            for (const [chave, quantas] of conta) {
              if (quantas > maior) {
                maior = quantas
                maisComum = chave
              }
            }

            const canais = maisComum.split(',').map(Number)
            return `#${canais.map((v) => (v ?? 0).toString(16).padStart(2, '0')).join('')}`
          })
        },
        {
          dados: captura,
          caixas: trechos.map((t) => t.caixa),
        }
      )

      for (const [i, { texto, frente }] of trechos.entries()) {
        const fundo = fundos[i]
        if (!fundo) continue

        const razao = razaoDeContraste(frente, fundo)
        expect(
          razao,
          `${rota} · "${texto}": ${razao.toFixed(2)}:1 do texto ${frente} sobre o fundo ${fundo}, abaixo do mínimo de ${MINIMO}:1`
        ).toBeGreaterThanOrEqual(MINIMO)
      }
    })
  }
})
