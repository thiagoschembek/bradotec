/* =====================================================================
   BRADOTEC — comportamento do site (sem dependências externas)
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.BRADOTEC || {};
  var MSG = CFG.mensagens || {};

  /* ---------- 1. Links de WhatsApp ---------------------------------
     Todo elemento com data-wa="chave" vira um link wa.me com a
     mensagem correspondente já preenchida.                            */
  function waLink(texto) {
    var num = (CFG.whatsapp || "").replace(/\D/g, "");
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(texto);
  }

  function montarLinksWhats() {
    document.querySelectorAll("[data-wa]").forEach(function (el) {
      var chave = el.getAttribute("data-wa");
      var texto = MSG[chave] || MSG.padrao || "Olá!";
      el.setAttribute("href", waLink(texto));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
  }

  /* ---------- 2. Dados de contato dinâmicos ------------------------ */
  function preencherContato() {
    document.querySelectorAll("[data-cfg]").forEach(function (el) {
      var v = CFG[el.getAttribute("data-cfg")];
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-cfg-prova]").forEach(function (el) {
      var v = (CFG.provaSocial || {})[el.getAttribute("data-cfg-prova")];
      if (v) el.textContent = v;
    });
    var tel = document.querySelectorAll("[data-tel-link]");
    if (CFG.telefone && CFG.telefone.indexOf("[") === -1) {
      tel.forEach(function (a) { a.href = "tel:" + CFG.telefone.replace(/\D/g, ""); });
    }
    var mail = document.querySelectorAll("[data-mail-link]");
    if (CFG.email && CFG.email.indexOf("[") === -1) {
      mail.forEach(function (a) { a.href = "mailto:" + CFG.email; });
    }
  }

  /* ---------- 3. Menu mobile --------------------------------------- */
  function menu() {
    var btn = document.querySelector(".burger");
    var box = document.getElementById("menu-mobile");
    if (!btn || !box) return;
    btn.addEventListener("click", function () {
      var aberto = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!aberto));
      box.classList.toggle("is-open", !aberto);
    });
    box.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        btn.setAttribute("aria-expanded", "false");
        box.classList.remove("is-open");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && box.classList.contains("is-open")) {
        btn.setAttribute("aria-expanded", "false");
        box.classList.remove("is-open");
        btn.focus();
      }
    });
  }

  /* ---------- 4. Quiz de triagem ------------------------------------
     Não entrega diagnóstico técnico nem jurídico: apenas organiza a
     conversa e monta a mensagem de WhatsApp.                          */
  var PERGUNTAS = [
    {
      id: "objeto",
      titulo: "O que você precisa regularizar?",
      opcoes: [
        ["empresa", "Uma empresa ou comércio"],
        ["condominio", "Um condomínio ou edifício"],
        ["imovel", "Um imóvel ou edificação"],
        ["instituicao", "Uma igreja, escola ou instituição"],
        ["veiculo", "Um veículo ou uma frota"]
      ]
    },
    {
      id: "problema",
      titulo: "Qual é o problema hoje?",
      opcoes: [
        ["sem_licenca", "Falta licença, alvará ou documento"],
        ["exigencia", "Recebi uma exigência ou notificação"],
        ["vencido", "Tenho documento vencido ou vencendo"],
        ["incendio", "Preciso regularizar segurança contra incêndio"],
        ["nao_sei", "Ainda não sei exatamente o que falta"]
      ]
    },
    {
      id: "urgencia",
      titulo: "Qual é o nível de urgência?",
      opcoes: [
        ["imediata", "Imediata — há prazo correndo ou risco de multa"],
        ["semanas", "Nas próximas semanas"],
        ["planejando", "Estou apenas planejando"]
      ]
    },
    {
      id: "perfil",
      titulo: "Você é pessoa física ou empresa?",
      opcoes: [
        ["pj", "Empresa / condomínio / instituição"],
        ["pf", "Pessoa física"]
      ]
    }
  ];

  var ROTAS = {
    incendio: {
      titulo: "Sua situação começa pela Bradotec Fire",
      texto: "Pelo que você respondeu, o caminho passa por segurança contra incêndio e pânico: levantamento do que a edificação já possui, organização documental e acompanhamento do processo junto ao órgão competente.",
      itens: [
        "Levantamento da documentação existente",
        "Organização e protocolo do processo",
        "Acompanhamento de vistorias e exigências",
        "Projetos e laudos por profissionais legalmente habilitados, quando aplicável"
      ]
    },
    documentos: {
      titulo: "Sua situação começa pela Bradotec Documentos",
      texto: "Pelo que você respondeu, o caminho passa por licenças, certidões e regularização administrativa, com acompanhamento do processo do início ao fim.",
      itens: [
        "Verificação do que já existe e do que falta",
        "Licenças, certidões e protocolos",
        "Acompanhamento de exigências",
        "Controle de vencimentos depois da regularização"
      ]
    },
    veicular: {
      titulo: "Sua situação começa pela Bradotec Auto",
      texto: "Pelo que você respondeu, o caminho passa por documentação e licenciamento veicular, com acompanhamento das pendências até a conclusão.",
      itens: [
        "Levantamento das pendências do veículo",
        "Transferência, emplacamento, segunda via ou alteração de dados",
        "Acompanhamento do processo",
        "Gestão de documentação para frotas, quando for o caso"
      ]
    }
  };

  function quiz() {
    var raiz = document.getElementById("quiz");
    if (!raiz) return;

    var passo = 0;
    var respostas = {};
    var campo = raiz.querySelector("[data-quiz-campo]");
    var barra = raiz.querySelector("[data-quiz-barra]");
    var resultado = raiz.querySelector("[data-quiz-resultado]");
    var form = raiz.querySelector("[data-quiz-form]");

    function render() {
      var p = PERGUNTAS[passo];
      var html =
        '<p class="quiz__count">Pergunta ' + (passo + 1) + " de " + PERGUNTAS.length + "</p>" +
        "<fieldset><legend>" + p.titulo + '</legend><div class="quiz__opts">';
      p.opcoes.forEach(function (o, i) {
        var marcado = respostas[p.id] === o[0] ? " checked" : "";
        html +=
          '<label class="opt"><input type="radio" name="' + p.id + '" value="' + o[0] +
          '"' + marcado + (i === 0 ? "" : "") + "><span>" + o[1] + "</span></label>";
      });
      html += "</div></fieldset>";
      html +=
        '<div class="quiz__nav">' +
        (passo > 0 ? '<button type="button" class="btn btn--ghost btn--sm" data-quiz-voltar>Voltar</button>' : "") +
        '<button type="button" class="btn btn--primary" data-quiz-avancar>' +
        (passo === PERGUNTAS.length - 1 ? "Ver o caminho indicado" : "Continuar") +
        "</button></div>";
      campo.innerHTML = html;
      barra.style.width = Math.round((passo / PERGUNTAS.length) * 100) + "%";
      var first = campo.querySelector("input");
      if (first && passo > 0) first.focus();
    }

    function decidir() {
      if (respostas.objeto === "veiculo") return ROTAS.veicular;
      if (respostas.problema === "incendio") return ROTAS.incendio;
      return ROTAS.documentos;
    }

    function mostrarResultado() {
      var r = decidir();
      var resumo = PERGUNTAS.map(function (p) {
        var achou = p.opcoes.filter(function (o) { return o[0] === respostas[p.id]; })[0];
        return p.titulo + " " + (achou ? achou[1] : "-");
      }).join(" | ");

      var msg =
        "Olá! Respondi o questionário no site da Bradotec.\n\n" +
        PERGUNTAS.map(function (p) {
          var achou = p.opcoes.filter(function (o) { return o[0] === respostas[p.id]; })[0];
          return "• " + p.titulo + "\n  " + (achou ? achou[1] : "-");
        }).join("\n") +
        "\n\nGostaria de falar com um especialista.";

      resultado.innerHTML =
        "<h3>" + r.titulo + "</h3>" +
        "<p>" + r.texto + "</p>" +
        '<div class="result-box"><b>Próximos passos que costumamos seguir</b><ul>' +
        r.itens.map(function (i) { return "<li>" + i + "</li>"; }).join("") +
        "</ul></div>" +
        '<div class="btn-row" style="margin-top:6px">' +
        '<a class="btn btn--primary" href="' + waLink(msg) + '" target="_blank" rel="noopener">' +
        "Enviar minhas respostas no WhatsApp</a>" +
        '<button type="button" class="btn btn--ghost" data-quiz-reiniciar>Refazer</button></div>' +
        '<p class="disclaimer">Este resultado é uma orientação inicial para direcionar o atendimento. ' +
        "A definição do que se aplica ao seu caso depende de análise da documentação e, quando necessário, " +
        "de profissional legalmente habilitado.</p>";

      form.hidden = true;
      resultado.classList.add("is-visible");
      barra.style.width = "100%";
      resultado.setAttribute("tabindex", "-1");
      resultado.focus();
      registrar("quiz_concluido", resumo);
    }

    raiz.addEventListener("click", function (e) {
      var t = e.target;
      if (t.matches("[data-quiz-avancar]")) {
        var p = PERGUNTAS[passo];
        var sel = campo.querySelector('input[name="' + p.id + '"]:checked');
        if (!sel) {
          var aviso = raiz.querySelector("[data-quiz-aviso]");
          aviso.textContent = "Selecione uma opção para continuar.";
          aviso.style.display = "block";
          return;
        }
        raiz.querySelector("[data-quiz-aviso]").style.display = "none";
        respostas[p.id] = sel.value;
        if (passo === PERGUNTAS.length - 1) mostrarResultado();
        else { passo++; render(); }
      }
      if (t.matches("[data-quiz-voltar]")) { passo--; render(); }
      if (t.matches("[data-quiz-reiniciar]")) {
        passo = 0; respostas = {};
        resultado.classList.remove("is-visible");
        resultado.innerHTML = "";
        form.hidden = false;
        render();
      }
    });

    render();
  }

  /* ---------- 5. Formulário -> WhatsApp -----------------------------
     Não há back-end nesta versão. O formulário qualifica o lead e
     monta uma mensagem estruturada no WhatsApp.                       */
  function formulario() {
    var form = document.getElementById("form-lead");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (c) {
        var wrap = c.closest(".field");
        var vazio = !c.value.trim();
        wrap.classList.toggle("has-error", vazio);
        if (vazio && ok) { c.focus(); ok = false; }
      });
      if (!ok) return;

      var d = new FormData(form);
      var linhas = [
        "Olá! Enviei uma solicitação pelo site da Bradotec.",
        "",
        "Nome: " + d.get("nome"),
        "WhatsApp/Telefone: " + d.get("telefone"),
        "Empresa/Condomínio: " + (d.get("empresa") || "não informado"),
        "Perfil: " + d.get("perfil"),
        "Assunto: " + d.get("assunto"),
        "Cidade: " + (d.get("cidade") || "não informada"),
        "Prazo: " + d.get("prazo"),
        "",
        "Situação: " + (d.get("mensagem") || "não detalhada")
      ];
      registrar("form_enviado", String(d.get("assunto")));
      window.open(waLink(linhas.join("\n")), "_blank", "noopener");

      var aviso = document.getElementById("form-ok");
      if (aviso) { aviso.hidden = false; aviso.setAttribute("tabindex", "-1"); aviso.focus(); }
    });

    form.querySelectorAll("input, select, textarea").forEach(function (c) {
      c.addEventListener("input", function () {
        var w = c.closest(".field");
        if (w && c.value.trim()) w.classList.remove("has-error");
      });
    });
  }

  /* ---------- 6. Eventos de conversão -------------------------------
     Envia para o dataLayer / gtag se existirem. Sem ID configurado,
     não acontece nada e nada quebra.                                  */
  function registrar(evento, rotulo) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: evento, rotulo: rotulo || "" });
    if (typeof window.gtag === "function") {
      window.gtag("event", evento, { rotulo: rotulo || "" });
    }
  }

  function rastrearCliques() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-wa]");
      if (a) registrar("clique_whatsapp", a.getAttribute("data-wa"));
    });
  }


  /* ---------- 8. Prova social só aparece com dado real --------------
     Nada de número inventado: enquanto config.js tiver "[", a faixa
     de números fica oculta e vale a faixa de compromissos.            */
  function provaSocial() {
    var pv = CFG.provaSocial || {};
    var temNumero = Object.keys(pv).some(function (k) {
      var v = String(pv[k] || "");
      return v && v.indexOf("[") === -1;
    });
    var numeros = document.querySelector("[data-strip-numeros]");
    var claims = document.querySelector("[data-strip-claims]");
    if (temNumero && numeros) {
      numeros.hidden = false;
      numeros.querySelectorAll("[data-cfg-prova]").forEach(function (el) {
        var v = String(pv[el.getAttribute("data-cfg-prova")] || "");
        if (!v || v.indexOf("[") > -1) el.closest("li").remove();
      });
      if (claims) claims.remove();
    }

    var caixa = document.querySelector("[data-depoimentos]");
    var lista = document.querySelector("[data-depoimentos-lista]");
    var deps = CFG.depoimentos || [];
    if (caixa && lista && deps.length) {
      lista.innerHTML = deps.map(function (d) {
        return '<div class="testimonial"><p>\u201c' + d.texto + '\u201d</p>' +
               "<footer>" + d.autor + "</footer></div>";
      }).join("");
      caixa.hidden = false;
    }
  }

  /* ---------- 9. Google Ads / GA4 (só se houver ID no config) ------- */
  function medicao() {
    var id = CFG.googleAdsId || CFG.ga4Id;
    if (!id) return;
    var sc = document.createElement("script");
    sc.async = true;
    sc.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(sc);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    if (CFG.ga4Id) window.gtag("config", CFG.ga4Id);
    if (CFG.googleAdsId) window.gtag("config", CFG.googleAdsId);
  }

  /* ---------- 10. Inicialização ------------------------------------- */
  function init() {
    montarLinksWhats();
    preencherContato();
    provaSocial();
    medicao();
    menu();
    quiz();
    formulario();
    rastrearCliques();
    var ano = document.getElementById("ano");
    if (ano) ano.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
