import { expect, test } from '@playwright/test'

/**
 * Teste de ponta a ponta do esqueleto do site: garante que o layout base
 * funciona de verdade no navegador antes de qualquer conteudo entrar.
 */

test.describe('Home', () => {
  test('carrega com o titulo, a headline e a cidade visiveis', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Bradotec/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Regularização, licenças e documentação'
    )
    // SEO local: a cidade precisa aparecer no texto que a pessoa realmente le.
    await expect(page.locator('main')).toContainText('João Pessoa')
  })

  test('tem exatamente um h1 — hierarquia correta para leitor de tela e Google', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  })

  test('nao rola na horizontal no celular', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const estouro = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    )
    expect(estouro).toBe(false)
  })
})

test.describe('Navegação', () => {
  test('o link "Ir para o conteúdo" aparece ao usar Tab e leva ao conteúdo', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')

    const atalho = page.getByRole('link', { name: 'Ir para o conteúdo' })
    await expect(atalho).toBeFocused()

    await atalho.press('Enter')
    await expect(page).toHaveURL(/#conteudo$/)
  })

  test('leva da home ate uma pagina interna pelo menu', async ({ page, isMobile }) => {
    await page.goto('/')

    if (isMobile) {
      await page.getByRole('button', { name: 'Abrir menu' }).click()
    }

    await page
      .getByRole('link', { name: /Regulariza/ })
      .first()
      .click()
    await expect(page).toHaveURL(/\/regularizacoes/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})

test.describe('Menu do celular', () => {
  test.skip(({ isMobile }) => !isMobile, 'Só faz sentido em tela pequena')

  test('abre, fecha pelo Esc e devolve o foco ao botao', async ({ page }) => {
    await page.goto('/')
    const botao = page.getByRole('button', { name: 'Abrir menu' })

    await botao.click()
    await expect(page.getByRole('navigation', { name: 'Menu' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('navigation', { name: 'Menu' })).toBeHidden()
    await expect(botao).toBeFocused()
  })
})

test.describe('Página 404', () => {
  test('responde com noindex para nao entrar no Google', async ({ page }) => {
    await page.goto('/404')

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
  })
})

test.describe('Botão flutuante do WhatsApp', () => {
  const seletor = '.fixed[aria-label="Falar no WhatsApp"]'

  /**
   * Opacidade real, e nao toBeVisible(): para o Playwright um elemento com
   * opacity 0 continua "visivel", porque ele olha display, visibility e
   * caixa — nao opacidade.
   */
  const estaAparecendo = (page: import('@playwright/test').Page) =>
    page.locator(seletor).evaluate((elemento) => {
      const estilo = getComputedStyle(elemento)
      return Number.parseFloat(estilo.opacity) > 0.05 && estilo.pointerEvents !== 'none'
    })

  test('aparece durante a leitura da página', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator(seletor)).toBeAttached()
    expect(await estaAparecendo(page), 'o atalho precisa existir antes do rodapé').toBe(true)
  })

  test('não cobre o conteúdo do rodapé', async ({ page }) => {
    await page.goto('/')
    await page.locator('footer').scrollIntoViewIfNeeded()

    const botao = await page.locator(seletor).boundingBox()
    const ultimoItem = await page.locator('footer li').last().boundingBox()

    expect(botao, 'o botão flutuante precisa existir').not.toBeNull()
    expect(ultimoItem, 'o rodapé precisa ter itens').not.toBeNull()
    if (!botao || !ultimoItem) return

    const sobrepoe =
      ultimoItem.y + ultimoItem.height > botao.y && ultimoItem.x + ultimoItem.width > botao.x

    // O que importa e nao cobrir, e ha dois jeitos legitimos de cumprir isso:
    // ou o botao nao passa por cima do rodape, ou ele se recolhe quando o
    // rodape entra na tela. A versao antiga deste teste so media geometria e
    // exigia a primeira solucao — na pratica, exigia calibrar o padding do
    // rodape de novo a cada link acrescentado.
    if (sobrepoe) {
      expect(
        await estaAparecendo(page),
        'o botão passa por cima do rodapé e continua aparecendo'
      ).toBe(false)
    }
  })

  test('sai da ordem de tabulação quando se recolhe', async ({ page }) => {
    await page.goto('/')
    await page.locator('footer').scrollIntoViewIfNeeded()

    // Alvo invisivel que ainda recebe foco e uma armadilha para quem navega
    // por teclado: o foco some da tela sem explicacao.
    const recolhido = !(await estaAparecendo(page))
    if (recolhido) {
      await expect(page.locator(seletor)).toHaveAttribute('inert', '')
    }
  })
})
