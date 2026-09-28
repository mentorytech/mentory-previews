(()=>{
if(!new URLSearchParams(location.search).has('edit'))return;
const bar=document.createElement('nav');bar.id='editor-toolbar';bar.setAttribute('aria-label','Edição local');bar.style='position:fixed;top:12px;right:12px;z-index:9999;background:#111;color:white;padding:12px 16px;border-radius:8px;font:14px system-ui;box-shadow:0 4px 20px #0003';
const text=document.createElement('span');text.textContent='Clique no texto para editar. ';bar.appendChild(text);
const b=document.createElement('button');b.textContent='Salvar HTML editado';b.style='padding:8px 12px;cursor:pointer';bar.appendChild(b);document.body.appendChild(bar);
b.onclick=()=>{document.activeElement.blur();bar.remove();const data='<!doctype html>\n'+document.documentElement.outerHTML;document.body.appendChild(bar);const blob=new Blob([data],{type:'text/html;charset=utf-8'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=location.pathname.split('/').pop();a.click();setTimeout(()=>URL.revokeObjectURL(u),10000)};
})();
