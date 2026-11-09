export const VERSION='pricing-v1';
const cents=x=>Math.ceil((x-1e-9)*100)/100;
export function calculate(a){
 if(!a||!['individual','group','hybrid'].includes(a.format))throw new Error('Escolha o formato da mentoria.');
 const limits={weeks:[1,104,true],meetings:[1,500,true],hoursPerMeeting:[0.25,24],prepHours:[0,10000],supportHours:[0,10000],participants:[1,1000,true],pay:[0,10000000],fixed:[0,10000000],variable:[0,1000000],fees:[0,99],margin:[0,99]};
 for(const [key,[min,max,integer]] of Object.entries(limits)){
  const v=a[key];if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max||(integer&&!Number.isInteger(v)))throw new Error('Revise os campos: use números válidos dentro dos limites indicados.');
 }
 if(a.fees+a.margin>=100)throw new Error('Taxas + margem devem somar menos de 100%.');
 if(a.pay+a.fixed+a.variable*a.participants<=0)throw new Error('Informe remuneração ou custos maiores que zero.');
 const cost=a.pay+a.fixed+a.variable*a.participants;
 const hours=a.meetings*a.hoursPerMeeting+a.prepHours+a.supportHours;
 return {version:VERSION,cost,minimum:cents(cost/(a.participants*(1-a.fees/100))),target:cents(cost/(a.participants*(1-(a.fees+a.margin)/100))),hours,hourlyPay:a.pay/hours};
}
