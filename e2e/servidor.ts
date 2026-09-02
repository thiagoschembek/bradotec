import { execSync } from 'node:child_process'

export const URL_BASE = 'http://localhost:4321'

/**
 * O `astro preview` da versao 7 sempre sobe como processo de fundo e devolve
 * o terminal na hora. O `webServer` do Playwright espera o contrario — um
 * processo que fica vivo — e por isso entende a saida como falha.
 *
 * Entao controlamos o ciclo de vida na mao: aqui subimos o servidor e
 * esperamos ele responder de fato antes de qualquer teste rodar.
 */
export default async function globalSetup(): Promise<void> {
  execSync('pnpm build', { stdio: 'inherit' })
  execSync('pnpm exec astro preview --background', { stdio: 'inherit' })

  // Espera ativa: so segue quando o servidor responder de verdade.
  const limite = Date.now() + 60_000
  while (Date.now() < limite) {
    try {
      const resposta = await fetch(URL_BASE)
      if (resposta.ok) return
    } catch {
      // Servidor ainda subindo — tenta de novo.
    }
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  throw new Error(`Servidor de preview não respondeu em ${URL_BASE} dentro de 60s`)
}
