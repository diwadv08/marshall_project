/* Marshall Admin Panel
   DEMO ONLY: data is stored in this browser (localStorage) so the public site reflects changes.
   Replace the MarshallStore / auth calls with real API + server-side authentication before going live. */
(function () {
  'use strict';

  var page = document.body.getAttribute('data-page');
  var AUTH = 'marshall_admin_session';
  var CRED = 'marshall_admin_cred';
  var THEME_KEY = 'marshall_theme';
  var MSG_KEY = 'marshall_messages';

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function initials(n) { return String(n).replace(/[^A-Za-z. ]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase() || '?'; }
  function creds() { try { return JSON.parse(localStorage.getItem(CRED)) || { email: 'admin@macad.in', pw: 'admin123' }; } catch (e) { return { email: 'admin@macad.in', pw: 'admin123' }; } }
  function fmtDate(iso) { try { return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return iso; } }

  var P = {
    dash: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5"/>',
    users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M17 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
    quote: '<path d="M5 17a4 4 0 0 1 4-4V9a6 6 0 0 0-6 6v2zM15 17a4 4 0 0 1 4-4V9a6 6 0 0 0-6 6v2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 13.2A8.5 8.5 0 1 1 10.8 3a6.8 6.8 0 0 0 10.2 10.2z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
    out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    ext: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>'
  };
  function ic(n) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + P[n] + '</svg>'; }

  function toast(msg, bad) {
    var t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'toast show' + (bad ? ' bad' : '');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }
  function setTheme(t) { document.documentElement.setAttribute('data-theme', t); try { localStorage.setItem(THEME_KEY, t); } catch (e) {} }

  /* ============ Login page ============ */
  if (page === 'login') {
    if (sessionStorage.getItem(AUTH)) { location.replace('index.html'); return; }
    var lf = $('#loginForm'), le = $('#loginErr');
    lf.addEventListener('submit', function (e) {
      e.preventDefault();
      var c = creds();
      if (lf.email.value.trim().toLowerCase() === c.email.toLowerCase() && lf.password.value === c.pw) {
        sessionStorage.setItem(AUTH, '1'); location.href = 'index.html';
      } else { le.style.display = 'block'; }
    });
    $('#themeBtn').addEventListener('click', function () { setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'); });
    return;
  }

  /* ============ Auth guard ============ */
  if (!sessionStorage.getItem(AUTH)) { location.replace('login.html'); return; }

  var store = window.MarshallStore;
  var data = store.get();
  function persist() { store.save(data); }
  function getMsgs() { try { return JSON.parse(localStorage.getItem(MSG_KEY) || '[]'); } catch (e) { return []; } }
  function putMsgs(m) { localStorage.setItem(MSG_KEY, JSON.stringify(m)); }

  /* ============ Shell ============ */
  var NAV = [
    ['dashboard', 'Dashboard', 'index.html', 'dash'],
    ['portfolio', 'Portfolio', 'portfolio.html', 'image'],
    ['services', 'Services', 'services.html', 'layers'],
    ['clients', 'Clients', 'clients.html', 'users'],
    ['testimonials', 'Testimonials', 'testimonials.html', 'quote'],
    ['messages', 'Messages', 'messages.html', 'mail'],
    ['settings', 'Settings', 'settings.html', 'cog']
  ];
  var unread = getMsgs().filter(function (m) { return !m.read; }).length;
  var searchHandler = null;

  function shell() {
    var nav = NAV.map(function (n, i) {
      var label = i === 0 ? '<div class="side-label">Overview</div>' : (i === 1 ? '<div class="side-label">Content</div>' : (i === 5 ? '<div class="side-label">System</div>' : ''));
      return label + '<a href="' + n[2] + '"' + (n[0] === page ? ' class="active" aria-current="page"' : '') + '>' + ic(n[3]) + n[1] +
        (n[0] === 'messages' && unread ? '<span class="badge">' + unread + '</span>' : '') + '</a>';
    }).join('');
    $('#app').innerHTML =
      '<div class="shell"><aside class="sidebar" id="sidebar">' +
      '<a class="logo" href="index.html"><span class="logo-mark"><svg viewBox="0 0 24 24"><path d="M5 17V7l7 7 7-7v10"/></svg></span><span><b>MARSHALL</b><small>Admin Panel</small></span></a>' +
      '<nav class="side-nav" aria-label="Admin">' + nav + '</nav>' +
      '<div class="side-foot">Demo build · data stored in this browser only.</div></aside>' +
      '<div class="scrim" id="scrim"></div>' +
      '<div class="main"><header class="topbar">' +
      '<button class="ibtn menu" id="menuBtn" aria-label="Open menu">' + ic('menu') + '</button>' +
      '<label class="tb-search">' + ic('search') + '<span class="sr-only" style="position:absolute;left:-9999px">Search</span><input id="tbSearch" type="search" placeholder="Search in this page…" autocomplete="off"></label>' +
      '<div class="tb-spacer"></div>' +
      '<a class="ibtn" href="../index.html" target="_blank" rel="noopener" aria-label="View website" title="View website">' + ic('ext') + '</a>' +
      '<button class="ibtn" id="themeBtn" aria-label="Toggle theme"><span class="theme-ico-sun">' + ic('sun') + '</span><span class="theme-ico-moon">' + ic('moon') + '</span></button>' +
      '<div class="me" id="me" tabindex="0" role="button" aria-haspopup="true"><span class="av">AD</span><span>Admin</span>' +
      '<div class="menu-pop" id="mePop"><a href="settings.html">' + ic('cog') + 'Settings</a><button id="logout">' + ic('out') + 'Sign out</button></div></div>' +
      '</header><main class="content" id="content"></main></div></div>';

    var sb = $('#sidebar'), sc = $('#scrim');
    function tog(o) { sb.classList.toggle('open', o); sc.classList.toggle('open', o); }
    $('#menuBtn').addEventListener('click', function () { tog(true); });
    sc.addEventListener('click', function () { tog(false); });
    $('#themeBtn').addEventListener('click', function () { setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'); });
    $('#me').addEventListener('click', function (e) { $('#mePop').classList.toggle('open'); e.stopPropagation(); });
    document.addEventListener('click', function () { $('#mePop').classList.remove('open'); });
    $('#logout').addEventListener('click', function () { sessionStorage.removeItem(AUTH); location.href = 'login.html'; });
    $('#tbSearch').addEventListener('input', function (e) { if (searchHandler) searchHandler(e.target.value); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeModal(); tog(false); } });
  }

  /* ============ Modal ============ */
  var modal;
  function closeModal() { if (modal) modal.classList.remove('open'); }
  function openModal(title, bodyHtml, footHtml) {
    if (!modal) { modal = document.createElement('div'); modal.className = 'modal'; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); document.body.appendChild(modal); modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); }); }
    modal.innerHTML = '<div class="modal-box"><div class="modal-head"><h3>' + esc(title) + '</h3><button class="ibtn" data-x aria-label="Close">' + ic('close') + '</button></div>' +
      '<div class="modal-body">' + bodyHtml + '</div><div class="modal-foot">' + footHtml + '</div></div>';
    modal.classList.add('open');
    $('[data-x]', modal).addEventListener('click', closeModal);
    return modal;
  }
  function confirmBox(msg, ok) {
    var m = openModal('Please confirm', '<p style="margin:0">' + esc(msg) + '</p>', '<button class="btn sec" data-x2>Cancel</button><button class="btn danger" data-ok>Delete</button>');
    $('[data-x2]', m).addEventListener('click', closeModal);
    $('[data-ok]', m).addEventListener('click', function () { closeModal(); ok(); });
  }

  /* ============ Generic CRUD page ============ */
  var CATS = ['Print Ads', 'Books', 'Bulletins & Newsletters'];
  var ICONS = ['news', 'books', 'tv', 'easel', 'board', 'mega'];
  var CFG = {
    portfolio: {
      title: 'Portfolio', sub: 'Manage projects shown on the public Portfolio page.', add: 'Add project', noun: 'project',
      fields: [
        { k: 'title', l: 'Title', t: 'text', req: 1 },
        { k: 'cat', l: 'Category', t: 'select', o: CATS },
        { k: 'tag', l: 'Label (e.g. Print Advertising)', t: 'text', req: 1 },
        { k: 'img', l: 'Image', t: 'image' }
      ],
      cols: [
        { l: 'Project', r: function (p, i) { return '<div class="cell">' + thumb(p, i) + '<b>' + esc(p.title) + '</b></div>'; } },
        { l: 'Category', r: function (p) { return '<span class="tag">' + esc(p.cat) + '</span>'; } },
        { l: 'Label', r: function (p) { return esc(p.tag); } }
      ],
      filter: { k: 'cat', l: 'All categories', o: CATS }
    },
    services: {
      title: 'Services', sub: 'Services listed on the Home and Services pages.', add: 'Add service', noun: 'service',
      fields: [
        { k: 'title', l: 'Title', t: 'text', req: 1 },
        { k: 'icon', l: 'Icon', t: 'select', o: ICONS },
        { k: 'desc', l: 'Description', t: 'textarea', req: 1 }
      ],
      cols: [
        { l: 'Service', r: function (s) { return '<b>' + esc(s.title) + '</b>'; } },
        { l: 'Icon', r: function (s) { return '<span class="tag">' + esc(s.icon) + '</span>'; } },
        { l: 'Description', r: function (s) { return '<span style="color:var(--muted)">' + esc(s.desc.length > 90 ? s.desc.slice(0, 90) + '…' : s.desc) + '</span>'; } }
      ]
    },
    clients: {
      title: 'Clients', sub: 'Logos / names shown in the “Our Clients” strip.', add: 'Add client', noun: 'client',
      fields: [
        { k: 'name', l: 'Client name', t: 'text', req: 1 },
        { k: 'logo', l: 'Logo', t: 'image' }
      ],
      cols: [
        { l: 'Client', r: function (c, i) { return '<div class="cell">' + thumb({ title: c.name, img: c.logo }, i) + '<b>' + esc(c.name) + '</b></div>'; } },
        { l: 'Logo', r: function (c) { return c.logo ? '<span class="tag ok">Uploaded</span>' : '<span class="tag warn">Text only</span>'; } }
      ]
    },
    testimonials: {
      title: 'Testimonials', sub: 'Client quotes. “Show on Home” controls the Home page selection.', add: 'Add testimonial', noun: 'testimonial',
      fields: [
        { k: 'name', l: 'Name', t: 'text', req: 1 },
        { k: 'role', l: 'Designation', t: 'text' },
        { k: 'org', l: 'Organisation', t: 'text' },
        { k: 'quote', l: 'Quote', t: 'textarea', req: 1 },
        { k: 'home', l: 'Show on Home page', t: 'check' }
      ],
      cols: [
        { l: 'Person', r: function (t) { return '<div class="cell"><span class="thumb" style="--h:200">' + esc(initials(t.name)) + '</span><div><b>' + esc(t.name) + '</b><br><small style="color:var(--muted)">' + esc(t.role) + ' · ' + esc(t.org) + '</small></div></div>'; } },
        { l: 'Quote', r: function (t) { return '<span style="color:var(--muted)">' + esc(t.quote.length > 80 ? t.quote.slice(0, 80) + '…' : t.quote) + '</span>'; } },
        { l: 'Home', r: function (t) { return t.home ? '<span class="tag ok">Yes</span>' : '<span class="tag">No</span>'; } }
      ]
    }
  };

  function thumb(o, i) {
    var h = (i * 47 + 190) % 360;
    return '<span class="thumb" style="--h:' + h + '">' + (o.img ? '<img src="' + esc(o.img) + '" alt="">' : esc(initials(o.title || ''))) + '</span>';
  }

  function crud(key) {
    var cfg = CFG[key], q = '', flt = '', pg = 1, SIZE = 8;
    var c = $('#content');
    c.innerHTML = '<div class="page-head"><div><h1>' + cfg.title + '</h1><p>' + cfg.sub + '</p></div><button class="btn" id="addBtn">' + ic('plus') + cfg.add + '</button></div>' +
      '<div class="card table-card"><div class="table-tools"><strong id="tCount"></strong>' +
      (cfg.filter ? '<select id="tFilter" aria-label="Filter"><option value="">' + cfg.filter.l + '</option>' + cfg.filter.o.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select>' : '') +
      '</div><div class="tw"><table><thead><tr>' + cfg.cols.map(function (x) { return '<th>' + x.l + '</th>'; }).join('') + '<th style="text-align:right">Actions</th></tr></thead><tbody id="tBody"></tbody></table></div><div class="pager" id="pager"></div></div>';

    function rows() {
      return data[key].map(function (it, i) { return { it: it, i: i }; }).filter(function (o) {
        var hay = JSON.stringify(o.it).toLowerCase();
        return (!q || hay.indexOf(q) > -1) && (!flt || o.it[cfg.filter.k] === flt);
      });
    }
    function draw() {
      var list = rows(), pages = Math.max(1, Math.ceil(list.length / SIZE));
      if (pg > pages) pg = pages;
      var slice = list.slice((pg - 1) * SIZE, pg * SIZE);
      $('#tCount').textContent = list.length + ' ' + cfg.noun + (list.length === 1 ? '' : 's');
      $('#tBody').innerHTML = slice.length ? slice.map(function (o) {
        return '<tr>' + cfg.cols.map(function (x) { return '<td data-label="' + x.l + '">' + x.r(o.it, o.i) + '</td>'; }).join('') +
          '<td data-label="Actions"><div class="acts"><button data-edit="' + o.it.id + '" aria-label="Edit">' + ic('edit') + '</button><button class="del" data-del="' + o.it.id + '" aria-label="Delete">' + ic('trash') + '</button></div></td></tr>';
      }).join('') : '<tr><td colspan="' + (cfg.cols.length + 1) + '"><div class="empty">Nothing found.</div></td></tr>';
      $('#pager').innerHTML = '<span>Page ' + pg + ' of ' + pages + '</span><div><button class="btn sec sm" data-p="-1"' + (pg <= 1 ? ' disabled' : '') + '>Previous</button><button class="btn sec sm" data-p="1"' + (pg >= pages ? ' disabled' : '') + '>Next</button></div>';
    }
    searchHandler = function (v) { q = v.trim().toLowerCase(); pg = 1; draw(); };
    if (cfg.filter) $('#tFilter').addEventListener('change', function (e) { flt = e.target.value; pg = 1; draw(); });
    $('#pager').addEventListener('click', function (e) { var b = e.target.closest('[data-p]'); if (b) { pg += +b.getAttribute('data-p'); draw(); } });
    $('#addBtn').addEventListener('click', function () { form(); });
    $('#tBody').addEventListener('click', function (e) {
      var ed = e.target.closest('[data-edit]'), dl = e.target.closest('[data-del]');
      if (ed) form(+ed.getAttribute('data-edit'));
      if (dl) confirmBox('Delete this ' + cfg.noun + '? This cannot be undone.', function () {
        var id = +dl.getAttribute('data-del');
        data[key] = data[key].filter(function (x) { return x.id !== id; }); persist(); draw(); toast('Deleted.');
      });
    });

    function form(id) {
      var item = id ? data[key].filter(function (x) { return x.id === id; })[0] : {};
      var body = cfg.fields.map(function (f) {
        var v = item[f.k] == null ? (f.t === 'select' ? f.o[0] : '') : item[f.k], h = '<div class="field"><label for="f_' + f.k + '">' + f.l + (f.req ? ' *' : '') + '</label>';
        if (f.t === 'textarea') h += '<textarea id="f_' + f.k + '">' + esc(v) + '</textarea>';
        else if (f.t === 'select') h += '<select id="f_' + f.k + '">' + f.o.map(function (o) { return '<option' + (o === v ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>';
        else if (f.t === 'check') return '<div class="field check"><input type="checkbox" id="f_' + f.k + '"' + (v ? ' checked' : '') + '><label for="f_' + f.k + '" style="margin:0">' + f.l + '</label></div>';
        else if (f.t === 'image') h += '<input id="f_' + f.k + '" type="text" placeholder="https://… or upload below" value="' + esc(v) + '"><input type="file" accept="image/*" id="u_' + f.k + '" style="margin-top:8px"><div class="hint">Small images only – uploads are stored in the browser for this demo.</div>';
        else h += '<input id="f_' + f.k + '" type="text" value="' + esc(v) + '">';
        return h + '<div class="hint" id="e_' + f.k + '" style="color:var(--bad);display:none">Required</div></div>';
      }).join('');
      var m = openModal((id ? 'Edit ' : 'Add ') + cfg.noun, body, '<button class="btn sec" data-c>Cancel</button><button class="btn" data-s>Save</button>');
      cfg.fields.forEach(function (f) {
        if (f.t !== 'image') return;
        $('#u_' + f.k, m).addEventListener('change', function (e) {
          var file = e.target.files[0]; if (!file) return;
          if (file.size > 400 * 1024) { toast('Image is over 400 KB – use a URL or a smaller file.', true); e.target.value = ''; return; }
          var r = new FileReader(); r.onload = function () { $('#f_' + f.k, m).value = r.result; }; r.readAsDataURL(file);
        });
      });
      $('[data-c]', m).addEventListener('click', closeModal);
      $('[data-s]', m).addEventListener('click', function () {
        var out = {}, ok = true;
        cfg.fields.forEach(function (f) {
          var el = $('#f_' + f.k, m), v = f.t === 'check' ? el.checked : el.value.trim();
          if (f.req && !v) { ok = false; $('#e_' + f.k, m).style.display = 'block'; } else if (f.req) $('#e_' + f.k, m).style.display = 'none';
          out[f.k] = v;
        });
        if (!ok) return;
        if (id) Object.assign(item, out);
        else { out.id = data[key].reduce(function (a, x) { return Math.max(a, x.id); }, 0) + 1; data[key].push(out); }
        try { persist(); } catch (e) { toast('Storage full – use a smaller image.', true); return; }
        closeModal(); draw(); toast(id ? 'Changes saved.' : 'Added successfully.');
      });
    }
    draw();
  }

  /* ============ Dashboard ============ */
  function dashboard() {
    var msgs = getMsgs();
    var counts = CATS.map(function (c) { return data.portfolio.filter(function (p) { return p.cat === c; }).length; });
    var max = Math.max.apply(null, counts.concat([1]));
    var visits = [182, 240, 216, 310, 287, 356, 402], days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var vm = Math.max.apply(null, visits), W = 560, H = 200, pad = 28;
    var pts = visits.map(function (v, i) { return [pad + i * ((W - pad * 2) / 6), H - pad - (v / vm) * (H - pad * 2)]; });
    var line = pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    var area = pad + ',' + (H - pad) + ' ' + line + ' ' + pts[6][0] + ',' + (H - pad);
    var recent = msgs.slice(0, 5);

    $('#content').innerHTML =
      '<div class="page-head"><div><h1>Dashboard</h1><p>Welcome back – here’s what’s happening on the site.</p></div><a class="btn" href="../index.html" target="_blank" rel="noopener">' + ic('ext') + 'View website</a></div>' +
      '<div class="grid stats">' +
      stat('image', data.portfolio.length, 'Portfolio projects') + stat('layers', data.services.length, 'Services') + stat('users', data.clients.length, 'Clients') + stat('mail', unread, 'Unread messages') + '</div>' +
      '<div class="grid two"><div class="card"><h3>Site visits <span class="tag">Sample data</span></h3>' +
      '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="Visits this week"><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00a0e3" stop-opacity=".4"/><stop offset="1" stop-color="#00a0e3" stop-opacity="0"/></linearGradient></defs>' +
      [0, 1, 2, 3].map(function (n) { var y = pad + n * ((H - pad * 2) / 3); return '<line x1="' + pad + '" x2="' + (W - pad) + '" y1="' + y + '" y2="' + y + '" stroke="currentColor" stroke-opacity=".08"/>'; }).join('') +
      '<polygon points="' + area + '" fill="url(#ga)"/><polyline points="' + line + '" fill="none" stroke="#00a0e3" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' +
      pts.map(function (p, i) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#00a0e3"/><text x="' + p[0] + '" y="' + (H - 6) + '" text-anchor="middle">' + days[i] + '</text>'; }).join('') + '</svg></div>' +
      '<div class="card"><h3>Portfolio by category</h3><div class="bars">' +
      CATS.map(function (cname, i) { return '<div class="bar-row"><div class="lbl"><span>' + esc(cname) + '</span><b>' + counts[i] + '</b></div><div class="bar"><i style="width:' + (counts[i] / max * 100) + '%"></i></div></div>'; }).join('') + '</div></div></div>' +
      '<div class="grid two even"><div class="card"><h3>Recent messages <a href="messages.html" style="font-size:.82rem">View all</a></h3><div class="list">' +
      (recent.length ? recent.map(function (m) { return '<a class="list-item" href="messages.html" style="color:inherit"><span class="av">' + esc(initials(m.name)) + '</span><span class="t"><b>' + esc(m.name) + (m.read ? '' : ' • new') + '</b><small>' + esc(m.message) + '</small></span><small>' + esc(fmtDate(m.date).split(',')[0]) + '</small></a>'; }).join('') : '<div class="empty">No messages yet. Submissions from the Contact page appear here.</div>') + '</div></div>' +
      '<div class="card"><h3>Quick actions</h3><div class="quick">' +
      '<a href="portfolio.html">' + ic('plus') + 'Add project</a><a href="services.html">' + ic('layers') + 'Edit services</a><a href="testimonials.html">' + ic('quote') + 'Add testimonial</a><a href="settings.html">' + ic('cog') + 'Contact details</a></div></div></div>';
    function stat(i, n, l) { return '<div class="card stat"><span class="ico">' + ic(i) + '</span><div><b>' + n + '</b><span>' + l + '</span></div></div>'; }
  }

  /* ============ Messages ============ */
  function messages() {
    var list = getMsgs(), sel = list.length ? list[0].id : null, q = '';
    $('#content').innerHTML = '<div class="page-head"><div><h1>Messages</h1><p>Enquiries submitted through the Contact page.</p></div><button class="btn sec" id="markAll">Mark all read</button></div><div class="card mail" id="mail"></div>';
    function draw() {
      list = getMsgs();
      var shown = list.filter(function (m) { return !q || (m.name + m.email + m.message).toLowerCase().indexOf(q) > -1; });
      var cur = list.filter(function (m) { return m.id === sel; })[0];
      $('#mail').innerHTML = '<div class="mail-list">' + (shown.length ? shown.map(function (m) {
        return '<button class="mail-item' + (m.read ? '' : ' unread') + (m.id === sel ? ' sel' : '') + '" data-id="' + m.id + '"><b>' + esc(m.name) + '</b><small>' + esc(m.message) + '</small><small>' + esc(fmtDate(m.date)) + '</small></button>';
      }).join('') : '<div class="empty">No messages.</div>') + '</div><div class="mail-view">' + (cur ?
        '<h2>' + esc(cur.name) + '</h2><div class="meta"><span>' + esc(cur.email) + (cur.phone ? ' · ' + esc(cur.phone) : '') + '</span><span>' + esc(fmtDate(cur.date)) + '</span></div><div class="body">' + esc(cur.message) + '</div>' +
        '<div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap"><a class="btn" href="mailto:' + esc(cur.email) + '?subject=Re: Your enquiry">Reply by email</a><button class="btn sec" id="toggleRead">' + (cur.read ? 'Mark unread' : 'Mark read') + '</button><button class="btn danger" id="delMsg">' + ic('trash') + 'Delete</button></div>'
        : '<div class="empty">Select a message to read it.</div>') + '</div>';
      unread = list.filter(function (m) { return !m.read; }).length;
      var b = $('.side-nav .badge'); if (b) { if (unread) b.textContent = unread; else b.remove(); }
    }
    searchHandler = function (v) { q = v.trim().toLowerCase(); draw(); };
    $('#mail').addEventListener('click', function (e) {
      var it = e.target.closest('.mail-item');
      if (it) { sel = +it.getAttribute('data-id'); var all = getMsgs(); all.forEach(function (m) { if (m.id === sel) m.read = true; }); putMsgs(all); draw(); return; }
      if (e.target.closest('#toggleRead')) { var a = getMsgs(); a.forEach(function (m) { if (m.id === sel) m.read = !m.read; }); putMsgs(a); draw(); }
      if (e.target.closest('#delMsg')) confirmBox('Delete this message?', function () { putMsgs(getMsgs().filter(function (m) { return m.id !== sel; })); var r = getMsgs(); sel = r.length ? r[0].id : null; draw(); toast('Message deleted.'); });
    });
    $('#markAll').addEventListener('click', function () { var a = getMsgs(); a.forEach(function (m) { m.read = true; }); putMsgs(a); draw(); toast('All marked as read.'); });
    if (sel) { var a0 = getMsgs(); a0.forEach(function (m) { if (m.id === sel) m.read = true; }); putMsgs(a0); }
    draw();
  }

  /* ============ Settings ============ */
  function settings() {
    var s = data.settings;
    var pp = Object.assign({}, store.defaults.settings.popup, s.popup || {});
    $('#content').innerHTML = '<div class="page-head"><div><h1>Settings</h1><p>Company details, appearance, security and data.</p></div></div>' +
      '<div class="grid two even" style="align-items:start">' +
      '<form class="card" id="cForm"><h3>Contact details</h3><div class="modal-body" style="padding:0">' +
      fld('company', 'Company name', s.company) + fld('phone1', 'Phone 1', s.phone1) + fld('phone2', 'Phone 2', s.phone2) + fld('email', 'Email', s.email) +
      '<div class="field"><label for="s_address">Address (one line per row)</label><textarea id="s_address">' + esc((s.address || []).join('\n')) + '</textarea></div>' +
      '<div><button class="btn" type="submit">Save changes</button></div></div></form>' +
      '<div class="grid">' +
      '<form class="card" id="popForm"><h3>Home page popup <a href="../index.html?popup=1" target="_blank" rel="noopener" style="font-size:.82rem">Preview</a></h3><div class="modal-body" style="padding:0">' +
      '<div class="field check"><input type="checkbox" id="pp_enabled"' + (pp.enabled ? ' checked' : '') + '><label for="pp_enabled" style="margin:0">Show to new visitors (once per session)</label></div>' +
      pfld('eyebrow', 'Eyebrow', pp.eyebrow) + pfld('title', 'Headline', pp.title) + pfld('emphasis', 'Italic emphasis (optional)', pp.emphasis) +
      '<div class="field"><label for="pp_text">Message</label><textarea id="pp_text">' + esc(pp.text) + '</textarea></div>' + pfld('cta', 'Button label', pp.cta) + pfld('link', 'Button link', pp.link) +
      '<div><button class="btn" type="submit">Save popup</button></div></div></form>' +
      '<form class="card" id="pForm"><h3>Change password</h3><div class="modal-body" style="padding:0">' +
      '<div class="field"><label for="p_cur">Current password</label><input id="p_cur" type="password" autocomplete="current-password"></div>' +
      '<div class="field"><label for="p_new">New password (min 8 chars)</label><input id="p_new" type="password" autocomplete="new-password"></div>' +
      '<div><button class="btn" type="submit">Update password</button></div></div></form>' +
      '<div class="card"><h3>Data management</h3><p style="color:var(--muted);margin-top:0">Export a backup, import one, or restore the original demo content.</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn sec" id="exp">Export JSON</button><label class="btn sec" style="cursor:pointer">Import JSON<input type="file" id="imp" accept="application/json" hidden></label><button class="btn danger" id="rst">Reset to defaults</button></div></div>' +
      '</div></div>';
    function pfld(k, l, v) { return '<div class="field"><label for="pp_' + k + '">' + l + '</label><input id="pp_' + k + '" type="text" value="' + esc(v) + '"></div>'; }
    function fld(k, l, v) { return '<div class="field"><label for="s_' + k + '">' + l + '</label><input id="s_' + k + '" type="text" value="' + esc(v) + '"></div>'; }
    $('#cForm').addEventListener('submit', function (e) {
      e.preventDefault();
      ['company', 'phone1', 'phone2', 'email'].forEach(function (k) { s[k] = $('#s_' + k).value.trim(); });
      s.address = $('#s_address').value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
      persist(); toast('Settings saved.');
    });
    $('#popForm').addEventListener('submit', function (e) {
      e.preventDefault();
      s.popup = { enabled: $('#pp_enabled').checked, eyebrow: $('#pp_eyebrow').value.trim(), title: $('#pp_title').value.trim(), emphasis: $('#pp_emphasis').value.trim(), text: $('#pp_text').value.trim(), cta: $('#pp_cta').value.trim(), link: $('#pp_link').value.trim() || 'contact.html' };
      persist(); toast('Popup saved.');
    });
    $('#pForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var c = creds();
      if ($('#p_cur').value !== c.pw) return toast('Current password is incorrect.', true);
      if ($('#p_new').value.length < 8) return toast('New password must be at least 8 characters.', true);
      c.pw = $('#p_new').value; localStorage.setItem(CRED, JSON.stringify(c)); e.target.reset(); toast('Password updated.');
    });
    $('#exp').addEventListener('click', function () {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      a.download = 'marshall-content-backup.json'; a.click();
    });
    $('#imp').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var d = JSON.parse(r.result);
          if (!d.portfolio || !d.services) throw new Error('bad');
          data = Object.assign(store.get(), d); persist(); toast('Backup imported.'); settings();
        } catch (err) { toast('That file is not a valid backup.', true); }
      };
      r.readAsText(f);
    });
    $('#rst').addEventListener('click', function () {
      confirmBox('Restore all content to the original defaults?', function () { store.reset(); data = store.get(); toast('Defaults restored.'); settings(); });
    });
  }

  /* ============ boot ============ */
  shell();
  if (page === 'dashboard') dashboard();
  else if (CFG[page]) crud(page);
  else if (page === 'messages') messages();
  else if (page === 'settings') settings();
})();
