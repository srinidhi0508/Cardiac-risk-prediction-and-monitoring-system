"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, AlertTriangle, Activity, FileText, LogOut, Stethoscope,
  Search, User, CheckCircle, Clock, ChevronRight, Bell, Loader2, X
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label:"Overview", icon:Activity,      href:"/doctor-dashboard" },
  { label:"Patients", icon:Users,         href:"/doctor-dashboard/patients" },
  { label:"Alerts",   icon:AlertTriangle, href:"/doctor-dashboard/alerts" },
  { label:"Reports",  icon:FileText,      href:"/doctor-dashboard/reports" },
];

type Patient = {
  id:number; name:string; age:number; condition:string; risk:number;
  riskLabel:string; bpm:number; status:string;
  spo2:number; systolic:number; diastolic:number; hrv:number;
  phone:string; address:string;
};

const patients: Patient[] = [
  { id:1, name:"Rahul Verma",   age:45, condition:"Hypertension",   risk:22, riskLabel:"Moderate", bpm:74,  status:"stable", spo2:98, systolic:120, diastolic:80, hrv:42, phone:"+91 9876543210", address:"Hyderabad, India" },
  { id:2, name:"Priya Sharma",  age:52, condition:"Type 2 Diabetes",risk:48, riskLabel:"Moderate", bpm:88,  status:"watch",  spo2:97, systolic:128, diastolic:84, hrv:35, phone:"+91 9123456789", address:"Secunderabad, India" },
  { id:3, name:"Arjun Mehta",   age:61, condition:"Post-MI",        risk:67, riskLabel:"High",     bpm:95,  status:"alert",  spo2:95, systolic:148, diastolic:92, hrv:28, phone:"+91 9988776655", address:"Pune, India" },
  { id:4, name:"Sunita Patel",  age:38, condition:"Hyperlipidemia", risk:14, riskLabel:"Low",      bpm:68,  status:"stable", spo2:99, systolic:112, diastolic:74, hrv:55, phone:"+91 9001122334", address:"Bengaluru, India" },
  { id:5, name:"Dev Krishnan",  age:57, condition:"Arrhythmia",     risk:55, riskLabel:"High",     bpm:102, status:"alert",  spo2:94, systolic:138, diastolic:88, hrv:22, phone:"+91 9445566778", address:"Chennai, India" },
  { id:6, name:"Meena Iyer",    age:49, condition:"Hypertension",   risk:31, riskLabel:"Moderate", bpm:79,  status:"watch",  spo2:98, systolic:132, diastolic:86, hrv:38, phone:"+91 9667788990", address:"Mumbai, India" },
  { id:7, name:"Kiran Reddy",   age:33, condition:"Normal",         risk:8,  riskLabel:"Low",      bpm:65,  status:"stable", spo2:99, systolic:110, diastolic:72, hrv:58, phone:"+91 9112233445", address:"Hyderabad, India" },
];

const rc = (r:string) => ({
  High:     { color:"#ef4444", bg:"rgba(239,68,68,0.12)",  border:"rgba(239,68,68,0.3)" },
  Moderate: { color:"#f59e0b", bg:"rgba(245,158,11,0.12)", border:"rgba(245,158,11,0.3)" },
  Low:      { color:"#10b981", bg:"rgba(16,185,129,0.12)", border:"rgba(16,185,129,0.3)" },
}[r] ?? { color:"#6366f1", bg:"rgba(99,102,241,0.12)", border:"rgba(99,102,241,0.3)" });

