"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, AlertTriangle, Activity, FileText, LogOut, Stethoscope,
  Bell, Clock, HeartPulse, ChevronRight, CheckCircle, Loader2, X, BellOff
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

const navItems = [
  { label:"Overview", icon:Activity,      href:"/doctor-dashboard" },
  { label:"Patients", icon:Users,         href:"/doctor-dashboard/patients" },
  { label:"Alerts",   icon:AlertTriangle, href:"/doctor-dashboard/alerts" },
  { label:"Reports",  icon:FileText,      href:"/doctor-dashboard/reports" },
];

type Alert = {
  id:number; name:string; age:number; condition:string; bpm:number; risk:number;
  message:string; time:string; severity:"critical"|"warning";
  trend:number[]; systolic:number; diastolic:number; spo2:number; hrv:number;
};

const initialAlerts: Alert[] = [
  { id:1, name:"Arjun Mehta",  age:61, condition:"Post-MI",    bpm:95,  risk:67, severity:"critical",
    message:"Elevated heart rate with irregular rhythm detected. Immediate review recommended.",
    time:"12 min ago", trend:[88,90,92,95,93,96,95,98,95],
    systolic:148, diastolic:92, spo2:95, hrv:28 },
  { id:2, name:"Dev Krishnan", age:57, condition:"Arrhythmia", bpm:102, risk:55, severity:"critical",
    message:"BPM exceeding safe threshold. PPG signal shows irregular peaks.",
    time:"38 min ago", trend:[85,88,92,95,99,102,98,103,102],
    systolic:138, diastolic:88, spo2:94, hrv:22 },
  { id:3, name:"Priya Sharma", age:52, condition:"Type 2 Diabetes", bpm:88, risk:48, severity:"warning",
    message:"Moderate risk increase noted. Blood pressure elevated above baseline.",
    time:"1h 12min ago", trend:[76,78,80,82,84,86,85,88,88],
    systolic:128, diastolic:84, spo2:97, hrv:35 },
];

const sty = (s:string) => s==="critical"
  ? { color:"#ef4444", bg:"rgba(239,68,68,0.1)",  border:"rgba(239,68,68,0.25)",  label:"Critical", stroke:"#ef4444" }
  : { color:"#f59e0b", bg:"rgba(245,158,11,0.1)", border:"rgba(245,158,11,0.25)", label:"Warning",  stroke:"#f59e0b" };

