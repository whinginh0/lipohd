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
    var carousel = group.previousElementSibling;
    var track = carousel && carousel.querySelector('.marquee-track');
    if (!track) return;
    var timer;
    function move(reverse) {
      track.classList.toggle('is-reverse', reverse);
      track.classList.add('is-fast');
      clearTimeout(timer);
      timer = setTimeout(function () { track.classList.remove('is-fast'); }, 1800);
    }
    var prev = group.querySelector('[data-marquee-prev]');
    var next = group.querySelector('[data-marquee-next]');
    if (prev) prev.addEventListener('click', function () { move(true); });
    if (next) next.addEventListener('click', function () { move(false); });
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

