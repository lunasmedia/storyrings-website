/* Storyrings site: shared behaviour for every page */
(function () {
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

/* ---- mobile menu ---- */
const hdr = $('#hdr'), menuBtn = $('#menuBtn');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const open = hdr.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => { hdr.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded', 'false'); }));
}

/* ---- desktop mega menus: hover (with a short delay) or click, Esc / outside click closes ---- */
const menus = $$('.has-menu');
const setOpen = (li, open) => {
  li.classList.toggle('open', open);
  li.querySelector('.nav-trigger').setAttribute('aria-expanded', open);
};
const closeAll = except => menus.forEach(m => { if (m !== except) setOpen(m, false); });
const hoverable = matchMedia('(hover:hover) and (pointer:fine)').matches;
menus.forEach(li => {
  const btn = li.querySelector('.nav-trigger');
  let t = null;
  btn.addEventListener('click', () => { const open = !li.classList.contains('open'); closeAll(li); setOpen(li, open); });
  if (hoverable) {
    li.addEventListener('mouseenter', () => { clearTimeout(t); t = setTimeout(() => { closeAll(li); setOpen(li, true); }, 90); });
    li.addEventListener('mouseleave', () => { clearTimeout(t); t = setTimeout(() => setOpen(li, false), 160); });
  }
  li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) setOpen(li, false); });
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const open = menus.find(m => m.classList.contains('open'));
  if (open) { setOpen(open, false); open.querySelector('.nav-trigger').focus(); }
});
document.addEventListener('click', e => { if (!e.target.closest('.has-menu')) closeAll(); });

/* ---- announcement bar (dismissal remembered in this browser when storage is available) ---- */
const announce = $('#announce'), announceX = $('#announceX');
if (announce) {
  try { if (localStorage.getItem('sr-announce-closed') === '1') announce.classList.add('closed'); } catch (e) {}
  announceX.addEventListener('click', () => {
    announce.classList.add('closed');
    try { localStorage.setItem('sr-announce-closed', '1'); } catch (e) {}
  });
}

