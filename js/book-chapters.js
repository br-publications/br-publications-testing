(function () {
  var B = {title:'Artificial Intelligence and IoT for Intelligent Prediction and Decision Support in Real-World Application',publisher:'ResNova Academic Press',year:'2026',pages:'470',doi:'10.65470/resnova.9788169011723'};
  var url = 'https://doi.org/' + B.doi;
  var F = {
    mla: function () { return 'Thangavelu, Arivanantham, et al., editors. <em>' + B.title + '</em>. ' + B.publisher + ', ' + B.year + ', p. ' + B.pages + ', ' + url + '.'; },
    apa: function () { return 'Thangavelu, A., Arunkumar, S., Ameen, N., &amp; Patil, B. D. (Eds.). (' + B.year + '). <em>' + B.title + '</em>. ' + B.publisher + '. ' + url; },
    chicago: function () { return 'Thangavelu, Arivanantham, S. Arunkumar, Nabeena Ameen, and Babasaheb Dnyandeo Patil, eds. ' + B.year + '. <em>' + B.title + '</em>. ' + B.publisher + '. ' + url + '.'; },
    harvard: function () { return 'Thangavelu, A., Arunkumar, S., Ameen, N. and Patil, B.D. (eds.) (' + B.year + ') <em>' + B.title + '</em>. ' + B.publisher + '. Available at: ' + url + '.'; },
    vancouver: function () { return 'Thangavelu A, Arunkumar S, Ameen N, Patil BD, editors. ' + B.title + '. ' + B.publisher + '; ' + B.year + '. Available from: ' + url; }
  };
  var cat = 'All';

  function flash(el, msg) { el.textContent = msg; setTimeout(function () { el.textContent = ''; }, 2500); }
  function copy(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(function () {});
  }
  function closeWraps(except) {
    document.querySelectorAll('.cd-pricewrap').forEach(function (w) {
      if (w !== except) { w.classList.remove('open'); w.querySelector('.cd-amount').setAttribute('aria-expanded', 'false'); }
    });
  }
  function renderCite() {
    var sel = document.getElementById('cd-style');
    if (sel) document.getElementById('cd-out').innerHTML = '<p>' + F[sel.value]() + '</p>';
  }
  function pick(tab) {
    document.querySelectorAll('.cd-tab').forEach(function (x) {
      var on = x === tab;
      x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
  }
  function tocRun() {
    var tq = document.getElementById('cd-toc-q');
    var v = tq.value.trim().toLowerCase(), n = 0;
    document.querySelectorAll('.cd-chap').forEach(function (c) {
      var ok = !v || c.dataset.search.indexOf(v) > -1; c.hidden = !ok; if (ok) n++;
    });
    var fr = document.getElementById('cd-front'), bk = document.getElementById('cd-back'), nr = document.getElementById('cd-noresult');
    fr.hidden = bk.hidden = !!v;
    nr.hidden = !(v && n === 0);
    nr.textContent = v && n === 0 ? 'No chapters found matching "' + tq.value.trim() + '".' : '';
  }
  function listRun() {
    var q = document.getElementById('cp-q');
    var v = q.value.trim().toLowerCase(), n = 0;
    document.querySelectorAll('.cp-card').forEach(function (k) {
      var ok = (cat === 'All' || k.dataset.category === cat) && (!v || k.dataset.search.indexOf(v) > -1);
      k.hidden = !ok; if (ok) n++;
    });
    document.getElementById('cp-count').textContent = 'Showing ' + n + ' book' + (n === 1 ? '' : 's');
    document.getElementById('cp-empty-msg').textContent = v ? 'No book chapter was found for "' + q.value.trim() + '".' : 'No books available in this category.';
    document.getElementById('cp-empty').classList.toggle('show', n === 0);
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;
    var chip = t.closest('.cp-chip');
    if (chip) {
      cat = chip.dataset.cat;
      document.querySelectorAll('.cp-chip').forEach(function (x) { x.setAttribute('aria-pressed', x === chip); });
      listRun(); return;
    }
    var tab = t.closest('.cd-tab');
    if (tab) { pick(tab); return; }
    if (t.closest('#cd-toc-go')) { tocRun(); return; }
    var isbn = t.closest('#cd-isbn');
    if (isbn) { copy(isbn.textContent, function () { flash(document.getElementById('cd-toast'), 'ISBN copied to clipboard.'); }); return; }
    if (t.closest('#cd-cite-open')) { renderCite(); document.getElementById('cd-dialog').showModal(); return; }
    if (t.closest('#cd-cite-close')) { document.getElementById('cd-dialog').close(); return; }
    if (t.closest('#cd-copy-cite')) {
      copy(document.getElementById('cd-out').textContent.trim(), function () { flash(document.getElementById('cd-dtoast'), 'Citation copied to clipboard.'); });
      return;
    }
    if (t.id === 'cd-dialog') { t.close(); return; }
    var amount = t.closest('.cd-amount');
    if (amount) {
      var w = amount.closest('.cd-pricewrap');
      var o = !w.classList.contains('open');
      closeWraps(w); w.classList.toggle('open', o); amount.setAttribute('aria-expanded', o);
      return;
    }
    if (!t.closest('.cd-pricewrap')) closeWraps();
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'cp-q') listRun();
    else if (e.target.id === 'cd-toc-q') tocRun();
  });
  document.addEventListener('change', function (e) { if (e.target.id === 'cd-style') renderCite(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeWraps();
    var tab = e.target.closest && e.target.closest('.cd-tab');
    if (!tab) return;
    var tabs = [].slice.call(document.querySelectorAll('.cd-tab')), i = tabs.indexOf(tab), n = null;
    if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
    else if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (e.key === 'Home') n = tabs[0];
    else if (e.key === 'End') n = tabs[tabs.length - 1];
    if (n) { e.preventDefault(); n.focus(); pick(n); }
  });
})();
