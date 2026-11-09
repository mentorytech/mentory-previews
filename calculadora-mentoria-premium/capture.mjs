import {calculate} from './engine.mjs';
export const ENDPOINT='https://n8n.mentoryacademy.com.br/webhook/calculadora-premium-ed';
export function createSender(transport=fetch,timeout=15000){
 let pending=null,busy=false;
 return async data=>{
  if(busy)throw new Error('Envio em andamento.');
  const fingerprint=JSON.stringify(data);
  if(!pending||pending.fingerprint!==fingerprint)pending={fingerprint,body:JSON.stringify({...data,event_id:crypto.randomUUID(),submitted_at:new Date().toISOString()}),accepted:false};
  if(pending.accepted)return;
  busy=true;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
  try{
   const response=await transport(ENDPOINT,{method:'POST',mode:'cors',credentials:'omit',redirect:'error',headers:{'Content-Type':'application/json'},body:pending.body,signal:controller.signal});
   if(response.type==='opaque'||response.status!==200)throw new Error('Resposta não confirmada.');
   const receipt=await response.json();
   if(receipt?.message!=='Workflow was started'||receipt.ok===false)throw new Error('Resposta não confirmada.');
   pending.accepted=true;
  }catch{throw new Error('Não foi possível confirmar o envio. Seus dados continuam aqui. Tente novamente.');}
  finally{clearTimeout(timer);busy=false;}
 };
}
const clean=v=>String(v).replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,300);
function safeUrl(value){try{const u=new URL(value);return /^https?:$/.test(u.protocol)?u.origin+u.pathname:'';}catch{return '';}}
export function captureAttribution(url,referrer=''){
 const u=new URL(url),result={page_url:safeUrl(url),referrer:safeUrl(referrer)};
 for(const k of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'])result[k]='';
 for(const [k,v] of u.searchParams)if(/^utm_[a-z0-9_]{1,40}$/.test(k))result[k]=clean(v);
 return Object.freeze(result);
}
export function buildPayload(lead,answers,attribution,event_id,submitted_at){
 return {schema_version:'calculator-capture-v1',source:'calculadora-mentoria-premium',tag:'Lead-FMP',tags:['Lead-FMP'],event_id,submitted_at,...lead,answers:{...answers},results:calculate(answers),...attribution};
}
