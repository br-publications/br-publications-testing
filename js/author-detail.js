(function () {
  window.addEventListener('scroll', function () {
    document.querySelectorAll('.ap-top').forEach(function (t) { t.classList.toggle('show', window.scrollY > 400); });
  }, { passive: true });
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;
    if (t.closest('.ap-top')) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (t.closest('[data-back]')) { e.preventDefault(); history.back(); return; }
    var c = t.closest('.ap-pub');
    if (c && !t.closest('a')) { var l = c.querySelector('h3 a'); if (l) l.click(); }
  });
})();
