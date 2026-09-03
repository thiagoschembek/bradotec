import { ehPlaceholder, site } from '@/config/site'

/**
 * Geradores de JSON-LD (schema.org) — o bloco de dados que o Google le para
 * entender que a Bradotec e um negocio local, quais servicos oferece e qual
 * o caminho de navegacao da pagina.
 *
 * No site anterior esse bloco era escrito a mao em cada arquivo, e as
 * respostas do FAQ ficavam duplicadas entre o HTML visivel e o JSON-LD.
 * Aqui os dois saem da mesma fonte: nunca podem divergir.
 */

/** Campos placeholder nao vao para o schema: melhor ausente que falso. */
const soSePreenchido = (valor: string): string | undefined =>
  ehPlaceholder(valor) ? undefined : valor

/** Remove chaves cujo valor e undefined, para o JSON sair limpo. */
const semVazios = <T extends Record<string, unknown>>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>

export function jsonLdNegocioLocal(siteUrl: string) {
  return semVazios({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${site.nome}: ${site.descritivo}`,
    description: site.descricao,
    url: siteUrl,
    image: new URL('/og-bradotec.jpg', siteUrl).href,
    telephone: soSePreenchido(site.telefone),
    email: soSePreenchido(site.email),
    priceRange: '$$',
    address: semVazios({
      '@type': 'PostalAddress',
      streetAddress: soSePreenchido(site.endereco),
      addressLocality: site.cidade,
      addressRegion: site.estado,
      postalCode: soSePreenchido(site.cep),
      addressCountry: 'BR',
    }),
    areaServed: [
      { '@type': 'City', name: site.cidade },
      { '@type': 'State', name: 'Paraíba' },
    ],
    openingHours: soSePreenchido(site.horario),
    sameAs: ehPlaceholder(site.instagram) ? undefined : [site.instagram],
  })
}

export function jsonLdBreadcrumb(
  trilha: readonly { nome: string; href: string }[],
  siteUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trilha.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nome,
      item: new URL(item.href, siteUrl).href,
    })),
  }
}

export function jsonLdFaq(perguntas: readonly { pergunta: string; resposta: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: perguntas.map((p) => ({
      '@type': 'Question',
      name: p.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: p.resposta },
    })),
  }
}