// ─── Patient PDF report ────────────────────────────────────────────────────────
async function generatePatientPDF(p: Patient) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W=210; const m=18;

  doc.setFillColor(18,14,45); doc.rect(0,0,W,36,"F");
  doc.setFillColor(99,102,241); doc.rect(0,36,W,1.5,"F");
  doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(18);
  doc.text("PulseGuard", m, 16);
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(170,168,220);
  doc.text("Cardiac Monitoring & PPG Risk Prediction  |  Patient Summary", m, 23);
  doc.text("AIIMS Hyderabad  |  Dr. Ananya Rao, Cardiologist", m, 29);
  doc.setTextColor(200,200,255); doc.setFontSize(7);
  doc.text("PATIENT REPORT", W-m, 13, {align:"right"});
  doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(255,255,255);
  doc.text(p.name, W-m, 20, {align:"right"});
  doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(170,168,220);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}`, W-m, 27, {align:"right"});

  let y=46;

  // Patient info
  doc.setFillColor(242,241,255);
  doc.roundedRect(m, y, W-m*2, 32, 3,3,"F");
  doc.setDrawColor(200,196,255); doc.setLineWidth(0.4);
  doc.roundedRect(m, y, W-m*2, 32, 3,3,"S");
  doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(70,60,140);
  doc.text("PATIENT INFORMATION", m+4, y+7);
  const rows=[
    ["Name:", p.name,       "Age:",      `${p.age} years`,   "Condition:", p.condition],
    ["Doctor:","Dr. Ananya Rao","Phone:", p.phone,          "Address:",   p.address],
    ["Status:", p.status.charAt(0).toUpperCase()+p.status.slice(1), "Risk Label:", p.riskLabel+" Risk", "CVD Risk:", `${p.risk}%`],
  ];
  const cx=[m+4,m+20,m+80,m+96,m+152,m+170];
  rows.forEach((row,ri)=>{ const ry=y+14+ri*6; for(let ci=0;ci<6;ci+=2){ doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(100,90,160); doc.text(row[ci],cx[ci],ry); doc.setFont("helvetica","normal"); doc.setTextColor(30,20,70); doc.text(row[ci+1],cx[ci+1],ry); } });
  y+=40;

  // Vitals
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(30,20,80);
  doc.text("Current PPG Vitals", m, y);
  doc.setDrawColor(99,102,241); doc.setLineWidth(0.6); doc.line(m, y+2, m+50, y+2); y+=9;

  const vv=[
    {label:"Heart Rate",   value:`${p.bpm} bpm`,        ok:p.bpm<100,       status:p.bpm<100?"Normal":"High BPM"},
    {label:"SpO2",         value:`${p.spo2}%`,           ok:p.spo2>=95,      status:p.spo2>=95?"Normal":"Low SpO2"},
    {label:"Systolic BP",  value:`${p.systolic} mmHg`,  ok:p.systolic<130,  status:p.systolic<130?"Normal":"Elevated"},
    {label:"Diastolic BP", value:`${p.diastolic} mmHg`, ok:p.diastolic<85,  status:p.diastolic<85?"Normal":"Elevated"},
    {label:"HRV",          value:`${p.hrv} ms`,          ok:p.hrv>30,        status:p.hrv>30?"Normal":"Low HRV"},
    {label:"CVD Risk",     value:`${p.risk}%`,           ok:p.risk<20,       status:p.riskLabel+" Risk"},
  ];
  const bw=(W-m*2-10)/3; let bx=m; let by=y;
  vv.forEach((v,i)=>{ if(i>0&&i%3===0){bx=m;by+=24;} doc.setFillColor(248,246,255); doc.roundedRect(bx,by,bw,20,2,2,"F"); doc.setDrawColor(210,206,255); doc.roundedRect(bx,by,bw,20,2,2,"S"); doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(100,90,160); doc.text(v.label,bx+4,by+7); doc.setFont("helvetica","bold"); doc.setFontSize(12); doc.setTextColor(20,10,60); doc.text(v.value,bx+4,by+15); const vc=v.ok?[16,185,129]:[239,68,68]; doc.setFillColor(vc[0],vc[1],vc[2]); doc.roundedRect(bx+bw-28,by+13,24,5,1.5,1.5,"F"); doc.setFont("helvetica","bold"); doc.setFontSize(6); doc.setTextColor(255,255,255); doc.text(v.status,bx+bw-16,by+16.2,{align:"center"}); bx+=bw+5; });
  y=by+30;

  // Risk bar
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(30,20,80);
  doc.text("10-Year Cardiovascular Risk", m, y);
  doc.setDrawColor(99,102,241); doc.line(m,y+2,m+75,y+2); y+=9;
  const bLen=W-m*2;
  doc.setFillColor(215,213,245); doc.roundedRect(m,y,bLen,8,2,2,"F");
  const filled=(p.risk/100)*bLen;
  const rcc=p.risk<20?[16,185,129]:p.risk<50?[245,158,11]:[239,68,68];
  doc.setFillColor(rcc[0],rcc[1],rcc[2]); doc.roundedRect(m,y,filled,8,2,2,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(30,20,80);
  doc.text(`${p.risk}% — ${p.riskLabel} Risk`, m, y+16);
  doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(100,90,150);
  doc.text("Derived from PPG signals: BPM, SpO2, HRV, blood pressure", m, y+22); y+=30;

  // Recommendations
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(30,20,80);
  doc.text("Clinical Recommendations", m, y);
  doc.setDrawColor(99,102,241); doc.line(m,y+2,m+75,y+2); y+=9;
  const recs=p.risk<20
    ?["Continue routine PPG monitoring. No immediate intervention required.","Schedule next review in 6 months.","Maintain current medication and lifestyle."]
    :p.risk<50
    ?["Follow-up within 30 days.","Daily PPG home monitoring advised.","Review medications and adjust if needed.","Counsel on diet and exercise."]
    :["Urgent cardiologist review required.","Daily vital monitoring mandatory.","Optimise current medications immediately.","Consider hospital admission for observation."];
  recs.forEach(r2=>{ doc.setFillColor(99,102,241); doc.circle(m+2.5,y-0.8,1.2,"F"); doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(30,20,70); doc.text(r2,m+7,y); y+=7; });

  const pH=297;
  doc.setFillColor(18,14,45); doc.rect(0,pH-16,W,16,"F");
  doc.setTextColor(160,158,210); doc.setFont("helvetica","normal"); doc.setFontSize(6.5);
  doc.text("Confidential Clinical Document — PulseGuard AI · Authorised personnel only.", m, pH-9);
  doc.text(`Patient ID: PG-PT-${p.id}  |  ${new Date().toLocaleString()}`, W-m, pH-9, {align:"right"});
  doc.setTextColor(99,102,241); doc.text("PulseGuard — Cardiac Intelligence", m, pH-4);

  window.open(URL.createObjectURL(doc.output("blob")), "_blank");
}

function Sidebar() {
  const router=useRouter(); const pathname=usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-20 flex flex-col py-6 px-4"
      style={{ background:"rgba(255,255,255,0.03)", borderRight:"1px solid rgba(255,255,255,0.06)", backdropFilter:"blur(20px)" }}>
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:"linear-gradient(135deg,#6366f1,#a855f7)" }}><Stethoscope className="w-4 h-4 text-white"/></div>
        <span className="text-white font-bold" style={{ fontFamily:"'DM Sans',sans-serif" }}>PulseGuard</span>
      </div>
      <div className="px-3 py-4 rounded-2xl mb-6" style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background:"linear-gradient(135deg,#a855f7,#6366f1)" }}><Stethoscope className="w-5 h-5 text-white"/></div>
          <div><div className="text-white text-sm font-semibold" style={{ fontFamily:"'DM Sans',sans-serif" }}>Dr. Ananya Rao</div><div className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>Cardiologist</div></div>
        </div>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item=>{ const active=pathname===item.href; return (
          <button key={item.label} onClick={()=>router.push(item.href)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left"
            style={{ background:active?"rgba(99,102,241,0.2)":"transparent", color:active?"#a5b4fc":"rgba(255,255,255,0.5)", border:active?"1px solid rgba(99,102,241,0.3)":"1px solid transparent" }}>
            <item.icon className="w-4 h-4"/>{item.label}
          </button>
        );})}
      </nav>
      <button onClick={()=>router.push("/")} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm" style={{ color:"rgba(255,255,255,0.35)" }}>
        <LogOut className="w-4 h-4"/> Sign Out
      </button>
    </aside>
  );
}

// ─── Patient detail modal ──────────────────────────────────────────────────────
function PatientModal({ patient, onClose, onPDF, loadingPDF }: { patient:Patient; onClose:()=>void; onPDF:()=>void; loadingPDF:boolean; }) {
  const c = rc(patient.riskLabel);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(10px)" }}>
      <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
        className="w-full max-w-lg p-8 rounded-3xl relative"
        style={{ background:"rgba(18,14,45,0.98)", border:"1px solid rgba(99,102,241,0.3)", maxHeight:"90vh", overflowY:"auto" }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background:"rgba(255,255,255,0.08)" }}><X className="w-4 h-4 text-white"/></button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#6366f1,#a855f7)" }}>
            <User className="w-7 h-7 text-white"/>
          </div>
          <div>
            <h2 className="text-white text-xl font-bold" style={{ fontFamily:"'DM Sans',sans-serif" }}>{patient.name}</h2>
            <p className="text-sm" style={{ color:"rgba(255,255,255,0.4)" }}>Age {patient.age} · {patient.condition}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            {label:"Heart Rate", value:`${patient.bpm} bpm`},
            {label:"SpO₂",       value:`${patient.spo2}%`},
            {label:"Systolic",   value:`${patient.systolic} mmHg`},
            {label:"Diastolic",  value:`${patient.diastolic} mmHg`},
            {label:"HRV",        value:`${patient.hrv} ms`},
            {label:"CVD Risk",   value:`${patient.risk}%`},
          ].map(v => (
            <div key={v.label} className="p-3 rounded-xl" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-xs mb-1" style={{ color:"rgba(255,255,255,0.4)" }}>{v.label}</div>
              <div className="text-white font-bold text-lg" style={{ fontFamily:"'DM Sans',sans-serif" }}>{v.value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6 p-4 rounded-xl" style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)" }}>
          <div>
            <div className="text-xs mb-0.5" style={{ color:"rgba(255,255,255,0.4)" }}>Risk Level</div>
            <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ background:c.bg, border:`1px solid ${c.border}`, color:c.color }}>
              {patient.risk}% — {patient.riskLabel} Risk
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={onPDF} disabled={loadingPDF}
            className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background:"linear-gradient(135deg,#6366f1,#a855f7)", color:"white" }}>
            {loadingPDF ? <><Loader2 className="w-4 h-4 animate-spin"/> Generating...</> : <><ChevronRight className="w-4 h-4"/> View Full Report</>}
          </motion.button>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={onClose}
            className="px-5 py-3 rounded-xl text-sm font-medium"
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)" }}>
            Close
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PatientsPage() {
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("All");
  const [selected, setSelected]   = useState<Patient|null>(null);
  const [loadingPDF, setLoadingPDF] = useState(false);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter==="All" || p.riskLabel===filter)
  );

  const handleViewPDF = async (p: Patient) => {
    setLoadingPDF(true);
    try { await generatePatientPDF(p); }
    finally { setLoadingPDF(false); }
  };

  return (
    <main className="min-h-screen" style={{ background:"linear-gradient(135deg,#0a0a1a 0%,#0d0d2b 40%,#1a0a2e 100%)" }}>
      <Sidebar/>
      {selected && <PatientModal patient={selected} onClose={()=>setSelected(null)} onPDF={()=>handleViewPDF(selected)} loadingPDF={loadingPDF}/>}

      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily:"'DM Sans',sans-serif" }}>Patients</h1>
            <p className="text-sm mt-1" style={{ color:"rgba(255,255,255,0.4)" }}>{patients.length} patients under monitoring</p>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center relative"
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
            <Bell className="w-4 h-4 text-white"/>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"/>
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:"rgba(255,255,255,0.3)" }}/>
            <input placeholder="Search patient..." value={search} onChange={e=>setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none"
              style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}/>
          </div>
          {["All","Low","Moderate","High"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition"
              style={{ background:filter===f?"rgba(99,102,241,0.25)":"rgba(255,255,255,0.04)", border:filter===f?"1px solid rgba(99,102,241,0.4)":"1px solid rgba(255,255,255,0.08)", color:filter===f?"#a5b4fc":"rgba(255,255,255,0.5)" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(20px)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                {["Patient","Age","Condition","BPM","10yr Risk","Status","Action"].map(h=>(
                  <th key={h} className="text-left px-5 py-4 font-medium text-xs" style={{ color:"rgba(255,255,255,0.35)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p,i)=>{
                const c=rc(p.riskLabel);
                return (
                  <motion.tr key={p.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.05 }}
                    className="border-b" style={{ borderColor:"rgba(255,255,255,0.05)" }}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background:"rgba(99,102,241,0.2)" }}>
                          <User className="w-3.5 h-3.5" style={{ color:"#a5b4fc" }}/>
                        </div>
                        <span className="text-white font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4" style={{ color:"rgba(255,255,255,0.5)" }}>{p.age}</td>
                    <td className="px-5 py-4" style={{ color:"rgba(255,255,255,0.5)" }}>{p.condition}</td>
                    <td className="px-5 py-4 text-white font-medium">{p.bpm} <span style={{ color:"rgba(255,255,255,0.35)", fontWeight:400 }}>bpm</span></td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background:c.bg, border:`1px solid ${c.border}`, color:c.color }}>
                        {p.risk}% · {p.riskLabel}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {p.status==="stable" && <span className="flex items-center gap-1 text-xs" style={{ color:"#6ee7b7" }}><CheckCircle className="w-3.5 h-3.5"/>Stable</span>}
                      {p.status==="watch"  && <span className="flex items-center gap-1 text-xs" style={{ color:"#fde047" }}><Clock className="w-3.5 h-3.5"/>Watch</span>}
                      {p.status==="alert"  && <span className="flex items-center gap-1 text-xs" style={{ color:"#fca5a5" }}><AlertTriangle className="w-3.5 h-3.5"/>Alert</span>}
                    </td>
                    <td className="px-5 py-4">
                      <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}
                        onClick={()=>setSelected(p)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.25)", color:"#a5b4fc" }}>
                        View <ChevronRight className="w-3 h-3"/>
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}