// @ts-check
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'

// URL publica do site. Usada para gerar canonical, Open Graph e sitemap.xml.
// TROCAR pelo dominio real do cliente (ou definir SITE_URL no ambiente do deploy).
const SITE_URL = process.env.SITE_URL ?? 'https://dominio-do-cliente.example'

export default defineConfig({
  site: SITE_URL,

  // 'static' = paginas viram HTML pronto no build. Sem servidor rodando,
  // sem custo por acesso e a pagina abre instantaneamente.
  output: 'static',

  integrations: [
    react(),
    // Gera sitemap.xml automaticamente a partir das paginas existentes.
    sitemap(),
  ],

  // Baixa a fonte no build e serve do nosso proprio dominio.
  // Sem isso, o navegador do visitante faria um pedido ao Google a cada acesso:
  // mais lento e com dado do visitante saindo para terceiro.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-plus-jakarta',
      weights: [400, 500, 600, 700, 800],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
  ],

  vite: { plugins: [tailwindcss()] },
})
