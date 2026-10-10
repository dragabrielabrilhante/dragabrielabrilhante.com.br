'use strict';
const form=document.getElementById('leadForm');
const steps=[...document.querySelectorAll('.step')];
const error=document.getElementById('error');
const labels=['Sua preferência','Seu primeiro contato','Sua disponibilidade','Seu investimento e contato'];
let current=0;
function selected(name){return new FormData(form).get(name)||'';}
function showStep(index,focus=true){
 current=index;steps.forEach((step,i)=>step.hidden=i!==index);
 document.querySelectorAll('.progress span').forEach((bar,i)=>bar.classList.toggle('on',i<=index));
 document.getElementById('stepLabel').textContent=`0${index+1} / 04`;
 document.getElementById('stepName').textContent=labels[index];
 document.getElementById('back').hidden=index===0;
 document.getElementById('nextLabel').textContent=index===3?'Simular envio':'Continuar';
 error.textContent='';if(focus)steps[index].querySelector('h3').focus({preventScroll:true});
}
function validation(){
 if(current===0&&!selected('modality'))return ['Escolha como prefere ser atendida(o).','modality'];
 if(current===1&&!selected('goal'))return ['Selecione o motivo do contato.','goal'];
 if(current===2&&!selected('when'))return ['Escolha quando gostaria de agendar.','when'];
 if(current===2&&!selected('period'))return ['Selecione um período de preferência.','period'];
 if(current===3){
  if(selected('name').trim().length<2)return ['Informe um nome com pelo menos 2 letras.','name'];
  if(selected('city').trim().length<2)return ['Informe sua cidade e estado.','city'];
  const phone=selected('phone').replace(/\D/g,'');
  if(!/^\d{10,11}$/.test(phone))return ['Informe um número de teste com DDD, com 10 ou 11 dígitos.','phone'];
  if(!form.elements.consent.checked)return ['Confirme que entendeu o funcionamento da simulação.','consent'];
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
 form.hidden=true;document.getElementById('progressBlock').hidden=true;document.getElementById('success').hidden=false;document.querySelector('#success h3').focus({preventScroll:true});
});
document.getElementById('back').addEventListener('click',()=>showStep(Math.max(0,current-1)));
form.elements.phone.addEventListener('input',event=>{let digits=event.target.value.replace(/\D/g,'').slice(0,11);if(digits.length>2)digits='('+digits.slice(0,2)+') '+digits.slice(2);if(digits.replace(/\D/g,'').length>6){const at=digits.replace(/\D/g,'').length===11?10:9;digits=digits.slice(0,at)+'-'+digits.slice(at);}event.target.value=digits;});
document.getElementById('restart').addEventListener('click',()=>{form.reset();document.getElementById('summary').replaceChildren();document.getElementById('success').hidden=true;form.hidden=false;document.getElementById('progressBlock').hidden=false;showStep(0);});
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
