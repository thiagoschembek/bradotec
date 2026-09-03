import { chromium } from '@playwright/test'
const OUT = process.argv[2]
const nav = await chromium.launch()
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } })
const p = await ctx.newPage()
await p.goto('http://localhost:4321/solucoes', { waitUntil: 'networkidle' })
await p.locator('main section').nth(1).screenshot({ path: `${OUT}/taste-solucoes.png` })
console.log('taste-solucoes.png')
await nav.close()
