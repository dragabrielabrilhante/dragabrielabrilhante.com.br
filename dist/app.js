'use strict';
const form=document.getElementById('leadForm');
const whatsappContact=document.getElementById('whatsappContact');
const whatsappNumber='5514998894616';
function buildWhatsAppUrl(){
 const data=new FormData(form);
 const name=String(data.get('name')||'').trim().slice(0,80);
 const allowedModalities=['On-line','Presencial em Marília','Ainda não decidi'];
 const selected=String(data.get('modality')||'');
 const modality=allowedModalities.includes(selected)?selected:'';
 const message=['Olá, Dra. Gabriela! Vim pelo site e gostaria de conversar sobre o agendamento de uma consulta.'];
 if(name)message.push('Nome: '+name);
 if(modality)message.push('Modalidade: '+modality);
 message.push('Quais são os próximos horários disponíveis?');
 return 'https://wa.me/'+whatsappNumber+'?text='+encodeURIComponent(message.join('\n'));
}
function updateWhatsAppLink(){whatsappContact.href=buildWhatsAppUrl();}
form.addEventListener('input',updateWhatsAppLink);
form.addEventListener('change',updateWhatsAppLink);
whatsappContact.addEventListener('click',updateWhatsAppLink);
form.addEventListener('submit',event=>{
 event.preventDefault();
 updateWhatsAppLink();
 whatsappContact.click();
});
const dialog=document.getElementById('privacyDialog');
for(const id of ['privacyForm','privacyFooter'])document.getElementById(id).addEventListener('click',()=>dialog.showModal());
document.getElementById('closePrivacy').addEventListener('click',()=>dialog.close());
updateWhatsAppLink();

const doctoraliaWidget=document.getElementById('doctoraliaWidget');
const doctoraliaLauncher=document.getElementById('doctoraliaLauncher');
const doctoraliaPanel=document.getElementById('doctoraliaPanel');
const doctoraliaClose=document.getElementById('doctoraliaClose');
function setDoctoraliaOpen(open,restoreFocus=true){
 doctoraliaWidget.classList.toggle('is-open',open);
 doctoraliaLauncher.setAttribute('aria-expanded',String(open));
 doctoraliaLauncher.hidden=open;
 doctoraliaPanel.hidden=!open;
 if(open)doctoraliaClose.focus({preventScroll:true});
 else if(restoreFocus)doctoraliaLauncher.focus({preventScroll:true});
}
doctoraliaLauncher.addEventListener('click',()=>setDoctoraliaOpen(true));
doctoraliaClose.addEventListener('click',()=>setDoctoraliaOpen(false));
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&!doctoraliaPanel.hidden){event.preventDefault();setDoctoraliaOpen(false);}
});
document.addEventListener('pointerdown',event=>{
 if(!doctoraliaPanel.hidden&&!doctoraliaWidget.contains(event.target))setDoctoraliaOpen(false,false);
});

// No celular, mantenha os controles livres e ofereça a Doctoralia dentro do formulário.
if(typeof window!=='undefined'&&typeof IntersectionObserver!=='undefined'){
 const mobileViewport=window.matchMedia('(max-width:700px)');
 let formInView=false;
 function syncDoctoraliaForMobile(){
  const hide=mobileViewport.matches&&formInView;
  if(hide&&!doctoraliaPanel.hidden)setDoctoraliaOpen(false,false);
  doctoraliaWidget.classList.toggle('is-near-form',hide);
  if(hide){
   doctoraliaWidget.setAttribute('aria-hidden','true');
   doctoraliaWidget.setAttribute('inert','');
  }else{
   doctoraliaWidget.removeAttribute('aria-hidden');
   doctoraliaWidget.removeAttribute('inert');
  }
 }
 const formObserver=new IntersectionObserver(([entry])=>{
  formInView=entry.isIntersecting;
  syncDoctoraliaForMobile();
 },{threshold:0});
 formObserver.observe(document.getElementById('agendamento'));
 if(mobileViewport.addEventListener)mobileViewport.addEventListener('change',syncDoctoraliaForMobile);
 else mobileViewport.addListener(syncDoctoraliaForMobile);
}

const heroHeadline=document.getElementById('heroHeadline');
if(heroHeadline&&typeof window!=='undefined'){
 const phrases=[...heroHeadline.querySelectorAll('.hero-phrase')];
 const controls=document.getElementById('heroHeadlineControls');
 const count=document.getElementById('heroPhraseCount');
 const reducedMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
 let phraseIndex=0;
 let headlineVisible=true;
 let rotationTimer=null;
 function nextPhrase(){
  phraseIndex=(phraseIndex+1)%phrases.length;
  phrases.forEach((phrase,index)=>phrase.classList.toggle('is-active',index===phraseIndex));
  count.textContent=String(phraseIndex+1).padStart(2,'0')+' / '+String(phrases.length).padStart(2,'0');
 }
 function syncRotation(){
  if(rotationTimer!==null){window.clearInterval(rotationTimer);rotationTimer=null;}
  controls.hidden=reducedMotion.matches;
  if(!reducedMotion.matches&&!document.hidden&&headlineVisible)rotationTimer=window.setInterval(nextPhrase,6000);
 }
 document.addEventListener('visibilitychange',syncRotation);
 if(reducedMotion.addEventListener)reducedMotion.addEventListener('change',syncRotation);
 else reducedMotion.addListener(syncRotation);
 if(typeof IntersectionObserver!=='undefined'){
  const headlineObserver=new IntersectionObserver(([entry])=>{
   headlineVisible=entry.isIntersecting;
   syncRotation();
  },{threshold:0});
  headlineObserver.observe(heroHeadline);
 }
 syncRotation();
}
