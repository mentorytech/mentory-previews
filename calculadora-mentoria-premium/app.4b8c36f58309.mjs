import {calculate} from './engine.mjs';
import {captureAttribution,buildPayload,createSender} from './capture.mjs';
import {initPhoneField} from './phone-field.3183953b6d76.mjs';
const phoneField=initPhoneField();
const attribution=captureAttribution(location.href,document.referrer),send=createSender();
const $=s=>document.querySelector(s);
const money=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
const state={answers:null,busy:false};
function stage(id){for(const el of document.querySelectorAll('main>section'))el.hidden=el.id!==id;document.querySelectorAll('nav li').forEach((el,i)=>{if(i===['calculator','capture','result'].indexOf(id))el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});$('#'+id+' h1').focus();window.scrollTo(0,0);}
function clearErrors(){$('#capture-error').textContent='';for(const id of ['name','email','phone'])$('#'+id).removeAttribute('aria-invalid');}
$('#calc-form').addEventListener('submit',event=>{
 event.preventDefault();$('#calc-error').textContent='';const fields=[...$('#calc-form').querySelectorAll('input')];fields.forEach(el=>el.removeAttribute('aria-invalid'));
 const invalid=fields.find(el=>!el.checkValidity());
 if(invalid){invalid.setAttribute('aria-invalid','true');$('#calc-error').textContent='Revise este campo. Preencha um número dentro dos limites de '+invalid.min+' a '+invalid.max+'.';invalid.focus();return;}
 try{const a=Object.fromEntries(new FormData(event.currentTarget));for(const k of Object.keys(a))if(k!=='format')a[k]=Number(a[k]);calculate(a);state.answers=a;clearErrors();stage('capture');}catch(e){$('#calc-error').textContent=e.message;}
});
$('#back').addEventListener('click',()=>{if(!state.busy){clearErrors();stage('calculator');}});
$('#lead-form').addEventListener('submit',async event=>{
 event.preventDefault();if(state.busy||!state.answers)return;clearErrors();
 phoneField.normalize?.();
 const fields=['name','email','phone'].map(id=>$('#'+id));
 fields.forEach(el=>el.value=el.value.trim());
 const invalid=fields.find(el=>!el.checkValidity()||(el.id==='name'&&el.value.length<2));
 if(invalid){invalid.setAttribute('aria-invalid','true');$('#capture-error').textContent='Preencha nome, email e WhatsApp válidos para continuar.';invalid.focus();return;}
 let phone;
 try{phone=phoneField.validate();}
 catch(e){$('#phone').setAttribute('aria-invalid','true');$('#capture-error').textContent=window.libphonenumber?'Informe um WhatsApp válido para o país selecionado.':e.message;$('#phone').focus();return;}
 const lead={nome:$('#name').value,email:$('#email').value,telefone:phone.number,phone_country:phone.country||'non-geographic',phone_country_code:phone.countryCallingCode};
 state.busy=true;$('#processing').hidden=false;
 for(const el of $('#lead-form').querySelectorAll('input,button,select'))el.disabled=true;
 try{
  await send(buildPayload(lead,state.answers,attribution));
  const a=state.answers,r=calculate(a);
  $('#minimum').textContent=money(r.minimum);$('#target').textContent=money(r.target);
  $('#scenario').textContent=`${a.participants} mentorado${a.participants===1?'':'s'} pagante${a.participants===1?'':'s'} · ${a.weeks} semanas · programa ${ {individual:'individual',group:'em grupo',hybrid:'híbrido'}[a.format]}. Valores totais, não mensais.`;
  $('#margin-copy').textContent=`Inclui a margem desejada de ${a.margin}% sobre a receita, depois dos custos, taxas e da sua remuneração.`;
  const entries=[['Sua remuneração no ciclo',money(a.pay)],['Custos fixos do ciclo',money(a.fixed)],['Custos variáveis para todos os pagantes',money(a.variable*a.participants)],['Total a cobrir antes de taxas e margem',money(r.cost)],['Taxas + impostos estimados',a.fees+'%'],['Horas de entrega, preparação e suporte',r.hours+' h'],['Sua remuneração equivalente por hora',money(r.hourlyPay)+'/h'],['Receita estimada no preço alvo',money(r.target*a.participants)]];
  $('#breakdown').replaceChildren(...entries.map(([label,value])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);return row;}));
  stage('result');
 }catch(e){$('#capture-error').textContent=e.message;}
 finally{state.busy=false;$('#processing').hidden=true;for(const el of $('#lead-form').querySelectorAll('input,button,select'))el.disabled=false;}
});
$('#recalculate').addEventListener('click',()=>{clearErrors();stage('calculator');});
