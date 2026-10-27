(function () {
  var pages = {
    home:    document.getElementById('pg-home'),
    about:   document.getElementById('pg-about'),
    contact: document.getElementById('pg-contact'),
    ipr:     document.getElementById('pg-ipr'),
    'web-app':    document.getElementById('pg-web-app'),
    'mobile-app': document.getElementById('pg-mobile-app'),
    internship:  document.getElementById('pg-internship'),
    'book-guidelines': document.getElementById('pg-book-guidelines'),
    books:       document.getElementById('pg-books'),
    'book-details': document.getElementById('pg-book-details'),
    'chapter-guidelines': document.getElementById('pg-chapter-guidelines'),
    chapters:    document.getElementById('pg-chapters'),
    'chapter-details': document.getElementById('pg-chapter-details'),
    chapter:     document.getElementById('pg-chapter'),
    author:      document.getElementById('pg-author'),
    editor:      document.getElementById('pg-editor')
  };

  var titles = {
    home:    'ResNova Academic Press',
    about:   'About Us – ResNova Academic Press',
    contact: 'Contact Us – ResNova Academic Press',
    ipr:     'Intellectual Property Rights (IPR) Services – ResNova Academic Press',
    'web-app':    'Web Application Development – ResNova Academic Press',
    'mobile-app': 'Mobile Application Development – ResNova Academic Press',
    internship:  'Student Internship Program – ResNova Academic Press',
    'book-guidelines': 'Book Author Guidelines – ResNova Academic Press',
    books:       'Our Books – ResNova Academic Press',
    'book-details': 'Book Details – ResNova Academic Press',
    'chapter-guidelines': 'Book Chapter Author Guidelines – ResNova Academic Press',
    chapters:    'Book Chapters – ResNova Academic Press',
    'chapter-details': 'Book Chapter Details – ResNova Academic Press',
    chapter:     'Chapter – ResNova Academic Press',
    author:      'Author – ResNova Academic Press',
    editor:      'Editor – ResNova Academic Press'
  };

  // Pages loaded on demand from userPages/
  var remote = {
    ipr: 'userPages/ipr.html',
    'web-app': 'userPages/web-app-development.html',
    'mobile-app': 'userPages/mobile-app-development.html',
    internship: 'userPages/student-internship-program.html',
    'book-guidelines': 'userPages/textbook-author-guidelines.html',
    books: 'userPages/books-list.html',
    'book-details': 'userPages/book-details.html',
    'chapter-guidelines': 'userPages/book-chapter-author-guidelines.html',
    chapters: 'userPages/book-chapters-list.html',
    'chapter-details': 'userPages/book-chapter-details.html',
    chapter: 'userPages/chapter-detail-page.html',
    author: 'userPages/author-detail-page.html',
    editor: 'userPages/editor-detail-page.html'
  };
  var loading = {};

  function parse() {
    var parts = window.location.hash.replace('#', '').split('/');
    var name = pages[parts[0]] ? parts[0] : 'home';
    return { name: name, sub: parts[1] || '' };
  }

  function load(name) {
    var el = pages[name];
    if (!remote[name] || el.dataset.loaded) return Promise.resolve();
    if (!loading[name]) {
      var get = function (bust) {
        return fetch(remote[name] + (bust ? '?v=' + Date.now() : ''), { cache: 'no-store' })
          .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); });
      };
      var complete = function (h) { return h.indexOf('<!-- end -->') !== -1; };
      loading[name] = get(false)
        .then(function (h) { return complete(h) ? h : get(true); })
        .then(function (html) {
          if (!complete(html)) throw new Error('incomplete response');
          el.innerHTML = html.slice(0, html.indexOf('<!-- end -->')); el.dataset.loaded = '1';
        })
        .catch(function (err) {
          loading[name] = null;
          el.innerHTML = '<p style="padding:48px 24px;text-align:center">Could not load this page. Open the site through a local server (e.g. VS Code Live Server).</p>';
          console.error('[router] failed to load', remote[name], err);
        });
    }
    return loading[name];
  }

  function scrollToSub(sub) {
    var target = sub && document.getElementById(sub);
    if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
  }

  var lastName = null;

  function navigate() {
    var route = parse();
    var name = route.name;

    Object.keys(pages).forEach(function (k) {
      if (pages[k]) pages[k].hidden = (k !== name);
    });
    document.title = titles[name] || titles.home;

    document.querySelectorAll('.nav a[href]').forEach(function (a) {
      a.removeAttribute('aria-current');
      var h = a.getAttribute('href');
      if (h === '#' + name) a.setAttribute('aria-current', 'page');
    });

    var nav = document.getElementById('nav');
    if (nav) nav.classList.remove('open');
    document.querySelectorAll('.has-dd.open').forEach(function (d) {
      d.classList.remove('open');
      d.firstElementChild.setAttribute('aria-expanded', 'false');
    });

    lastName = name;
    load(name).then(function () {
      if (lastName === name) scrollToSub(route.sub);
    });
  }

  // FAQ accordions inside loaded pages (wad-/mad-)
  document.addEventListener('click', function (e) {
    var q = e.target.closest('.wad-faq-q, .mad-faq-q');
    if (!q) return;
    var item = q.closest('.wad-faq-item, .mad-faq-item');
    var open = !item.classList.contains('open');
    item.parentNode.querySelectorAll('.open').forEach(function (i) {
      i.classList.remove('open');
      var b = i.querySelector('[aria-expanded]'); if (b) b.setAttribute('aria-expanded', 'false');
    });
    if (open) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
  });

  // Book search on the books page
  document.addEventListener('input', function (e) {
    if (e.target.id !== 'bp-q') return;
    var v = e.target.value.trim().toLowerCase(), n = 0;
    document.querySelectorAll('.bp-card').forEach(function (k) {
      var m = !v || k.dataset.search.indexOf(v) > -1; k.hidden = !m; if (m) n++;
    });
    document.getElementById('bp-count').textContent = 'Showing ' + n + ' book' + (n === 1 ? '' : 's');
    document.getElementById('bp-empty').classList.toggle('show', n === 0);
  });

  window.addEventListener('hashchange', navigate);
  navigate();
})();
