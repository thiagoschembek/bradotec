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
  test('não cobre o conteúdo do rodapé', async ({ page }) => {
    await page.goto('/')
    await page.locator('footer').scrollIntoViewIfNeeded()

    const botao = await page.locator('.fixed[aria-label="Falar no WhatsApp"]').boundingBox()
    const ultimoItem = await page.locator('footer li').last().boundingBox()

    expect(botao, 'o botão flutuante precisa existir').not.toBeNull()
    expect(ultimoItem, 'o rodapé precisa ter itens').not.toBeNull()
    if (!botao || !ultimoItem) return

    // O último item do rodapé precisa terminar acima de onde o botão começa,
    // senão fica escondido atrás dele — problema encontrado na revisão visual.
    const sobrepoe =
      ultimoItem.y + ultimoItem.height > botao.y && ultimoItem.x + ultimoItem.width > botao.x

    expect(sobrepoe, 'o botão flutuante está cobrindo o rodapé').toBe(false)
  })
})
