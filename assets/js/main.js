/* Marshall Advertising Company – public site behaviour (v2).
   Needs assets/js/data.js to be loaded first. */
(function () {
  'use strict';

  var D = window.SITE || { services: [], portfolio: [], clients: [], testimonials: [], settings: {} };
  var page = document.body.getAttribute('data-page') || 'home';
  var THEME_KEY = 'marshall_theme';

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function initials(name) {
    return String(name).replace(/[^A-Za-z. ]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
  }

  var ICONS = {
    news: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="15" height="16" rx="2"/><path d="M18 8h2a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2M7 8h4v4H7zM13 8h2M13 12h2M7 16h8"/></svg>',
    books: '<svg viewBox="0 0 24 24"><path d="M4 5h14a2 2 0 0 1 2 2v1H4zM4 8h16v4H4zM4 12h14a2 2 0 0 1 2 2v1H4zM4 15h16v2a2 2 0 0 1-2 2H4z"/></svg>',
    tv: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 3l3 4 3-4M10.5 11.5v5l4-2.5z"/></svg>',
    easel: '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="12" rx="1.5"/><path d="M4 12l4-4 4 4 3-3 5 5M12 15v6M8 21l4-6 4 6"/><circle cx="16" cy="7" r="1.2"/></svg>',
    board: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="11" rx="1.5"/><path d="M7 2v2M12 2v2M17 2v2M9 15l-2 6M15 15l2 6M12 15v6"/></svg>',
    mega: '<svg viewBox="0 0 24 24"><path d="M4 13l11-5v10L4 14zM6 14l1.5 6h3L9 16M18 9.5a3 3 0 0 1 0 5M20 7a6 6 0 0 1 0 10"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    sun: '<svg class="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="moon" viewBox="0 0 24 24"><path d="M21 13.2A8.5 8.5 0 1 1 10.8 3a6.8 6.8 0 0 0 10.2 10.2z"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M4 8h16M9 16h11"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    ne: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>',
    up: '<svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>'
  };
  function icon(n) { return ICONS[n] || ICONS.news; }

  function logo(id) {
    return '<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#275a8f"/><path d="M11 33V15l13 13 13-13v18" fill="none" stroke="#fff" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/></svg>';
  }
  var BRAND_TEXT = '<span class="brand-text"><b>MARSHALL</b><small>Advertising Company</small></span>';

  var NAV = [
    ['home', 'Home', 'index.html'],
    ['about', 'About Us', 'about.html'],
    ['services', 'Services', 'services.html'],
    ['portfolio', 'Portfolio', 'portfolio.html'],
    ['contact', 'Contact Us', 'contact.html']
  ];

  /* ---------- header / footer ---------- */
  function buildHeader() {
    var host = $('#site-header');
    if (!host) return;
    var links = NAV.map(function (n) {
      var on = n[0] === page;
      return '<a href="' + n[2] + '"' + (on ? ' class="active" aria-current="page"' : '') + '>' + n[1] + '</a>';
    }).join('');
    host.outerHTML =
      '<header class="site-header"><div class="container nav">' +
      '<a class="brand" href="index.html" aria-label="Marshall Advertising Company – home">' + logo('lgH') + BRAND_TEXT + '</a>' +
      '<nav class="nav-links" id="navLinks" aria-label="Main">' + links + '</nav>' +
      '<div class="nav-tools">' +
      '<button class="icon-btn" id="openSearch" aria-label="Search the site" title="Search (Ctrl+K)">' + icon('search') + '</button>' +
      '<button class="icon-btn theme-toggle" aria-label="Toggle dark / light theme" title="Toggle theme">' + icon('sun') + icon('moon') + '</button>' +
      '<button class="icon-btn menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">' + icon('menu') + '</button>' +
      '</div></div></header>';
  }

  function buildFooter() {
    var host = $('#site-footer');
    if (!host) return;
    var links = NAV.map(function (n) {
      return '<a href="' + n[2] + '"' + (n[0] === page ? ' class="active"' : '') + '>' + n[1] + '</a>';
    }).join('');
    host.outerHTML =
      '<footer class="site-footer"><div class="container">' +
      '<nav class="footer-nav" aria-label="Footer">' + links + '</nav>' +
      '<div class="footer-bottom"><span>Copyright © ' + new Date().getFullYear() + '. All rights reserved.</span>' +
      '<span>Powered by <a href="https://diwaportfolio.vercel.app/" target="_blank" rel="noopener">Diwa</a></span></div>' +
      '</div></footer>' +
      '<button class="to-top" id="toTop" aria-label="Back to top">' + icon('up') + '</button>' +
      '<div class="toast" id="toast" role="status" aria-live="polite"></div>';
  }

  /* ---------- theme ---------- */
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
  }
  function bindTheme() {
    $$('.theme-toggle').forEach(function (b) {
      b.addEventListener('click', function () {
        setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
      });
    });
  }

  /* ---------- off-canvas drawer (mobile) ---------- */
  var drawer, drawerScrim, menuBtn, lastFocus, openSearchFn = function () {};

  function buildDrawer() {
    var s = D.settings || {};
    var links = NAV.map(function (n, i) {
      var on = n[0] === page;
      return '<a href="' + n[2] + '" style="--i:' + i + '"' + (on ? ' class="active" aria-current="page"' : '') + '><span class="dn">' + pad(i + 1) + '</span><span class="dl">' + n[1] + '</span>' + icon('arrow') + '</a>';
    }).join('');
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="drawer-scrim" id="drawerScrim"></div>' +
      '<aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Site menu">' +
      '<div class="drawer-head"><a class="brand" href="index.html" aria-label="Home">' + logo('lgD') + BRAND_TEXT + '</a>' +
      '<button class="icon-btn" id="drawerClose" aria-label="Close menu">' + icon('close') + '</button></div>' +
      '<button class="drawer-search" id="drawerSearch" type="button">' + icon('search') + '<span>Search the site…</span></button>' +
      '<nav class="drawer-nav" aria-label="Mobile">' + links + '</nav>' +
      '<div class="drawer-foot">' +
      '<div class="drawer-contact"><small>Say hello</small>' +
      '<a href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a>' +
      '<a href="tel:' + esc(String(s.phone1 || '').replace(/\s/g, '')) + '">' + esc(s.phone1) + '</a></div>' +
      '<button class="drawer-theme theme-toggle" type="button" aria-label="Toggle dark / light theme">' +
      '<span class="dt-label"><span class="dt-dark">Switch to light</span><span class="dt-light">Switch to dark</span></span>' + icon('sun') + icon('moon') + '</button>' +
      '<a class="btn" href="contact.html">Let’s connect over coffee</a></div></aside>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    drawer = $('#drawer'); drawerScrim = $('#drawerScrim'); menuBtn = $('#menuBtn');
    drawer.inert = true;
    menuBtn.addEventListener('click', openDrawer);
    drawerScrim.addEventListener('click', closeDrawer);
    $('#drawerClose').addEventListener('click', closeDrawer);
    $('#drawerSearch').addEventListener('click', function () { closeDrawer(true); openSearchFn(); });
    $$('.drawer-nav a', drawer).forEach(function (a) { a.addEventListener('click', function () { closeDrawer(true); }); });
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a[href],button', drawer).filter(function (x) { return !x.disabled; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) closeDrawer(true); });
  }
  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.inert = false;
    drawer.classList.add('open'); drawerScrim.classList.add('open');
    document.body.classList.add('no-scroll');
    menuBtn.setAttribute('aria-expanded', 'true');
    setTimeout(function () { $('#drawerClose').focus(); }, 60);
  }
  function closeDrawer(skipFocus) {
    if (!drawer || !drawer.classList.contains('open')) return;
    drawer.classList.remove('open'); drawerScrim.classList.remove('open');
    document.body.classList.remove('no-scroll');
    menuBtn.setAttribute('aria-expanded', 'false');
    drawer.inert = true;
    if (skipFocus !== true && lastFocus) lastFocus.focus();
  }

  /* ---------- site search ---------- */
  function buildIndex() {
    var idx = [];
    NAV.forEach(function (n) { idx.push({ g: 'Pages', t: n[1], s: '', u: n[2], k: n[1] }); });
    D.services.forEach(function (s) { idx.push({ g: 'Services', t: s.title, s: s.desc.slice(0, 60) + '…', u: 'services.html#service-' + s.id, k: s.title + ' ' + s.desc }); });
    D.portfolio.forEach(function (p) { idx.push({ g: 'Portfolio', t: p.title, s: p.tag, u: 'portfolio.html?q=' + encodeURIComponent(p.title), k: p.title + ' ' + p.tag + ' ' + p.cat }); });
    D.clients.forEach(function (c) { idx.push({ g: 'Clients', t: c.name, s: '', u: 'about.html#clients', k: c.name }); });
    D.testimonials.forEach(function (t) { idx.push({ g: 'Testimonials', t: t.name, s: t.org, u: 'about.html#testimonials', k: t.name + ' ' + t.org + ' ' + t.quote }); });
    return idx;
  }

  var ovSearch;
  function closeSearch() { if (ovSearch) ovSearch.classList.remove('open'); }

  function bindSearch() {
    var open = $('#openSearch');
    ovSearch = document.createElement('div');
    ovSearch.className = 'search-overlay';
    ovSearch.setAttribute('role', 'dialog');
    ovSearch.setAttribute('aria-modal', 'true');
    ovSearch.setAttribute('aria-label', 'Search');
    ovSearch.innerHTML = '<div class="search-box"><div class="search-input-row">' + icon('search') +
      '<input type="search" id="siteSearch" placeholder="Search pages, services, portfolio…" autocomplete="off" aria-label="Search"><button class="kbd" type="button" id="searchClose" aria-label="Close search">Esc</button></div>' +
      '<div class="search-results" id="searchResults"></div></div>';
    document.body.appendChild(ovSearch);
    var input = $('#siteSearch'), out = $('#searchResults');
    var index = buildIndex(), sel = -1;

    function render(q) {
      q = q.trim().toLowerCase();
      var list = q ? index.filter(function (i) { return i.k.toLowerCase().indexOf(q) > -1; }) : index.filter(function (i) { return i.g === 'Pages'; });
      if (!list.length) { out.innerHTML = '<div class="search-empty">No results for “' + esc(q) + '”.</div>'; return; }
      var html = '', last = '', shown = 0;
      list.forEach(function (i) {
        if (shown >= 14) return;
        if (i.g !== last) { html += '<div class="search-group">' + i.g + '</div>'; last = i.g; }
        html += '<a class="search-item" href="' + i.u + '"><span>' + esc(i.t) + '</span><small>' + esc(i.s) + '</small></a>';
        shown++;
      });
      out.innerHTML = html; sel = -1;
    }
    openSearchFn = function () { ovSearch.classList.add('open'); input.value = ''; render(''); setTimeout(function () { input.focus(); }, 30); };
    if (open) open.addEventListener('click', openSearchFn);
    $('#searchClose').addEventListener('click', closeSearch);
    ovSearch.addEventListener('click', function (e) { if (e.target === ovSearch) closeSearch(); });
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('keydown', function (e) {
      var items = $$('.search-item', out);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % (items.length || 1);
        items.forEach(function (i, n) { i.classList.toggle('sel', n === sel); });
        if (items[sel]) items[sel].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        var t = items[sel] || items[0];
        if (t) window.location.href = t.getAttribute('href');
      }
    });
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearchFn(); }
    });
  }

  /* ---------- renderers ---------- */
  function renderServices() {
    $$('[data-render="services"]').forEach(function (el) {
      var lim = parseInt(el.getAttribute('data-limit'), 10) || D.services.length;
      var v = el.getAttribute('data-variant') || 'spot';
      el.innerHTML = D.services.slice(0, lim).map(function (s, i) {
        var variant = v === 'fill' ? 'c-fill' : 'c-spot';
        return '<article class="card service-card ' + variant + ' reveal" id="service-' + s.id + '">' +
          '<div class="service-card-top"><span class="service-index">' + pad(i + 1) + ' <i>/ ' + pad(D.services.length) + '</i></span>' +
          '<span class="ico">' + icon(s.icon) + '</span></div>' +
          '<h3>' + esc(s.title) + '</h3><p>' + esc(s.desc) + '</p>' +
          '<a class="service-link" href="services.html#service-' + s.id + '">Explore service ' + icon('arrow') + '</a></article>';
      }).join('');
    });
  }

  function renderClients() {
    $$('[data-render="clients"]').forEach(function (el) {
      el.innerHTML = D.clients.map(function (c) {
        return '<div class="client" role="listitem">' + (c.logo ? '<img src="' + esc(c.logo) + '" alt="' + esc(c.name) + '" loading="lazy">' : '<span>' + esc(c.name) + '</span>') + '</div>';
      }).join('');
    });
  }

  function renderTestimonials() {
    $$('[data-render="testimonials"]').forEach(function (el) {
      var only = el.getAttribute('data-filter') === 'home';
      var list = D.testimonials.filter(function (t) { return only ? t.home : true; });
      el.innerHTML =
        '<div class="testimonial-swiper" role="region" aria-label="What our clients say" aria-roledescription="carousel">' +
        '<div class="testimonial-track" tabindex="0">' +
        list.map(function (t, i) {
          return '<figure class="card c-quote swiper-slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + list.length + '">' +
            '<blockquote>' + esc(t.quote) + '</blockquote>' +
            '<figcaption><span class="avatar" aria-hidden="true">' + esc(initials(t.name)) + '</span><span><b>' + esc(t.name) + '</b><small>' + esc(t.role) + '<br>' + esc(t.org) + '</small></span></figcaption></figure>';
        }).join('') +
        '</div><div class="testimonial-controls">' +
        '<button class="testimonial-arrow" type="button" data-testimonial-step="-1" aria-label="Previous testimonial"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button>' +
        '<div class="testimonial-pagination" role="group" aria-label="Choose a testimonial">' +
        list.map(function (t, i) {
          return '<button class="testimonial-dot' + (i === 0 ? ' is-active' : '') + '" type="button" data-testimonial-index="' + i + '" aria-label="Show testimonial ' + (i + 1) + '"' + (i === 0 ? ' aria-pressed="true"' : ' aria-pressed="false"') + '></button>';
        }).join('') +
        '</div><button class="testimonial-arrow" type="button" data-testimonial-step="1" aria-label="Next testimonial"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>' +
        '</div></div>';

      var swiper = $('.testimonial-swiper', el);
      var track = $('.testimonial-track', swiper);
      var slides = $$('.swiper-slide', track);
      var dots = $$('.testimonial-dot', swiper);
      var current = 0;
      function setCurrent(index) {
        if (!slides.length) return;
        current = (index + slides.length) % slides.length;
        dots.forEach(function (dot, i) {
          var active = i === current;
          dot.classList.toggle('is-active', active);
          dot.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
      }
      function goTo(index) {
        if (!slides.length) return;
        var target = (index + slides.length) % slides.length;
        var behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        track.scrollTo({ left: slides[target].offsetLeft - track.offsetLeft, behavior: behavior });
        setCurrent(target);
      }
      $('[data-testimonial-step="-1"]', swiper).addEventListener('click', function () { goTo(current - 1); });
      $('[data-testimonial-step="1"]', swiper).addEventListener('click', function () { goTo(current + 1); });
      dots.forEach(function (dot, i) { dot.addEventListener('click', function () { goTo(i); }); });
      track.addEventListener('scroll', function () {
        if (track.clientWidth) setCurrent(Math.round(track.scrollLeft / track.clientWidth));
      }, { passive: true });
      track.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          goTo(current + (e.key === 'ArrowRight' ? 1 : -1));
        }
      });
    });
  }

  function renderArt() {
    var artwork = '<img class="brand-art-image" src="assets/images/abt-img.jpg" alt="Marshall Advertising colourful lightbulb campaign artwork">';
    $$('[data-art="bulb"], [data-art="poster"]').forEach(function (el) { el.innerHTML = artwork; });
  }

  function renderBindings() {
    var s = D.settings || {};
    $$('[data-bind]').forEach(function (el) {
      var k = el.getAttribute('data-bind');
      if (k === 'address') { el.innerHTML = (s.address || []).map(esc).join('<br>'); return; }
      el.textContent = s[k] || '';
      if (k === 'phone1' || k === 'phone2') el.setAttribute('href', 'tel:' + String(s[k]).replace(/\s/g, ''));
      if (k === 'email') el.setAttribute('href', 'mailto:' + s[k]);
    });
    $$('[data-count]').forEach(function (el) {
      var k = el.getAttribute('data-count');
      el.textContent = (D[k] || []).length;
    });
  }

  /* ---------- portfolio ---------- */
  var lb;
  function closeLb() { if (lb) lb.classList.remove('open'); }

  function thumb(p) {
    return '<div class="pf-thumb' + (p.img ? '' : ' is-placeholder') + '">' +
      (p.img ? '<img src="' + esc(p.img) + '" alt="' + esc(p.title) + '" loading="lazy">' : '') +
      '</div>';
  }

  function initPortfolio() {
    var grid = $('#pfGrid');
    if (!grid) return;
    var tabsEl = $('#pfTabs'), q = $('#pfSearch'), count = $('#pfCount'), empty = $('#pfEmpty'), pagination = $('#pfPagination');
    var cats = ['All work'].concat(D.portfolio.map(function (p) { return p.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
    var cur = 'All work';
    var pageSize = 8;
    var currentPage = 1;

    tabsEl.innerHTML = cats.map(function (c) {
      var n = c === 'All work' ? D.portfolio.length : D.portfolio.filter(function (p) { return p.cat === c; }).length;
      return '<button class="tab' + (c === cur ? ' active' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '<span class="n">' + n + '</span></button>';
    }).join('');

    function draw() {
      var term = q.value.trim().toLowerCase();
      var list = D.portfolio.map(function (p, i) { return { p: p, i: i }; }).filter(function (o) {
        return (cur === 'All work' || o.p.cat === cur) && (!term || (o.p.title + ' ' + o.p.tag).toLowerCase().indexOf(term) > -1);
      });
      var pageCount = Math.max(1, Math.ceil(list.length / pageSize));
      currentPage = Math.min(currentPage, pageCount);
      var start = (currentPage - 1) * pageSize;
      var pageItems = list.slice(start, start + pageSize);
      grid.innerHTML = pageItems.map(function (o) {
        return '<article class="pf-card" tabindex="0" data-i="' + o.i + '" role="button" aria-label="View ' + esc(o.p.title) + '">' +
          '<div class="pf-media">' + thumb(o.p) + '</div>' +
          '<div class="pf-info"><div><small>' + esc(o.p.tag) + '</small><b>' + esc(o.p.title) + '</b></div><span class="pf-go" aria-hidden="true">' + icon('ne') + '</span></div></article>';
      }).join('');
      count.textContent = list.length
        ? 'Showing ' + (start + 1) + '–' + Math.min(start + pageSize, list.length) + ' of ' + list.length + ' projects'
        : 'Showing 0 projects';
      empty.style.display = list.length ? 'none' : 'block';
      pagination.hidden = list.length <= pageSize;
      pagination.innerHTML = list.length > pageSize
        ? '<button class="pf-page pf-page-step" type="button" data-page="' + Math.max(1, currentPage - 1) + '" aria-label="Previous page"' + (currentPage === 1 ? ' disabled' : '') + '>Previous</button>' +
          Array.from({ length: pageCount }, function (_, i) {
            var n = i + 1;
            return '<button class="pf-page' + (n === currentPage ? ' is-current' : '') + '" type="button" data-page="' + n + '" aria-label="Page ' + n + '"' + (n === currentPage ? ' aria-current="page"' : '') + '>' + n + '</button>';
          }).join('') +
          '<button class="pf-page pf-page-step" type="button" data-page="' + Math.min(pageCount, currentPage + 1) + '" aria-label="Next page"' + (currentPage === pageCount ? ' disabled' : '') + '>Next</button>'
        : '';
    }

    tabsEl.addEventListener('click', function (e) {
      var b = e.target.closest('.tab');
      if (!b) return;
      cur = b.getAttribute('data-cat');
      currentPage = 1;
      $$('.tab', tabsEl).forEach(function (t) { t.classList.toggle('active', t === b); });
      draw();
    });
    q.addEventListener('input', function () { currentPage = 1; draw(); });
    pagination.addEventListener('click', function (e) {
      var button = e.target.closest('[data-page]');
      if (!button || button.disabled) return;
      currentPage = Number(button.getAttribute('data-page'));
      draw();
    });

    var params = new URLSearchParams(window.location.search);
    if (params.get('q')) q.value = params.get('q');

    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
    document.body.appendChild(lb);
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.closest('.lb-close')) closeLb(); });
    function openLb(i) {
      var p = D.portfolio[i];
      lb.setAttribute('aria-labelledby', 'projectTitle');
      lb.innerHTML = '<div class="lb-card"><button class="icon-btn lb-close" aria-label="Close">' + icon('close') + '</button>' + thumb(p) +
        '<div class="lb-body"><small style="color:var(--accent);font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:.7rem">' + esc(p.tag) + '</small><h3 id="projectTitle">' + esc(p.title) + '</h3></div></div>';
      lb.classList.add('open');
    }
    grid.addEventListener('click', function (e) { var c = e.target.closest('.pf-card'); if (c) openLb(+c.getAttribute('data-i')); });
    grid.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var c = e.target.closest('.pf-card'); if (c) openLb(+c.getAttribute('data-i')); } });
    draw();
  }

  function initWelcomeGate() {
    if (page !== 'home') return;

    var background = Array.prototype.slice.call(document.body.children).map(function (el) {
      return { element: el, inert: el.inert };
    });
    background.forEach(function (item) { item.element.inert = true; });

    var gate = document.createElement('div');
    gate.className = 'welcome-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'welcomeGateTitle');
    gate.innerHTML =
      '<div class="welcome-gate-doors" aria-hidden="true">' +
      '<span class="welcome-gate-door"></span></div>' +
      '<div class="welcome-gate-content">' +
      '<span class="welcome-gate-kicker"><i></i> MARSHALL ADVERTISING | <span>A WORLD OF IDEAS</span></span>' +
      '<h1 id="welcomeGateTitle">Welcome to <em>Marshall</em> Advertising</h1>' +
      '<p class="welcome-gate-copy">Click anywhere to enter.</p>' +
      '<button class="welcome-gate-action" type="button">Enter the website <span aria-hidden="true">↗</span></button>' +
      '</div>';
    document.body.appendChild(gate);
    document.body.classList.add('no-scroll');

    var action = $('.welcome-gate-action', gate);
    var opening = false;
    gate.addEventListener('click', function () {
      if (opening) return;
      opening = true;
      gate.classList.add('is-opening');
      gate.setAttribute('aria-busy', 'true');
      action.disabled = true;
      window.setTimeout(function () {
        gate.classList.add('is-leaving');
        document.body.classList.remove('no-scroll');
        background.forEach(function (item) { item.element.inert = item.inert; });
        window.setTimeout(function () {
          if (gate.parentNode) gate.parentNode.removeChild(gate);
        }, 400);
      }, 1350);
    });
    action.focus();
  }

  /* ---------- contact form ---------- */
  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, 4000);
  }

  function initContact() {
    var form = $('#contactForm');
    if (!form) return;
    function bad(name, on) { form.elements[name].closest('.field').classList.toggle('bad', on); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var name = f.name.value.trim(), email = f.email.value.trim(), phone = f.phone.value.trim(), msg = f.message.value.trim();
      var vName = name.length >= 2, vMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), vPhone = !phone || /^[+\d][\d\s\-]{6,}$/.test(phone), vMsg = msg.length >= 5;
      bad('name', !vName); bad('email', !vMail); bad('phone', !vPhone); bad('message', !vMsg);
      if (!(vName && vMail && vPhone && vMsg)) return;
      try {
        var all = JSON.parse(localStorage.getItem('marshall_messages') || '[]');
        all.unshift({ id: Date.now(), name: name, email: email, phone: phone, message: msg, date: new Date().toISOString(), read: false });
        localStorage.setItem('marshall_messages', JSON.stringify(all));
      } catch (err) {}
      form.reset();
      toast('Thank you! Your message has been sent. We’ll be in touch soon.');
    });
  }

  /* ---------- card effects: spotlight + tilt ---------- */
  function initFx() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.c-spot, .c-fill, .c-quote, .info-card');
      if (!c) return;
      var r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
      if (!calm && c.classList.contains('c-quote')) {
        c.style.setProperty('--ry', ((x / r.width - .5) * 6).toFixed(2) + 'deg');
        c.style.setProperty('--rx', ((.5 - y / r.height) * 6).toFixed(2) + 'deg');
      }
    }, { passive: true });
    document.addEventListener('pointerout', function (e) {
      var c = e.target.closest && e.target.closest('.c-quote');
      if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); }
    });
  }

  /* ---------- reveal + to top ---------- */
  function initReveal() {
    var els = $$('.reveal:not(.in)');
    els.forEach(function (e) {
      var sibs = Array.prototype.indexOf.call(e.parentNode.children, e);
      e.style.setProperty('--d', ((sibs % 6) * 70) + 'ms');
    });
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  }
  function initToTop() {
    var b = $('#toTop'); if (!b) return;
    window.addEventListener('scroll', function () { b.classList.toggle('show', window.scrollY > 500); }, { passive: true });
    b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ---------- boot ---------- */
  buildHeader();
  buildFooter();
  buildDrawer();
  renderArt();
  renderServices();
  renderClients();
  renderTestimonials();
  renderBindings();
  bindTheme();
  bindSearch();
  initPortfolio();
  initContact();
  initFx();
  initReveal();
  initToTop();
  initWelcomeGate();

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeSearch(); closeLb(); closeDrawer(); }
  });
})();
