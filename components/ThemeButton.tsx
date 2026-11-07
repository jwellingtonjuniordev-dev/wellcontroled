"use client";
import { Moon, Sun } from "lucide-react";
export function ThemeButton({theme,onToggle}:{theme:"light"|"dark";onToggle:()=>void}){return <button type="button" className="icon-button" aria-label={theme==="dark"?"Ativar modo claro":"Ativar modo escuro"} title="Alterar tema" onClick={onToggle}>{theme==="dark"?<Sun size={19}/>:<Moon size={19}/>}</button>}
