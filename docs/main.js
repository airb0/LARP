// LARP.Paris — motion, menu, show overlays.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  // ---------- Grain: seamless random-noise tile, generated once ----------
  const grain = document.querySelector('.grain');
  if (grain) {
    const size = 320; // device pixels; shown at 160 CSS px, so one noise pixel per device pixel on retina
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    grain.style.backgroundImage = `url(${c.toDataURL('image/png')})`;

    // Parallax: the grain layer drifts up at half the scroll speed. The layer is one tile (160px)
    // taller on each side, so shifting it modulo 160 never exposes an edge. Whole pixels keep it sharp.
    if (!reduce) {
      const TILE = 160, K = 0.5;
      let gTick = false, gy = 0;
      const drift = () => { grain.style.transform = `translate3d(0, ${-Math.round(gy * K) % TILE}px, 0)`; gTick = false; };
      document.addEventListener('scroll', (e) => {
        gy = e.target === document ? scrollY : e.target.scrollTop; // page or an open show overlay
        if (!gTick) { gTick = true; requestAnimationFrame(drift); }
      }, { passive: true, capture: true });
    }
  }

  // ---------- Reveal on scroll ----------
  const show = (el) => el.classList.add('in');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  const targets = '.split, .rise';
  document.querySelectorAll(targets).forEach((el) => {
    if (el.hasAttribute('data-now')) setTimeout(() => show(el), 120);
    else io.observe(el);
  });

  // ---------- Smooth scroll ----------
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  // ---------- Logo ----------
  // Big: as wide as the hero headline's longest line, sitting above it, scrolling with the page.
  // Small (header): fades in once the big one is fully out of view plus 24px, fades out on the way back.
  const slot = document.querySelector('.logo-slot');
  const topStrip = document.querySelector('.top-fade');
  const heroLogo = document.querySelector('.hero-logo img');
  const heroH1 = document.querySelector('.hero h1');
  const ASPECT = 624 / 970;

  const measure = () => {
    // Measure the glyphs only (text nodes), not the block boxes of the line spans.
    const rects = [];
    const walker = document.createTreeWalker(heroH1, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (!walker.currentNode.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(walker.currentNode);
      rects.push(...range.getClientRects());
    }
    const textW = Math.max(...rects.map((r) => r.right)) - Math.min(...rects.map((r) => r.left));
    const hero = heroH1.closest('.hero');
    const room = hero.offsetHeight - heroH1.offsetHeight - 64 - 28 - 72; // header, gap, breathing room
    heroLogo.style.width = Math.max(80, Math.min(textW, room / ASPECT)) + 'px';
    toggleSmall();
  };
  const toggleSmall = () => {
    const on = heroLogo.getBoundingClientRect().bottom < -24;
    slot.classList.toggle('on', on);
    topStrip?.classList.toggle('on', on);
    slot.tabIndex = on ? 0 : -1;
  };
  addEventListener('scroll', toggleSmall, { passive: true });
  addEventListener('resize', measure);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(measure);

  // ---------- Parallax: photos drift slower than the text above them ----------
  // Each [data-px] box holds an oversized image (see .px in CSS); the image shifts by up to
  // 9% of the box height depending on where the box sits in the viewport.
  const pxBoxes = [...document.querySelectorAll('[data-px]')];
  var parallax = () => {
    const vh = innerHeight;
    pxBoxes.forEach((box) => {
      const r = box.getBoundingClientRect();
      if (!r.height || r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1 .. 1
      box.querySelector('img').style.translate = `0 ${(-p * r.height * 0.09).toFixed(1)}px`;
    });
  };
  if (!reduce && pxBoxes.length) {
    let pxTick = false;
    const onScroll = () => { if (!pxTick) { pxTick = true; requestAnimationFrame(() => { parallax(); pxTick = false; }); } };
    document.addEventListener('scroll', onScroll, { passive: true, capture: true }); // capture: show overlays scroll on their own
    addEventListener('resize', onScroll);
    parallax();
  }

  // Keyboard focus stays inside an open menu / show: everything behind becomes inert.
  const behind = [document.querySelector('main'), document.querySelector('.hdr')];
  const setInert = (on) => behind.forEach((el) => { if (el) el.inert = on; });

  // ---------- Mobile menu ----------
  const menu = document.getElementById('menu');
  const menuBtn = document.querySelector('.menu-btn');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    root.classList.toggle('locked', open);
    setInert(open);
    if (lenis) open ? lenis.stop() : lenis.start();
    (open ? menu.querySelector('.close') : menuBtn).focus({ preventScroll: true });
  };
  menuBtn.addEventListener('click', () => setMenu(true));
  menu.querySelector('.close').addEventListener('click', () => setMenu(false));

  // In-page anchors (nav, menu, footer)
  document.querySelectorAll('a[href^="#"]:not([data-show])').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!document.getElementById(id)) return;
      e.preventDefault();
      if (menu.classList.contains('open')) { setMenu(false); setTimeout(() => scrollToId(id), 450); }
      else scrollToId(id);
    });
  });

  // ---------- Show overlays ----------
  const overlays = Object.fromEntries([...document.querySelectorAll('article.show')].map((a) => [a.dataset.show, a]));
  const cards = Object.fromEntries([...document.querySelectorAll('.card[data-show]')].map((c) => [c.dataset.show, c]));
  let current = null;
  let pushed = false;

  const cardImg = (id) => cards[id] && cards[id].querySelector('img');
  const topImg = (id) => overlays[id] && overlays[id].querySelector('.top img');
  const name = (el, n) => { if (el) el.style.viewTransitionName = n || ''; };

  const transition = (fn) => {
    if (!reduce && document.startViewTransition) {
      const vt = document.startViewTransition(fn);
      vt.ready.catch(() => {});
      return vt.finished.catch(() => {});
    }
    fn(); return Promise.resolve();
  };

  const revealTop = (el) => el.querySelectorAll('.top .split, .top .rise').forEach((n, i) => setTimeout(() => show(n), 250 + i * 150));

  const open = (id) => {
    if (!overlays[id] || current === id) return;
    const from = current;
    name(from ? topImg(from) : cardImg(id), 'show-img');
    return transition(() => {
      if (from) { overlays[from].hidden = true; name(topImg(from)); }
      name(cardImg(id));
      const el = overlays[id];
      el.hidden = false;
      el.scrollTop = 0;
      name(topImg(id), 'show-img');
      root.classList.add('locked');
      setInert(true);
      if (lenis) lenis.stop();
      current = id;
      revealTop(el);
      if (!reduce) requestAnimationFrame(parallax);
      el.querySelector('.x').focus({ preventScroll: true });
    }).then(() => name(topImg(id)));
  };

  const close = () => {
    if (!current) return;
    const id = current;
    name(topImg(id), 'show-img');
    return transition(() => {
      overlays[id].hidden = true;
      name(topImg(id));
      name(cardImg(id), 'show-img');
      root.classList.remove('locked');
      setInert(false);
      if (lenis) lenis.start();
      current = null;
      if (cards[id]) cards[id].focus({ preventScroll: true });
    }).then(() => name(cardImg(id)));
  };

  const fromHash = () => {
    const id = location.hash.slice(1);
    if (overlays[id]) open(id); else if (current) close();
  };

  document.querySelectorAll('a[data-show]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.dataset.show;
      if (current) history.replaceState(null, '', '#' + id);
      else { history.pushState(null, '', '#' + id); pushed = true; }
      open(id);
    });
  });
  document.querySelectorAll('article.show .x').forEach((b) => b.addEventListener('click', () => {
    if (pushed) { pushed = false; history.back(); }
    else { history.replaceState(null, '', location.pathname); close(); }
  }));
  addEventListener('popstate', fromHash);
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (menu.classList.contains('open')) setMenu(false);
    else if (current) document.querySelector(`#show-${current} .x`).click();
  });

  if (overlays[location.hash.slice(1)]) {
    const id = location.hash.slice(1);
    overlays[id].hidden = false; root.classList.add('locked'); setInert(true); current = id; revealTop(overlays[id]);
    if (lenis) lenis.stop();
  }
})();