// ─── PDF for alert report ──────────────────────────────────────────────────────
async function generateAlertPDF(alert: Alert) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W=210; const m=18;
  const sc = alert.severity==="critical" ? [239,68,68] : [245,158,11];

  doc.setFillColor(18,14,45); doc.rect(0,0,W,36,"F");
  doc.setFillColor(sc[0],sc[1],sc[2]); doc.rect(0,36,W,1.5,"F");
  doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(18);
  doc.text("PulseGuard", m, 16);
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(200,180,180);
  doc.text(`${alert.severity.toUpperCase()} ALERT REPORT  |  PPG Monitoring`, m, 23);
  doc.text("AIIMS Hyderabad  |  Dr. Ananya Rao, Cardiologist", m, 29);
  doc.setTextColor(255,200,200); doc.setFontSize(7);
  doc.text("ALERT REPORT", W-m, 13, {align:"right"});
  doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(255,255,255);
  doc.text(`${alert.name} — ${alert.severity.toUpperCase()}`, W-m, 20, {align:"right"});
  doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(200,180,180);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}`, W-m, 27, {align:"right"});
  doc.text(`Alert raised: ${alert.time}`, W-m, 33, {align:"right"});

  let y=46;

  // Alert banner
  doc.setFillColor(sc[0],sc[1],sc[2],0.15);
  doc.setFillColor(Math.min(255,sc[0]+180), Math.min(255,sc[1]+180), Math.min(255,sc[2]+180));
  doc.roundedRect(m, y, W-m*2, 18, 3,3,"F");
  doc.setDrawColor(sc[0],sc[1],sc[2]); doc.setLineWidth(0.5);
  doc.roundedRect(m, y, W-m*2, 18, 3,3,"S");
  doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(sc[0],sc[1],sc[2]);
  doc.text(`${alert.severity.toUpperCase()} ALERT`, m+5, y+8);
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(60,40,40);
  doc.text(alert.message, m+5, y+14);
  y+=26;

  // Patient info
  doc.setFillColor(248,246,255);
  doc.roundedRect(m, y, W-m*2, 24, 3,3,"F");
  doc.setDrawColor(210,200,255); doc.roundedRect(m, y, W-m*2, 24, 3,3,"S");
  doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(70,60,140);
  doc.text("PATIENT", m+4, y+7);
  const pr = [
    ["Name:", alert.name, "Age:", `${alert.age} years`, "Condition:", alert.condition],
    ["Risk Score:", `${alert.risk}% (High)`, "Alert Time:", alert.time, "Severity:", alert.severity.charAt(0).toUpperCase()+alert.severity.slice(1)],
  ];
  const pcx=[m+4,m+20,m+80,m+96,m+152,m+170];
  pr.forEach((row,ri)=>{ const ry=y+13+ri*6; for(let ci=0;ci<6;ci+=2){ doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(100,90,160); doc.text(row[ci],pcx[ci],ry); doc.setFont("helvetica","normal"); doc.setTextColor(30,20,70); doc.text(row[ci+1],pcx[ci+1],ry); } });
  y+=32;

  // Vitals at alert time
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(30,20,80);
  doc.text("Vitals at Time of Alert", m, y);
  doc.setDrawColor(sc[0],sc[1],sc[2]); doc.line(m, y+2, m+60, y+2); y+=9;

  const vv=[
    {label:"Heart Rate",  value:`${alert.bpm} bpm`,        ok:alert.bpm<100,   status:alert.bpm<100?"Normal":"CRITICAL"},
    {label:"SpO2",        value:`${alert.spo2}%`,           ok:alert.spo2>=95,  status:alert.spo2>=95?"Normal":"LOW"},
    {label:"Systolic BP", value:`${alert.systolic} mmHg`,  ok:alert.systolic<130,status:alert.systolic<130?"Normal":"ELEVATED"},
    {label:"Diastolic BP",value:`${alert.diastolic} mmHg`, ok:alert.diastolic<85,status:alert.diastolic<85?"Normal":"ELEVATED"},
    {label:"HRV",         value:`${alert.hrv} ms`,          ok:alert.hrv>30,   status:alert.hrv>30?"Normal":"LOW"},
    {label:"CVD Risk",    value:`${alert.risk}%`,           ok:alert.risk<20,  status:`${alert.risk<20?"Low":alert.risk<50?"Moderate":"High"} Risk`},
  ];
  const bw=(W-m*2-10)/3; let bx=m; let by=y;
  vv.forEach((v,i)=>{ if(i>0&&i%3===0){bx=m;by+=24;} doc.setFillColor(248,246,255); doc.roundedRect(bx,by,bw,20,2,2,"F"); doc.setDrawColor(210,206,255); doc.roundedRect(bx,by,bw,20,2,2,"S"); doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(100,90,160); doc.text(v.label,bx+4,by+7); doc.setFont("helvetica","bold"); doc.setFontSize(12); doc.setTextColor(20,10,60); doc.text(v.value,bx+4,by+15); const vc=v.ok?[16,185,129]:[sc[0],sc[1],sc[2]]; doc.setFillColor(vc[0],vc[1],vc[2]); doc.roundedRect(bx+bw-28,by+13,24,5,1.5,1.5,"F"); doc.setFont("helvetica","bold"); doc.setFontSize(5.5); doc.setTextColor(255,255,255); doc.text(v.status,bx+bw-16,by+16.2,{align:"center"}); bx+=bw+5; });
  y=by+30;

  // Recommended actions
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(30,20,80);
  doc.text("Immediate Actions Required", m, y);
  doc.setDrawColor(sc[0],sc[1],sc[2]); doc.line(m, y+2, m+72, y+2); y+=9;
  const acts = alert.severity==="critical"
    ? ["Contact patient immediately via phone.","Dispatch emergency medical assistance if unreachable.","Review PPG trend and cross-reference with patient history.","Update medication and escalate to senior cardiologist."]
    : ["Schedule urgent follow-up appointment within 48 hours.","Advise patient to increase monitoring frequency.","Review current medication for BP management.","Counsel patient on lifestyle modifications."];
  acts.forEach(a=>{ doc.setFillColor(sc[0],sc[1],sc[2]); doc.circle(m+2.5,y-0.8,1.2,"F"); doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(30,20,70); doc.text(a,m+7,y); y+=7; });

  const pH=297;
  doc.setFillColor(18,14,45); doc.rect(0,pH-16,W,16,"F");
  doc.setTextColor(160,158,210); doc.setFont("helvetica","normal"); doc.setFontSize(6.5);
  doc.text("Confidential Clinical Alert — PulseGuard AI · Authorised personnel only.", m, pH-9);
  doc.text(`Alert ID: PG-ALERT-${alert.id}  |  ${new Date().toLocaleString()}`, W-m, pH-9, {align:"right"});
  doc.setTextColor(sc[0],sc[1],sc[2]);
  doc.text("PulseGuard — Cardiac Intelligence", m, pH-4);

  window.open(URL.createObjectURL(doc.output("blob")), "_blank");
}

// ─── Snooze modal ─────────────────────────────────────────────────────────────
function SnoozeModal({ onClose, onConfirm }: { onClose:()=>void; onConfirm:(h:number)=>void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)" }}>
      <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
        className="p-8 rounded-2xl w-80 text-center"
        style={{ background:"rgba(20,15,50,0.98)", border:"1px solid rgba(99,102,241,0.3)" }}>
        <BellOff className="w-10 h-10 mx-auto mb-3" style={{ color:"#a5b4fc" }}/>
        <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily:"'DM Sans',sans-serif" }}>Snooze Alert</h3>
        <p className="text-sm mb-6" style={{ color:"rgba(255,255,255,0.5)" }}>How long should this alert be snoozed?</p>
        <div className="flex flex-col gap-2 mb-4">
          {[1,2,4,8].map(h => (
            <button key={h} onClick={() => onConfirm(h)}
              className="py-2.5 rounded-xl text-sm font-medium text-white transition"
              style={{ background:"rgba(99,102,241,0.2)", border:"1px solid rgba(99,102,241,0.3)" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(99,102,241,0.4)")}
              onMouseLeave={e=>(e.currentTarget.style.background="rgba(99,102,241,0.2)")}>
              {h} hour{h>1?"s":""}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>Cancel</button>
      </motion.div>
    </div>
  );
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
        {navItems.map(item => { const active=pathname===item.href; return (
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

export default function AlertsPage() {
  const [alerts, setAlerts]       = useState<Alert[]>(initialAlerts);
  const [resolved, setResolved]   = useState<number[]>([]);
  const [snoozed, setSnoozed]     = useState<{id:number;until:string}[]>([]);
  const [snoozeFor, setSnoozeFor] = useState<number|null>(null);
  const [loadingPDF, setLoadingPDF] = useState<number|null>(null);
  const [toast, setToast]         = useState<string|null>(null);

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(null),3000); };

  const handleResolve = (id:number) => {
    setResolved(r=>[...r,id]);
    showToast("Alert marked as resolved ✓");
  };

  const handleSnoozeConfirm = (hours:number) => {
    if (snoozeFor===null) return;
    const until = new Date(Date.now()+hours*3600000).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    setSnoozed(s=>[...s,{id:snoozeFor,until}]);
    setSnoozeFor(null);
    showToast(`Alert snoozed for ${hours}h — resumes at ${until}`);
  };

  const handleViewReport = async (alert:Alert) => {
    setLoadingPDF(alert.id);
    try { await generateAlertPDF(alert); }
    finally { setLoadingPDF(null); }
  };

  const activeAlerts  = alerts.filter(a => !resolved.includes(a.id));
  const criticalCount = activeAlerts.filter(a=>a.severity==="critical").length;
  const warningCount  = activeAlerts.filter(a=>a.severity==="warning").length;

  return (
    <main className="min-h-screen" style={{ background:"linear-gradient(135deg,#0a0a1a 0%,#0d0d2b 40%,#1a0a2e 100%)" }}>
      <Sidebar/>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-sm font-medium text-white flex items-center gap-2"
            style={{ background:"rgba(16,185,129,0.9)", border:"1px solid rgba(16,185,129,0.5)", backdropFilter:"blur(12px)" }}>
            <CheckCircle className="w-4 h-4"/> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {snoozeFor!==null && <SnoozeModal onClose={()=>setSnoozeFor(null)} onConfirm={handleSnoozeConfirm}/>}

      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily:"'DM Sans',sans-serif" }}>Active Alerts</h1>
            <p className="text-sm mt-1" style={{ color:"rgba(255,255,255,0.4)" }}>{activeAlerts.length} patient{activeAlerts.length!==1?"s":""} require attention</p>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center relative"
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
            <Bell className="w-4 h-4 text-white"/>
            {activeAlerts.length>0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"/>}
          </button>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label:"Critical Alerts",  value:`${criticalCount}`, color:"from-rose-500 to-red-600",      icon:AlertTriangle },
            { label:"Warnings",         value:`${warningCount}`,  color:"from-amber-500 to-orange-500",  icon:Clock },
            { label:"Resolved Today",   value:`${resolved.length+5}`, color:"from-emerald-500 to-teal-500", icon:CheckCircle },
          ].map((s,i) => (
            <motion.div key={s.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
              className="p-5 rounded-2xl flex items-center gap-4"
              style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(20px)" }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${s.color}`}>
                <s.icon className="w-5 h-5 text-white"/>
              </div>
              <div>
                <div className="text-2xl font-black text-white" style={{ fontFamily:"'DM Sans',sans-serif" }}>{s.value}</div>
                <div className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alert cards */}
        <div className="flex flex-col gap-5">
          <AnimatePresence>
            {activeAlerts.map((a,i) => {
              const st = sty(a.severity);
              const isSnoozed = snoozed.find(s=>s.id===a.id);
              const isLoading = loadingPDF===a.id;
              return (
                <motion.div key={a.id}
                  initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20, scale:0.95 }}
                  transition={{ delay:i*0.08 }}
                  className="p-6 rounded-2xl"
                  style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${st.border}`, backdropFilter:"blur(20px)", boxShadow:`0 0 30px ${st.bg}` }}>

                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background:st.bg, border:`1px solid ${st.border}` }}>
                        <HeartPulse className="w-6 h-6" style={{ color:st.color }}/>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <span className="text-white font-semibold" style={{ fontFamily:"'DM Sans',sans-serif" }}>{a.name}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ background:st.bg, border:`1px solid ${st.border}`, color:st.color }}>
                            {st.label}
                          </span>
                          <span className="text-xs flex items-center gap-1" style={{ color:"rgba(255,255,255,0.35)" }}>
                            <Clock className="w-3 h-3"/>{a.time}
                          </span>
                          {isSnoozed && (
                            <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                              style={{ background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", color:"#a5b4fc" }}>
                              <BellOff className="w-3 h-3"/> Snoozed until {isSnoozed.until}
                            </span>
                          )}
                        </div>
                        <p className="text-sm mb-3" style={{ color:"rgba(255,255,255,0.55)" }}>{a.message}</p>
                        <div className="flex gap-3 text-xs flex-wrap" style={{ color:"rgba(255,255,255,0.4)" }}>
                          <span>Age {a.age}</span><span>·</span>
                          <span>{a.condition}</span><span>·</span>
                          <span style={{ color:st.color, fontWeight:600 }}>{a.bpm} bpm</span><span>·</span>
                          <span>SpO₂ {a.spo2}%</span><span>·</span>
                          <span>{a.risk}% 10yr risk</span>
                        </div>
                      </div>
                    </div>

                    {/* Sparkline */}
                    <div className="w-36 h-16 shrink-0 ml-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={a.trend.map((v,j)=>({j,v}))}>
                          <Line type="monotone" dataKey="v" stroke={st.stroke} strokeWidth={2} dot={false} isAnimationActive={false}/>
                          <YAxis domain={["auto","auto"]} hide/>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 mt-5 pt-4 flex-wrap" style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
                    <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                      onClick={() => handleViewReport(a)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold min-w-[160px] justify-center"
                      style={{ background:"linear-gradient(135deg,#6366f1,#a855f7)", color:"white" }}>
                      {isLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin"/> Generating...</>
                        : <><ChevronRight className="w-4 h-4"/> View Full Report</>}
                    </motion.button>

                    <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                      onClick={() => handleResolve(a.id)}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium"
                      style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#6ee7b7" }}>
                      <CheckCircle className="w-4 h-4"/> Mark Resolved
                    </motion.button>

                    <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                      onClick={() => setSnoozeFor(a.id)}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium"
                      style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)" }}>
                      <BellOff className="w-4 h-4"/> Snooze
                    </motion.button>

                    <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                      onClick={() => { setAlerts(prev=>prev.filter(al=>al.id!==a.id)); showToast(`Alert for ${a.name} dismissed`); }}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm"
                      style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"rgba(239,68,68,0.7)" }}>
                      <X className="w-4 h-4"/>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {activeAlerts.length === 0 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              className="flex flex-col items-center justify-center py-20 text-center">
              <CheckCircle className="w-16 h-16 mb-4" style={{ color:"rgba(16,185,129,0.5)" }}/>
              <h3 className="text-white font-semibold text-lg mb-2" style={{ fontFamily:"'DM Sans',sans-serif" }}>All Clear!</h3>
              <p style={{ color:"rgba(255,255,255,0.4)" }}>No active alerts at this time.</p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}