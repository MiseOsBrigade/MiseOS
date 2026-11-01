import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ShieldCheck,Database,GitBranch,Activity,ChefHat,Search} from 'lucide-react';
import './style.css';
const API=import.meta.env.VITE_API_URL||'http://localhost:8000';
function App(){
 const [summary,setSummary]=useState(null),[agents,setAgents]=useState([]),[q,setQ]=useState(''),[dept,setDept]=useState('All');
 useEffect(()=>{Promise.all([fetch(`${API}/grid/summary`).then(r=>r.json()),fetch(`${API}/agents`).then(r=>r.json())]).then(([s,a])=>{setSummary(s);setAgents(a)})},[]);
 const departments=['All',...new Set(agents.map(a=>a.department))];
 const shown=agents.filter(a=>(dept==='All'||a.department===dept)&&(`${a.name} ${a.role}`.toLowerCase().includes(q.toLowerCase())));
 return <main><header><div><span className="eyebrow">MISEOS / RELEASE 1</span><h1>GridOps Playground</h1><p>Operational truth for autonomous software systems.</p></div><div className="proof"><ShieldCheck/> Evidence-native</div></header>
 <section className="metrics">{summary&&<><Metric icon={<ChefHat/>} label="Chef Agents" value={summary.items.character_card||0}/><Metric icon={<Database/>} label="Registry" value={summary.items.registry_manifest||0}/><Metric icon={<GitBranch/>} label="Repositories" value={summary.repositories}/><Metric icon={<Activity/>} label="Evidence Cards" value={summary.evidence}/></>}</section>
 <section className="control"><div className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search agents or roles"/></div><div className="tabs">{departments.map(d=><button className={d===dept?'active':''} onClick={()=>setDept(d)} key={d}>{d}</button>)}</div></section>
 <section className="grid">{shown.map(a=><article key={a.id}><div className="num">{String(a.number).padStart(3,'0')}</div><div><small>{a.department}</small><h3>{a.name}</h3><p>{a.role}</p></div><span className="rarity">{a.rarity}</span></article>)}</section>
 </main>
}
function Metric({icon,label,value}){return <div className="metric">{icon}<div><strong>{value}</strong><span>{label}</span></div></div>}
createRoot(document.getElementById('root')).render(<App/>);
