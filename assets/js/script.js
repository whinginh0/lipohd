/* ============================================================
   As Aventuras de Davi em Quadrinhos — Landing Page Scripts
   ============================================================ */

// 1. Atualizar data da oferta dinâmica
(function () {
  function updateOfferDate() {
    var dateEl = document.querySelector('[data-current-date]');
    if (!dateEl) return;

    var now = new Date();
    var day = String(now.getDate()).padStart(2, '0');
    var month = String(now.getMonth() + 1).padStart(2, '0');
    dateEl.textContent = day + '/' + month;
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateOfferDate);
  } else {
    updateOfferDate();
  }
})();

// 2. Interações principais (Carrosséis, FAQ Accordion, Animações de Scroll)
(function () {
  'use strict';

  /* ---------- Marquee direction controls ---------- */
  document.querySelectorAll('[data-marquee-control]').forEach(function (group) {
    var sec = group.closest('.sec') || group.parentElement;
    var tracks = sec ? sec.querySelectorAll('.marquee-track') : [];
    if (!tracks.length) return;
    var timer;
    function move(isNext) {
      tracks.forEach(function (track) {
        track.classList.add('is-fast');
      });
      clearTimeout(timer);
      timer = setTimeout(function () {
        tracks.forEach(function (track) { track.classList.remove('is-fast'); });
      }, 1800);
    }
    var prev = group.querySelector('[data-marquee-prev]');
    var next = group.querySelector('[data-marquee-next]');
    if (prev) prev.addEventListener('click', function () { move(false); });
    if (next) next.addEventListener('click', function () { move(true); });
  });

  /* ---------- Activity gallery carousel (mobile) ---------- */
  var track = document.querySelector('[data-gal-track]');
  if (track) {
    var prev = document.querySelector('[data-gal-prev]');
    var next = document.querySelector('[data-gal-next]');
    var step = function () {
      var card = track.querySelector('.gal-card');
      return card ? card.getBoundingClientRect().width + 26 : 300;
    };
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  }

  /* ---------- Testimonials carousel ---------- */
  var tTrack = document.querySelector('[data-testi-track]');
  if (tTrack) {
    var slides = tTrack.children.length;
    var idx = 0;
    var dotsWrap = document.querySelector('[data-testi-dots]');
    var tPrev = document.querySelector('[data-testi-prev]');
    var tNext = document.querySelector('[data-testi-next]');
    var dots = [];
    for (var i = 0; i < slides; i++) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Depoimento ' + (i + 1));
      (function (n) { b.addEventListener('click', function () { go(n); }); })(i);
      dotsWrap.appendChild(b);
      dots.push(b);
    }
    function go(n) {
      idx = (n + slides) % slides;
      tTrack.style.transform = 'translateX(' + (-idx * 100) + '%)';
      dots.forEach(function (d, j) { d.classList.toggle('on', j === idx); });
    }
    if (tPrev) tPrev.addEventListener('click', function () { go(idx - 1); auto(); });
    if (tNext) tNext.addEventListener('click', function () { go(idx + 1); auto(); });
    var timer;
    function auto() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 6500); }
    go(0); auto();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) { other.classList.remove('open'); other.querySelector('.faq-a').style.maxHeight = null; }
      });
      if (isOpen) { item.classList.remove('open'); a.style.maxHeight = null; }
      else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
})();

// 3. Rastreamento e Injeção de Parâmetros UTM nos Botões de Checkout (Kiwify, Greenn, Hotmart, etc.)
(function () {
  'use strict';

  var UTM_STORAGE_KEY = '__utm_tracking_params__';

  // Obtém os parâmetros da URL atual ou recupera do sessionStorage
  function getUtmParams() {
    var search = window.location.search;
    if (search && search.length > 1) {
      try {
        sessionStorage.setItem(UTM_STORAGE_KEY, search);
      } catch (e) {}
      return new URLSearchParams(search);
    }
    try {
      var stored = sessionStorage.getItem(UTM_STORAGE_KEY);
      if (stored) return new URLSearchParams(stored);
    } catch (e) {}
    return null;
  }

  // Verifica se o link é de compra/checkout (qualquer plataforma externa, GGCheckout, Kiwify, Greenn, Hotmart, etc.)
  function isCheckoutUrl(url, el) {
    if (!url) return false;
    var trimmed = url.trim();

    // Ignora âncoras internas (#oferta), javascript, mailto ou tel
    if (trimmed.startsWith('#') || trimmed.startsWith('javascript:') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
      return false;
    }

    // Se o elemento tiver atributo data-checkout ou estiver dentro da seção de planos/oferta
    if (el) {
      if (el.hasAttribute('data-checkout')) return true;
      if (el.closest('.plans') || el.closest('.plan') || el.closest('#oferta')) {
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true;
      }
    }

    // Qualquer link HTTP/HTTPS externo é tratado como checkout/destino de compra
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      try {
        var parsed = new URL(trimmed, window.location.origin);
        if (parsed.origin !== window.location.origin) {
          return true; // Link externo de pagamento
        }
      } catch (e) {
        return true;
      }
    }

    return false;
  }

  // Constrói a URL final de checkout mesclando os parâmetros sem duplicar
  function buildTrackingUrl(originalHref, params) {
    if (!originalHref || !params) return originalHref;
    try {
      var base = originalHref.split('#')[0];
      var hash = originalHref.indexOf('#') !== -1 ? '#' + originalHref.split('#')[1] : '';
      var urlParts = base.split('?');
      var baseUrl = urlParts[0];
      var existingQuery = urlParts[1] ? urlParts[1] : '';
      
      var targetParams = new URLSearchParams(existingQuery);

      // Injeta todos os parâmetros UTM da página
      params.forEach(function (val, key) {
        if (!targetParams.has(key)) {
          targetParams.set(key, val);
        }
      });

      // Mapeamento universal para GGCheckout, Kiwify, Greenn, Hotmart, etc.
      if (targetParams.has('utm_source') && !targetParams.has('src')) {
        targetParams.set('src', targetParams.get('utm_source'));
      }
      if (targetParams.has('utm_campaign') && !targetParams.has('sck')) {
        targetParams.set('sck', targetParams.get('utm_campaign'));
      }

      var queryString = targetParams.toString();
      return baseUrl + (queryString ? '?' + queryString : '') + hash;
    } catch (err) {
      return originalHref;
    }
  }

  // Atualiza todos os links de checkout na página
  function injectUtmsToCheckoutButtons() {
    var params = getUtmParams();
    if (!params) return;

    var links = document.querySelectorAll('a[href]');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && isCheckoutUrl(href, link)) {
        var newHref = buildTrackingUrl(href, params);
        if (newHref !== href) {
          link.setAttribute('href', newHref);
        }
      }
    });
  }

  // Intercepta o clique para garantir a injeção em tempo real antes do redirecionamento
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (href && isCheckoutUrl(href, link)) {
      var params = getUtmParams();
      if (params) {
        var finalHref = buildTrackingUrl(href, params);
        link.setAttribute('href', finalHref);
      }
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectUtmsToCheckoutButtons);
  } else {
    injectUtmsToCheckoutButtons();
  }
})();

