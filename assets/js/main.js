/* ==========================================================================
   Afeto — utilitários compartilhados, cabeçalho, menu, WhatsApp e mídia
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.AFETO_CONFIG || {};
  var BIZ = CFG.business || {};
  var root = document.documentElement.getAttribute("data-root") || "./";

  document.documentElement.classList.add("js");

  /* ---------- utilitários ---------- */
  function waLink(text) {
    if (!BIZ.whatsapp) return null;
    return "https://wa.me/" + BIZ.whatsapp + "?text=" + encodeURIComponent(text || CFG.messages.default);
  }
  function msg(key, vars) {
    var t = (CFG.messages && CFG.messages[key]) || CFG.messages.default;
    Object.keys(vars || {}).forEach(function (k) { t = t.split("{" + k + "}").join(vars[k]); });
    return t;
  }
  function openWhatsApp(text) {
    var url = waLink(text);
    if (!url) { toast("O WhatsApp da loja ainda não foi configurado."); return false; }
    var w = window.open(url, "_blank", "noopener");
    if (!w) window.location.href = url;
    return true;
  }
  function storage() {
    try { var k = "__afeto"; localStorage.setItem(k, "1"); localStorage.removeItem(k); return localStorage; }
    catch (e) { return null; }
  }
  function icon(id, extra) {
    return '<svg class="icon ' + (extra || "") + '" aria-hidden="true"><use href="#' + id + '"></use></svg>';
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- toast ---------- */
  var toastEl, toastTimer;
  function toast(text, action) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = "<span>" + esc(text) + "</span>";
    if (action) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = action.label;
      b.addEventListener("click", function () { hide(); action.onClick(); });
      toastEl.appendChild(b);
    }
    requestAnimationFrame(function () { toastEl.classList.add("is-visible"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hide, 4200);
  }
  function hide() { if (toastEl) toastEl.classList.remove("is-visible"); }

  /* ---------- preencher dados da configuração ---------- */
  function nb(s) { return String(s || "").replace(/-/g, "\u2011"); } // hífen que não quebra linha
  function fillConfig() {
    var a = BIZ.address || {};
    var values = {
      phoneDisplay: BIZ.phoneDisplay,
      addressLine: a.street ? a.street + " — " + nb(a.unit) : null,
      addressCity: a.district ? a.district + ", " + a.city + " – " + a.state + ", " + nb(a.zip) : null,
      venue: a.venue,
      hours: BIZ.hours,
      email: BIZ.email,
      cnpj: BIZ.cnpj ? "CNPJ " + BIZ.cnpj : null,
      tiktokHandle: BIZ.social && BIZ.social.tiktokHandle,
      instagramHandle: BIZ.social && BIZ.social.instagramHandle,
      year: String(new Date().getFullYear())
    };
    document.querySelectorAll("[data-config]").forEach(function (el) {
      var v = values[el.getAttribute("data-config")];
      if (v) el.textContent = v;
      else if (el.hasAttribute("data-hide-empty")) (el.closest("[data-config-wrap]") || el).hidden = true;
    });

    var hrefs = {
      maps: BIZ.mapsUrl,
      tiktok: BIZ.social && BIZ.social.tiktok,
      instagram: BIZ.social && BIZ.social.instagram,
      email: BIZ.email ? "mailto:" + BIZ.email : null,
      tel: BIZ.whatsapp ? "tel:+" + BIZ.whatsapp : null
    };
    document.querySelectorAll("[data-href]").forEach(function (el) {
      var v = hrefs[el.getAttribute("data-href")];
      if (v) el.setAttribute("href", v);
      else (el.closest("[data-config-wrap]") || el).hidden = true;
    });

    // links de WhatsApp com mensagem contextual
    document.querySelectorAll("[data-wa]").forEach(function (el) {
      var url = waLink(msg(el.getAttribute("data-wa") || "default"));
      if (url) {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      } else {
        el.classList.add("config-pending");
        el.setAttribute("title", "Configure o número do WhatsApp em assets/js/config.js");
      }
    });
  }

  /* ---------- cabeçalho e menu ---------- */
  function header() {
    var h = document.querySelector("[data-header]");
    if (!h) return;
    var onScroll = function () { h.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toggle = h.querySelector(".menu-toggle");
    var nav = document.getElementById("menu");
    if (!toggle || !nav) return;
    var mq = window.matchMedia("(max-width: 960px)");

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      toggle.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
      nav.classList.toggle("is-open", open);
      h.classList.toggle("menu-open", open);
      document.body.classList.toggle("is-locked", open);
      if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
    }
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a") && mq.matches) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    mq.addEventListener("change", function () { if (!mq.matches) setOpen(false); });
  }

  /* ---------- hero: entrada e vídeo ---------- */
  function hero() {
    var section = document.querySelector(".hero");
    if (section) requestAnimationFrame(function () { setTimeout(function () { section.classList.add("is-ready"); }, 60); });

    var video = document.querySelector("[data-hero-video]");
    var btn = document.querySelector("[data-video-toggle]");
    if (!video) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    function sync() {
      if (!btn) return;
      var paused = video.paused;
      btn.setAttribute("aria-label", paused ? "Reproduzir vídeo" : "Pausar vídeo");
      btn.setAttribute("aria-pressed", String(paused));
      btn.querySelector("use").setAttribute("href", paused ? "#i-play" : "#i-pause");
    }
    function tryPlay() { var p = video.play(); if (p && p.catch) p.catch(function () { sync(); }); }

    if (reduce.matches) { video.removeAttribute("autoplay"); video.pause(); }
    else tryPlay();
    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    if (btn) btn.addEventListener("click", function () { if (video.paused) tryPlay(); else video.pause(); });

    // pausa quando sai da tela para economizar bateria
    if ("IntersectionObserver" in window) {
      var userPaused = false;
      if (btn) btn.addEventListener("click", function () { userPaused = video.paused; });
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { if (!userPaused && !reduce.matches) tryPlay(); }
          else video.pause();
        });
      }, { threshold: .15 }).observe(video);
    }
    sync();
  }

  /* ---------- explore por sentimento: prévia ---------- */
  function feelings() {
    var list = document.querySelector("[data-feelings]");
    var frame = document.querySelector("[data-feelings-preview]");
    if (!list || !frame) return;
    var imgs = frame.querySelectorAll("img");
    var cap = document.querySelector("[data-feelings-caption]");
    var front = 0, current = null;
    var links = list.querySelectorAll("a[data-preview]");

    function show(a) {
      if (a === current) return;
      current = a;
      links.forEach(function (l) { l.classList.toggle("is-active", l === a); });
      var next = imgs[1 - front];
      next.src = a.getAttribute("data-preview");
      next.alt = "";
      var swap = function () {
        next.classList.remove("is-out");
        imgs[front].classList.add("is-out");
        front = 1 - front;
      };
      if (next.complete) swap(); else next.onload = swap;
      if (cap) cap.textContent = a.getAttribute("data-caption") || "";
    }
    links.forEach(function (a) {
      a.addEventListener("mouseenter", function () { show(a); });
      a.addEventListener("focus", function () { show(a); });
    });
    if (links[0]) { links[0].classList.add("is-active"); current = links[0]; if (cap) cap.textContent = links[0].getAttribute("data-caption"); }
  }

  /* ---------- mapa (carrega só quando aparece) ---------- */
  function map() {
    var box = document.querySelector("[data-map]");
    if (!box || !BIZ.mapsEmbed) return;
    function load() {
      if (box.querySelector("iframe")) return;
      var f = document.createElement("iframe");
      f.src = BIZ.mapsEmbed;
      f.title = "Mapa: Floricultura Afeto no Mercado Central de Belo Horizonte";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      f.setAttribute("allowfullscreen", "");
      box.appendChild(f);
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { load(); io.disconnect(); } }, { rootMargin: "200px" });
      io.observe(box);
    } else load();
  }

  /* ---------- WhatsApp flutuante: some quando um diálogo está aberto ---------- */
  function floatWa() {
    var fab = document.querySelector(".wa-float");
    if (!fab) return;
    var obs = new MutationObserver(function () {
      var open = document.querySelector("dialog[open]") || document.body.classList.contains("is-locked");
      fab.classList.toggle("is-hidden", !!open);
    });
    obs.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["open", "class"] });
  }

  window.Afeto = {
    cfg: CFG, root: root, waLink: waLink, msg: msg, openWhatsApp: openWhatsApp,
    storage: storage, toast: toast, hideToast: hide, icon: icon, esc: esc
  };

  document.addEventListener("DOMContentLoaded", function () {
    fillConfig(); header(); hero(); feelings(); map(); floatWa();
  });
})();
