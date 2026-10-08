(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- theme toggle ---------- */
  var toggle = document.getElementById('theme-toggle');
  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function label() {
    if (toggle) toggle.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
  }
  if (!root.getAttribute('data-theme') && isDark()) root.setAttribute('data-theme', 'dark');
  label();
  if (toggle) toggle.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    label();
  });

  /* ---------- mobile menu ---------- */
  var btn = document.getElementById('menu-btn');
  var nav = document.getElementById('nav-links');
  function closeMenu() { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Open menu'); }
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); btn.focus(); } });
  }

  /* ---------- scroll: progress bar, nav shadow, timeline rail ---------- */
  var bar = document.getElementById('progress-bar');
  var navBar = document.getElementById('nav-bar');
  var timeline = document.getElementById('timeline');
  var rail = document.getElementById('rail-fill');
  var ticking = false;
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight;
    var y = scrollY;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
    if (navBar) navBar.classList.toggle('scrolled', y > 8);
    if (timeline && rail) {
      var r = timeline.getBoundingClientRect();
      var p = (innerHeight * 0.7 - r.top) / r.height;
      rail.style.transform = 'scaleY(' + Math.max(0, Math.min(1, p)) + ')';
    }
    ticking = false;
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- active nav link ---------- */
  var links = nav ? nav.querySelectorAll('a[href^="#"]') : [];
  if (hasIO && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && byId[en.target.id]) {
          links.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
          byId[en.target.id].classList.add('active');
          byId[en.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) navIO.observe(s); });
  }

  /* ---------- typed role line ---------- */
  var typed = document.getElementById('typed');
  var phrases = ['Azure and AWS infrastructure', 'Kubernetes platforms on AKS and EKS', 'Terraform for every environment', 'CI/CD pipelines with zero downtime', 'monitoring that catches problems early'];
  if (typed && !reduce) {
    var pi = 0, ci = phrases[0].length, deleting = true;
    setTimeout(function step() {
      var word = phrases[pi];
      if (deleting) {
        ci--;
        typed.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
        setTimeout(step, 28);
      } else {
        word = phrases[pi];
        ci++;
        typed.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(step, 2200); }
        else setTimeout(step, 55);
      }
    }, 2600);
  }

  /* ---------- count-up numbers ---------- */
  function fmt(n) { return n.toLocaleString('en-US'); }
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = pre + fmt(target) + suf; return; }
    var dur = 1400, t0 = null;
    function frame(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + fmt(Math.round(target * e)) + suf;
      if (k < 1) requestAnimationFrame(frame);
    }
    el.textContent = pre + '0' + suf;
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll('[data-count]');

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (hasIO) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        en.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    // counters outside reveal blocks (hero badge)
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { if (!el.closest('.reveal')) cio.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- spotlight on service cards ---------- */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.svc').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- pipeline run ---------- */
  var pipe = document.getElementById('pipe');
  var term = document.getElementById('term');
  var status = document.getElementById('pipe-status');
  var lines = [
    ['p', '$ ', 'docker build -t api:1.42 .'],
    ['g', '', '✓ image built, 214 tests passed'],
    ['p', '$ ', 'trivy image api:1.42'],
    ['g', '', '✓ 0 critical, 0 high vulnerabilities'],
    ['p', '$ ', 'terraform apply -auto-approve'],
    ['g', '', '✓ Apply complete! Resources: 3 changed'],
    ['p', '$ ', 'kubectl rollout status deploy/api'],
    ['g', '', '✓ deployment "api" successfully rolled out']
  ];
  function esc(s) { return s.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function renderAll() {
    var stages = pipe.querySelectorAll('.stages li');
    stages.forEach(function (li) { li.className = 'done'; });
    term.innerHTML = lines.map(function (l) { return '<span class="' + l[0] + '">' + esc(l[1]) + '</span>' + (l[0] === 'p' ? esc(l[2]) : '<span class="g">' + esc(l[2]) + '</span>'); }).join('\n');
    status.textContent = 'Passed'; status.classList.add('ok');
  }
  function runPipeline() {
    var stages = pipe.querySelectorAll('.stages li');
    var html = '';
    var si = 0;
    function typeLine(li, done) {
      var l = lines[li];
      if (!l) return done();
      var prefix = '<span class="' + l[0] + '">' + esc(l[1]) + '</span>';
      var text = l[2], i = 0;
      if (l[0] === 'g') {
        html += (html ? '\n' : '') + '<span class="g">' + esc(text) + '</span>';
        term.innerHTML = html;
        return setTimeout(done, 380);
      }
      html += (html ? '\n' : '') + prefix;
      var base = html;
      (function tick() {
        i++;
        term.innerHTML = base + esc(text.slice(0, i));
        if (i < text.length) setTimeout(tick, 22);
        else { html = base + esc(text); setTimeout(done, 260); }
      })();
    }
    function nextStage() {
      if (si >= stages.length) { status.textContent = 'Passed'; status.classList.add('ok'); return; }
      var li = stages[si];
      li.className = 'run';
      var lineIdx = si < 4 ? si * 2 : -1;
      var finish = function () { li.className = 'done'; si++; setTimeout(nextStage, 180); };
      if (lineIdx >= 0) typeLine(lineIdx, function () { typeLine(lineIdx + 1, finish); });
      else setTimeout(finish, 900);
    }
    nextStage();
  }
  if (pipe && term && status) {
    if (reduce || !hasIO) renderAll();
    else {
      var pio = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { pio.disconnect(); setTimeout(runPipeline, 300); }
      }, { threshold: 0.45 });
      pio.observe(pipe);
    }
  }

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
