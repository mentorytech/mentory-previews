import {calculate} from './engine.mjs';
const $=s=>document.querySelector(s);
const money=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
const state={answers:null,busy:false,demo:false};
function stage(id){for(const el of document.querySelectorAll('main>section'))el.hidden=el.id!==id;document.querySelectorAll('nav li').forEach((el,i)=>{if(i===['calculator','capture','result'].indexOf(id))el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});$('#'+id+' h1').focus();window.scrollTo(0,0);}
function clearDemo(){state.demo=false;for(const id of ['name','email','phone'])$('#'+id).value='';$('#submit-demo').disabled=true;$('#capture-error').textContent='';$('#simulate-failure').checked=false;}
$('#calc-form').addEventListener('submit',event=>{
 event.preventDefault();$('#calc-error').textContent='';const fields=[...$('#calc-form').querySelectorAll('input')];fields.forEach(el=>el.removeAttribute('aria-invalid'));
 const invalid=fields.find(el=>!el.checkValidity());
 if(invalid){invalid.setAttribute('aria-invalid','true');$('#calc-error').textContent='Revise este campo. Preencha um número dentro dos limites de '+invalid.min+' a '+invalid.max+'.';invalid.focus();return;}
 try{const a=Object.fromEntries(new FormData(event.currentTarget));for(const k of Object.keys(a))if(k!=='format')a[k]=Number(a[k]);calculate(a);state.answers=a;clearDemo();stage('capture');}catch(e){$('#calc-error').textContent=e.message;}
});
$('#demo').addEventListener('click',()=>{if(state.busy)return;$('#name').value='Pessoa de demonstração';$('#email').value='revisao@example.invalid';$('#phone').value='Número fictício (não enviado)';state.demo=true;$('#submit-demo').disabled=false;});
$('#back').addEventListener('click',()=>{if(!state.busy){clearDemo();stage('calculator');}});
$('#lead-form').addEventListener('submit',async event=>{
 event.preventDefault();if(state.busy||!state.demo||!state.answers)return;state.busy=true;$('#capture-error').textContent='';$('#processing').hidden=false;
 const fail=$('#simulate-failure').checked;for(const id of ['demo','submit-demo','back','simulate-failure'])$('#'+id).disabled=true;
 try{
  // Review only: no fetch, contact persistence, pixels, or production route.
  await new Promise(resolve=>setTimeout(resolve,350));
  if(fail)throw new Error('Falha simulada. Nenhum cadastro foi enviado e o resultado permanece bloqueado. Desmarque a simulação e tente novamente.');
  const a=state.answers,r=calculate(a);
  $('#minimum').textContent=money(r.minimum);$('#target').textContent=money(r.target);
  $('#scenario').textContent=`${a.participants} mentorado${a.participants===1?'':'s'} pagante${a.participants===1?'':'s'} · ${a.weeks} semanas · programa ${ {individual:'individual',group:'em grupo',hybrid:'híbrido'}[a.format]}. Valores totais, não mensais.`;
  $('#margin-copy').textContent=`Inclui a margem desejada de ${a.margin}% sobre a receita, depois dos custos, taxas e da sua remuneração.`;
  const entries=[['Sua remuneração no ciclo',money(a.pay)],['Custos fixos do ciclo',money(a.fixed)],['Custos variáveis para todos os pagantes',money(a.variable*a.participants)],['Total a cobrir antes de taxas e margem',money(r.cost)],['Taxas + impostos estimados',a.fees+'%'],['Horas de entrega, preparação e suporte',r.hours+' h'],['Sua remuneração equivalente por hora',money(r.hourlyPay)+'/h'],['Receita estimada no preço alvo',money(r.target*a.participants)]];
  $('#breakdown').replaceChildren(...entries.map(([label,value])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);return row;}));
  stage('result');
 }catch(e){$('#capture-error').textContent=e.message;}
 finally{state.busy=false;$('#processing').hidden=true;for(const id of ['demo','submit-demo','back','simulate-failure'])$('#'+id).disabled=false;}
});
$('#recalculate').addEventListener('click',()=>{clearDemo();stage('calculator');});
