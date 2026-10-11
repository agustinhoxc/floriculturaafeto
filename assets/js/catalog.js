/* ==========================================================================
   Catálogo: cartões, destaques, filtros e detalhe do produto
   ========================================================================== */
(function () {
  "use strict";

  var A, DATA, CFG;

  function imgSrc(p) { return A.root + "assets/img/products/" + p.image + (/\.[a-z0-9]+$/i.test(p.image) ? "" : ".svg"); }
  function catLabel(p) { var c = DATA.categories[p.category]; return c ? c.singular : ""; }
  function find(id) { return DATA.products.filter(function (p) { return p.id === id; })[0]; }
  function priceText(p) { return p.price || CFG.catalog.priceFallback; }
  function productWa(p) { return A.waLink(A.msg("product", { produto: p.name })) || "#"; }

  function card(p, opts) {
    opts = opts || {};
    var lazy = opts.eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
    var flag = p.demo && CFG.catalog.showDemoNotice ? '<span class="product__flag">Ilustração</span>' : "";
    return (
      '<article class="product" data-id="' + p.id + '">' +
        '<button type="button" class="product__media" style="--tone:' + (p.tone || "") + '" data-product-open="' + p.id + '" aria-label="Ver detalhes: ' + A.esc(p.name) + '">' +
          '<img src="' + imgSrc(p) + '" alt="' + A.esc(p.name) + ': ' + A.esc(p.short) + '" width="800" height="1000" ' + lazy + '>' +
          flag +
          '<span class="product__view" aria-hidden="true">Ver composição</span>' +
        '</button>' +
        '<div class="product__body">' +
          '<p class="product__cat">' + A.esc(catLabel(p)) + '</p>' +
          '<h3 class="product__name"><button type="button" data-product-open="' + p.id + '">' + A.esc(p.name) + '</button></h3>' +
          '<p class="product__desc">' + A.esc(p.short) + '</p>' +
          (p.size ? '<p class="product__desc">' + A.esc(p.size) + '</p>' : "") +
          '<p class="product__price">' + A.esc(priceText(p)) + '</p>' +
          '<div class="product__actions">' +
            '<button type="button" class="btn btn-primary btn-sm btn-add" data-add="' + p.id + '">' + A.icon("i-plus") + '<span>Adicionar ao pedido</span></button>' +
            '<a class="product__wa" href="' + productWa(p) + '" target="_blank" rel="noopener">' + A.icon("i-whatsapp", "icon--fill") + '<span>Perguntar no WhatsApp</span></a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  /* ---------- destaques (início) ---------- */
  function featured() {
    var el = document.querySelector("[data-featured]");
    if (!el) return;
    var items = DATA.products.filter(function (p) { return p.featured; }).slice(0, 5);
    el.innerHTML = items.map(function (p) { return card(p); }).join("");
  }

  /* ---------- catálogo completo ---------- */
  function catalog() {
    var grid = document.querySelector("[data-catalog]");
    if (!grid) return;
    var chips = document.querySelector("[data-filter-cats]");
    var selS = document.querySelector("[data-filter-sentimento]");
    var selO = document.querySelector("[data-filter-ocasiao]");
    var count = document.querySelector("[data-filter-count]");
    var empty = document.querySelector("[data-catalog-empty]");
    var clear = document.querySelectorAll("[data-filter-clear]");

    var params = new URLSearchParams(location.search);
    var state = {
      categoria: DATA.categories[params.get("categoria")] ? params.get("categoria") : "",
      sentimento: DATA.sentiments[params.get("sentimento")] ? params.get("sentimento") : "",
      ocasiao: DATA.occasions[params.get("ocasiao")] ? params.get("ocasiao") : ""
    };

    // monta controles
    chips.innerHTML = '<button type="button" class="chip" data-cat="">Todos</button>' +
      Object.keys(DATA.categories).map(function (k) {
        return '<button type="button" class="chip" data-cat="' + k + '">' + DATA.categories[k].label + "</button>";
      }).join("");
    selS.innerHTML = '<option value="">Qualquer sentimento</option>' + Object.keys(DATA.sentiments).map(function (k) {
      return '<option value="' + k + '">' + DATA.sentiments[k].label + "</option>";
    }).join("");
    selO.innerHTML = '<option value="">Qualquer ocasião</option>' + Object.keys(DATA.occasions).map(function (k) {
      return '<option value="' + k + '">' + DATA.occasions[k].label + "</option>";
    }).join("");

    function render() {
      var list = DATA.products.filter(function (p) {
        return (!state.categoria || p.category === state.categoria) &&
               (!state.sentimento || p.sentiments.indexOf(state.sentimento) > -1) &&
               (!state.ocasiao || p.occasions.indexOf(state.ocasiao) > -1);
      });
      grid.innerHTML = list.map(function (p) { return card(p); }).join("");
      empty.classList.toggle("is-visible", list.length === 0);
      var n = list.length;
      count.textContent = n === 0 ? "Nenhuma sugestão com esses filtros" : n + (n === 1 ? " sugestão" : " sugestões");
      chips.querySelectorAll(".chip").forEach(function (c) {
        c.setAttribute("aria-pressed", String(c.getAttribute("data-cat") === state.categoria));
      });
      selS.value = state.sentimento;
      selO.value = state.ocasiao;
      var active = state.categoria || state.sentimento || state.ocasiao;
      clear.forEach(function (b) { b.hidden = !active; });

      var q = new URLSearchParams();
      Object.keys(state).forEach(function (k) { if (state[k]) q.set(k, state[k]); });
      var qs = q.toString();
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
    }

    chips.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      state.categoria = b.getAttribute("data-cat"); render();
    });
    selS.addEventListener("change", function () { state.sentimento = selS.value; render(); });
    selO.addEventListener("change", function () { state.ocasiao = selO.value; render(); });
    clear.forEach(function (b) {
      b.addEventListener("click", function () { state = { categoria: "", sentimento: "", ocasiao: "" }; render(); });
    });
    render();

    var item = params.get("item");
    if (item && find(item)) openProduct(item);
  }

  /* ---------- detalhe do produto ---------- */
  var dlg;
  function buildDialog() {
    dlg = document.createElement("dialog");
    dlg.className = "modal";
    dlg.setAttribute("aria-labelledby", "product-title");
    dlg.innerHTML =
      '<div class="modal__grid">' +
        '<div class="modal__media"><img alt="" width="800" height="1000"></div>' +
        '<div class="modal__content">' +
          '<button type="button" class="icon-btn modal__close" data-close aria-label="Fechar detalhes">' + A.icon("i-close") + "</button>" +
          '<p class="product__cat" data-f="cat"></p>' +
          '<h2 id="product-title" data-f="name"></h2>' +
          '<p class="modal__story" data-f="story"></p>' +
          '<div><h3 class="modal__h">Composição de referência</h3><ul class="modal__list" data-f="comp" style="margin-top:.6rem"></ul></div>' +
          '<div><h3 class="modal__h">Combina com</h3><ul class="tags" data-f="tags" style="margin-top:.6rem"></ul></div>' +
          '<p class="product__price" data-f="price"></p>' +
          '<div class="modal__actions">' +
            '<button type="button" class="btn btn-primary" data-f="add">' + A.icon("i-plus") + "<span>Adicionar ao pedido</span></button>" +
            '<a class="btn btn-ghost" data-f="wa" target="_blank" rel="noopener">' + A.icon("i-whatsapp", "icon--fill") + "<span>Perguntar no WhatsApp</span></a>" +
          "</div>" +
          '<p class="notice" data-f="notice">' + A.icon("i-info") + "<span>Imagem ilustrativa. As flores variam conforme a estação e a disponibilidade da loja; cores, tamanho e valor são confirmados pelo WhatsApp.</span></p>" +
        "</div>" +
      "</div>";
    document.body.appendChild(dlg);
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
    });
    dlg.addEventListener("close", function () { document.body.classList.remove("is-locked"); });
  }

  function openProduct(id) {
    var p = find(id); if (!p) return;
    if (!dlg) buildDialog();
    var q = function (k) { return dlg.querySelector('[data-f="' + k + '"]'); };
    var img = dlg.querySelector(".modal__media img");
    dlg.querySelector(".modal__media").style.background = p.tone || "";
    img.src = imgSrc(p); img.alt = p.name + ": " + p.short;
    q("cat").textContent = catLabel(p);
    q("name").textContent = p.name;
    q("story").textContent = p.story;
    q("comp").innerHTML = p.composition.map(function (c) { return "<li>" + A.esc(c) + "</li>"; }).join("");
    var base = A.root + "arranjos/";
    q("tags").innerHTML =
      p.sentiments.map(function (s) { return '<li><a href="' + base + "?sentimento=" + s + '">' + DATA.sentiments[s].label + "</a></li>"; }).join("") +
      p.occasions.map(function (o) { return '<li><a href="' + base + "?ocasiao=" + o + '">' + DATA.occasions[o].label + "</a></li>"; }).join("");
    q("price").textContent = priceText(p) + (p.size ? ", " + p.size : "");
    q("add").setAttribute("data-add", p.id);
    q("wa").href = productWa(p);
    q("notice").hidden = !(p.demo && CFG.catalog.showDemoNotice);
    dlg.showModal();
    document.body.classList.add("is-locked");
    dlg.querySelector(".modal__close").focus();
  }

  document.addEventListener("DOMContentLoaded", function () {
    A = window.Afeto; DATA = window.AFETO_CATALOG; CFG = A.cfg;
    if (!DATA) return;
    featured();
    catalog();
    document.addEventListener("click", function (e) {
      var o = e.target.closest("[data-product-open]");
      if (o) { e.preventDefault(); openProduct(o.getAttribute("data-product-open")); }
    });
  });

  window.AfetoCatalog = { find: function (id) { return find(id); }, imgSrc: function (p) { return imgSrc(p); }, catLabel: function (p) { return catLabel(p); } };
})();
