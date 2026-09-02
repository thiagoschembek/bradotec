import { describe, expect, it } from 'vitest'
import { MINIMO_AA, razaoDeContraste, type TamanhoDeTexto } from '@/lib/contraste'

/**
 * Trava de acessibilidade da paleta.
 *
 * Cada par abaixo e uma combinacao que existe hoje na tela. Trocar uma cor no
 * bloco @theme de global.css sem atualizar esta lista quebra o teste — que e
 * exatamente a intencao: a paleta so muda com o contraste conferido.
 */

const NAVY_950 = '#08131f'
const NAVY_900 = '#0b1b2e'
const NAVY_800 = '#13293f'
const BRANCO = '#ffffff'
const CANVAS = '#f6f8fb'
const AMARELO_PENDENTE = '#fff8e9'

const pares: { frente: string; fundo: string; tamanho: TamanhoDeTexto; onde: string }[] = [
  // --- Texto claro sobre fundo escuro ---
  { frente: '#8fa3b8', fundo: NAVY_900, tamanho: 'pequeno', onde: 'trilha do CabecalhoPagina' },
  { frente: '#8fa3b8', fundo: NAVY_800, tamanho: 'pequeno', onde: 'trilha, fim do gradiente' },
  { frente: '#71889f', fundo: NAVY_950, tamanho: 'pequeno', onde: 'rodape, texto menor' },
  { frente: '#8298af', fundo: NAVY_950, tamanho: 'pequeno', onde: 'rodape, texto' },
  { frente: '#93a7bc', fundo: NAVY_950, tamanho: 'pequeno', onde: 'rodape, links' },
  { frente: '#a9bccf', fundo: NAVY_950, tamanho: 'pequeno', onde: 'rodape, links destacados' },
  { frente: '#b9c9da', fundo: NAVY_900, tamanho: 'grande', onde: 'subtitulo sobre navy' },
  { frente: '#a7bacd', fundo: NAVY_900, tamanho: 'pequeno', onde: 'lista de provas da home' },
  { frente: '#dce7f2', fundo: NAVY_900, tamanho: 'pequeno', onde: 'selo da home' },
  { frente: '#e8a5a2', fundo: NAVY_900, tamanho: 'pequeno', onde: 'kicker "O que esta em jogo"' },
  { frente: '#8fd4da', fundo: NAVY_900, tamanho: 'pequeno', onde: 'kicker "Para empresas"' },
  { frente: '#7fd1a6', fundo: NAVY_900, tamanho: 'interface', onde: 'check da home' },

  // --- Chips do painel de vencimentos ---
  { frente: '#ff9c97', fundo: NAVY_900, tamanho: 'pequeno', onde: 'chip "Exigencia aberta"' },
  { frente: '#f0be6a', fundo: NAVY_900, tamanho: 'pequeno', onde: 'chip "Vence em 30 dias"' },
  { frente: '#79d6a8', fundo: NAVY_900, tamanho: 'pequeno', onde: 'chip "Regular"' },

  // --- Texto escuro sobre fundo claro ---
  { frente: '#0f2033', fundo: BRANCO, tamanho: 'pequeno', onde: '--color-ink' },
  { frente: '#42576d', fundo: BRANCO, tamanho: 'pequeno', onde: '--color-ink-soft sobre branco' },
  { frente: '#42576d', fundo: CANVAS, tamanho: 'pequeno', onde: '--color-ink-soft sobre canvas' },
  { frente: '#5c6e85', fundo: BRANCO, tamanho: 'pequeno', onde: '--color-steel-500 sobre branco' },
  { frente: '#5c6e85', fundo: CANVAS, tamanho: 'pequeno', onde: '--color-steel-500 sobre canvas' },
  { frente: '#667482', fundo: BRANCO, tamanho: 'pequeno', onde: '--color-steel-400 sobre branco' },
  { frente: '#667482', fundo: CANVAS, tamanho: 'pequeno', onde: '--color-steel-400 sobre canvas' },
  { frente: '#d22b26', fundo: BRANCO, tamanho: 'pequeno', onde: '--color-fire como texto' },
  { frente: '#1d4e89', fundo: BRANCO, tamanho: 'pequeno', onde: '--color-div-doc como texto' },
  { frente: '#0e7c86', fundo: BRANCO, tamanho: 'pequeno', onde: '--color-div-auto como texto' },
  { frente: '#a0650b', fundo: AMARELO_PENDENTE, tamanho: 'pequeno', onde: '--color-warn' },

  // --- Texto branco sobre fundo colorido ---
  { frente: BRANCO, fundo: '#118848', tamanho: 'pequeno', onde: 'botao flutuante do WhatsApp' },
  { frente: BRANCO, fundo: '#0e7539', tamanho: 'pequeno', onde: 'botao flutuante, hover' },
  { frente: BRANCO, fundo: '#d22b26', tamanho: 'pequeno', onde: 'botao primario --color-fire' },
  { frente: BRANCO, fundo: '#0b1b2e', tamanho: 'pequeno', onde: 'botao escuro --color-navy-900' },
]

describe('contraste da paleta (WCAG 2.1 AA)', () => {
  for (const { frente, fundo, tamanho, onde } of pares) {
    it(`${onde}: ${frente} sobre ${fundo}`, () => {
      const razao = razaoDeContraste(frente, fundo)
      expect(
        razao,
        `${onde} — ${razao.toFixed(2)}:1, abaixo do minimo de ${MINIMO_AA[tamanho]}:1`
      ).toBeGreaterThanOrEqual(MINIMO_AA[tamanho])
    })
  }
})

describe('razaoDeContraste', () => {
  it('devolve 21 para preto sobre branco', () => {
    expect(razaoDeContraste('#000000', '#ffffff')).toBeCloseTo(21, 2)
  })

  it('devolve 1 para a mesma cor', () => {
    expect(razaoDeContraste('#d22b26', '#d22b26')).toBeCloseTo(1, 5)
  })

  it('nao depende da ordem dos argumentos', () => {
    expect(razaoDeContraste('#0f2033', '#ffffff')).toBeCloseTo(
      razaoDeContraste('#ffffff', '#0f2033'),
      10
    )
  })

  it('rejeita cor fora do formato #rrggbb', () => {
    expect(() => razaoDeContraste('#fff', '#ffffff')).toThrow(/Cor invalida/)
  })
})
