"use client";
import {useCallback,useEffect,useState} from "react";
import {Login} from "@/components/Login";
import {Dashboard} from "@/components/Dashboard";
import {Toast,type ToastMessage} from "@/components/Toast";
import {seedTransactions,type Transaction} from "@/lib/data";
import {createClient,isConfigured} from "@/lib/supabase/client";
type Theme="light"|"dark";
type DbRow={id:string;title:string;category:string;date:string;amount:number;type:"income"|"expense"};
export default function Home(){
 const[ready,setReady]=useState(false);const[theme,setTheme]=useState<Theme>("dark");
 const[name,setName]=useState<string|null>(null);const[userId,setUserId]=useState<string|null>(null);
 const[loading,setLoading]=useState(false);const[transactions,setTransactions]=useState<Transaction[]>(isConfigured?[]:seedTransactions);
 const[toast,setToast]=useState<ToastMessage|null>(null);
 const notify=useCallback((kind:"success"|"error",text:string)=>setToast({kind,text,id:Date.now()}),[]);
 const dismiss=useCallback(()=>setToast(null),[]);
 useEffect(()=>{
  const next=localStorage.getItem("wc-theme")==="light"?"light":"dark";setTheme(next);document.documentElement.classList.toggle("dark",next==="dark");
  if(!isConfigured){setName(sessionStorage.getItem("wc-demo-user"));try{const list=localStorage.getItem("wc-demo-transactions");if(list){const parsed:unknown=JSON.parse(list);if(Array.isArray(parsed))setTransactions(parsed as Transaction[])}}catch{}setReady(true);return}
  const supabase=createClient();let active=true;
  async function loadTransactions(){const {data,error}=await supabase.from("transactions").select("id,title,category,date,amount,type").order("date",{ascending:false});if(active){if(error)notify("error","Não foi possível carregar as transações.");else setTransactions((data??[]).map((t:DbRow)=>({...t,amount:Number(t.amount)})))}}
  async function sync(){const {data:{user}}=await supabase.auth.getUser();if(!active)return;setUserId(user?.id??null);setName(user?user.user_metadata?.display_name||user.email?.split("@")[0]||"Utilizador":null);if(user)await loadTransactions();else setTransactions([]);setReady(true)}
  void sync();const {data:{subscription}}=supabase.auth.onAuthStateChange(()=>{window.setTimeout(()=>{void sync()},0)});return ()=>{active=false;subscription.unsubscribe()};
 },[notify]);
 function toggle(){const next=theme==="dark"?"light":"dark";setTheme(next);document.documentElement.classList.toggle("dark",next==="dark");localStorage.setItem("wc-theme",next)}
 async function login(email:string,password:string){setLoading(true);try{if(!isConfigured){const next=email.split("@")[0].replace(/[._-]+/g," ");setName(next);sessionStorage.setItem("wc-demo-user",next);notify("success","Entrou no modo de demonstração.");return}
  const {error}=await createClient().auth.signInWithPassword({email,password});if(error)throw new Error("Credenciais inválidas ou conta não confirmada.");notify("success","Sessão iniciada com sucesso.");}finally{setLoading(false)}}
 async function register(email:string,password:string){setLoading(true);try{const {data,error}=await createClient().auth.signUp({email,password});if(error)throw new Error(error.message);notify("success",data.session?"Conta criada com sucesso.":"Verifique o seu e-mail para confirmar a conta.")}finally{setLoading(false)}}
 async function logout(){if(isConfigured){const {error}=await createClient().auth.signOut();if(error){notify("error","Não foi possível terminar a sessão.");return}setName(null);setUserId(null);setTransactions([])}else{setName(null);sessionStorage.removeItem("wc-demo-user")}notify("success","Sessão terminada.")}
 async function add(t:Transaction){if(isConfigured){if(!userId)throw new Error("Sessão inválida");const {data,error}=await createClient().from("transactions").insert({...t,user_id:userId}).select("id,title,category,date,amount,type").single();if(error){notify("error","Não foi possível guardar. Verifique a ligação à base de dados.");throw error}setTransactions(prev=>[{...(data as DbRow),amount:Number(data.amount)},...prev]);}
 else setTransactions(prev=>{const next=[t,...prev];localStorage.setItem("wc-demo-transactions",JSON.stringify(next));return next});notify("success","Transação registada.")}
 async function remove(id:string){if(isConfigured){const {error}=await createClient().from("transactions").delete().eq("id",id);if(error){notify("error","Não foi possível eliminar a transação.");return}}setTransactions(prev=>{const next=prev.filter(t=>t.id!==id);if(!isConfigured)localStorage.setItem("wc-demo-transactions",JSON.stringify(next));return next});notify("success","Transação eliminada.")}
 // A public deployment must never silently turn into a local demo if configuration is missing.
 if(process.env.NODE_ENV==="production" && !isConfigured){
  return <main className="loading" role="alert">Well<span>Controled</span><p style={{fontSize:16,fontWeight:400,textAlign:"center",marginTop:20}}>Serviço temporariamente indisponível. Contacte o administrador.</p></main>;
 }
 if(!ready)return <div className="loading">Well<span>Controled</span></div>;
 return <><Toast toast={toast} onDismiss={dismiss}/>{name?<Dashboard name={name} theme={theme} onTheme={toggle} onLogout={()=>void logout()} transactions={transactions} onAdd={add} onDelete={remove}/>:<Login onLogin={login} onRegister={register} loading={loading} realAuth={isConfigured} theme={theme} onTheme={toggle}/>}</>;
}
