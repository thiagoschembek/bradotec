/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config'

// getViteConfig reaproveita a config do Astro, para o teste enxergar
// os mesmos aliases e plugins que o site usa de verdade.
export default getViteConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    globals: true,
  },
})