/* ---- reveal on scroll ---- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .14, rootMargin: '0px 0px -40px 0px' });
$$('.reveal, .chart').forEach(el => io.observe(el));

/* ---- header, progress bar, orb parallax ---- */
const prog = $('#progress'), orbs = $$('.orb');
let ticking = false;
function onScroll(){
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  hdr.classList.toggle('scrolled', y > 20);
  if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
  if (!reduced) orbs.forEach(o => o.style.translate = '0 ' + (y * o.dataset.depth / 100) + 'px');
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
onScroll();

/* ---- rotating headline ---- */
const swap = $('#swap');
if (swap && !reduced) {
  const words = ['what matters.', 'your drops.', 'your launches.', 'your news.', 'your best deals.'];
  let wi = 0;
  setInterval(() => {
    const cur = swap.querySelector('span:not(.out)');
    wi = (wi + 1) % words.length;
    const nx = document.createElement('span'); nx.textContent = words[wi]; nx.className = 'pre';
    swap.appendChild(nx); requestAnimationFrame(() => requestAnimationFrame(() => nx.className = ''));
    cur.className = 'out'; setTimeout(() => cur.remove(), 600);
  }, 2600);
}

/* ---- demo stories data ---- */
const groups = [
  { title: 'Flash Sale', label: '-30%', colors: ['#FF4F8B','#7A1E45'], badge: 'SALE', pulse: true, stories: [
    { h: '48 hours only', p: 'Up to 30% off the new season. Rings like this one grab attention first.', cta: 'Shop the sale' },
    { h: 'Hand-picked for you', p: 'Each story can link straight to a product or a page.', cta: 'See picks' } ] },
  { title: 'New in', label: 'DROP', colors: ['#FF9A3C','#7A3A08'], badge: 'NEW', stories: [
    { h: 'Just landed', p: 'Upload images, videos or GIFs from the dashboard. No app update needed.', cta: 'Explore' },
    { h: 'Swipe-worthy', p: 'Tap right for the next story, left to go back. Hold to pause.', cta: 'Explore' } ] },
  { title: 'How it works', label: 'HOW', colors: ['#8B5CF6','#2E1A63'], stories: [
    { h: '1. Add your app', p: 'Register your app or website and copy its token.', cta: 'Get early access', href: 'contact.html' },
    { h: '2. Create groups', p: 'Each group is a ring. Fill it with stories.', cta: 'Get early access', href: 'contact.html' },
    { h: '3. Drop in the SDK', p: 'A few lines of code and you are live.', cta: 'See the code', href: 'developers.html' } ] },
  { title: 'Live event', label: 'EVENT', colors: ['#22C1A8','#0D4A44'], badge: 'LIVE', stories: [
    { h: 'Happening now', p: 'Schedule groups to appear only between set dates and times.', cta: 'See use cases', href: 'use-cases.html' } ] },
  { title: 'Tips', label: 'TIPS', colors: ['#3C8BFF','#0E2A5C'], stories: [
    { h: 'Make it pop', p: 'Gradient, glow or rotating rings in your brand colours.', cta: 'Design a ring', href: 'platform.html#designer' } ] }
];
const gradOf = g => 'linear-gradient(160deg,' + g.colors[0] + ',' + g.colors[1] + ')';
function ringHTML(g, isSeen){
  return '<span class="ring' + (isSeen ? ' seen' : (g.pulse ? ' pulse' : '')) + '"><span class="ring-inner" style="background:' + gradOf(g) + '">' + g.label + '</span>' + (g.badge && !isSeen ? '<span class="badge">' + g.badge + '</span>' : '') + '</span><span class="ring-label">' + g.title + '</span>';
}

/* ---- static story bar (showcase screen) ---- */
const showBar = $('#showBar');
if (showBar) showBar.innerHTML = groups.slice(0, 4).map((g, i) => '<span class="ring-btn" style="--i:' + i + '">' + ringHTML(g, false) + '</span>').join('');

/* ---- interactive demo phone ---- */
const bar = $('#storyBar'), viewer = $('#viewer');
if (bar && viewer) {
  const seen = new Set();
  const barsEl = $('#bars'), slide = $('#vSlide'), vCta = $('#vCta'), vArt = $('#vArt');
  let gi = 0, si = 0, elapsed = 0, last = 0, raf = null, paused = false;
  const DURATION = 4500;
  const renderBar = () => {
    bar.innerHTML = '';
    groups.forEach((g, i) => {
      const b = document.createElement('button');
      b.className = 'ring-btn'; b.style.setProperty('--i', i); b.setAttribute('role', 'listitem');
      b.setAttribute('aria-label', g.title + ' stories' + (seen.has(i) ? ', watched' : ''));
      b.innerHTML = ringHTML(g, seen.has(i));
      b.addEventListener('click', () => openViewer(i));
      bar.appendChild(b);
    });
  };
  const openViewer = i => { gi = i; si = 0; viewer.classList.add('open'); document.body.classList.add('viewing'); show(); $('#vClose').focus(); };
  const closeViewer = () => { cancelAnimationFrame(raf); viewer.classList.remove('open'); document.body.classList.remove('viewing'); renderBar(); const btns = bar.querySelectorAll('.ring-btn'); (btns[gi] || bar).focus(); };
  function show(){
    cancelAnimationFrame(raf);
    const g = groups[gi], s = g.stories[si];
    seen.add(gi);
    viewer.style.background = 'linear-gradient(170deg,' + g.colors[0] + ',' + g.colors[1] + ')';
    vArt.innerHTML = '<i style="width:180px;height:180px;left:-40px;top:120px"></i><i style="width:120px;height:120px;right:-20px;top:60px;animation-delay:-3s"></i><i style="width:90px;height:90px;left:140px;top:300px;animation-delay:-6s"></i>';
    $('#vTitle').textContent = g.title; $('#vMini').style.background = gradOf(g);
    slide.classList.remove('anim'); void slide.offsetWidth; slide.classList.add('anim');
    slide.querySelector('h3').textContent = s.h; slide.querySelector('p').textContent = s.p; vCta.textContent = s.cta;
    barsEl.innerHTML = g.stories.map((_, k) => '<span><i style="width:' + (k < si ? 100 : 0) + '%"></i></span>').join('');
    elapsed = 0; last = performance.now();
    const fill = barsEl.children[si].firstChild;
    const tick = t => {
      if (!paused) elapsed += t - last;
      last = t;
      fill.style.width = Math.min(100, elapsed / DURATION * 100) + '%';
      if (elapsed >= DURATION) return next();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  function next(){ const g = groups[gi]; if (si < g.stories.length - 1) { si++; show(); } else if (gi < groups.length - 1) { gi++; si = 0; show(); } else closeViewer(); }
  function prev(){ if (si > 0) { si--; show(); } else if (gi > 0) { gi--; si = groups[gi].stories.length - 1; show(); } else show(); }
  let holdT = null, held = false, sx = 0;
  const setPause = p => { paused = p; viewer.classList.toggle('is-paused', p); };
  ['vNext', 'vPrev'].forEach(id => {
    const el = $('#' + id);
    el.addEventListener('pointerdown', e => { sx = e.clientX; held = false; holdT = setTimeout(() => { held = true; setPause(true); }, 220); });
    el.addEventListener('pointerup', e => {
      clearTimeout(holdT); setPause(false);
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 50) { if (dx < 0 && gi < groups.length - 1) { gi++; si = 0; show(); } else if (dx > 0 && gi > 0) { gi--; si = 0; show(); } return; }
      if (!held) (id === 'vNext' ? next : prev)();
    });
    el.addEventListener('pointerleave', () => { clearTimeout(holdT); setPause(false); });
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (id === 'vNext' ? next : prev)(); } });
  });
  $('#vClose').addEventListener('click', closeViewer);
  vCta.addEventListener('click', () => { const href = groups[gi].stories[si].href || 'contact.html'; closeViewer(); location.href = href; });
  viewer.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
  renderBar();

  const heroPhone = $('#demo-phone'), hero = $('.hero');
  if (hero && !reduced && matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', e => {
      const r = heroPhone.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / innerWidth, y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
      heroPhone.style.transform = 'perspective(1200px) rotateY(' + (x * 14) + 'deg) rotateX(' + (-y * 10) + 'deg)';
    });
    hero.addEventListener('pointerleave', () => heroPhone.style.transform = '');
  }
}

