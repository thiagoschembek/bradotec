import { expect, test } from '@playwright/test'

/**
 * O formulario de contato no navegador.
 *
 * A segunda porta do site — a que existe para quem nao quer WhatsApp.
 * Ate aqui nenhum teste tocava nela: dava para quebrar a validacao inteira
 * sem nenhum alarme.
 *
 * Os testes verificam comportamento e acessibilidade, nao implementacao, para
 * sobreviverem a uma eventual troca de React por outra coisa.
 */

test.describe('Formulário de contato', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contato')
  })

  test('todo campo tem rótulo associado — sem isso o leitor de tela não anuncia', async ({
    page,
  }) => {
    const formulario = page.locator('form')

    for (const campo of await formulario.locator('input, select, textarea').all()) {
      const nome = (await campo.getAttribute('name')) ?? (await campo.getAttribute('aria-label'))
      // Vale <label for> ou aria-label: os dois dao nome acessivel ao campo.
      const acessivel = await campo.evaluate((elemento) => {
        const rotuloDireto = elemento.getAttribute('aria-label')?.trim()
        if (rotuloDireto) return rotuloDireto

        const id = elemento.getAttribute('id')
        if (!id) return ''
        return document.querySelector(`label[for="${id}"]`)?.textContent?.trim() ?? ''
      })
      expect(acessivel, `o campo "${nome}" ficou sem nome acessível`).not.toBe('')
    }
  })

  test('recusa o envio vazio e explica cada campo obrigatório', async ({ page }) => {
    await page.getByRole('button', { name: /Enviar pelo WhatsApp|Montar mensagem/ }).click()

    // Um alerta por campo obrigatorio: nome, telefone, perfil, urgencia, assunto.
    await expect(page.getByRole('alert')).toHaveCount(5)
    await expect(page.getByText('Informe o seu nome.')).toBeVisible()
    await expect(page.getByText('Informe um telefone para contato.')).toBeVisible()
  })

  test('liga o erro ao campo por aria-describedby e marca aria-invalid', async ({ page }) => {
    await page.getByRole('button', { name: /Enviar pelo WhatsApp|Montar mensagem/ }).click()

    const nome = page.locator('#nome')
    await expect(nome).toHaveAttribute('aria-invalid', 'true')

    const idDoErro = await nome.getAttribute('aria-describedby')
    expect(idDoErro).toBeTruthy()
    await expect(page.locator(`#${idDoErro}`)).toHaveText('Informe o seu nome.')
  })

  test('recusa telefone com letras', async ({ page }) => {
    await page.locator('#telefone').fill('não tenho')
    await page.locator('#nome').click()

    await expect(page.getByText(/Use apenas números/)).toBeVisible()
  })

  test('aceita telefone com parênteses, espaço e traço', async ({ page }) => {
    await page.locator('#telefone').fill('(83) 99999-8888')
    await page.locator('#nome').click()

    await expect(page.getByText(/Use apenas números/)).toHaveCount(0)
  })

  test('o erro some quando o campo é corrigido', async ({ page }) => {
    await page.getByRole('button', { name: /Enviar pelo WhatsApp|Montar mensagem/ }).click()
    await expect(page.getByText('Informe o seu nome.')).toBeVisible()

    await page.locator('#nome').fill('Maria Souza')
    await page.locator('#telefone').click()

    await expect(page.getByText('Informe o seu nome.')).toHaveCount(0)
  })

  test('com o WhatsApp ainda em placeholder, monta a mensagem para copiar', async ({ page }) => {
    await page.locator('#nome').fill('Maria Souza')
    await page.locator('#telefone').fill('83999998888')
    await page.locator('#cidade').fill('João Pessoa')
    await page.locator('#organizacao').fill('Condomínio Aurora')
    await page.locator('#perfil').selectOption('Condomínio ou administradora')
    await page.locator('#urgencia').selectOption('Nas próximas semanas')
    await page.locator('#assunto').selectOption('Segurança contra incêndio e pânico')
    await page.locator('#descricao').fill('Exigência aberta desde o mês passado.')

    await page.getByRole('button', { name: /Enviar pelo WhatsApp|Montar mensagem/ }).click()

    const area = page.getByLabel('Mensagem pronta para copiar')
    await expect(area).toBeVisible()

    const texto = await area.inputValue()
    expect(texto).toContain('Maria Souza')
    expect(texto).toContain('83999998888')
    expect(texto).toContain('Condomínio Aurora')
    expect(texto).toContain('Segurança contra incêndio e pânico')
    expect(texto).toContain('Exigência aberta desde o mês passado.')
  })

  test('os dados de contato ainda pendentes aparecem marcados, não escondidos', async ({
    page,
  }) => {
    // A regra do projeto: placeholder aparece sinalizado para ninguem publicar sem ver.
    const pendentes = page.locator('[title="Dado ainda não informado pelo cliente"]')
    await expect(pendentes.first()).toBeVisible()
  })

  test('a página não promete prazo, aprovação nem resultado', async ({ page }) => {
    const texto = (await page.locator('main').innerText()).toLowerCase()
    for (const proibido of [
      'garantimos',
      'aprovação garantida',
      'resolvemos em',
      'prazo garantido',
    ]) {
      expect(texto, `a pagina nao pode conter "${proibido}"`).not.toContain(proibido)
    }
  })
})
