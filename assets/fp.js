'use strict';
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;

/* menu */
const menu = $('.menu'), nav = $('#navigation');
const setMenu = open => { menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); nav.classList.toggle('open', open); };
menu && menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav && $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); } });

/* header + progress */
const header = $('.header'), bar = $('.progress');
const onScroll = () => {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  header && header.classList.toggle('scrolled', y > 20);
  if (bar) bar.style.scale = (h > 0 ? y / h : 0) + ' 1';
  steps();
};
addEventListener('scroll', onScroll, { passive: true });

/* word-by-word headings */
$$('.words').forEach(el => {
  let i = 0;
  const walk = n => [...n.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(t => {
        if (!t) return;
        if (/^\s+$/.test(t)) { f.append(t); return; }
        const s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', i++); s.textContent = t; f.append(s);
      });
      c.replaceWith(f);
    } else if (c.nodeType === 1 && !c.classList.contains('grad')) walk(c);
    else if (c.nodeType === 1) { c.classList.add('w'); c.style.setProperty('--i', i++); c.style.display = 'inline-block'; }
  });
  walk(el);
});

/* reveal on scroll */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
  e.target.dispatchEvent(new CustomEvent('reveal'));
}), { threshold: .14, rootMargin: '0px 0px -40px 0px' });
$$('.rv,.words').forEach(el => io.observe(el));

/* rotating word in hero */
const rot = $$('.rotator span');
if (rot.length && !calm) {
  let k = 0;
  setInterval(() => {
    const cur = rot[k]; cur.classList.remove('on'); cur.classList.add('out');
    setTimeout(() => cur.classList.remove('out'), 650);
    k = (k + 1) % rot.length; rot[k].classList.add('on');
  }, 2300);
}

