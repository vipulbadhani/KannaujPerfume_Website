/* Shared site shell: header + mega menu, mobile menu, search, cart drawer, footer,
   design switcher, scroll reveals, and the shop / product page renderers.
   Each theme folder styles the same markup through its own theme.css. */
(function () {
  const C = window.CATALOG, F = window.FAMILIES;
  const body = document.body, page = body.dataset.page || '', theme = body.dataset.theme || '';
  const THEMES = [['noir', 'Noir Royal'], ['ivory', 'Ivory Atelier'], ['velvet', 'Mughal Velvet']];
  const SIZES = [['50 ml · Eau de Parfum', 1], ['100 ml · Eau de Parfum', 1.65], ['12 ml · Pure Attar', .55]];
  const rupee = n => '₹ ' + Math.round(n).toLocaleString('en-IN');
  const sizePrice = (p, i) => Math.round(p.price * SIZES[i][1] / 100) * 100;
  const byId = id => C.find(p => p.id === id);
  const bottle = (p, extra) => window.bottleSVG(Object.assign({}, p.bottle, window.THEME_BOTTLE || {}, extra || {}));
  const $ = (s, r = document) => r.querySelector(s);
  const store = {
    get() { try { return JSON.parse(localStorage.getItem('kp_cart')) || []; } catch (e) { return []; } },
    set(v) { try { localStorage.setItem('kp_cart', JSON.stringify(v)); } catch (e) {} }
  };
  let cart = store.get();

  /* Scroll reveals — defined first because the shop renderer re-observes new cards */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  function observe() { document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el)); }

  /* ---------- Header, mega menu, mobile menu ---------- */
  const active = p => page === p ? ' class="active"' : '';
  const feat = byId('oudh-shahi');
  const header = `
<div class="announce">Complimentary engraving &amp; gift wrap on every order · Free shipping across India</div>
<header class="site-nav" id="siteNav">
  <button class="burger" id="burger" aria-label="Open menu"><span></span><span></span></button>
  <ul class="nav-l">
    <li class="has-mega"><a href="shop.html"${active('shop')}>Shop</a></li>
    <li><a href="product.html?id=oudh-shahi">Bestseller</a></li>
    <li><a href="heritage.html"${active('heritage')}>Heritage</a></li>
  </ul>
  <a class="brand" href="index.html">KANNAUJ<small>PERFUME</small></a>
  <ul class="nav-r">
    <li class="hide-m"><a href="contact.html"${active('contact')}>Contact</a></li>
    <li class="hide-m"><button data-open="search">Search</button></li>
    <li><button data-open="cart">Bag (<span data-count>0</span>)</button></li>
  </ul>
  <div class="mega" id="mega">
    <div><h6>Shop by family</h6>${F.map(f => `<a href="shop.html?f=${f.id}">${f.name}</a>`).join('')}</div>
    <div><h6>Bestsellers</h6>${C.slice(0, 5).map(p => `<a href="product.html?id=${p.id}">${p.name}</a>`).join('')}</div>
    <div><h6>Discover</h6><a href="heritage.html">Our Heritage</a><a href="heritage.html#craft">The Attar Craft</a><a href="contact.html">Book a Consultation</a><a href="contact.html#boutiques">Boutiques</a></div>
    <a class="mega-feat" href="product.html?id=${feat.id}"><div class="mf-b">${bottle(feat)}</div><span>Signature</span><b>${feat.name}</b><em>${rupee(feat.price)}</em></a>
  </div>
</header>
<div class="mmenu" id="mmenu">
  <nav>
    <a href="index.html">Home</a>
    <details><summary>Shop</summary>${F.map(f => `<a href="shop.html?f=${f.id}">${f.name}</a>`).join('')}</details>
    <a href="product.html?id=oudh-shahi">Bestseller</a>
    <a href="heritage.html">Heritage</a>
    <a href="contact.html">Contact</a>
  </nav>
  <div class="mm-foot"><button data-open="search">Search</button><button data-open="cart">Bag (<span data-count>0</span>)</button></div>
</div>
<div class="search" id="search">
  <button class="x" data-close>Close ✕</button>
  <input type="search" id="q" placeholder="Search attars, notes, moods…" autocomplete="off">
  <div class="s-res" id="sres"></div>
</div>
<div class="scrim" id="scrim" data-close></div>
<aside class="cart" id="cart" aria-label="Shopping bag">
  <div class="c-head"><h4>Your Bag</h4><button data-close>✕</button></div>
  <div class="c-items" id="citems"></div>
  <div class="c-foot"><div class="c-sub"><span>Subtotal</span><b id="csub">₹ 0</b></div><p>Taxes included. Complimentary gift wrap.</p><button class="btn solid wide" id="checkout">Checkout</button></div>
</aside>
<div class="toast" id="toast"></div>`;
  const footer = `
<footer class="site-foot">
  <div class="f-news"><h3>Letters from <em>Kannauj</em></h3>
    <form id="news"><input type="email" placeholder="Your email address" required aria-label="Email"><button>Subscribe →</button></form></div>
  <div class="f-cols">
    <div><a class="brand" href="index.html">KANNAUJ<small>PERFUME</small></a><p>Pure attars and perfumes, distilled by hand in Kannauj — the perfume capital of India.</p></div>
    <div><h6>Shop</h6>${F.slice(1).map(f => `<a href="shop.html?f=${f.id}">${f.name}</a>`).join('')}</div>
    <div><h6>Kannauj</h6><a href="heritage.html">Our Heritage</a><a href="heritage.html#craft">The Craft</a><a href="contact.html#boutiques">Boutiques</a></div>
    <div><h6>Care</h6><a href="contact.html">Contact Us</a><a href="contact.html">Shipping</a><a href="contact.html">Returns</a><a href="contact.html">FAQ</a></div>
  </div>
  <div class="f-legal"><span>© 2026 Kannauj Perfume. All rights reserved.</span><span>Instagram · Pinterest · YouTube</span></div>
</footer>`;
  const file = location.pathname.split('/').pop() || 'index.html';
  const switcher = `<div class="switcher"><a href="../index.html">← All designs</a>${THEMES.filter(t => t[0] !== theme).map(t => `<a href="../${t[0]}/${file}${location.search}">${t[1]}</a>`).join('')}</div>`;

  body.insertAdjacentHTML('afterbegin', header);
  body.insertAdjacentHTML('beforeend', footer + switcher);

  const nav = $('#siteNav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const megaLi = $('.has-mega', nav);
  megaLi.addEventListener('mouseenter', () => nav.classList.add('mega-on'));
  nav.addEventListener('mouseleave', () => nav.classList.remove('mega-on'));
  nav.querySelectorAll('.nav-l li:not(.has-mega), .nav-r li').forEach(li => li.addEventListener('mouseenter', () => nav.classList.remove('mega-on')));

  // Panels: mobile menu, search, cart
  const panels = { menu: $('#mmenu'), search: $('#search'), cart: $('#cart') };
  function open(name) {
    Object.entries(panels).forEach(([k, el]) => el.classList.toggle('open', k === name));
    $('#scrim').classList.toggle('on', name === 'cart');
    body.classList.toggle('locked', !!name);
    $('#burger').classList.toggle('x', name === 'menu');
    if (name === 'search') setTimeout(() => $('#q').focus(), 300);
  }
  $('#burger').onclick = () => open(panels.menu.classList.contains('open') ? null : 'menu');
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]'); if (o) { e.preventDefault(); open(o.dataset.open); }
    if (e.target.closest('[data-close]')) open(null);
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') open(null); });

  $('#q').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    const hits = q ? C.filter(p => (p.name + p.fam + p.desc + Object.values(p.notes).join(' ')).toLowerCase().includes(q)) : [];
    $('#sres').innerHTML = q && !hits.length ? '<p class="s-none">No attar matches — try “rose”, “oudh” or “rain”.</p>'
      : hits.map(p => `<a href="product.html?id=${p.id}"><div class="sb">${bottle(p)}</div><div><b>${p.name}</b><span>${p.fam} · ${rupee(p.price)}</span></div></a>`).join('');
  });

  $('#news').onsubmit = e => { e.preventDefault(); e.target.querySelector('button').textContent = 'Welcome ✦'; };

  /* ---------- Cart ---------- */
  function renderCart() {
    store.set(cart);
    const n = cart.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('[data-count]').forEach(el => el.textContent = n);
    let sub = 0;
    $('#citems').innerHTML = cart.length ? cart.map((it, k) => {
      const p = byId(it.id); if (!p) return '';
      const pr = sizePrice(p, it.size); sub += pr * it.qty;
      return `<div class="c-item"><div class="cb">${bottle(p)}</div><div class="ci"><b>${p.name}</b><span>${SIZES[it.size][0]}</span>
        <div class="qty"><button data-q="${k}" data-d="-1">−</button><span>${it.qty}</span><button data-q="${k}" data-d="1">+</button></div></div>
        <div class="cp">${rupee(pr * it.qty)}<button data-rm="${k}">Remove</button></div></div>`;
    }).join('') : '<div class="c-empty"><p>Your bag is empty.</p><a class="btn" href="shop.html">Discover the attars</a></div>';
    $('#csub').textContent = rupee(sub);
  }
  $('#citems').addEventListener('click', e => {
    const q = e.target.dataset.q, rm = e.target.dataset.rm;
    if (q !== undefined) { cart[q].qty += +e.target.dataset.d; if (cart[q].qty < 1) cart.splice(q, 1); }
    if (rm !== undefined) cart.splice(rm, 1);
    renderCart();
  });
  $('#checkout').onclick = () => toast('Demo store — checkout will connect to payments in the real build.');
  window.addToBag = (id, size = 0, qty = 1) => {
    const ex = cart.find(i => i.id === id && i.size === size);
    ex ? ex.qty += qty : cart.push({ id, size, qty });
    renderCart(); open('cart');
  };
  let tt;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 3200); }
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]'); if (!a) return;
    e.preventDefault(); addToBag(a.dataset.add, +(a.dataset.size || 0));
  });
  renderCart();

  /* ---------- Shop page ---------- */
  const card = p => `<article class="p-card reveal" style="--tint:${p.tint}">
    <a class="pc-img" href="product.html?id=${p.id}"><div class="pb">${bottle(p)}</div></a>
    <div class="pc-info"><span class="pc-fam">${p.fam}</span><a href="product.html?id=${p.id}"><h3>${p.name}</h3></a><p>${p.tag}</p>
    <div class="pc-row"><b>${rupee(p.price)}</b><button data-add="${p.id}">Add to bag</button></div></div></article>`;
  window.productCard = card;

  const shop = $('[data-shop]');
  if (shop) {
    const params = new URLSearchParams(location.search);
    let fam = params.get('f') || 'all', sort = 'featured';
    shop.innerHTML = `<div class="filters"><div class="chips">${F.map(f => `<button data-f="${f.id}">${f.name}</button>`).join('')}</div>
      <label class="sort">Sort <select id="sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="intense">Most intense</option></select></label></div>
      <p class="count" id="pcount"></p><div class="p-grid" id="pgrid"></div>`;
    const draw = () => {
      let list = C.filter(p => fam === 'all' || p.family === fam);
      if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
      if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
      if (sort === 'intense') list = [...list].sort((a, b) => b.intensity - a.intensity);
      shop.querySelectorAll('[data-f]').forEach(b => b.classList.toggle('on', b.dataset.f === fam));
      $('#pcount').textContent = `${list.length} ${list.length === 1 ? 'fragrance' : 'fragrances'}`;
      $('#pgrid').innerHTML = list.map(card).join('');
      observe();
    };
    shop.addEventListener('click', e => {
      const b = e.target.closest('[data-f]'); if (!b) return;
      fam = b.dataset.f; history.replaceState(null, '', fam === 'all' ? 'shop.html' : '?f=' + fam); draw();
    });
    $('#sort').onchange = e => { sort = e.target.value; draw(); };
    draw();
  }

  /* ---------- Product page ---------- */
  const pd = $('[data-product]');
  if (pd) {
    const p = byId(new URLSearchParams(location.search).get('id')) || C[0];
    document.title = `${p.name} — Kannauj Perfume`;
    let size = 0, qty = 1;
    const related = C.filter(x => x.id !== p.id).sort((a, b) => (b.family === p.family) - (a.family === p.family)).slice(0, 4);
    pd.innerHTML = `
<div class="pd" style="--tint:${p.tint}">
  <div class="pd-stage"><div class="pd-glow"></div><div class="pd-b" id="pdb">${bottle(p)}</div>
    <div class="pd-meta"><span>Intensity <i class="dots">${'●'.repeat(p.intensity)}<s>${'●'.repeat(5 - p.intensity)}</s></i></span><span>Longevity <b>${p.longevity}</b></span></div></div>
  <div class="pd-info">
    <nav class="crumbs"><a href="index.html">Home</a> / <a href="shop.html?f=${p.family}">${F.find(f => f.id === p.family).name}</a> / <span>${p.name}</span></nav>
    <span class="pd-fam">${p.fam}</span>
    <h1>${p.name}</h1><p class="pd-tag">${p.tag}</p>
    <div class="pd-price" id="pdp">${rupee(sizePrice(p, 0))}</div>
    <p class="pd-desc">${p.desc}</p>
    <div class="sizes">${SIZES.map((s, i) => `<button data-s="${i}" class="${i ? '' : 'on'}">${s[0]}</button>`).join('')}</div>
    <div class="buy"><div class="qty big"><button id="qm">−</button><span id="qv">1</span><button id="qp">+</button></div><button class="btn solid" id="pdadd">Add to Bag</button></div>
    <p class="pd-perks">✦ Hand-filled &amp; numbered in Kannauj · ✦ Free engraving · ✦ Ships in 48 hours</p>
    <div class="pyr"><h6>The composition</h6>
      <div><small>Top</small><span>${p.notes.top}</span></div><div><small>Heart</small><span>${p.notes.heart}</span></div><div><small>Base</small><span>${p.notes.base}</span></div></div>
    <details open><summary>The ritual</summary><p>Warm a single drop between your wrists, then touch it to the pulse points — behind the ears, at the throat. Attar develops with your skin; give it ten minutes to bloom.</p></details>
    <details><summary>Ingredients</summary><p>Steam-distilled natural extracts in a base of pure sandalwood oil (attar) or perfumer's alcohol (eau de parfum). No parabens, no phthalates.</p></details>
    <details><summary>Delivery &amp; returns</summary><p>Free insured shipping across India in 2–5 days. Unopened bottles can be returned within 14 days.</p></details>
  </div>
</div>
<section class="related"><h2 class="reveal">You may also <em>love</em></h2><div class="p-grid four">${related.map(card).join('')}</div></section>`;
    const upd = () => { $('#pdp').textContent = rupee(sizePrice(p, size) * qty); $('#qv').textContent = qty; };
    pd.querySelectorAll('[data-s]').forEach(b => b.onclick = () => {
      size = +b.dataset.s; pd.querySelectorAll('[data-s]').forEach(x => x.classList.toggle('on', x === b)); upd();
    });
    $('#qm').onclick = () => { qty = Math.max(1, qty - 1); upd(); };
    $('#qp').onclick = () => { qty++; upd(); };
    $('#pdadd').onclick = () => addToBag(p.id, size, qty);
    const st = $('.pd-stage');
    st.addEventListener('mousemove', e => {
      const r = st.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      $('#pdb').style.transform = `perspective(900px) rotateY(${x * 18}deg) rotateX(${-y * 10}deg) scale(1.03)`;
    });
    st.addEventListener('mouseleave', () => $('#pdb').style.transform = '');
  }

  /* ---------- Any element that wants a catalog bottle: <div data-pbottle="mitti"> ---------- */
  document.querySelectorAll('[data-pbottle]').forEach(el => { const p = byId(el.dataset.pbottle); if (p) el.innerHTML = bottle(p); });
  document.querySelectorAll('[data-pgrid]').forEach(el => {
    el.innerHTML = el.dataset.pgrid.split(',').map(id => byId(id)).filter(Boolean).map(card).join('');
  });

  /* ---------- Contact form ---------- */
  const cf = $('#contactForm');
  if (cf) cf.onsubmit = e => { e.preventDefault(); cf.innerHTML = '<div class="sent"><h3>Thank you.</h3><p>Our team in Kannauj will write to you within one working day.</p></div>'; };

  observe();
})();
