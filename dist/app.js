'use strict';
const form=document.getElementById('leadForm');
const steps=[...document.querySelectorAll('.step')];
const error=document.getElementById('error');
const whatsappContact=document.getElementById('whatsappContact');
const whatsappNumber='5514998894616';
const labels=['Sua preferência','Seu primeiro contato','Sua disponibilidade','Seu investimento e contato'];
let current=0;
let saving=false;
let leadId;
function selected(name){return new FormData(form).get(name)||'';}
function showStep(index,focus=true){
 current=index;steps.forEach((step,i)=>step.hidden=i!==index);
 document.querySelectorAll('.progress span').forEach((bar,i)=>bar.classList.toggle('on',i<=index));
 document.getElementById('stepLabel').textContent=`0${index+1} / 04`;
 document.getElementById('stepName').textContent=labels[index];
 document.getElementById('back').hidden=index===0;
 document.getElementById('nextLabel').textContent=index===3?'Salvar e revisar respostas':'Continuar';
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
  if(!/^[1-9]\d{9,10}$/.test(phone))return ['Informe seu WhatsApp com DDD, com 10 ou 11 dígitos.','phone'];
  if(!form.elements.consent.checked)return ['Confirme que autoriza o registro das informações para o contato sobre agendamento.','consent'];
 }
 return null;
}
function submissionId(){
 if(crypto.randomUUID)return crypto.randomUUID();
 const bytes=crypto.getRandomValues(new Uint8Array(16));
 bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
 const hex=[...bytes].map(value=>value.toString(16).padStart(2,'0')).join('');
 return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
function setSaving(value){
 saving=value;form.setAttribute('aria-busy',String(value));
 form.querySelectorAll('input,select,button').forEach(control=>control.disabled=value);
 document.getElementById('nextLabel').textContent=value?'Salvando suas respostas…':'Salvar e revisar respostas';
 document.getElementById('saveStatus').textContent=value?'Aguarde um momento enquanto registramos seu contato.':'';
}
form.addEventListener('submit',async event=>{
 event.preventDefault();if(saving)return;const issue=validation();
 if(issue){error.textContent=issue[0];const input=form.elements.namedItem(issue[1]);(input instanceof RadioNodeList?input[0]:input).focus();return;}
 if(current<3){showStep(current+1);return;}
 const entries=[['Nome',selected('name').trim()],['Modalidade',selected('modality')],['Interesse',selected('goal')],['Valor',selected('goal')==='Consulta de retorno'?'R$ 150 (retorno)':'R$ 250 (consulta)'],['Quando',selected('when')],['Período',selected('period')],['Cidade',selected('city').trim()],['WhatsApp',selected('phone')]];
 const lead={modality:selected('modality'),goal:selected('goal'),when:selected('when'),period:selected('period'),name:selected('name').trim(),city:selected('city').trim(),phone:selected('phone'),consent:form.elements.consent.checked,company:selected('company')};
 error.textContent='';setSaving(true);
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),25000);
 try{
  if(!leadId)leadId=submissionId();lead.id=leadId;
  const result=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(lead),signal:controller.signal});
  if(!result.ok)throw new Error('registration_failed');
  const receipt=await result.json();
  if(receipt.ok!==true||receipt.id!==leadId)throw new Error('registration_failed');
 }catch{
  error.textContent='Não foi possível registrar suas respostas agora. Elas continuam preenchidas. Tente novamente para seguir com o agendamento.';
  error.focus({preventScroll:true});return;
 }finally{clearTimeout(timeout);setSaving(false);}
 const summary=document.getElementById('summary');summary.replaceChildren();
 for(const [label,value] of entries){const row=document.createElement('div');const key=document.createElement('span');key.textContent=label;const val=document.createElement('strong');val.textContent=value;row.append(key,val);summary.append(row);}
 const message=['Olá, Dra. Gabriela! Gostaria de conversar sobre o atendimento. Preenchi o formulário do site:', '', ...entries.map(([label,value])=>`${label}: ${value}`), '', 'Aguardo a confirmação da disponibilidade e as orientações para agendar.'].join('\n');
 whatsappContact.href=`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
 form.hidden=true;document.getElementById('progressBlock').hidden=true;document.getElementById('success').hidden=false;document.querySelector('#success h3').focus({preventScroll:true});
});
document.getElementById('back').addEventListener('click',()=>{if(!saving)showStep(Math.max(0,current-1));});
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
