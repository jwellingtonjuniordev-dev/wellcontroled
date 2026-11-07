"use client";
import {useEffect} from "react";
import {CheckCircle2,AlertCircle,X} from "lucide-react";
export type ToastMessage={id:number;kind:"success"|"error";text:string};
export function Toast({toast,onDismiss}:{toast:ToastMessage|null;onDismiss:()=>void}) {
  useEffect(()=>{if(!toast)return;const id=window.setTimeout(onDismiss,5000);return ()=>clearTimeout(id)},[toast,onDismiss]);
  if(!toast)return null;
  return <div className={`wc-toast ${toast.kind}`} role={toast.kind==="error"?"alert":"status"} aria-live={toast.kind==="error"?"assertive":"polite"}>
    {toast.kind==="success"?<CheckCircle2 size={20}/>:<AlertCircle size={20}/>}<span>{toast.text}</span><button aria-label="Fechar notificação" type="button" onClick={onDismiss}><X size={18}/></button>
    <div className="wc-toast-progress" key={toast.id}/>
  </div>
}
