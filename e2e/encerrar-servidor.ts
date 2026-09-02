import { execSync } from 'node:child_process'

/** Derruba o servidor de preview quando a suite termina. */
export default function globalTeardown(): void {
  try {
    execSync('pnpm exec astro preview stop', { stdio: 'inherit' })
  } catch {
    // Ja estava parado — nada a fazer.
  }
}
