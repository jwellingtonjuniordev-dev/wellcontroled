export type Transaction = { id: string; title: string; category: string; date: string; amount: number; type: "income" | "expense" };
export const seedTransactions: Transaction[] = [
  {id:"1",title:"Salário",category:"Trabalho",date:"2026-11-01",amount:6230,type:"income"},
  {id:"2",title:"Supermercado",category:"Alimentação",date:"2026-11-02",amount:248.9,type:"expense"},
  {id:"3",title:"Conta de eletricidade",category:"Habitação",date:"2026-11-03",amount:95.2,type:"expense"},
  {id:"4",title:"Freelance",category:"Trabalho",date:"2026-11-04",amount:650,type:"income"},
  {id:"5",title:"Transporte",category:"Transporte",date:"2026-11-04",amount:72.6,type:"expense"},
  {id:"6",title:"Streaming",category:"Lazer",date:"2026-11-05",amount:17.99,type:"expense"},
];
export const money = (amount:number) => new Intl.NumberFormat("pt-PT",{style:"currency",currency:"EUR"}).format(amount);
export const dateLabel = (value:string) => new Date(`${value}T12:00:00`).toLocaleDateString("pt-PT",{day:"2-digit",month:"short",year:"numeric"});
