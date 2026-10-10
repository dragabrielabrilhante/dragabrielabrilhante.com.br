'use strict';
const form=document.getElementById('leadForm');
const steps=[...document.querySelectorAll('.step')];
const error=document.getElementById('error');
const whatsappContact=document.getElementById('whatsappContact');
const whatsappNumber='5514998894616';
const labels=['Sua preferência','Seu primeiro contato','Sua disponibilidade','Seu investimento e contato'];
let current=0;
function selected(name){return new FormData(form).get(name)||'';}
function focusHeading(heading){
 heading.focus({preventScroll:true});
 if(typeof window!=='undefined'&&window.matchMedia('(max-width:700px)').matches){
  heading.scrollIntoView({block:'start',behavior:'auto'});
 }
}
function showStep(index,focus=true){
 current=index;steps.forEach((step,i)=>step.hidden=i!==index);
 document.querySelectorAll('.progress span').forEach((bar,i)=>bar.classList.toggle('on',i<=index));
 document.getElementById('stepLabel').textContent=`0${index+1} / 04`;
 document.getElementById('stepName').textContent=labels[index];
 document.getElementById('back').hidden=index===0;
 document.getElementById('nextLabel').textContent=index===3?'Revisar respostas':'Continuar';
 error.textContent='';if(focus)focusHeading(steps[index].querySelector('h3'));
}
function validation(){
 if(current===0&&!selected('modality'))return ['Escolha como prefere ser atendido(a).','modality'];
 if(current===1&&!selected('goal'))return ['Selecione o motivo do contato.','goal'];
 if(current===2&&!selected('when'))return ['Escolha quando gostaria de agendar.','when'];
 if(current===2&&!selected('period'))return ['Selecione um período de preferência.','period'];
 if(current===3){
  if(selected('name').trim().length<2)return ['Informe um nome com pelo menos 2 letras.','name'];
  if(selected('city').trim().length<2)return ['Informe sua cidade e estado.','city'];
  const phone=selected('phone').replace(/\D/g,'');
  if(!/^\d{10,11}$/.test(phone))return ['Informe seu WhatsApp com DDD, com 10 ou 11 dígitos.','phone'];
  if(!form.elements.consent.checked)return ['Confirme que concorda em compartilhar estas informações pelo WhatsApp.','consent'];
 }
 return null;
}
form.addEventListener('submit',event=>{
 event.preventDefault();const issue=validation();
 if(issue){error.textContent=issue[0];const input=form.elements.namedItem(issue[1]);(input instanceof RadioNodeList?input[0]:input).focus();return;}
 if(current<3){showStep(current+1);return;}
 const summary=document.getElementById('summary');summary.replaceChildren();
 const entries=[['Nome',selected('name').trim()],['Modalidade',selected('modality')],['Interesse',selected('goal')],['Valor',selected('goal')==='Consulta de retorno'?'R$ 150 (retorno)':'R$ 250 (consulta)'],['Quando',selected('when')],['Período',selected('period')],['Cidade',selected('city').trim()],['WhatsApp',selected('phone')]];
 for(const [label,value] of entries){const row=document.createElement('div');const key=document.createElement('span');key.textContent=label;const val=document.createElement('strong');val.textContent=value;row.append(key,val);summary.append(row);}
 const message=['Olá, Dra. Gabriela! Gostaria de conversar sobre o atendimento. Preenchi o formulário do site:', '', ...entries.map(([label,value])=>`${label}: ${value}`), '', 'Aguardo a confirmação da disponibilidade e as orientações para agendar.'].join('\n');
 whatsappContact.href=`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
 form.hidden=true;document.getElementById('progressBlock').hidden=true;document.getElementById('success').hidden=false;focusHeading(document.querySelector('#success h3'));
});
document.getElementById('back').addEventListener('click',()=>showStep(Math.max(0,current-1)));
form.elements.phone.addEventListener('input',event=>{let digits=event.target.value.replace(/\D/g,'').slice(0,11);if(digits.length>2)digits='('+digits.slice(0,2)+') '+digits.slice(2);if(digits.replace(/\D/g,'').length>6){const at=digits.replace(/\D/g,'').length===11?10:9;digits=digits.slice(0,at)+'-'+digits.slice(at);}event.target.value=digits;});
document.getElementById('restart').addEventListener('click',()=>{whatsappContact.removeAttribute('href');document.getElementById('summary').replaceChildren();document.getElementById('success').hidden=true;form.hidden=false;document.getElementById('progressBlock').hidden=false;showStep(3);});
const dialog=document.getElementById('privacyDialog');
for(const id of ['privacyForm','privacyFooter'])document.getElementById(id).addEventListener('click',()=>dialog.showModal());
document.getElementById('closePrivacy').addEventListener('click',()=>dialog.close());
form.reset();showStep(0,false);

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
