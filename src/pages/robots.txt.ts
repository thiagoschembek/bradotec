import type { APIRoute } from 'astro'

/**
 * Gera o robots.txt no build, usando a URL definida em astro.config.mjs.
 *
 * Antes esse arquivo era escrito a mao com o dominio fixo dentro — e o
 * dominio aparecia como placeholder em varios arquivos, exigindo troca
 * manual em cada um no dia da publicacao. Aqui ele acompanha o config.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href

  const corpo = `User-agent: *
Allow: /

Sitemap: ${sitemap}
`

  return new Response(corpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
