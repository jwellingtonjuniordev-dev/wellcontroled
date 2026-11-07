import { TrendingUp } from "lucide-react";
export function Brand({compact=false}:{compact?:boolean}){return <div className="brand"><span className="brand-symbol"><span className="bar b1"/><span className="bar b2"/><span className="bar b3"/><TrendingUp size={compact?17:22} strokeWidth={3} className="brand-trend"/></span><span className="brand-name">Well<span>Controled</span></span></div>}
