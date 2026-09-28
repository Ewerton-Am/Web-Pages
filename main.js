/* Ton Web · interações da landing page (sem bibliotecas externas) */
(function () {
  'use strict';
  var win = window, doc = document;
  var root = doc.querySelector('.tw-root');
  if (!root) return;

  var mq = function (q) { return win.matchMedia && win.matchMedia(q).matches; };
  var reduce = mq('(prefers-reduced-motion: reduce)');
  var fine = mq('(hover: hover) and (pointer: fine)');

  /* ---------- Dúvidas (acordeão, uma aberta por vez) ---------- */
  var items = root.querySelectorAll('.qa');
  items.forEach(function (qa) {
    var btn = qa.querySelector('.q');
    var ans = qa.querySelector('.a');
    btn.addEventListener('click', function () {
      var willOpen = btn.getAttribute('aria-expanded') !== 'true';
      items.forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.q').setAttribute('aria-expanded', 'false');
        o.querySelector('.a').hidden = true;
      });
      if (willOpen) {
        qa.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        ans.hidden = false;
      }
    });
  });

  /* ---------- Revelar ao rolar ---------- */
  if (!reduce && 'IntersectionObserver' in win) {
    root.classList.add('js-motion');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    root.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  }

  /* ---------- Barra de progresso de leitura ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    win.requestAnimationFrame(function () {
      var h = doc.documentElement;
      var max = (h.scrollHeight - win.innerHeight) || 1;
      root.style.setProperty('--p', String(Math.min(1, Math.max(0, win.scrollY / max))));
      ticking = false;
    });
  }
  win.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!fine || reduce) return;

  /* ---------- Cursor e holofote ---------- */
  var cur = root.querySelector('.cur');
  win.addEventListener('pointermove', function (e) {
    root.style.setProperty('--mx', e.clientX + 'px');
    root.style.setProperty('--my', e.clientY + 'px');
    root.classList.add('cur-on');
      if (cur) cur.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
  }, { passive: true });
  root.addEventListener('pointerover', function (e) {
    var hot = e.target.closest && e.target.closest('a,button,input');
    root.classList.toggle('cur-hot', !!hot);
  });

  /* ---------- Botões magnéticos ---------- */
  root.querySelectorAll('[data-mag]').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      el.style.transform = 'translate(' + (x * 0.28) + 'px,' + (y * 0.38) + 'px)';
    });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  });

  /* ---------- Inclinação 3D ---------- */
  root.querySelectorAll('[data-tilt]').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = 'perspective(1000px) rotateY(' + (px * 10) + 'deg) rotateX(' + (-py * 10) + 'deg)';
    });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  });
})();
