(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Loader with percentage ---------- */
  var loader = $('.loader');
  if (loader) {
    var seen = false;
    try { seen = sessionStorage.getItem('rj-loaded') === '1'; } catch (e) {}
    if (reduce || seen) { loader.style.display = 'none'; }
    else {
      var pc = $('.pc', loader), fill = $('.bar i', loader), p = 0;
      var t = setInterval(function () {
        p += Math.random() * 9 + 3;
        if (p >= 100) { p = 100; clearInterval(t); setTimeout(function () { loader.classList.add('done'); }, 260); }
        pc.textContent = Math.floor(p) + '%'; fill.style.transform = 'scaleX(' + p / 100 + ')';
      }, 60);
      try { sessionStorage.setItem('rj-loaded', '1'); } catch (e) {}
    }
  }

  /* ---------- Header, progress, scrollspy ---------- */
  var header = $('.site-header'), bar = $('.progress');
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('solid', y > 30);
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var spyLinks = $$('.menu a[data-spy]');
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    spyLinks.forEach(function (a) { map[a.dataset.spy] = a; });
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { spyLinks.forEach(function (a) { a.classList.remove('on'); }); if (map[e.target.id]) map[e.target.id].classList.add('on'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  }

  /* ---------- Mobile menu ---------- */
  var burger = $('.burger'), menu = $('.menu');
  if (burger && menu) {
    var close = function () { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
    burger.addEventListener('click', function () { burger.setAttribute('aria-expanded', menu.classList.toggle('open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------- Reveal ---------- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- Counters ---------- */
  var cs = $$('[data-count]');
  function runCount(el) {
    var end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, t0 = null;
    if (reduce) { el.textContent = end.toFixed(dec); return; }
    (function step(ts) {
      if (!t0) t0 = ts; var k = Math.min((ts - t0) / 1200, 1);
      el.textContent = (end * (1 - Math.pow(1 - k, 3))).toFixed(dec);
      if (k < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); } }); }, { threshold: 0.6 });
    cs.forEach(function (c) { co.observe(c); });
  } else { cs.forEach(runCount); }

  /* ---------- Typed roles ---------- */
  var ty = $('#typed');
  if (ty) {
    var words = JSON.parse(ty.dataset.words), wi = 0, ci = 0, del = false;
    if (reduce) { ty.textContent = words[0]; }
    else (function tick() {
      var w = words[wi];
      ty.textContent = w.slice(0, ci);
      if (!del && ci === w.length) { del = true; return setTimeout(tick, 1600); }
      if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
      ci += del ? -1 : 1; setTimeout(tick, del ? 38 : 78);
    })();
  }

  /* ---------- Hero slideshow ---------- */
  var slides = $$('.slides img');
  if (slides.length > 1 && !reduce) {
    var si = 0; slides[0].classList.add('on');
    setInterval(function () { slides[si].classList.remove('on'); si = (si + 1) % slides.length; slides[si].classList.add('on'); }, 5200);
  } else if (slides[0]) slides[0].classList.add('on');

  /* ---------- Particle network ---------- */
  var cv = $('#fx');
  if (cv && !reduce) {
    var cx = cv.getContext('2d'), W, H, pts = [], N;
    var size = function () { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; N = Math.min(70, Math.floor(W / 22)); pts = []; for (var i = 0; i < N; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }); };
    size(); window.addEventListener('resize', size);
    var vis = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(cv);
    (function draw() {
      if (vis) {
        cx.clearRect(0, 0, W, H);
        for (var i = 0; i < pts.length; i++) {
          var a = pts[i]; a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
          cx.fillStyle = 'rgba(46,230,166,.55)'; cx.beginPath(); cx.arc(a.x, a.y, 1.4, 0, 6.3); cx.fill();
          for (var j = i + 1; j < pts.length; j++) {
            var b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 120) { cx.strokeStyle = 'rgba(61,184,255,' + (.18 * (1 - d / 120)) + ')'; cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke(); }
          }
        }
      }
      requestAnimationFrame(draw);
    })();
  }

  /* ---------- Cursor glow + card tilt ---------- */
  var glow = $('.glow');
  if (glow && !reduce && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', function (e) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }, { passive: true });
    $$('.pcard').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = 'perspective(900px) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 6) + 'deg) translateY(-4px)';
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
  }

  /* ---------- Missing images ---------- */
  function mark(slot) {
    slot.classList.add('missing');
    var gb = slot.closest('.gallery-block');
    if (gb && !gb.querySelector('.slot:not(.missing)')) gb.classList.add('is-empty');
  }
  $$('.slot img').forEach(function (img) {
    var slot = img.closest('.slot'), pr = new Image();
    pr.onerror = function () { mark(slot); };
    pr.src = img.getAttribute('src');
  });

  /* ---------- Tabs ---------- */
  $$('[data-tabs]').forEach(function (wrap) {
    var btns = $$('[role="tab"]', wrap), panels = $$('[role="tabpanel"]', wrap);
    function select(i) {
      btns.forEach(function (b, j) { b.setAttribute('aria-selected', j === i); b.tabIndex = j === i ? 0 : -1; });
      panels.forEach(function (p, j) { p.hidden = j !== i; });
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { select(i); });
      b.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
        if (n === null) return; n = (n + btns.length) % btns.length; select(n); btns[n].focus();
      });
    });
    select(0);
  });

  /* ---------- Project filters ---------- */
  var fb = $$('.filters button');
  if (fb.length) {
    var cards = $$('[data-cats]'), empty = $('.empty');
    fb.forEach(function (b) {
      b.addEventListener('click', function () {
        fb.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        var f = b.dataset.filter, n = 0;
        cards.forEach(function (c) { var show = f === 'all' || c.dataset.cats.split(' ').indexOf(f) > -1; c.hidden = !show; if (show) n++; });
        if (empty) empty.hidden = n > 0;
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lb = document.createElement('div');
  lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML = '<button class="x" aria-label="Close">×</button><button class="pv" aria-label="Previous">‹</button><button class="nx" aria-label="Next">›</button><div><img alt=""><p></p></div>';
  document.body.appendChild(lb);
  var lbImg = $('img', lb), lbCap = $('p', lb), items = [], idx = 0, last;
  function show(i) { idx = (i + items.length) % items.length; var it = items[idx]; lbImg.src = it.src; lbImg.alt = it.alt; lbCap.textContent = it.cap; }
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; if (last) last.focus(); }
  $$('.gallery .slot, .shots .slot, .strip .slot').forEach(function (s) {
    s.tabIndex = 0; s.setAttribute('role', 'button');
    var go = function () {
      var group = $$('.slot:not(.missing)', s.parentElement);
      items = group.map(function (g) { var im = $('img', g), c = $('figcaption', g); return { src: im.currentSrc || im.src, alt: im.alt, cap: c ? c.textContent : im.alt }; });
      last = document.activeElement; show(group.indexOf(s)); lb.classList.add('open'); $('.x', lb).focus(); document.body.style.overflow = 'hidden';
    };
    s.addEventListener('click', go);
    s.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  $('.x', lb).addEventListener('click', closeLb);
  $('.pv', lb).addEventListener('click', function () { show(idx - 1); });
  $('.nx', lb).addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1);
  });
})();
