/**
 * Registro de leads da LP da Dra. Gabriela Brilhante.
 *
 * Instalação: abra a planilha > Extensões > Apps Script e cole este arquivo.
 * Execute configureLeadCapture uma vez, revise a autorização do Google e
 * implante como Aplicativo da Web: executar como você, acesso Qualquer pessoa.
 * A URL /exec e o token criado em Propriedades do projeto devem ser
 * configurados no servidor da Vercel, como LEADS_SCRIPT_URL e LEADS_SCRIPT_TOKEN.
 * Instalar apenas este script não conecta automaticamente o formulário do site.
 */
const SPREADSHEET_ID='1zT4Pa3XVwi1CBw_CgH8xknfD4DsxHMD67F5vKt7-EGU';
const LEAD_HEADERS=['Como prefere ser atendida(o)','O que você procura hoje','Quando gostaria de agendar','Período de preferência','Nome','Cidade e estado','WhatsApp com DDD'];
const META_HEADERS=['Recebido em','ID do envio'];
const LEAD_OPTIONS={
 modality:['On-line','Presencial em Marília','Ainda não decidi'],
 goal:['Primeira consulta','Consulta de retorno','Informações sobre atendimento'],
 when:['Assim que houver disponibilidade','Na próxima semana','Nas próximas semanas','Ainda estou pesquisando'],
 period:['Manhã','Tarde','Noite','Sábado','Tenho flexibilidade']
};

function jsonResult(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
function headerKey(value){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');}
function targetSheet(){
 const sheets=SpreadsheetApp.openById(SPREADSHEET_ID).getSheets();
 const matches=sheets.filter(sheet=>{
  const headers=sheet.getRange(1,1,1,7).getDisplayValues()[0];
  return headers.every((value,i)=>headerKey(value)===headerKey(LEAD_HEADERS[i]));
 });
 if(matches.length!==1)throw new Error('É necessária uma única aba com as sete colunas esperadas.');
 return matches[0];
}
function ensureMetadata(sheet){
 const headers=sheet.getRange(1,8,1,2).getDisplayValues()[0];
 for(let i=0;i<2;i++){
  if(headers[i]&&headerKey(headers[i])!==headerKey(META_HEADERS[i]))throw new Error('As colunas H e I já têm outro conteúdo.');
  if(!headers[i]&&sheet.getLastRow()>1){
   const values=sheet.getRange(2,8+i,sheet.getLastRow()-1,1).getDisplayValues();
   if(values.some(row=>row[0]))throw new Error('As colunas H e I já têm outro conteúdo.');
  }
 }
 sheet.getRange(1,8,1,2).setValues([META_HEADERS]).setFontWeight('bold');
}
function configureLeadCapture(){
 const sheet=targetSheet();
 ensureMetadata(sheet);
 const properties=PropertiesService.getScriptProperties();
 if(!properties.getProperty('LEADS_SCRIPT_TOKEN'))properties.setProperty('LEADS_SCRIPT_TOKEN',Utilities.getUuid()+Utilities.getUuid());
 // O token fica nas propriedades do projeto. Não o escreva na planilha ou nos logs.
 return {configured:true};
}
function validateLead(input){
 if(!input||input.consent!==true||typeof input.id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.id))return null;
 const lead={id:input.id.toLowerCase()};
 for(const key in LEAD_OPTIONS){if(LEAD_OPTIONS[key].indexOf(input[key])===-1)return null;lead[key]=input[key];}
 for(const key of ['name','city']){
  if(typeof input[key]!=='string'||input[key].length>80)return null;
  const value=input[key].trim();
  if(value.length<2||/[\u0000-\u001f\u007f]/.test(value))return null;
  lead[key]=value;
 }
 if(typeof input.phone!=='string'||!/^[1-9]\d{9,10}$/.test(input.phone))return null;
 lead.phone=input.phone;
 return lead;
}
function cellText(value){return /^[=+\-@]/.test(value)?"'"+value:value;}
function displayPhone(value){return '('+value.slice(0,2)+') '+value.slice(2,-4)+'-'+value.slice(-4);}
function doPost(event){
 let lock;
 let acquired=false;
 try{
  if(!event||!event.postData||event.postData.contents.length>4096)return jsonResult({ok:false});
  const input=JSON.parse(event.postData.contents);
  const token=PropertiesService.getScriptProperties().getProperty('LEADS_SCRIPT_TOKEN');
  if(!token||token.length<32||input.token!==token)return jsonResult({ok:false});
  const lead=validateLead(input.lead);
  if(!lead)return jsonResult({ok:false});
  lock=LockService.getScriptLock();
  lock.waitLock(10000);acquired=true;
  const sheet=targetSheet();
  ensureMetadata(sheet);
  const lastRow=sheet.getLastRow();
  const found=lastRow>1?sheet.getRange(2,9,lastRow-1,1).createTextFinder(lead.id).matchEntireCell(true).findNext():null;
  const row=found?found.getRow():lastRow+1;
  const received=found?sheet.getRange(row,8).getValue():new Date();
  const values=[lead.modality,lead.goal,lead.when,lead.period,lead.name,lead.city,displayPhone(lead.phone)].map(cellText);
  sheet.getRange(row,7).setNumberFormat('@');
  sheet.getRange(row,1,1,9).setValues([values.concat([received,lead.id])]);
  sheet.getRange(row,8).setNumberFormat('dd/MM/yyyy HH:mm');
  SpreadsheetApp.flush();
  return jsonResult({ok:true,id:lead.id});
 }catch{return jsonResult({ok:false});}
 finally{if(acquired)lock.releaseLock();}
}
function doGet(){return jsonResult({ok:false,error:'post_required'});}