/* hero network canvas: nodes with money pulses travelling along the links */
const cv = $('#net');
if (cv && !calm) {
  const ctx = cv.getContext('2d'); let W, H, nodes = [], pulses = [], mx = .5, my = .5, dpr = Math.min(devicePixelRatio || 1, 2);
  const size = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(70, W * H / 16000)); nodes = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.6 + .6 })); };
  size(); addEventListener('resize', size);
  cv.parentElement.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; });
  const D = 150; let visible = true;
  new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(cv);
  const tick = () => {
    requestAnimationFrame(tick); if (!visible) return;
    ctx.clearRect(0, 0, W, H);
    const ox = (mx - .5) * 30, oy = (my - .5) * 30;
    for (const p of nodes) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < D) {
        ctx.strokeStyle = `rgba(130,140,255,${(1 - d / D) * .22})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x + ox, a.y + oy); ctx.lineTo(b.x + ox, b.y + oy); ctx.stroke();
        if (Math.random() < .0009 && pulses.length < 26) pulses.push({ a, b, t: 0 });
      }
    }
    for (const p of nodes) { ctx.fillStyle = 'rgba(190,200,255,.7)'; ctx.beginPath(); ctx.arc(p.x + ox, p.y + oy, p.r, 0, 7); ctx.fill(); }
    pulses = pulses.filter(q => (q.t += .014) < 1);
    for (const q of pulses) {
      const x = q.a.x + (q.b.x - q.a.x) * q.t + ox, y = q.a.y + (q.b.y - q.a.y) * q.t + oy;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 9); g.addColorStop(0, 'rgba(94,231,255,.95)'); g.addColorStop(1, 'rgba(94,231,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill();
    }
  };
  tick();
}

/* route race: illustrative quotes, best route wins, settles on Solana */
const corridors = [
  { send: '£100', cur: 'GBP', flag: 'PH', sym: '₱', routes: [['A', 'Bank payout', 'Local bank transfer', 7771.93], ['B', 'E-wallet', 'Mobile money', 7372.88], ['C', 'Stablecoin off-ramp', 'USDC to PHP', 7214.10], ['D', 'Card network', 'Push to card', 7050.55]] },
  { send: '£250', cur: 'GBP', flag: 'KE', sym: 'KSh ', routes: [['A', 'E-wallet', 'Mobile money', 41187.40], ['B', 'Bank payout', 'Local bank transfer', 40552.15], ['C', 'Stablecoin off-ramp', 'USDC to KES', 40930.62], ['D', 'Card network', 'Push to card', 39804.20]] },
  { send: '$500', cur: 'USD', flag: 'BR', sym: 'R$ ', routes: [['A', 'Instant bank', 'Local instant rail', 2741.30], ['B', 'Bank payout', 'Local bank transfer', 2702.85], ['C', 'Stablecoin off-ramp', 'USDC to BRL', 2756.12], ['D', 'E-wallet', 'Digital wallet', 2689.44]] },
];
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const sig = () => Array.from({ length: 44 }, () => B58[Math.random() * 58 | 0]).join('');
const fmt = (v, s) => s + v.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const race = $('#race');
if (race) {
  const list = $('#routes'), foot = $('#race-foot'), sigEl = $('#sig'); let c = 0;
  const run = () => {
    const k = corridors[c++ % corridors.length];
    $('#r-send').textContent = k.send; $('#r-cur').textContent = k.cur; $('#r-flag').textContent = k.flag;
    foot.classList.remove('done'); sigEl.textContent = 'Asking every route for a quote…';
    list.innerHTML = k.routes.map(r => `<div class="route"><span class="ico">${r[0]}</span><span class="rname">${r[1]}<small>Route ${r[0]} · ${r[2]}</small></span><span class="rval loading">${fmt(r[3], k.sym)}</span><span class="bar"></span><span class="badge">Best route</span></div>`).join('');
    const rows = $$('.route', list), max = Math.max(...k.routes.map(r => r[3])), min = Math.min(...k.routes.map(r => r[3]));
    rows.forEach((row, i) => setTimeout(() => {
      $('.rval', row).classList.remove('loading');
      $('.bar', row).style.width = (35 + 65 * (k.routes[i][3] - min) / (max - min || 1)) + '%';
    }, calm ? 0 : 500 + i * 380));
    setTimeout(() => {
      const best = k.routes.findIndex(r => r[3] === max);
      rows.forEach((row, i) => row.classList.add(i === best ? 'win' : 'lose'));
      sigEl.textContent = `Route ${k.routes[best][0]} delivers the most. Settling on Solana…`;
      setTimeout(() => { foot.classList.add('done'); sigEl.textContent = 'Settled · ' + sig().slice(0, 18) + '…'; }, 1100);
    }, calm ? 0 : 2300);
  };
  run();
  if (!calm) setInterval(run, 7200);
}

/* count-up + compare bars */
const countUp = el => {
  const to = +el.dataset.to, dec = +(el.dataset.dec || 0), pre = el.dataset.pre || '', t0 = performance.now(), dur = calm ? 1 : 1600;
  const step = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = pre + (to * e).toFixed(dec); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
};
$$('.count').forEach(el => { const host = el.closest('.rv'); host ? host.addEventListener('reveal', () => countUp(el), { once: true }) : countUp(el); });
const cmp = $('#compare');
cmp && cmp.addEventListener('reveal', () => $$('.cmp-fill', cmp).forEach((f, i) => setTimeout(() => f.style.width = f.dataset.w + '%', 300 + i * 250)), { once: true });

/* steps: the line runs from the first icon to the last (under the icons), a coin travels it with scroll */
const stepsEl = $('#steps');
function steps() {
  if (!stepsEl) return;
  const line = $('.steps-line', stepsEl), icos = $$('.s-ico', stepsEl), box = stepsEl.getBoundingClientRect();
  const c = icos.map(i => { const r = i.getBoundingClientRect(); return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top]; });
  const first = c[0], last = c[c.length - 1], vertical = Math.abs(last[0] - first[0]) < 4;
  line.classList.toggle('v', vertical);
  const len = vertical ? last[1] - first[1] : last[0] - first[0];
  Object.assign(line.style, vertical
    ? { left: first[0] - 1 + 'px', top: first[1] + 'px', width: '2px', height: len + 'px' }
    : { left: first[0] + 'px', top: first[1] - 1 + 'px', width: len + 'px', height: '2px' });
  let p;
  if (vertical) p = (innerHeight * .62 - (box.top + first[1])) / len;
  else p = (innerHeight * .78 - box.top) / (box.height * .9 + innerHeight * .25);
  p = Math.max(0, Math.min(1, p));
  stepsEl.style.setProperty('--p', (p * 100).toFixed(1) + '%');
  $$('.step', stepsEl).forEach((st, i) => { const at = len ? ((vertical ? c[i][1] - first[1] : c[i][0] - first[0]) / len) : 0; st.classList.toggle('lit', p >= at - .01); });
}
addEventListener('resize', steps);
onScroll();

/* claim phone: options and currencies cycle */
const opts = $$('.opt'), curs = $$('#claim-cur span'), amt = $('#claim-amt');
const amounts = [['PHP', '₱7,771.93'], ['GBP', '£98.40'], ['USD', '$131.60'], ['USDC', '131.60 USDC']];
if (opts.length && !calm) {
  let o = 0, cu = 0;
  setInterval(() => { opts.forEach(x => x.classList.remove('on')); o = (o + 1) % opts.length; opts[o].classList.add('on');
    if (o === 0) { cu = (cu + 1) % amounts.length; curs.forEach((x, i) => x.classList.toggle('on', i === cu)); amt.textContent = amounts[cu][1]; } }, 1700);
}

/* API snippet types itself when it scrolls into view */
const code = $('#code');
if (code) {
  const src = [
    ['c', '// Where the money starts and where it should land\n'],
    ['k', 'POST'], ['', ' /v1/quotes\n{\n  '],
    ['s', '"source"'], ['', ': { "type": '], ['s', '"bank_account"'], ['', ', "currency": '], ['s', '"GBP"'], ['', ', "country": '], ['s', '"GB"'], ['', ' },\n  '],
    ['s', '"destination"'], ['', ': { "type": '], ['s', '"ewallet"'], ['', ', "currency": '], ['s', '"PHP"'], ['', ',\n                   "country": '], ['s', '"PH"'], ['', ', "recipientKind": '], ['s', '"individual"'], ['', ' },\n  '],
    ['s', '"amount"'], ['', ': { "side": '], ['s', '"send"'], ['', ', "value": { "amount": '], ['s', '"10000"'], ['', ', "currency": '], ['s', '"GBP"'], ['', ' } }\n}\n\n'],
    ['c', '// FlexiPay asks every eligible route, then ranks them\n'],
    ['n', '200 OK'], ['', '  routes ranked by what the recipient receives\n'],
    ['', '  1. '], ['n', 'route A'], ['', '  →  '], ['s', 'PHP 7,771.93'], ['c', '   chosen\n'],
    ['', '  2. route B  →  PHP 7,372.88\n'],
  ];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const full = src.map(([c, t]) => c ? `<span class="${c}">${esc(t)}</span>` : esc(t)).join('');
  if (calm) code.innerHTML = full;
  else {
    const host = code.closest('.rv');
    const type = () => {
      let i = 0, chars = 0; const total = src.reduce((n, [, t]) => n + t.length, 0);
      const t = setInterval(() => {
        chars = Math.min(total, chars + 3); let left = chars, out = '';
        for (const [c, s] of src) { if (left <= 0) break; const part = s.slice(0, left); left -= s.length; out += c ? `<span class="${c}">${esc(part)}</span>` : esc(part); }
        code.innerHTML = out + '<span class="caret"></span>';
        if (chars >= total) clearInterval(t);
      }, 22);
    };
    host ? host.addEventListener('reveal', type, { once: true }) : type();
  }
}

/* cards: cursor spotlight; race card: tilt; buttons: magnetic */
if (fine && !calm) {
  $$('.card').forEach(c => c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px'); }));
  $$('.tilt').forEach(t => {
    t.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1)';
    t.addEventListener('pointermove', e => { const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; t.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`; });
    t.addEventListener('pointerleave', () => t.style.transform = '');
  });
  $$('.magnet').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * .18}px ${(e.clientY - r.top - r.height / 2) * .25}px`; });
    b.addEventListener('pointerleave', () => b.style.translate = '');
  });
}

/* early access form: opens a pre-filled email (nothing is sent by the website) */
const form = $('#enquiry-form');
form && form.addEventListener('submit', e => {
  e.preventDefault();
  const nameEl = $('#name'), name = nameEl.value.trim();
  if (!name) { nameEl.focus(); return; }
  const interest = $('#interest').value;
  const subject = 'FlexiPay early access — ' + interest;
  const body = 'Hello FlexiPay,\n\nMy name is ' + name + '. I’m interested in FlexiPay for ' + interest.toLowerCase() + '.\n\nHere’s what I’d like to use it for:\n\nCountries / currencies I’m interested in:\n\nPlease let me know about suitable early access.\n\nThank you,\n' + name;
  location.href = 'mailto:hello@getflexipay.app?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  $('#form-status').textContent = 'Your email app should open with a draft. Press send there to make your enquiry. If it doesn’t open, email hello@getflexipay.app directly.';
});
const year = $('#year'); if (year) year.textContent = new Date().getFullYear();
})();