/* ---- marquee ---- */
const marquee = $('#marquee');
if (marquee) {
  const items = [['Flash sales','#FF4F8B'],['Product drops','#FF9A3C'],['Onboarding','#8B5CF6'],['Live events','#22C1A8'],['Lookbooks','#3C8BFF'],['Announcements','#E5383B'],['Match highlights','#FFC83D'],['Tutorials','#B6E43C']];
  const html = items.map(([t, c]) => '<span class="marquee-item"><span class="r" style="--c:' + c + '"></span>' + t + '</span>').join('');
  marquee.innerHTML = html + html.replace(/class="marquee-item"/g, 'class="marquee-item" aria-hidden="true"');
}

/* ---- sticky showcase ---- */
const steps = $$('.show-step'), screens = $$('.screen');
if (steps.length) {
  const sio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const n = +e.target.dataset.step;
    steps.forEach(s => s.classList.toggle('active', s === e.target));
    screens.forEach(s => s.classList.toggle('on', +s.dataset.screen === n));
    const tog = $('#demoTog');
    if (n === 1 && tog) setTimeout(() => tog.classList.add('on'), 700);
  }), { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(s => sio.observe(s));
}

/* ---- card spotlight ---- */
$$('.feature').forEach(f => f.addEventListener('pointermove', e => {
  const r = f.getBoundingClientRect();
  f.style.setProperty('--mx', (e.clientX - r.left) + 'px'); f.style.setProperty('--my', (e.clientY - r.top) + 'px');
}));

/* ---- ring designer ---- */
const dRing = $('#dRing');
if (dRing) {
  const D = { style: 'gradient', a: '#FF4F8B', b: '#FF9A3C', badge: 'NEW' };
  const dIn = $('#dIn'), dBdg = $('#dBdg');
  const names = { gradient: 'Gradient', spin: 'Rotating', glow: 'Glow', solid: 'Solid' };
  const draw = () => {
    dRing.className = 'd-ring' + (D.style === 'spin' ? ' spin' : D.style === 'glow' ? ' glow' : '');
    dRing.style.background = D.style === 'solid' || D.style === 'glow' ? D.a : D.style === 'spin' ? 'conic-gradient(from 0deg,' + D.a + ',' + D.b + ',' + D.a + ')' : 'linear-gradient(135deg,' + D.a + ',' + D.b + ')';
    dRing.style.setProperty('--glow', D.a + '99');
    dIn.style.background = 'linear-gradient(160deg,' + D.a + ',#141414 120%)';
    dBdg.textContent = D.badge || 'NEW'; dBdg.classList.toggle('hide', !D.badge);
    $('#dLabel').textContent = names[D.style] + ' ring · ' + (D.badge ? D.badge + ' badge' : 'no badge');
  };
  const seg = (id, fn) => $$('#' + id + ' button').forEach(b => b.addEventListener('click', () => { $$('#' + id + ' button').forEach(x => x.setAttribute('aria-pressed', x === b)); fn(b); draw(); }));
  seg('styleSeg', b => D.style = b.dataset.v);
  seg('colSeg', b => { D.a = b.dataset.a; D.b = b.dataset.b; });
  seg('bdgSeg', b => D.badge = b.dataset.v);
  draw();
}

