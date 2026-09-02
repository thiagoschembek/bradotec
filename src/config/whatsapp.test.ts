import { beforeEach, describe, expect, it, vi } from 'vitest'

// O numero real fica em site.ts. Aqui trocamos por um controlado,
// para o teste nao depender de o cliente ja ter preenchido o config.
vi.mock('./site', () => ({
  ehPlaceholder: (v: string) => v.trim().startsWith('[') && v.trim().endsWith(']'),
  site: { whatsapp: '5583999998888' },
}))

describe('linkWhatsapp', () => {
  beforeEach(() => vi.resetModules())

  it('monta o link com o numero e a mensagem da origem', async () => {
    const { linkWhatsapp } = await import('./whatsapp')
    const link = linkWhatsapp('incendio')

    expect(link).toContain('https://wa.me/5583999998888')
    expect(link).toContain(encodeURIComponent('regularização contra incêndio'))
  })

  it('usa a mensagem padrao quando nenhuma origem e informada', async () => {
    const { linkWhatsapp, mensagensWhatsapp } = await import('./whatsapp')

    expect(linkWhatsapp()).toContain(encodeURIComponent(mensagensWhatsapp.padrao))
  })

  it('aceita texto customizado (usado pelo quiz e pelo formulario)', async () => {
    const { linkWhatsapp } = await import('./whatsapp')

    expect(linkWhatsapp('padrao', 'Texto do quiz')).toContain(encodeURIComponent('Texto do quiz'))
  })

  it('devolve null enquanto o WhatsApp for placeholder, em vez de link quebrado', async () => {
    vi.doMock('./site', () => ({
      ehPlaceholder: (v: string) => v.trim().startsWith('[') && v.trim().endsWith(']'),
      site: { whatsapp: '[NUMERO DE WHATSAPP]' },
    }))
    const { linkWhatsapp } = await import('./whatsapp')

    expect(linkWhatsapp('orcamento')).toBeNull()
  })
})
