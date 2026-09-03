# Fotos provisórias

**Estas imagens não são da Bradotec e não têm licença de uso.**

Os nomes de origem mostram que vieram de artigos de outros sites. Foram
colocadas a pedido, como marcador de lugar, até chegarem as fotos reais do
cliente.

Antes de o site ir ao ar em domínio próprio, cada uma precisa ser trocada
por uma foto do próprio cliente ou por uma imagem com licença comercial
(Adobe Stock, Unsplash+, Getty). Publicar como está expõe o cliente a
notificação de direito autoral.

| Arquivo | Onde aparece | Trocar por |
|---|---|---|
| `casa-de-bomba.webp` | /seguranca-contra-incendio | vistoria real da equipe |
| `inspecao-de-extintores.png` | /avcb | inspeção real |
| `extintor-e-prancheta.jpg` | /treinamentos | treinamento do sogro |
| `carimbo-em-documentos.jpg` | /regularizacoes | protocolo real |
| `joao-pessoa-vista-aerea.jpg` | home | foto própria ou licenciada |

O teste `e2e/contraste-sobre-ilustracao.spec.ts` já cobre estas imagens:
foto é muito mais clara que desenho, e ele falha se o texto por cima perder
contraste.
