/* Home carousels (from HTML designs/Home.html) */
var sl=document.querySelectorAll('.slide'),cur=0;
function show(i){cur=(i+sl.length)%sl.length;sl.forEach(function(s,k){s.hidden=k!==cur;});}
document.getElementById('prev').addEventListener('click',function(){show(cur-1);});
document.getElementById('next').addEventListener('click',function(){show(cur+1);});
sl.forEach(function(s,k){var t=document.createElement('div');t.className='ticks';for(var j=0;j<sl.length;j++){var b=document.createElement('button');b.type='button';b.className='tick'+(j===k?' active':'');b.setAttribute('aria-label','Show book '+(j+1));(function(j){b.addEventListener('click',function(){show(j);});})(j);t.appendChild(b);}s.querySelector('.copy').appendChild(t);});
function initCarousel(a){var tr=document.getElementById(a[0]),cs=tr.children,dots=document.getElementById(a[1]),pv=document.getElementById(a[2]),nx=document.getElementById(a[3]),pp=document.getElementById(a[4]),playing=!window.matchMedia('(prefers-reduced-motion:reduce)').matches,held=false;
function step(){return cs[0].getBoundingClientRect().width+(parseFloat(getComputedStyle(tr).columnGap)||20);}
function per(){return Math.max(1,Math.round(tr.clientWidth/step()));}
function pages(){return Math.ceil(cs.length/per());}
function max(){return tr.scrollWidth-tr.clientWidth;}
function mark(){var p=pages(),m=max(),i=m<=1?0:Math.round(tr.scrollLeft/m*(p-1));[].forEach.call(dots.children,function(d,k){d.classList.toggle('on',k===i);if(k===i){d.setAttribute('aria-current','true');}else{d.removeAttribute('aria-current');}});}
function build(){dots.innerHTML='';for(var i=0;i<pages();i++){(function(i){var b=document.createElement('button');b.type='button';b.className='tb-dot';b.setAttribute('aria-label','Go to page '+(i+1));b.addEventListener('click',function(){tr.scrollTo({left:Math.min(i*per()*step(),max()),behavior:'smooth'});});dots.appendChild(b);})(i);}mark();}
function go(dir){var m=max();if(dir>0&&tr.scrollLeft>=m-2){tr.scrollTo({left:0,behavior:'smooth'});}else if(dir<0&&tr.scrollLeft<=2){tr.scrollTo({left:m,behavior:'smooth'});}else{tr.scrollBy({left:dir*step()*per(),behavior:'smooth'});}}
function sync(){pp.dataset.state=playing?'playing':'paused';pp.setAttribute('aria-label',playing?'Pause automatic scrolling':'Play automatic scrolling');}
pv.addEventListener('click',function(){go(-1);});nx.addEventListener('click',function(){go(1);});
pp.addEventListener('click',function(){playing=!playing;sync();});
tr.addEventListener('scroll',function(){window.requestAnimationFrame(mark);},{passive:true});
['mouseenter','focusin'].forEach(function(e){tr.addEventListener(e,function(){held=true;});});
['mouseleave','focusout'].forEach(function(e){tr.addEventListener(e,function(){held=false;});});
window.addEventListener('resize',build);
setInterval(function(){if(playing&&!held&&!document.hidden){var m=max();if(tr.scrollLeft>=m-2){tr.scrollTo({left:0,behavior:'smooth'});}else{tr.scrollBy({left:step(),behavior:'smooth'});}}},3500);
build();sync();}
initCarousel(['tbTrack','tbDots','tbPrev','tbNext','tbPlay']);
initCarousel(['tbTrack2','tbDots2','tbPrev2','tbNext2','tbPlay2']);
