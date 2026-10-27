(function () {
  var ROOT = (typeof window.ROOT !== 'undefined') ? window.ROOT : '';

  /* ── Inject fetched HTML: insert before mount, then remove mount ── */
  function loadComponent(mountId, url, onReady) {
    var mount = document.getElementById(mountId);
    if (!mount) { if (onReady) onReady(null); return; }
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status + ' – ' + url);
        return r.text();
      })
      .then(function (html) {
        var resolved = html.replace(/\{\{ROOT\}\}/g, ROOT);
        mount.insertAdjacentHTML('afterend', resolved);
        mount.parentNode.removeChild(mount);
        if (onReady) onReady();
      })
      .catch(function (err) {
        console.error('[components] Failed to load:', url, err);
      });
  }

  /* ── Set active nav link based on current URL ── */
  function setActiveNav() {
    var currentPath = window.location.pathname;
    document.querySelectorAll('.nav a[href]').forEach(function (a) {
      a.removeAttribute('aria-current');
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      try {
        var resolved = new URL(href, window.location.href).pathname;
        var norm = resolved.replace(/\/$/, '/index.html');
        var cur  = currentPath.replace(/\/$/, '/index.html');
        if (norm === cur) a.setAttribute('aria-current', 'page');
      } catch (e) {}
    });
  }

  /* ── Nav interactivity (hamburger + dropdowns) ── */
  function initNav() {
    var btn = document.getElementById('menuBtn');
    var nav = document.getElementById('nav');
    if (btn && nav) {
      btn.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
    }

    var dds = document.querySelectorAll('.has-dd');
    function closeAll(except) {
      dds.forEach(function (d) {
        if (d !== except) {
          d.classList.remove('open');
          d.firstElementChild.setAttribute('aria-expanded', 'false');
        }
      });
    }
    dds.forEach(function (d) {
      var toggle = d.firstElementChild;
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        var opening = !d.classList.contains('open');
        closeAll(d);
        d.classList.toggle('open', opening);
        toggle.setAttribute('aria-expanded', String(opening));
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.has-dd')) closeAll();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
  }

  /* ── Footer helpers (year + FAB hide on footer scroll) ── */
  function initFooter() {
    var yr = document.getElementById('ftYear');
    if (yr) yr.textContent = new Date().getFullYear();

    var fab    = document.getElementById('fab');
    var footer = document.getElementById('footerPage');
    if (fab && footer && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        fab.classList.toggle('hide', entries[0].isIntersecting);
      }).observe(footer);
    }
  }

  /* ── Boot ── */
  loadComponent('site-header', ROOT + 'components/header.html', function () {
    setActiveNav();
    initNav();
  });

  loadComponent('site-footer', ROOT + 'components/footer.html', function () {
    initFooter();
  });

})();