/* ---- code tabs with typing ---- */
const pane = $('#codePane');
if (pane) {
  const CODE = {
    web: '<!-- 1. Load the SDK -->\n<script src="https://stories-dashboard.fly.dev/sdk/v1/stories.js" defer></' + 'script>\n\n<!-- 2. Place the story bar -->\n<div id="stories"></div>\n\n<script>\n  const stories = Stories.init({\n    token: "YOUR_WEBSITE_TOKEN"\n  });\n\n  stories.mount("#stories", {\n    onCtaClick: (e) => console.log(e.url)\n  });\n</' + 'script>',
    react: 'import { StoriesBar } from "@lunasmedia/storyrings-react";\n\nexport default function Home() {\n  return (\n    <StoriesBar\n      token="YOUR_WEBSITE_TOKEN"\n      onStoryOpen={(e) => track(e.groupId)}\n    />\n  );\n}',
    ios: 'import StoryRings\n\n// Start the SDK when the app launches\nStoriesClient.start(\n  token: "YOUR_APP_TOKEN",\n  apiURL: "https://stories-dashboard.fly.dev"\n)\n\n// Then place the bar in any SwiftUI view\nScrollView {\n  StoriesBar(\n    token: "YOUR_APP_TOKEN",\n    apiURL: "https://stories-dashboard.fly.dev"\n  )\n}',
    android: '// Android SDK: coming soon\nStoriesClient.start(\n  this,\n  token = "YOUR_APP_TOKEN",\n  apiUrl = "https://stories-dashboard.fly.dev"\n)\n\nColumn {\n  StoriesBar(\n    token = "YOUR_APP_TOKEN",\n    apiUrl = "https://stories-dashboard.fly.dev"\n  )\n}'
  };
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const hl = s => esc(s).replace(/(&lt;!--[\s\S]*?(?:--&gt;|$))|(^[ \t]*\/\/.*$)|("[^"\n]*"?)|\b(import|from|export|default|function|return|let|val|const)\b/gm,
    (m, com, line, str) => '<span class="' + (com || line ? 'c-c' : str ? 'c-s' : 'c-k') + '">' + m + '</span>');
  let curKey = 'web', timer = null, typed = false;
  const setCode = (k, animate) => {
    curKey = k; clearInterval(timer);
    const full = CODE[k];
    if (!animate || reduced) { pane.innerHTML = hl(full); return; }
    let n = 0;
    timer = setInterval(() => {
      n = Math.min(full.length, n + 3);
      pane.innerHTML = hl(full.slice(0, n)) + (n < full.length ? '<span class="caret"></span>' : '');
      if (n >= full.length) clearInterval(timer);
    }, 16);
  };
  new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting && !typed) { typed = true; setCode('web', true); o.disconnect(); } }), { threshold: .4 }).observe(pane);
  const tabs = $$('.tab');
  const selectTab = t => { tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; }); t.focus(); typed = true; setCode(t.dataset.k, true); };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') selectTab(tabs[(i + 1) % tabs.length]);
      if (e.key === 'ArrowLeft') selectTab(tabs[(i - 1 + tabs.length) % tabs.length]);
    });
  });
  const copyBtn = $('#copyBtn');
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(CODE[curKey]); copyBtn.textContent = 'Copied'; }
    catch { copyBtn.textContent = 'Copy failed'; }
    setTimeout(() => copyBtn.textContent = 'Copy', 1600);
  });
}

/* ---- contact form: opens the visitor's email app with the details filled in ---- */
const form = $('#accessForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const body = ['Name: ' + d.get('name'), 'Company: ' + d.get('company'), 'Email: ' + d.get('email'), 'Platform: ' + d.get('platform'), '', d.get('message') || ''].join('\n');
    location.href = 'mailto:' + form.dataset.to + '?subject=' + encodeURIComponent('Storyrings early access: ' + d.get('company')) + '&body=' + encodeURIComponent(body);
    $('#formStatus').textContent = 'Your email app should now open with your details filled in. Just press send.';
  });
}
})();
