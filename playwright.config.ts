import { defineConfig, devices } from '@playwright/test'

/**
 * O Playwright abre um navegador de verdade e usa o site como um visitante
 * usaria. Diferente do teste unitario, ele pega problema que so aparece na
 * tela: botao que nao clica, menu que nao abre, link quebrado.
 *
 * `webServer` faz o proprio Playwright subir o site antes de testar, para
 * voce nao precisar lembrar de rodar `pnpm dev` em outro terminal.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: 'http://localhost:4321',
    // Guarda o rastro da execucao so quando o teste falha na primeira tentativa.
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'celular', use: { ...devices['Pixel 7'] } },
  ],

  // Ver e2e/servidor.ts: o preview do Astro 7 sobe em segundo plano, entao
  // controlamos o ciclo de vida aqui em vez de usar `webServer`.
  globalSetup: './e2e/servidor.ts',
  globalTeardown: './e2e/encerrar-servidor.ts',
})
