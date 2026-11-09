// Country inventory and validation use the self-hosted libphonenumber metadata.
export function initPhoneField(){
 const input=document.querySelector('#phone'),country=document.querySelector('#phone-country'),picker=document.querySelector('#phone-picker'),summary=picker.querySelector('summary'),search=document.querySelector('#phone-search'),help=document.querySelector('#phone-help');
 const lib=window.libphonenumber;
 if(!lib){help.textContent='Não foi possível carregar a validação do WhatsApp. Recarregue a página para tentar novamente.';return {validate(){throw new Error(help.textContent);}};}
 const names=new Intl.DisplayNames(['pt-BR'],{type:'region'});
 const countries=lib.getCountries().map(code=>({code,name:names.of(code),ddi:lib.getCountryCallingCode(code)})).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
 let selected='BR',internationalError=false;
 const fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function render(){const term=fold(search.value);country.replaceChildren(...countries.filter(c=>fold(`${c.name} ${c.code} +${c.ddi}`).includes(term)).map(c=>{const o=new Option(`${c.name} +${c.ddi}`,c.code);o.selected=c.code===selected;return o;}));}
 function update(){const c=countries.find(c=>c.code===selected);summary.textContent=`${c.name} +${c.ddi}`;render();}
 function normalize(){
  const raw=input.value,pos=input.selectionStart;
  internationalError=false;
  if(raw.trim().startsWith('+')){
   try{const p=lib.parsePhoneNumberWithError(raw.replace(/[^\d+]/g,''),{extract:false});if(!p.country)throw new Error();selected=p.country;input.value=p.nationalNumber;update();help.textContent='DDI identificado no número colado. Confira o país selecionado.';return;}
   catch{internationalError=true;help.textContent='DDI não reconhecido. Selecione o país e informe novamente o número nacional.';}
  }
  input.value=raw.replace(/\D/g,'');
  if(pos!==null){const caret=raw.slice(0,pos).replace(/\D/g,'').length;input.setSelectionRange(caret,caret);}
 }
 search.addEventListener('input',render);
 search.addEventListener('search',render);
 picker.addEventListener('toggle',()=>{if(picker.open)render();});
 country.addEventListener('change',()=>{selected=country.value;search.value='';update();picker.open=false;internationalError=false;input.focus();});
 picker.addEventListener('keydown',e=>{if(e.key==='Escape'){picker.open=false;summary.focus();}});
 input.addEventListener('input',normalize);
 input.addEventListener('paste',event=>{
  const text=event.clipboardData?.getData('text');if(text==null)return;
  event.preventDefault();
  if(text.trim().startsWith('+'))input.value=text;
  else input.setRangeText(text,input.selectionStart,input.selectionEnd,'end');
  normalize();
 });
 update();
 return {normalize(){if(/\D/.test(input.value))normalize();},validate(){
  // Also normalize autofill that did not dispatch an input event.
  if(/\D/.test(input.value))normalize();
  if(internationalError)throw new Error('Confira o DDI e digite novamente o número nacional.');
  const p=lib.parsePhoneNumberWithError('+'+lib.getCountryCallingCode(selected)+input.value,{extract:false});
  if(!p.isValid()||p.country!==selected)throw new Error('Informe um WhatsApp válido para o país selecionado.');
  return p;
 }};
}
