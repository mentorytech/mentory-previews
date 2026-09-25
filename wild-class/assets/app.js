(() => {
'use strict';
const IS_PRODUCTION = false;
const ENDPOINT = '';
const SUCCESS_URL = '';
const PIXELS = ['2287457011481211', '25887522304217772'];
const assets = new URL('./', document.currentScript.src);
const form = document.querySelector('#inscricao'), button = form.querySelector('[type="submit"]'), status = document.querySelector('#form-status');
const phone = document.querySelector('#phone');
const keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid','msclkid','src','sck','s2','s3','ad_id','adset_id','campaign_id'];
let busy = false, completed = false, pending = null, phoneInstance = null, corePromise = null, utilsPromise = null;
const id = () => crypto.randomUUID();
function loadPixels() {
 if (!IS_PRODUCTION || window.fbq) return;
 const fbq = window.fbq = function(){fbq.callMethod ? fbq.callMethod.apply(fbq,arguments) : fbq.queue.push(arguments);};
 window._fbq = fbq; fbq.push=fbq; fbq.loaded=true; fbq.version='2.0'; fbq.queue=[];
 const script=document.createElement('script');script.async=true;script.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(script);
 PIXELS.forEach(pixel=>fbq('init',pixel));
 fbq('track','PageView',{}, {eventID:'wild-class-pv-'+id()});
}
if(IS_PRODUCTION){setTimeout(loadPixels,1100);['pointerdown','keydown'].forEach(type=>addEventListener(type,loadPixels,{once:true,passive:true}));}
function phoneReady(){
 if(!corePromise){corePromise=new Promise((resolve,reject)=>{
  const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('vendor/css/intlTelInput.min.css',assets);document.head.appendChild(css);
  const script=document.createElement('script');script.src=new URL('vendor/js/intlTelInput.min.js',assets);script.async=true;
  script.onerror=()=>{corePromise=null;reject(new Error('phone-load'));};
  script.onload=()=>{
   phone.removeAttribute('maxlength');
   phoneInstance=window.intlTelInput(phone,{countryNameLocale:'pt-BR',countryOrder:['br','pt','us','gb','es'],countrySearch:true,dropdownParent:document.body,formatAsYouType:true,initialCountryLookup:()=>Promise.resolve('br'),numberDisplayFormat:'NATIONAL',placeholderNumberPolicy:'AGGRESSIVE',separateDialCode:true,strictMode:true,uiTranslations:{selectedCountryAriaLabel:'Alterar país, selecionado ${countryName} (${dialCode})',noCountrySelected:'Selecionar país',countryListAriaLabel:'Lista de países',searchPlaceholder:'Procurar país',clearSearchAriaLabel:'Limpar pesquisa',searchEmptyState:'Nenhum país encontrado'}});
   resolve(phoneInstance);
  };document.head.appendChild(script);
 });}
 return corePromise.then(async instance=>{
  if(!utilsPromise)utilsPromise=window.intlTelInput.attachUtils(()=>import(new URL('vendor/js/utils.js',assets).href)).then(()=>{if(phone.value)instance.setNumber(phone.value);}).catch(err=>{utilsPromise=null;throw err;});
  await utilsPromise;await instance.promise;return instance;
 });
}
phone.addEventListener('focus',()=>phoneReady().catch(()=>{status.textContent='Não foi possível carregar o telefone. Tente novamente.';}));
function error(el,message){el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby',el.id+'-error');document.getElementById(el.id+'-error').textContent=message;}
function clearErrors(){['name','email','phone','faturamento'].forEach(key=>{const el=document.getElementById(key);el.removeAttribute('aria-invalid');document.getElementById(key+'-error').textContent='';});}
function basicValid(){
 clearErrors();const name=document.querySelector('#name'), email=document.querySelector('#email'), revenue=document.querySelector('#faturamento');
 if(name.value.trim().length<3)error(name,'Informe seu nome completo.');
 if(!email.validity.valid||!email.value.trim()||!/^\S+@\S+\.\S+$/.test(email.value.trim()))error(email,'Informe um e-mail válido.');
 if(!phone.value.trim())error(phone,'Informe seu telefone.');
 if(!revenue.value)error(revenue,'Selecione seu faturamento.');
 const invalid=form.querySelector('[aria-invalid="true"]');if(invalid){invalid.focus();return false;}return true;
}
form.addEventListener('input',()=>{if(!busy&&!completed)pending=null;});
form.addEventListener('change',()=>{if(!busy&&!completed)pending=null;});
form.addEventListener('submit',async event=>{
 event.preventDefault();if(busy||completed)return;status.textContent='';if(!basicValid())return;
 busy=true;button.disabled=true;button.textContent='Confirmando sua inscrição…';
 try{
  const instance=await phoneReady();
  if(!instance.isValidNumber()){error(phone,'Confira o telefone e o país selecionado.');phone.focus();return;}
  if(document.querySelector('#website').value)throw new Error('invalid');
  if(!pending){const country=instance.getSelectedCountry(), query=new URLSearchParams(location.search);pending={name:document.querySelector('#name').value.trim(),email:document.querySelector('#email').value.trim().toLowerCase(),phone:instance.getNumber(),phone_e164:instance.getNumber(),phone_country:country.iso2.toUpperCase(),phone_dial_code:'+'+country.dialCode,faturamento:document.querySelector('#faturamento').value,event_id:id(),s1:'wild-class',list:'WILD-CLASS',event_source_url:location.origin+location.pathname,consent:true,consent_text:'Aceito receber comunicações sobre a WILD CLASS.',website:''};keys.forEach(key=>{const value=query.get(key);if(value)pending[key]=value.slice(0,500);});}
  if(!IS_PRODUCTION){status.textContent='Prévia validada. Nenhum cadastro foi enviado e nenhum evento foi disparado.';status.focus();return;}
  if(!ENDPOINT)throw new Error('integration-pending');
  const response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(pending),signal:AbortSignal.timeout(25000),credentials:'omit'});
  if(!response.ok)throw new Error('registration-failed');
  const result=await response.json();if(result.success!==true)throw new Error('registration-not-confirmed');
  completed=true;loadPixels();window.fbq('track','Lead',{content_name:'WILD CLASS',content_category:'WILD-CLASS'},{eventID:pending.event_id});
  status.textContent='Inscrição confirmada na WILD CLASS.';status.focus();
  button.textContent='Sua inscrição está confirmada';
  if(SUCCESS_URL){const url=new URL(SUCCESS_URL);keys.forEach(key=>{if(pending[key])url.searchParams.set(key,pending[key]);});setTimeout(()=>location.assign(url.href),800);}
 }catch(err){status.textContent='Não foi possível confirmar sua inscrição. Seus dados continuam aqui. Tente novamente.';status.focus();}
 finally{busy=false;if(!completed){button.disabled=false;button.innerHTML='Quero participar da WILD CLASS <span aria-hidden="true">↗</span>';}}
});
button.disabled=false;
const gallery=document.querySelector('#gallery');
['previous','next'].forEach(key=>document.getElementById(key).addEventListener('click',()=>gallery.scrollBy({left:(key==='next'?1:-1)*(gallery.querySelector('.proof-card').getBoundingClientRect().width+18),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})));
})();
