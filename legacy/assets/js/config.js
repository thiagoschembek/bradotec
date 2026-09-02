/* =====================================================================
   BRADOTEC — CONFIGURAÇÃO
   ---------------------------------------------------------------------
   ESTE É O ÚNICO ARQUIVO QUE PRECISA SER EDITADO PARA O SITE ENTRAR NO AR.
   Troque os valores entre aspas pelos dados reais da empresa.
   Tudo que estiver entre [COLCHETES] ainda é um placeholder.
   ===================================================================== */

window.BRADOTEC = {

  /* --- WhatsApp ---------------------------------------------------
     Formato: código do país + DDD + número, só dígitos.
     Exemplo de João Pessoa: "5583999998888"                          */
  whatsapp: "5583000000000",          // [NÚMERO DE WHATSAPP]

  /* --- Contato ---------------------------------------------------- */
  telefone:  "[TELEFONE]",
  email:     "[EMAIL]",
  endereco:  "[ENDEREÇO COMPLETO]",
  bairro:    "[BAIRRO]",
  cidade:    "João Pessoa",
  estado:    "PB",
  cep:       "[CEP]",
  cnpj:      "[CNPJ]",
  horario:   "[HORÁRIO DE ATENDIMENTO]",
  instagram: "[LINK DO INSTAGRAM]",

  /* --- Números de prova social ------------------------------------
     Só preencha com dados REAIS. Enquanto estiver com [ ],
     o site mostra o rótulo em modo rascunho.                          */
  provaSocial: {
    clientes:   "[Nº]",
    processos:  "[Nº]",
    condominios:"[Nº]",
    notaGoogle: "[NOTA]"
  },

  /* --- Rastreamento (opcional) -------------------------------------
     Cole aqui o ID quando for rodar campanha no Google.
     Deixe vazio ("") para não carregar nada.                          */
  googleAdsId: "",     // ex.: "AW-123456789"
  ga4Id: "",           // ex.: "G-XXXXXXX"

  /* --- Depoimentos reais ------------------------------------------
     Enquanto a lista estiver vazia, a seção nem aparece no site.
     Para publicar, adicione objetos assim:
     { texto: "...", autor: "Nome — Condomínio X, João Pessoa" }      */
  depoimentos: [],

  /* --- Mensagens pré-preenchidas do WhatsApp -----------------------
     A chave é usada no atributo data-wa="..." dos botões.             */
  mensagens: {
    padrao:      "Olá! Vim pelo site da Bradotec e gostaria de falar com um especialista.",
    orcamento:   "Olá! Gostaria de solicitar um orçamento para documentação/regularização da minha empresa.",
    incendio:    "Olá! Gostaria de saber como funciona a regularização contra incêndio.",
    condominio:  "Olá! Sou de um condomínio e preciso resolver pendências de regularização.",
    edificacao:  "Olá! Preciso regularizar uma edificação.",
    licenca:     "Olá! Preciso de uma licença e não sei quais documentos são necessários.",
    exigencia:   "Olá! Recebi uma exigência e preciso de ajuda para atender.",
    veicular:    "Olá! Preciso resolver uma pendência de documentação veicular.",
    frota:       "Olá! Tenho uma frota e gostaria de conhecer a gestão de documentação veicular.",
    vencimento:  "Olá! Tenho documentos vencendo e gostaria de organizar os prazos.",
    diagnostico: "Olá! Gostaria de solicitar o Diagnóstico de Regularização.",
    recorrente:  "Olá! Gostaria de conhecer a gestão documental recorrente da Bradotec.",
    comecar:     "Olá! Não sei por onde começar. Pode me orientar sobre o que preciso regularizar?",
    empresas:    "Olá! Gostaria de conhecer as soluções da Bradotec para empresas."
  }
};
