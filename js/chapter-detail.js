(function () {
  var B={title:'Artificial Intelligence for Predictive Analytics in Smart Systems',book:'Artificial Intelligence and IoT for Intelligent Prediction and Decision Support in Real-World Application',publisher:'ResNova Academic Press',year:'2026',pages:'1-22',doi:'10.65470/resnova.9788169011723.01'};
  var url = 'https://doi.org/' + B.doi;
  var F={
    mla:function(){return 'Saveeithaa, S. V., and M. Ananthi. &ldquo;'+B.title+'.&rdquo; <em>'+B.book+'</em>, '+B.publisher+', '+B.year+', pp. '+B.pages+', '+url+'.';},
    apa:function(){return 'Saveeithaa, S. V., &amp; Ananthi, M. ('+B.year+'). '+B.title+'. In <em>'+B.book+'</em> (pp. '+B.pages+'). '+B.publisher+'. '+url;},
    chicago:function(){return 'Saveeithaa, S. V., and M. Ananthi. '+B.year+'. &ldquo;'+B.title+'.&rdquo; In <em>'+B.book+'</em>, '+B.pages+'. '+B.publisher+'. '+url+'.';},
    harvard:function(){return 'Saveeithaa, S.V. and Ananthi, M. ('+B.year+') &lsquo;'+B.title+'&rsquo;, in <em>'+B.book+'</em>. '+B.publisher+', pp. '+B.pages+'. Available at: '+url+'.';},
    vancouver:function(){return 'Saveeithaa SV, Ananthi M. '+B.title+'. In: '+B.book+'. '+B.publisher+'; '+B.year+'. p. '+B.pages+'. Available from: '+url;}
  };

  function flash(el, msg) { el.textContent = msg; setTimeout(function () { el.textContent = ''; }, 2500); }
  function copy(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(function () {});
  }
  function renderCite() {
    var sel = document.getElementById('chd-style');
    if (sel) document.getElementById('chd-out').innerHTML = '<p>' + F[sel.value]() + '</p>';
  }
  function tocRun() {
    var tq = document.getElementById('chd-toc-q');
    var v = tq.value.trim().toLowerCase(), n = 0;
    document.querySelectorAll('.chd-chap').forEach(function (c) {
      var ok = !v || c.dataset.search.indexOf(v) > -1; c.hidden = !ok; if (ok) n++;
    });
    var fr = document.getElementById('chd-front'), bk = document.getElementById('chd-back'), nr = document.getElementById('chd-noresult');
    fr.hidden = bk.hidden = !!v;
    nr.hidden = !(v && n === 0);
    nr.textContent = v && n === 0 ? 'No chapters found matching "' + tq.value.trim() + '".' : '';
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;
    if (t.closest('#chd-toc-go')) { tocRun(); return; }
    if (t.closest('#chd-cite-open')) { renderCite(); document.getElementById('chd-dialog').showModal(); return; }
    if (t.closest('#chd-cite-close')) { document.getElementById('chd-dialog').close(); return; }
    if (t.closest('#chd-copy-cite')) {
      copy(document.getElementById('chd-out').textContent.trim(), function () { flash(document.getElementById('chd-dtoast'), 'Citation copied to clipboard.'); });
      return;
    }
    if (t.id === 'chd-dialog') t.close();
  });
  document.addEventListener('input', function (e) { if (e.target.id === 'chd-toc-q') tocRun(); });
  document.addEventListener('change', function (e) { if (e.target.id === 'chd-style') renderCite(); });
})();
