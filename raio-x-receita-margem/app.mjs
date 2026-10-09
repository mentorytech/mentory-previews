import {questions} from './questions.mjs';
import {diagnose,qualify} from './engine.mjs';
const $=s=>document.querySelector(s);
let answers={},step=0;
const names={acquisition:'Aquisição',products:'Produtos',margin:'Margem / LTV'};
const plans={
 acquisition:{action:'Nos dias 1 e 2, reúna as oportunidades recentes e sua origem. Nos dias 3 a 5, escolha um canal e defina um responsável pela rotina comercial. Nos dias 6 e 7, revise a passagem de oportunidade para venda.',metrics:'Oportunidades por canal, conversão em venda e custo de aquisição quando disponível.'},
 products:{action:'Nos dias 1 e 2, liste as ofertas e o problema que cada uma resolve. Nos dias 3 a 5, desenhe uma próxima compra coerente para uma oferta atual. Nos dias 6 e 7, valide essa passagem em conversas com compradores, sem lançar uma nova oferta às pressas.',metrics:'Adesão à próxima oferta, ticket por oferta e intervalo entre compras.'},
 margin:{action:'Nos dias 1 e 2, selecione uma oferta e reúna receita, custos e despesas variáveis. Nos dias 3 a 5, apure sua margem de contribuição. Nos dias 6 e 7, revise os dados de recompra ou continuidade, respeitando o ciclo do negócio.',metrics:'Margem de contribuição por oferta, taxa de recompra ou retenção e receita acumulada por comprador.'}
};
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function focusHeading(root){window.scrollTo(0,0);root.querySelector('h1,h2').focus();}
function show(id){for(const key of ['intro','journey','report'])$('#'+key).hidden=key!==id;}
function button(text,fn,cls='secondary'){const n=el('button',text,cls);n.type='button';n.onclick=fn;return n;}
function render(){
 show('journey');const root=$('#journey');root.replaceChildren();const q=questions[step];
 root.append(el('p',`${q.group} · ${step+1} de ${questions.length}`,'eyebrow'));
 const progress=el('progress');progress.max=questions.length;progress.value=step;progress.setAttribute('aria-label','Progresso do diagnóstico');root.append(progress);
 const title=el('h1',q.title);title.tabIndex=-1;root.append(title);if(q.help)root.append(el('p',q.help,'help'));
 const form=el('form');const field=el('fieldset');const legend=el('legend','Escolha uma resposta');field.append(legend);
 for(const [value,text] of q.options){const label=el('label',undefined,'option');const input=el('input');input.type='radio';input.name=q.id;input.value=value;input.checked=answers[q.id]===value;input.required=true;input.onchange=()=>{answers[q.id]=value;};label.append(input,el('span',text));field.append(label);}
 form.append(field);
 if(q.clarify){const alt=button('Minha receita não se encaixa nessas faixas',()=>{answers.monthly='unclassified';step++;render();},'textbutton');form.append(alt);}
 const error=el('p','','error');error.setAttribute('role','alert');form.append(error);
 const actions=el('div',undefined,'actions');actions.append(button('Voltar',()=>{if(step){step--;render();}else{show('intro');$('#start').focus();}}));const next=el('button',step===questions.length-1?'Ver meu relatório':'Continuar','primary');next.type='submit';actions.append(next);form.append(actions);
 form.noValidate=true;form.onsubmit=e=>{e.preventDefault();const checked=form.querySelector('input:checked');if(!checked){error.textContent='Selecione uma resposta para continuar.';field.setAttribute('aria-invalid','true');return;}answers[q.id]=checked.value;if(step<questions.length-1){step++;render();}else report();};root.append(form);focusHeading(root);
}
function report(){
 const d=diagnose(answers),qualification=qualify(answers);show('report');const root=$('#report');root.replaceChildren();
 root.append(el('p','SEU RAIO-X · ARQUITETURA DE RECEITA','eyebrow'));
 const titles={bottleneck:'Seu primeiro ponto de atenção: '+names[d.bottlenecks[0]],tie:'Há um empate entre prioridades',strong:'Sem gargalo evidente nas respostas',insufficient:'Faltam dados para apontar um gargalo'};
 const h=el('h1',titles[d.status]);h.tabIndex=-1;root.append(h);
 const summaries={bottleneck:'Este foi o pilar com menor sinal de estrutura nas suas respostas. Trate-o como hipótese para validar, não como causa comprovada.',tie:'Os pilares '+d.bottlenecks.map(k=>names[k]).join(' e ')+' tiveram a mesma pontuação. Não há base para escolher um vencedor.',strong:'Você relatou práticas estruturadas nos três pilares. O próximo passo é validar essa percepção com indicadores, não inventar um problema.',insufficient:'Uma ou mais respostas foram “não sei”. Isso não recebe nota ruim. Primeiro feche as lacunas de informação; não é possível comparar todos os pilares com segurança.'};root.append(el('p',summaries[d.status],'lead'));
 if(!qualification.icp)root.append(el('p','O enquadramento de receita e maturidade deste Raio-X não foi confirmado. Use esta leitura como organização inicial, não como indicação de um programa.','notice'));
 if(answers.monthly==='unclassified')root.append(el('p','Sua receita mensal não foi classificada. O critério anual foi considerado separadamente, sem aproximar ou alterar as faixas.','notice'));
 const grid=el('div',undefined,'scores');for(const [key,score] of Object.entries(d.scores)){const card=el('article');card.append(el('h2',names[key]),el('p',score===null?'Sem base suficiente':score+' / 100','score'),el('p','Índice de estrutura declarada, não desempenho financeiro.'));grid.append(card);}root.append(grid);
 const evidence=el('section',undefined,'block');evidence.append(el('h2','O que sustenta esta leitura'));
 const dl=el('dl');for(const q of questions.filter(x=>['model','acquisition','products','margin','retention','dependency','pain','timing'].includes(x.id))){dl.append(el('dt',q.title),el('dd',q.options.find(o=>o[0]===answers[q.id])[1]));}evidence.append(dl);root.append(evidence);
 const action=el('section',undefined,'block');action.append(el('p','SEU PRÓXIMO MOVIMENTO','eyebrow'),el('h2','Uma ação prática em 7 dias'));
 const chosen=d.bottlenecks.length===1?d.bottlenecks[0]:null;
 if(chosen){action.append(el('p',plans[chosen].action),el('h3','Indicadores para acompanhar'),el('p',plans[chosen].metrics));}
 else if(d.status==='insufficient'){action.append(el('p','Nos dias 1 e 2, identifique quais respostas ficaram sem dados e quem pode apurá-las. Nos dias 3 a 5, reúna os registros disponíveis. Nos dias 6 e 7, revise as evidências e refaça a leitura. Não escolha um gargalo antes disso.'),el('h3','Indicadores para acompanhar'),el('p','Cobertura dos dados por pilar, período dos registros e responsável pela atualização.'));}
 else if(d.status==='tie'){action.append(el('p','Nos dias 1 e 2, reúna uma evidência operacional de cada pilar empatado. Nos dias 3 a 5, compare impacto observado e capacidade de execução. Nos dias 6 e 7, escolha uma frente com base nesses dados e defina responsável e revisão.'),el('h3','Indicadores para comparar'));for(const key of d.bottlenecks)action.append(el('p',names[key]+': '+plans[key].metrics));}
 else{action.append(el('p','Nos dias 1 e 2, reúna os indicadores dos três pilares. Nos dias 3 a 5, compare períodos equivalentes. Nos dias 6 e 7, confirme consistência e documente uma rotina de revisão, sem iniciar mudanças apenas por esta pontuação.'),el('h3','Indicadores para acompanhar'),el('p','Conversão por canal, passagem entre ofertas, margem de contribuição e recompra ou retenção.'));}
 if(answers.dependency==='dependent')action.append(el('p','Atenção à execução: você informou dependência alta do dono. Escolha um responsável e documente uma única rotina antes de ampliar a frente de trabalho.','notice'));
 root.append(action);
 const limits=el('section',undefined,'block');limits.append(el('h2','Como interpretar'),el('p','Leitura determinística a partir das suas respostas. Cada sinal conhecido vale 0, 50 ou 100; Margem / LTV combina margem e continuidade com peso igual. Desconhecidos não recebem nota. Não estimamos perdas financeiras, não auditamos documentos e não prometemos resultado.'),el('p',answers.conversation==='yes'?'Você indicou interesse em conversar. Nenhum agendamento ou envio foi realizado. O destino da conversa ainda será definido.':'Você preferiu começar pelo relatório. Use a ação prática e revise suas evidências.'),el('p','Preview sem coleta de nome, e-mail ou telefone. Ao recarregar ou refazer, as respostas são descartadas.'));root.append(limits);
 const actions=el('div',undefined,'actions no-print');actions.append(button('Imprimir / salvar PDF',()=>window.print(),'primary'),button('Revisar respostas',()=>render()),button('Refazer',()=>{answers={};step=0;show('intro');$('#start').focus();window.scrollTo(0,0);}));root.append(actions);focusHeading(root);
}
$('#start').onclick=()=>render();
