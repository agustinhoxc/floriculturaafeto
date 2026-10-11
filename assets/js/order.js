/* ==========================================================================
   Pedido: lista de itens guardada no navegador e enviada pelo WhatsApp.
   Não há pagamento nem envio automático: a mensagem é aberta no WhatsApp
   e o cliente confirma o envio por lá.
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "afeto-pedido-v1";
  var A, C, store, items = [], sheet;

  function load() {
    if (!store) return;
    try { items = JSON.parse(store.getItem(KEY)) || []; } catch (e) { items = []; }
    items = items.filter(function (it) { return C.find(it.id); });
  }
  function save() { if (store) try { store.setItem(KEY, JSON.stringify(items)); } catch (e) { /* armazenamento indisponível */ } }
  function total() { return items.reduce(function (n, it) { return n + it.qty; }, 0); }

  function updateBadges(bump) {
    var n = total();
    document.querySelectorAll("[data-order-count]").forEach(function (b) {
      b.textContent = n; b.hidden = n === 0;
    });
    document.querySelectorAll("[data-order-open]").forEach(function (t) {
      t.setAttribute("aria-label", n ? "Abrir pedido, " + n + (n === 1 ? " item" : " itens") : "Abrir pedido, vazio");
      if (bump) { t.classList.remove("is-bumped"); void t.offsetWidth; t.classList.add("is-bumped"); }
    });
  }

  function add(id) {
    var p = C.find(id); if (!p) return;
    var it = items.filter(function (i) { return i.id === id; })[0];
    if (it) it.qty = Math.min(it.qty + 1, 20); else items.push({ id: id, qty: 1 });
    save(); updateBadges(true); renderList();
    document.querySelectorAll('[data-add="' + id + '"]').forEach(function (b) {
      if (!b.classList.contains("btn-add")) return;
      var label = b.querySelector("span");
      b.classList.add("is-added");
      if (label) label.textContent = "Adicionado";
      setTimeout(function () { b.classList.remove("is-added"); if (label) label.textContent = "Adicionar ao pedido"; }, 1800);
    });
    A.toast(p.name + " foi adicionado ao pedido.", { label: "Ver pedido", onClick: open });
  }

  function setQty(id, qty) {
    items = items.map(function (i) { return i.id === id ? { id: id, qty: qty } : i; }).filter(function (i) { return i.qty > 0; });
    save(); updateBadges(false); renderList();
  }

  /* ---------- painel ---------- */
  function build() {
    sheet = document.createElement("dialog");
    sheet.className = "sheet";
    sheet.setAttribute("aria-labelledby", "order-title");
    var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    var min = today.toISOString().slice(0, 10);
    sheet.innerHTML =
      '<div class="sheet__head"><h2 id="order-title">Seu pedido</h2>' +
        '<button type="button" class="icon-btn" data-close aria-label="Fechar pedido">' + A.icon("i-close") + "</button></div>" +
      '<form class="sheet__body" novalidate data-order-form>' +
        '<ul class="order-list" data-order-list aria-live="polite"></ul>' +
        '<div class="order-empty" data-order-empty hidden>' +
          '<p class="order-empty__title">Seu pedido ainda está vazio.</p>' +
          '<p>Escolha flores no catálogo ou conte direto pelo WhatsApp o que você imagina.</p>' +
          '<a class="btn btn-ghost btn-sm" href="' + A.root + 'arranjos/">Ver arranjos</a>' +
        "</div>" +
        '<div class="order-fields" data-order-fields style="display:grid;gap:1.25rem">' +
          '<div class="field" data-field="nome"><label for="o-nome">Seu nome</label>' +
            '<input class="input" id="o-nome" name="nome" autocomplete="name" required maxlength="80">' +
            '<span class="field__error" id="o-nome-err">Escreva seu nome para a loja saber com quem está falando.</span></div>' +
          '<fieldset class="choice-group"><legend class="field__legend" style="font-size:var(--t-sm);font-weight:600">Como prefere receber?</legend>' +
            '<div class="choice-group__opts">' +
              '<label class="choice"><input type="radio" name="receber" value="retirada" checked>Retirar na loja</label>' +
              '<label class="choice"><input type="radio" name="receber" value="entrega">Entrega</label>' +
            "</div></fieldset>" +
          '<div class="field" data-delivery hidden><label for="o-end">Endereço ou bairro da entrega</label>' +
            '<textarea class="textarea" id="o-end" name="endereco" maxlength="240" rows="2" style="min-height:80px"></textarea>' +
            '<span class="field__hint">A loja confirma pelo WhatsApp se atende a região e o valor da entrega.</span>' +
            '<span class="field__error">Informe o endereço ou bairro para a loja avaliar a entrega.</span></div>' +
          '<div class="field"><label for="o-data">Para quando? <span class="opt">(opcional)</span></label>' +
            '<input class="input" type="date" id="o-data" name="data" min="' + min + '"></div>' +
          '<div class="field"><label for="o-cartao">Mensagem do cartão <span class="opt">(opcional)</span></label>' +
            '<textarea class="textarea" id="o-cartao" name="cartao" maxlength="300" rows="3"></textarea></div>' +
          '<div class="field"><label for="o-obs">Cores, ajustes ou observações <span class="opt">(opcional)</span></label>' +
            '<textarea class="textarea" id="o-obs" name="obs" maxlength="400" rows="2" style="min-height:80px"></textarea></div>' +
          '<div class="form-status" data-order-status role="status"></div>' +
        "</div>" +
      "</form>" +
      '<div class="sheet__foot" data-order-foot>' +
        '<button type="button" class="btn btn-primary btn-block" data-order-send>' + A.icon("i-whatsapp", "icon--fill") + "<span>Enviar pedido pelo WhatsApp</span></button>" +
        '<p class="order-note">A loja confirma disponibilidade, valores e prazo pela conversa. Nada é cobrado pelo site.</p>' +
        '<button type="button" class="btn-text" data-order-clear hidden>Limpar pedido</button>' +
      "</div>";
    document.body.appendChild(sheet);

    sheet.addEventListener("click", function (e) {
      if (e.target === sheet || e.target.closest("[data-close]")) { sheet.close(); return; }
      var b = e.target.closest("[data-qty]");
      if (b) {
        var id = b.getAttribute("data-id"), it = items.filter(function (i) { return i.id === id; })[0];
        if (it) setQty(id, Math.max(0, Math.min(20, it.qty + Number(b.getAttribute("data-qty")))));
      }
      var r = e.target.closest("[data-remove]");
      if (r) setQty(r.getAttribute("data-remove"), 0);
    });
    sheet.addEventListener("close", function () { document.body.classList.remove("is-locked"); });
    sheet.querySelector("[data-order-send]").addEventListener("click", send);
    sheet.querySelector("[data-order-clear]").addEventListener("click", function () {
      items = []; save(); updateBadges(false); renderList(); status("", "");
      sheet.querySelector("[data-order-form]").reset(); toggleDelivery();
    });
    sheet.querySelector("[data-order-form]").addEventListener("submit", function (e) { e.preventDefault(); send(); });
    sheet.querySelectorAll('input[name="receber"]').forEach(function (r) { r.addEventListener("change", toggleDelivery); });
    sheet.querySelector("#o-nome").addEventListener("input", function () { this.closest(".field").classList.remove("is-invalid"); this.removeAttribute("aria-invalid"); });
  }

  function toggleDelivery() {
    var ent = sheet.querySelector('input[name="receber"]:checked').value === "entrega";
    sheet.querySelector("[data-delivery]").hidden = !ent;
  }

  function renderList() {
    if (!sheet) return;
    var ul = sheet.querySelector("[data-order-list]");
    var emptyBox = sheet.querySelector("[data-order-empty]");
    var fields = sheet.querySelector("[data-order-fields]");
    var foot = sheet.querySelector("[data-order-foot]");
    emptyBox.hidden = items.length > 0;
    fields.style.display = items.length ? "grid" : "none";
    foot.style.display = items.length ? "grid" : "none";
    sheet.querySelector("[data-order-clear]").hidden = items.length === 0;
    ul.innerHTML = items.map(function (it) {
      var p = C.find(it.id);
      return '<li class="order-item">' +
        '<img src="' + C.imgSrc(p) + '" alt="" width="64" height="80" style="background:' + (p.tone || "") + '">' +
        "<div><p class=\"order-item__cat\">" + A.esc(C.catLabel(p)) + '</p><p class="order-item__name">' + A.esc(p.name) + "</p>" +
          '<div class="qty" role="group" aria-label="Quantidade de ' + A.esc(p.name) + '">' +
            '<button type="button" data-qty="-1" data-id="' + p.id + '" aria-label="Diminuir">' + A.icon("i-minus") + "</button>" +
            "<output aria-live=\"polite\">" + it.qty + "</output>" +
            '<button type="button" data-qty="1" data-id="' + p.id + '" aria-label="Aumentar">' + A.icon("i-plus") + "</button>" +
          "</div></div>" +
        '<button type="button" class="icon-btn order-item__remove" data-remove="' + p.id + '" aria-label="Remover ' + A.esc(p.name) + '">' + A.icon("i-trash") + "</button>" +
      "</li>";
    }).join("");
  }

  function status(kind, text) {
    var s = sheet.querySelector("[data-order-status]");
    s.className = "form-status" + (kind ? " is-visible form-status--" + kind : "");
    s.innerHTML = kind ? A.icon(kind === "ok" ? "i-check" : "i-info") + "<span>" + A.esc(text) + "</span>" : "";
  }

  function fmtDate(v) { if (!v) return ""; var p = v.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }

  function send() {
    if (!items.length) return;
    var f = sheet.querySelector("[data-order-form]");
    var nome = f.nome.value.trim();
    var receber = f.receber.value;
    var end = f.endereco.value.trim();
    var ok = true;
    var nf = f.nome.closest(".field");
    nf.classList.toggle("is-invalid", !nome);
    if (!nome) { f.nome.setAttribute("aria-invalid", "true"); f.nome.setAttribute("aria-describedby", "o-nome-err"); ok = false; }
    var df = sheet.querySelector("[data-delivery]");
    df.classList.toggle("is-invalid", receber === "entrega" && !end);
    if (receber === "entrega" && !end) ok = false;
    if (!ok) {
      status("erro", "Revise os campos destacados para enviar o pedido.");
      (!nome ? f.nome : f.endereco).focus();
      return;
    }
    var addr = A.cfg.business.address || {};
    var lines = ["Olá, Afeto! Quero fazer um pedido pelo site:", ""];
    items.forEach(function (it) { lines.push("• " + it.qty + "x " + C.find(it.id).name); });
    lines.push("", "Nome: " + nome);
    lines.push("Receber: " + (receber === "entrega" ? "Entrega em " + end : "Retirada na loja (" + (addr.unit || "") + ", " + (addr.venue || "") + ")"));
    if (f.data.value) lines.push("Para quando: " + fmtDate(f.data.value));
    if (f.cartao.value.trim()) lines.push('Mensagem do cartão: "' + f.cartao.value.trim() + '"');
    if (f.obs.value.trim()) lines.push("Observações: " + f.obs.value.trim());
    lines.push("", "Pode me confirmar disponibilidade e valores?");
    if (A.openWhatsApp(lines.join("\n"))) {
      status("ok", "Abrimos o WhatsApp com o seu pedido. Para concluir, envie a mensagem por lá.");
    }
  }

  function open() {
    if (!sheet) build();
    A.hideToast();
    renderList(); toggleDelivery();
    sheet.showModal();
    document.body.classList.add("is-locked");
  }

  document.addEventListener("DOMContentLoaded", function () {
    A = window.Afeto; C = window.AfetoCatalog;
    if (!C) return;
    store = A.storage();
    load(); updateBadges(false);
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-add]");
      if (a) { add(a.getAttribute("data-add")); return; }
      if (e.target.closest("[data-order-open]")) open();
    });
  });
})();
