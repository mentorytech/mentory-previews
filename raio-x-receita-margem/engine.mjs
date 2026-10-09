export const version='rx-1';
export function diagnose(a){
 const scale={weak:0,partial:50,strong:100,unknown:null};
 for(const key of ['acquisition','products','margin','retention']) if(!Object.hasOwn(scale,a[key])) throw new Error('Resposta inválida: '+key);
 if(!['dependent','shared','independent','unknown'].includes(a.dependency)) throw new Error('Dependência inválida');
 const scores={acquisition:scale[a.acquisition],products:scale[a.products],margin:a.margin==='unknown'||a.retention==='unknown'?null:(scale[a.margin]+scale[a.retention])/2};
 const known=Object.values(scores).every(x=>x!==null);
 const min=known?Math.min(...Object.values(scores)):null;
 const bottlenecks=known&&min<100?Object.keys(scores).filter(k=>scores[k]===min):[];
 return {scores,bottlenecks,status:!known?'insufficient':min===100?'strong':bottlenecks.length>1?'tie':'bottleneck',dependency:a.dependency};
}
export function qualify(a){
 const enums={maturity:['validated','building'],monthly:['low','mid','high','top','validation','unclassified'],annual:['yes','no','unknown'],role:['owner','decision','team'],pain:['acquisition','products','margin','owner','none'],timing:['30','90','later','unknown'],conversation:['yes','no']};
 for(const [key,values] of Object.entries(enums)) if(!values.includes(a[key])) throw new Error('Resposta inválida: '+key);
 const icp=a.maturity==='validated' && a.monthly!=='validation' && (['high','top'].includes(a.monthly)||a.annual==='yes');
 return {icp,mql:icp&&['owner','decision'].includes(a.role)&&a.pain!=='none'&&['30','90'].includes(a.timing),conversation:a.conversation==='yes',provisional:true};
}
