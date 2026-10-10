const options={
 modality:['On-line','Presencial em Marília','Ainda não decidi'],
 goal:['Primeira consulta','Consulta de retorno','Informações sobre atendimento'],
 when:['Assim que houver disponibilidade','Na próxima semana','Nas próximas semanas','Ainda estou pesquisando'],
 period:['Manhã','Tarde','Noite','Sábado','Tenho flexibilidade']
};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const response=(status,body)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});

function validate(input){
 if(!input||typeof input!=='object'||Array.isArray(input)||input.consent!==true||typeof input.id!=='string'||!uuid.test(input.id))return null;
 if(input.company)return null;
 const lead={id:input.id.toLowerCase(),consent:true};
 for(const [key,allowed] of Object.entries(options)){
  if(!allowed.includes(input[key]))return null;
  lead[key]=input[key];
 }
 for(const key of ['name','city']){
  if(typeof input[key]!=='string'||input[key].length>80)return null;
  const value=input[key].trim();
  if(value.length<2||/[\u0000-\u001f\u007f]/.test(value))return null;
  lead[key]=value;
 }
 if(typeof input.phone!=='string'||input.phone.length>20||/[^\d()+\s-]/.test(input.phone))return null;
 lead.phone=input.phone.replace(/\D/g,'');
 if(!/^[1-9]\d{9,10}$/.test(lead.phone))return null;
 return lead;
}

function scriptUrl(value){
 try{
  const url=new URL(value);
  if(url.protocol!=='https:'||url.hostname!=='script.google.com'||url.username||url.password||url.search||url.hash||!/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname))return null;
  return url.href;
 }catch{return null;}
}

export default {
 async fetch(request){
  if(request.method!=='POST')return response(405,{ok:false,error:'method_not_allowed'});
  const origin=request.headers.get('origin');
  if(origin&&origin!==new URL(request.url).origin)return response(403,{ok:false,error:'origin_not_allowed'});
  if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return response(415,{ok:false,error:'json_required'});
  if(Number(request.headers.get('content-length'))>4096)return response(413,{ok:false,error:'payload_too_large'});
  let input;
  try{
   const text=await request.text();
   if(new TextEncoder().encode(text).length>4096)return response(413,{ok:false,error:'payload_too_large'});
   input=JSON.parse(text);
  }catch{return response(400,{ok:false,error:'invalid_json'});}
  const lead=validate(input);
  if(!lead)return response(400,{ok:false,error:'invalid_lead'});
  const endpoint=scriptUrl(process.env.LEADS_SCRIPT_URL);
  const token=process.env.LEADS_SCRIPT_TOKEN;
  if(!endpoint||!token||token.length<32)return response(503,{ok:false,error:'capture_not_configured'});
  try{
   const upstream=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,lead}),signal:AbortSignal.timeout(15000),redirect:'follow'});
   if(!upstream.ok)return response(502,{ok:false,error:'registration_failed'});
   const result=await upstream.json();
   if(result.ok!==true||result.id!==lead.id)return response(502,{ok:false,error:'registration_failed'});
   return response(200,{ok:true,id:lead.id});
  }catch{return response(502,{ok:false,error:'registration_failed'});}
 }
};
