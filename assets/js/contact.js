/* ==========================================================================
   Formulário "Personalize seu presente" (página de contato)
   Site estático: o formulário monta a mensagem e abre o WhatsApp oficial.
   Para receber por e-mail, veja as alternativas no README.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("[data-personalize-form]");
    if (!form) return;
    var A = window.Afeto, DATA = window.AFETO_CATALOG;
    var statusEl = form.querySelector("[data-form-status]");

    // opções a partir do catálogo
    var oc = form.querySelector("#p-ocasiao"), se = form.querySelector("#p-sentimento");
    oc.innerHTML = '<option value="">Escolha uma ocasião</option>' +
      Object.keys(DATA.occasions).map(function (k) { return '<option>' + DATA.occasions[k].label + "</option>"; }).join("") +
      "<option>Outra ocasião</option>";
    se.innerHTML = '<option value="">Ainda não sei</option>' +
      Object.keys(DATA.sentiments).map(function (k) { return "<option>" + DATA.sentiments[k].label + "</option>"; }).join("");

    var params = new URLSearchParams(location.search);
    var preO = params.get("ocasiao");
    if (preO && DATA.occasions[preO]) oc.value = DATA.occasions[preO].label;

    var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    form.querySelector("#p-data").min = today.toISOString().slice(0, 10);

    var delivery = form.querySelector("[data-delivery]");
    function toggleDelivery() { delivery.hidden = form.receber.value !== "entrega"; }
    form.querySelectorAll('input[name="receber"]').forEach(function (r) { r.addEventListener("change", toggleDelivery); });
    toggleDelivery();

    var rules = [
      { el: form.nome, test: function (v) { return v.trim().length >= 2; } },
      { el: form.ocasiao, test: function (v) { return !!v; } },
      { el: form.detalhes, test: function (v) { return v.trim().length >= 10; } },
      { el: form.endereco, test: function (v) { return form.receber.value !== "entrega" || v.trim().length > 3; } }
    ];
    function check(rule) {
      var ok = rule.test(rule.el.value);
      var field = rule.el.closest(".field");
      field.classList.toggle("is-invalid", !ok);
      if (ok) rule.el.removeAttribute("aria-invalid"); else rule.el.setAttribute("aria-invalid", "true");
      return ok;
    }
    rules.forEach(function (r) {
      r.el.addEventListener("blur", function () { if (r.el.value) check(r); });
      r.el.addEventListener("input", function () { if (r.el.closest(".field").classList.contains("is-invalid")) check(r); });
    });

    function setStatus(kind, text) {
      statusEl.className = "form-status is-visible form-status--" + kind;
      statusEl.innerHTML = A.icon(kind === "ok" ? "i-check" : "i-info") + "<span>" + A.esc(text) + "</span>";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = rules.filter(function (r) { return !check(r); });
      if (bad.length) {
        setStatus("erro", "Faltam algumas informações. Revise os campos destacados.");
        bad[0].el.focus();
        return;
      }
      var f = form, L = ["Olá, Afeto! Quero criar um presente especial:", ""];
      L.push("Nome: " + f.nome.value.trim());
      L.push("Ocasião: " + f.ocasiao.value);
      if (f.sentimento.value) L.push("Sentimento: " + f.sentimento.value);
      if (f.cores.value.trim()) L.push("Cores preferidas: " + f.cores.value.trim());
      if (f.investimento.value.trim()) L.push("Quanto pretendo investir: " + f.investimento.value.trim());
      if (f.data.value) { var p = f.data.value.split("-"); L.push("Para quando: " + p[2] + "/" + p[1] + "/" + p[0]); }
      L.push("Receber: " + (f.receber.value === "entrega" ? "Entrega em " + f.endereco.value.trim() : "Retirada na loja"));
      if (f.cartao.value.trim()) L.push('Mensagem do cartão: "' + f.cartao.value.trim() + '"');
      L.push("", "O que imagino: " + f.detalhes.value.trim());

      var btn = form.querySelector('[type="submit"]');
      btn.setAttribute("aria-busy", "true");
      if (A.openWhatsApp(L.join("\n"))) {
        setStatus("ok", "Abrimos o WhatsApp com a sua mensagem. Para concluir, envie a mensagem por lá.");
      }
      setTimeout(function () { btn.removeAttribute("aria-busy"); }, 800);
    });
  });
})();
