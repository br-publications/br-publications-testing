(function () {
  var B = {authors:[{family:'Suresha',given:'S.'}],title:'Fundamentals of Physics and Modern Applications',publisher:'ResNova Academic Press',year:'2026',pages:'314',doi:'10.5281/zenodo.22752704',isbn:'978-81-69935-64-7'};
  var url = 'https://doi.org/' + B.doi;
  var A = B.authors[0];
  var F = {
    mla: function () { return A.family + ', ' + A.given + ' <em>' + B.title + '</em>. ' + B.publisher + ', ' + B.year + ', p. ' + B.pages + ', ' + url + '.'; },
    apa: function () { return A.family + ', ' + A.given + ' (' + B.year + '). <em>' + B.title + '</em>. ' + B.publisher + '. ' + url; },
    chicago: function () { return A.family + ', ' + A.given + ' ' + B.year + '. <em>' + B.title + '</em>. ' + B.publisher + '. ' + url + '.'; },
    harvard: function () { return A.family + ', ' + A.given + ' (' + B.year + ') <em>' + B.title + '</em>. ' + B.publisher + '. Available at: ' + url + '.'; },
    vancouver: function () { return A.family + ' ' + A.given.replace(/\./g, '') + '. ' + B.title + '. ' + B.publisher + '; ' + B.year + '. Available from: ' + url; }
  };

  function flash(el, msg) { el.textContent = msg; setTimeout(function () { el.textContent = ''; }, 2500); }
  function copy(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(function () {});
  }
  function closeWraps(except) {
    document.querySelectorAll('.bd-pricewrap').forEach(function (w) {
      if (w !== except) { w.classList.remove('open'); w.querySelector('.bd-amount').setAttribute('aria-expanded', 'false'); }
    });
  }
  function renderCite() {
    var sel = document.getElementById('bd-style');
    if (sel) document.getElementById('bd-out').innerHTML = '<p>' + F[sel.value]() + '</p>';
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;
    var isbn = t.closest('#bd-isbn');
    if (isbn) { copy(isbn.textContent, function () { flash(document.getElementById('bd-toast'), 'ISBN copied to clipboard.'); }); return; }
    if (t.closest('#bd-cite-open')) { renderCite(); document.getElementById('bd-dialog').showModal(); return; }
    if (t.closest('#bd-cite-close')) { document.getElementById('bd-dialog').close(); return; }
    if (t.closest('#bd-copy-cite')) {
      copy(document.getElementById('bd-out').textContent.trim(), function () { flash(document.getElementById('bd-dtoast'), 'Citation copied to clipboard.'); });
      return;
    }
    if (t.id === 'bd-dialog') { t.close(); return; }
    var amount = t.closest('.bd-amount');
    if (amount) {
      var w = amount.closest('.bd-pricewrap');
      var o = !w.classList.contains('open');
      closeWraps(w); w.classList.toggle('open', o); amount.setAttribute('aria-expanded', o);
      return;
    }
    if (!t.closest('.bd-pricewrap')) closeWraps();
  });
  document.addEventListener('change', function (e) { if (e.target.id === 'bd-style') renderCite(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeWraps(); });
})();
