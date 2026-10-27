/* Contact form submit + reset */
var form=document.getElementById('contactForm'),ok=document.getElementById('formOk'),again=document.getElementById('again');
if(form){
  form.addEventListener('submit',function(e){
    e.preventDefault();
    form.hidden=true;
    ok.hidden=false;
    ok.focus();
  });
}
if(again){
  again.addEventListener('click',function(){
    ok.hidden=true;
    form.hidden=false;
    form.reset();
    form.querySelector('input,select,textarea').focus();
  });
}
