(function () {
  var cache = {};
  var current = null;

  function getText(name) {
    if (cache[name]) return Promise.resolve(cache[name]);
    var url = 'forms/' + name + '.html';
    var done = function (h) { return h.indexOf('<!-- end -->') !== -1; };
    var get = function (bust) {
      return fetch(url + (bust ? '?v=' + Date.now() : ''), { cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); });
    };
    return get(false).then(function (h) { return done(h) ? h : get(true); }).then(function (h) {
      if (!done(h)) throw new Error('incomplete response');
      cache[name] = h.slice(0, h.indexOf('<!-- end -->'));
      return cache[name];
    });
  }

  function closeModal() {
    if (!current) return;
    var c = current; current = null;
    c.modal.remove();
    document.body.style.overflow = c.prevOverflow;
    document.removeEventListener('keydown', c.onKey);
    if (c.trigger && c.trigger.focus) c.trigger.focus();
  }

  function openForm(name, preset, trigger) {
    closeModal();
    var modal = document.createElement('div');
    modal.className = 'fm-modal';
    modal.innerHTML = '<div class="fm-modal-box" role="dialog" aria-modal="true" aria-labelledby="fm-title">' +
      '<button type="button" class="fm-modal-x" aria-label="Close form"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<div class="fm-modal-body"><p class="fm-modal-loading">Loading form\u2026</p></div></div>';
    document.body.appendChild(modal);
    var box = modal.querySelector('.fm-modal-box');
    var body = modal.querySelector('.fm-modal-body');
    var onKey = function (e) {
      if (e.key === 'Escape' && !modal.querySelector('dialog[open]')) closeModal();
    };
    current = { modal: modal, trigger: trigger, prevOverflow: document.body.style.overflow, onKey: onKey };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    modal.addEventListener('mousedown', function (e) { if (e.target === modal) closeModal(); });
    modal.querySelector('.fm-modal-x').addEventListener('click', closeModal);
    modal.querySelector('.fm-modal-x').focus();

    getText(name).then(function (html) {
      if (!current || current.modal !== modal) return;
      body.innerHTML = html;
      var S = JSON.parse(body.querySelector('#fm-spec').textContent);
      initForm(body, S, preset, box, closeModal, function () { openForm(name, preset, trigger); });
    }).catch(function (err) {
      console.error('[forms] failed to load', name, err);
      body.innerHTML = '<p class="fm-modal-loading">Could not load this form. Open the site through a local server (e.g. VS Code Live Server).</p>';
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-form]');
    if (!t) return;
    e.preventDefault();
    var role = t.getAttribute('data-preset');
    openForm(t.getAttribute('data-form'), role ? { appliedRole: role } : null, t);
  });

  function initForm(root, S, preset, box, onClose, onReset) {
var CC=[["IN","+91"],["US","+1"],["GB","+44"],["AE","+971"],["AU","+61"],["CA","+1"],["SG","+65"],["MY","+60"],["DE","+49"],["FR","+33"],["SA","+966"],["LK","+94"],["BD","+880"],["NP","+977"],["ZA","+27"],["NG","+234"]];
var st={step:0,v:{},files:{},err:{},co:[],nid:1,corr:'main',decl:false};
var fmap={};
var $=function(s,r){return (r||root).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||root).querySelectorAll(s))};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var IC={check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 up:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M6 10l6-6 6 6M4 20h16"/></svg>',
 x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
 plus:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
 back:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
 next:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
 trash:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>'};

/* ---- init ---- */
S.steps.forEach(function(s){(s.fields||[]).forEach(function(f){if(f.value!=null)st.v[f.name]=f.value;if(f.type==='tel')st.v[f.name+'.cc']='+91';if(f.type==='chapters')st.v[f.name]=[];});});
if(preset)Object.keys(preset).forEach(function(k){st.v[k]=preset[k]});

function key(p,n){return p+n}
function vis(f,p){return !f.showIf||st.v[p+f.showIf.name]===f.showIf.value}
function words(t){return String(t||'').trim().split(/\s+/).filter(Boolean).length}
function listFor(step){
  var out=[];
  if(step.repeat){st.co.forEach(function(id){step.repeat.forEach(function(f){out.push({f:f,p:'co'+id+'.'})})})}
  else if(step.fields){step.fields.forEach(function(f){out.push({f:f,p:''})})}
  return out;
}
function bookOf(){var b=st.v.bookTitle;return (S.books||[]).filter(function(x){return x.id===b})[0]}

/* ---- field markup ---- */
function fieldHTML(f,p){
  var k=key(p,f.name),id='f_'+k.replace(/\W/g,'_'),val=st.v[k]==null?'':st.v[k];
  fmap[k]={f:f,p:p};
  var req=!f.optional;
  var lab='<span>'+esc(f.label)+(req?'<span class="fm-req" aria-hidden="true">*</span>':'<span class="fm-opt">Optional</span>')+'</span>';
  if(f.maxWords)lab+='<span class="fm-count" data-count="'+k+'">'+words(val)+' / '+f.maxWords+' words</span>';
  var desc=id+'-e'+(f.help?' '+id+'-h':'');
  var c='';
  if(f.type==='select'){
    c='<select id="'+id+'" data-k="'+k+'"'+(req?' aria-required="true"':'')+' aria-describedby="'+desc+'"><option value="">'+esc(f.placeholder||'Select an option')+'</option>'+f.options.map(function(o){return '<option value="'+esc(o[0])+'"'+(val===o[0]?' selected':'')+'>'+esc(o[1])+'</option>'}).join('')+'</select>';
  }else if(f.type==='textarea'){
    c='<textarea id="'+id+'" data-k="'+k+'" rows="'+(f.rows||6)+'" placeholder="'+esc(f.placeholder||'')+'"'+(req?' aria-required="true"':'')+' aria-describedby="'+desc+'">'+esc(val)+'</textarea>';
  }else if(f.type==='tel'){
    var cc=st.v[k+'.cc']||'+91';
    c='<div class="fm-phone"><select data-cc="'+k+'" aria-label="Country code">'+CC.map(function(o){return '<option value="'+o[1]+'"'+(cc===o[1]?' selected':'')+'>'+o[0]+' ('+o[1]+')</option>'}).join('')+'</select><input type="tel" id="'+id+'" data-k="'+k+'" inputmode="numeric" autocomplete="tel-national" placeholder="'+esc(f.placeholder||'e.g. 9876543210')+'" value="'+esc(val)+'"'+(req?' aria-required="true"':'')+' aria-describedby="'+desc+'"></div>';
  }else if(f.type==='file'){
    var fl=st.files[k];
    c='<div class="fm-file'+(fl?' has':'')+'" data-fwrap="'+k+'"><input class="fm-file-in sr" type="file" id="'+id+'" data-k="'+k+'" accept="'+esc(f.accept||'')+'" aria-describedby="'+desc+'"><label class="fm-file-btn" for="'+id+'">'+IC.up+esc(f.btn||'Choose file')+'</label><span class="fm-file-name">'+(fl?esc(fl.name):'No file chosen')+'</span><button type="button" class="fm-file-x" data-clear="'+k+'" aria-label="Remove file">'+IC.x+'</button></div>';
  }else if(f.type==='chapters'){
    var bk=bookOf();
    if(!bk)c='<div class="fm-chaps"><p class="fm-chaps-empty">Please select a book title first</p></div>';
    else c='<div class="fm-chaps" role="group" aria-labelledby="'+id+'-l">'+bk.chapters.map(function(ch,i){var cid=bk.id+'-'+i;return '<label class="fm-chap"><input type="checkbox" data-chap="'+k+'" value="'+cid+'"'+((val||[]).indexOf(cid)>-1?' checked':'')+'><span>'+esc(ch)+'</span></label>'}).join('')+'</div><p class="fm-sel-sum" data-sum="'+k+'">'+selSum(val)+'</p>';
  }else{
    c='<input type="'+(f.type==='email'?'email':'text')+'" id="'+id+'" data-k="'+k+'" value="'+esc(val)+'" placeholder="'+esc(f.placeholder||'')+'"'+(f.readonly?' readonly':'')+(req?' aria-required="true"':'')+' aria-describedby="'+desc+'"'+(f.type==='email'?' autocomplete="email"':'')+'>';
  }
  var head=(f.type==='chapters'||f.type==='file')?'<div class="fm-label" id="'+id+'-l">'+lab+'</div>':'<label for="'+id+'">'+lab+'</label>';
  return '<div class="fm-field'+(f.w==='full'?' fm-full':'')+(st.err[k]?' has-err':'')+'" data-wrap="'+k+'">'+head+c+(f.help?'<p class="fm-help" id="'+id+'-h">'+esc(f.help)+'</p>':'')+'<p class="fm-err" id="'+id+'-e" data-err="'+k+'" aria-live="polite">'+esc(st.err[k]||'')+'</p></div>';
}
function selSum(v){return v&&v.length?'Selected: '+v.length+' chapter'+(v.length!==1?'s':''):''}
function gridHTML(fields,p){return '<div class="fm-grid">'+fields.map(function(f){return vis(f,p)?fieldHTML(f,p):''}).join('')+'</div>'}
function corrHTML(id){return '<label class="fm-corr"><input type="checkbox" data-corr="'+id+'"'+(st.corr===id?' checked':'')+'> Corresponding author</label>'}

function repeatHTML(s){
  var n=st.co.length,max=s.max||6;
  var h='<div class="fm-co-head"><p>'+esc(s.hint||'')+' <strong>'+n+' / '+max+'</strong> added.</p><button type="button" class="fm-btn" data-add="1"'+(n>=max?' disabled':'')+'>'+IC.plus+'Add co-author</button></div>';
  if(!n)h+='<div class="fm-empty"><strong>No co-authors added yet</strong>This step is optional. Use the button above to add the people who contributed to this work, or continue to the next step.</div>';
  st.co.forEach(function(id,i){
    h+='<div class="fm-co" data-co="'+id+'"><div class="fm-co-top"><h3>Co-author '+(i+1)+'</h3><button type="button" class="fm-btn danger sm" data-rm="'+id+'" aria-label="Remove co-author '+(i+1)+'">'+IC.trash+'Remove</button></div>'+gridHTML(s.repeat,'co'+id+'.')+(S.corresponding?corrHTML(id):'')+'</div>';
  });
  return h;
}

/* ---- review ---- */
function dispVal(f,k){
  var v=st.v[k];
  if(f.type==='file')return st.files[k]?st.files[k].name:'';
  if(f.type==='select'){var o=f.options.filter(function(x){return x[0]===v})[0];return o?o[1]:''}
  if(f.type==='tel')return v?(st.v[k+'.cc']||'+91')+' '+v:'';
  if(f.type==='chapters'){var bk=bookOf();return bk?(v||[]).map(function(c){return bk.chapters[parseInt(c.split('-')[1],10)]}).join('\n'):''}
  return v||'';
}
function dlHTML(step,p){
  return '<dl class="fm-rv">'+step.map(function(f){
    if(!vis(f,p))return '';
    var k=key(p,f.name),d=dispVal(f,k);
    var full=(f.w==='full'||f.type==='textarea'||f.type==='chapters')?' class="full"':'';
    return '<div'+full+'><dt>'+esc(f.label)+'</dt><dd>'+(d?esc(d):'<span style="color:var(--color-text-muted)">Not provided</span>')+'</dd></div>';
  }).join('')+'</dl>';
}
function reviewHTML(){
  var h='';
  S.steps.forEach(function(s,i){
    if(s.type==='review')return;
    if(s.repeat){
      if(!st.co.length)return;
      h+='<section class="fm-rv-sec"><div class="fm-rv-top"><h3>Co-authors ('+st.co.length+')</h3><button type="button" class="fm-btn ghost sm" data-goto="'+i+'">Edit</button></div>';
      st.co.forEach(function(id,j){h+='<div style="margin-bottom:'+(j<st.co.length-1?'20px':'0')+'"><h3 style="display:flex;gap:10px;align-items:center;margin-bottom:12px;font-size:var(--fs-base)">Co-author '+(j+1)+(st.corr===id?'<span class="fm-badge">Corresponding</span>':'')+'</h3>'+dlHTML(s.repeat,'co'+id+'.')+'</div>'});
      h+='</section>';return;
    }
    h+='<section class="fm-rv-sec"><div class="fm-rv-top"><h3>'+esc(s.title)+(S.corresponding&&i===0&&st.corr==='main'?'<span class="fm-badge">Corresponding</span>':'')+'</h3><button type="button" class="fm-btn ghost sm" data-goto="'+i+'">Edit</button></div>'+dlHTML(s.fields,'')+'</section>';
  });
  if(S.declaration)h+='<section class="fm-decl"><h3>Declaration</h3><p>'+esc(S.declaration.text)+'</p><label><input type="checkbox" id="fm-decl"'+(st.decl?' checked':'')+'><span>'+esc(S.declaration.label)+'</span></label></section>';
  return h;
}

/* ---- render ---- */
function renderSteps(){
  $('#fm-steps').innerHTML=S.steps.map(function(s,i){
    var cls=i<st.step?'done':(i===st.step?'current':'');
    return '<li class="'+cls+'"><button type="button" data-goto="'+i+'"'+(i===st.step?' aria-current="step"':'')+'><span class="fm-dot">'+(i<st.step?IC.check:(i+1))+'</span><span class="fm-slabel">'+esc(s.label)+'</span></button></li>';
  }).join('');
}
function render(opts){
  fmap={};
  var s=S.steps[st.step],last=st.step===S.steps.length-1;
  var h='<div class="fm-stephead"><p class="fm-stepno">Step '+(st.step+1)+' of '+S.steps.length+'</p><h2 id="fm-h" tabindex="-1">'+esc(s.title)+'</h2>'+(s.desc?'<p>'+esc(s.desc)+'</p>':'')+'</div>';
  if(s.type==='review')h+=reviewHTML();
  else if(s.repeat)h+=repeatHTML(s);
  else{h+=gridHTML(s.fields,'');if(S.corresponding&&st.step===0)h+=corrHTML('main');}
  $('#fm-body').innerHTML=h;
  renderSteps();
  var a='';
  a+=st.step>0?'<button type="button" class="fm-btn ghost" data-prev="1">'+IC.back+'Previous</button>':'<span class="fm-spacer"></span>';
  a+=last?'<button type="submit" class="fm-btn" id="fm-submit"'+(S.declaration&&!st.decl?' disabled':'')+'>'+esc(S.submitLabel||'Submit')+IC.check+'</button>':'<button type="button" class="fm-btn" data-next="1">Next'+IC.next+'</button>';
  $('#fm-actions').innerHTML=a;
  if(opts&&opts.focus){var el=$('#fm-h');box.scrollTo({top:0,behavior:'smooth'});el&&el.focus({preventScroll:true});}
}

/* ---- validation ---- */
function check(f,k,p){
  if(!vis(f,p))return '';
  var v=st.v[k],empty;
  if(f.type==='file')empty=!st.files[k];
  else if(f.type==='chapters')empty=!(v&&v.length);
  else empty=v==null||!String(v).trim();
  if(empty)return f.optional?'':(f.reqMsg||(f.type==='select'?'Please select an option':'This field is required'));
  if(f.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))return 'Enter a valid email address, e.g. name@example.com';
  if(f.type==='tel'&&String(v).replace(/\D/g,'').length<10)return 'Phone number needs at least 10 digits';
  if(f.maxWords&&words(v)>f.maxWords)return 'Must not exceed '+f.maxWords+' words';
  if(f.link&&!/^https?:\/\//i.test(v))return 'Paste the full link, starting with https://';
  return '';
}
function validateStep(i){
  var bad=[];
  listFor(S.steps[i]).forEach(function(x){var k=key(x.p,x.f.name),e=check(x.f,k,x.p);if(e){st.err[k]=e;bad.push(k)}else delete st.err[k]});
  return bad;
}
function paint(){
  $$('[data-err]').forEach(function(el){var k=el.getAttribute('data-err'),e=st.err[k]||'';el.textContent=e;var w=el.closest('.fm-field');if(w)w.classList.toggle('has-err',!!e);var inp=w&&w.querySelector('[data-k]');if(inp){if(e)inp.setAttribute('aria-invalid','true');else inp.removeAttribute('aria-invalid');}});
}
function focusFirst(k){var el=root.querySelector('[data-k="'+k+'"]');if(el){el.scrollIntoView({block:'center',behavior:'smooth'});el.focus({preventScroll:true});}}

/* ---- dialog ---- */
function alertBox(type,title,msg){
  var d=$('#fm-dlg');
  $('#fm-dlg-box').className='fm-dlg '+type;
  $('#fm-dlg-ic').textContent={error:'!',success:'✓',info:'i',warning:'!'}[type]||'i';
  $('#fm-dlg-t').textContent=title;$('#fm-dlg-m').textContent=msg;
  if(d.showModal)d.showModal();else d.setAttribute('open','');
}

/* ---- navigation ---- */
function go(t){
  if(t===st.step)return;
  if(t>st.step){
    for(var i=st.step;i<t;i++){
      var bad=validateStep(i);
      if(bad.length){st.step=i;render({focus:true});setTimeout(function(){paint();focusFirst(bad[0])},60);alertBox('error','Validation error',S.steps[i].errMsg||'Please fill in all required fields correctly.');return;}
    }
  }
  st.step=t;render({focus:true});
}

/* ---- events ---- */
var form=$('#fm-form');
form.addEventListener('input',function(e){
  var t=e.target,k=t.getAttribute('data-k');if(!k)return;
  var m=fmap[k];if(!m||t.type==='file'||t.tagName==='SELECT')return;
  if(m.f.type==='tel'){var d=t.value.replace(/\D/g,'').slice(0,15);if(d!==t.value)t.value=d;}
  st.v[k]=t.value;
  if(m.f.maxWords){var c=$('[data-count="'+k+'"]'),n=words(t.value);c.textContent=n+' / '+m.f.maxWords+' words';c.classList.toggle('over',n>m.f.maxWords);}
  if(st.err[k]){var er=check(m.f,k,m.p);if(er)st.err[k]=er;else delete st.err[k];paint();}
});
form.addEventListener('focusout',function(e){
  var t=e.target,k=t.getAttribute&&t.getAttribute('data-k');if(!k||t.type==='file')return;
  var m=fmap[k];if(!m)return;var er=check(m.f,k,m.p);if(er)st.err[k]=er;else delete st.err[k];paint();
});
form.addEventListener('change',function(e){
  var t=e.target;
  if(t.hasAttribute('data-cc')){st.v[t.getAttribute('data-cc')+'.cc']=t.value;return;}
  if(t.hasAttribute('data-chap')){
    var k=t.getAttribute('data-chap'),a=st.v[k]||[],i=a.indexOf(t.value);
    if(t.checked&&i<0)a.push(t.value);if(!t.checked&&i>-1)a.splice(i,1);st.v[k]=a;
    $('[data-sum="'+k+'"]').textContent=selSum(a);
    if(st.err[k]){delete st.err[k];paint();}return;
  }
  if(t.hasAttribute('data-corr')){var id=t.getAttribute('data-corr');if(id==='main'&&!t.checked){t.checked=true;return;}st.corr=t.checked?id:'main';render();return;}
  if(t.id==='fm-decl'){st.decl=t.checked;$('#fm-submit').disabled=!st.decl;return;}
  var k2=t.getAttribute('data-k');if(!k2)return;var m=fmap[k2];if(!m)return;
  if(t.type==='file'){
    var fl=t.files&&t.files[0];if(!fl)return;
    var lim=m.f.maxMB;
    if(lim&&fl.size>lim*1048576){t.value='';alertBox('error','File too large','Please choose a file under '+lim+' MB.');return;}
    setFile(k2,fl);return;
  }
  st.v[k2]=t.value;
  var dep=false;
  S.steps[st.step].fields&&S.steps[st.step].fields.forEach(function(f){if(f.showIf&&f.showIf.name===m.f.name||f.dependsOn===m.f.name)dep=true});
  (S.steps[st.step].repeat||[]).forEach(function(f){if(f.showIf&&f.showIf.name===m.f.name)dep=true});
  if(m.f.name==='bookTitle')st.v.chapters=[];
  if(dep){render();var el=root.querySelector('[data-k="'+k2+'"]');el&&el.focus();}
  if(st.err[k2]){var er=check(m.f,k2,m.p);if(er)st.err[k2]=er;else delete st.err[k2];paint();}
});
function setFile(k,fl){
  if(fl)st.files[k]=fl;else delete st.files[k];st.v[k]=fl?fl.name:'';
  var w=$('[data-fwrap="'+k+'"]');if(!w)return;
  w.classList.toggle('has',!!fl);$('.fm-file-name',w).textContent=fl?fl.name:'No file chosen';
  var old=$('.fm-thumb',w);if(old)old.remove();
  if(fl&&/^image\//.test(fl.type)){var im=document.createElement('img');im.className='fm-thumb';im.alt='';im.src=URL.createObjectURL(fl);w.insertBefore(im,w.firstChild);}
  if(fl&&st.err[k]){delete st.err[k];paint();}
}
form.addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-next'))go(st.step+1);
  else if(b.hasAttribute('data-prev'))go(st.step-1);
  else if(b.hasAttribute('data-goto'))go(parseInt(b.getAttribute('data-goto'),10));
  else if(b.hasAttribute('data-add')){if(st.co.length>=(S.steps[st.step].max||6)){alertBox('warning','Maximum co-authors','You can add a maximum of '+(S.steps[st.step].max||6)+' co-authors.');return;}st.co.push(st.nid++);render();}
  else if(b.hasAttribute('data-rm')){var id=parseInt(b.getAttribute('data-rm'),10);st.co=st.co.filter(function(x){return x!==id});Object.keys(st.err).forEach(function(k){if(k.indexOf('co'+id+'.')===0)delete st.err[k]});if(st.corr===id)st.corr='main';render();}
  else if(b.hasAttribute('data-clear')){var k=b.getAttribute('data-clear');var inp=root.querySelector('input[type=file][data-k="'+k+'"]');if(inp)inp.value='';setFile(k,null);}
});
$('#fm-steps').addEventListener('click',function(e){var b=e.target.closest('button');if(b)go(parseInt(b.getAttribute('data-goto'),10));});
form.addEventListener('submit',function(e){
  e.preventDefault();
  if(S.declaration&&!st.decl){alertBox('error','Declaration required','Please accept the declaration before submitting.');return;}
  for(var i=0;i<S.steps.length;i++){if(S.steps[i].type==='review')continue;var bad=validateStep(i);if(bad.length){st.step=i;render({focus:true});setTimeout(function(){paint();focusFirst(bad[0])},60);alertBox('error','Validation error','Please correct all errors before submitting.');return;}}
  var btn=$('#fm-submit');btn.disabled=true;btn.textContent='Submitting…';
  setTimeout(function(){
    $('#fm-card').innerHTML='<div class="fm-done"><div class="fm-done-ic">'+IC.check+'</div><h2>'+esc(S.success.title)+'</h2><p>'+esc(S.success.text)+'</p><div class="row"><button type="button" class="fm-btn" id="fm-close2">'+esc(S.success.cta)+'</button><button type="button" class="fm-btn ghost" id="fm-again">Submit another</button></div></div>';
    $('#fm-close2').addEventListener('click',onClose);
    $('#fm-again').addEventListener('click',onReset);
    box.scrollTo({top:0,behavior:'smooth'});
  },700);
});
$('#fm-dlg-x').addEventListener('click',function(){$('#fm-dlg').close()});
$('#fm-dlg').addEventListener('click',function(e){if(e.target===this)this.close()});
render();
  }
})();
