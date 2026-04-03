"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, AlertTriangle, Activity, FileText, LogOut, Stethoscope,
  Bell, Download, Eye, Plus, Calendar, User, Loader2
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label:"Overview", icon:Activity,      href:"/doctor-dashboard" },
  { label:"Patients", icon:Users,         href:"/doctor-dashboard/patients" },
  { label:"Alerts",   icon:AlertTriangle, href:"/doctor-dashboard/alerts" },
  { label:"Reports",  icon:FileText,      href:"/doctor-dashboard/reports" },
];

type Report = {
  id:number; patient:string; age:number; condition:string;
  type:string; date:string; risk:string; pages:number; status:string;
  bpm:number; spo2:number; systolic:number; diastolic:number; hrv:number; riskScore:number;
  notes:string;
};

const reports: Report[] = [
  { id:1, patient:"Rahul Verma",  age:45, condition:"Hypertension",   type:"Monthly Cardiac Review",    date:"28 Mar 2026", risk:"Moderate", pages:6,  status:"ready",
    bpm:74, spo2:98, systolic:120, diastolic:80,  hrv:42, riskScore:22,
    notes:"Patient shows stable BPM patterns. HRV within acceptable range. Blood pressure borderline. Regular monitoring advised." },
  { id:2, patient:"Arjun Mehta",  age:61, condition:"Post-MI",        type:"Post-Incident Risk Report", date:"27 Mar 2026", risk:"High",     pages:10, status:"ready",
    bpm:95, spo2:95, systolic:148, diastolic:92,  hrv:28, riskScore:67,
    notes:"Elevated BPM and irregular rhythm detected post-MI. Immediate cardiology review recommended. Patient on beta-blockers." },
  { id:3, patient:"Sunita Patel", age:38, condition:"Hyperlipidemia", type:"Routine Checkup Summary",   date:"25 Mar 2026", risk:"Low",      pages:4,  status:"ready",
    bpm:68, spo2:99, systolic:112, diastolic:74,  hrv:55, riskScore:14,
    notes:"All PPG vitals within normal range. Lipid management is effective. Continue current medication and lifestyle." },
  { id:4, patient:"Dev Krishnan", age:57, condition:"Arrhythmia",     type:"PPG Arrhythmia Analysis",   date:"24 Mar 2026", risk:"High",     pages:8,  status:"ready",
    bpm:102, spo2:94, systolic:138, diastolic:88, hrv:22, riskScore:55,
    notes:"BPM exceeding safe threshold. PPG signal shows irregular peaks consistent with arrhythmia. Electrophysiology consult needed." },
  { id:5, patient:"Priya Sharma", age:52, condition:"Type 2 Diabetes",type:"Quarterly Risk Assessment", date:"20 Mar 2026", risk:"Moderate", pages:7,  status:"draft",
    bpm:88, spo2:97, systolic:128, diastolic:84,  hrv:35, riskScore:48,
    notes:"Moderate cardiovascular risk. Glycemic control impacting HRV. Lifestyle modifications and quarterly monitoring advised." },
  { id:6, patient:"Meena Iyer",   age:49, condition:"Hypertension",   type:"Blood Pressure Trend",      date:"18 Mar 2026", risk:"Moderate", pages:5,  status:"ready",
    bpm:79, spo2:98, systolic:132, diastolic:86,  hrv:38, riskScore:31,
    notes:"Systolic BP consistently elevated. PPG-derived HRV shows moderate stress markers. Anti-hypertensive adjustment considered." },
];

const riskStyle = (r:string) => ({
  High:     { color:"#ef4444", bg:"rgba(239,68,68,0.12)",  border:"rgba(239,68,68,0.3)" },
  Moderate: { color:"#f59e0b", bg:"rgba(245,158,11,0.12)", border:"rgba(245,158,11,0.3)" },
  Low:      { color:"#10b981", bg:"rgba(16,185,129,0.12)", border:"rgba(16,185,129,0.3)" },
}[r] ?? { color:"#6366f1", bg:"rgba(99,102,241,0.12)", border:"rgba(99,102,241,0.3)" });

// ─── PDF Generator ─────────────────────────────────────────────────────────────
async function generateDoctorPDF(report: Report, download: boolean) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W = 210; const m = 18;

  // Header
  doc.setFillColor(18, 14, 45);
  doc.rect(0, 0, W, 36, "F");
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 36, W, 1.5, "F");
  doc.setTextColor(255,255,255);
  doc.setFont("helvetica","bold"); doc.setFontSize(18);
  doc.text("PulseGuard", m, 16);
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(170,168,220);
  doc.text("Cardiac Monitoring & PPG Risk Prediction  |  Clinical Report", m, 23);
  doc.text("AIIMS Hyderabad  |  support@pulseguard.health", m, 29);
  doc.setTextColor(200,200,255); doc.setFontSize(7);
  doc.text("CLINICAL REPORT", W-m, 13, { align:"right" });
  doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(255,255,255);
  doc.text(report.type, W-m, 20, { align:"right" });
  doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(170,168,220);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}`, W-m, 27, { align:"right" });
  doc.text(`Report Date: ${report.date}`, W-m, 33, { align:"right" });

  let y = 46;

  // Doctor + Patient Info
  doc.setFillColor(242,241,255);
  doc.roundedRect(m, y, W-m*2, 38, 3, 3, "F");
  doc.setDrawColor(200,196,255); doc.setLineWidth(0.4);
  doc.roundedRect(m, y, W-m*2, 38, 3, 3, "S");
  doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(70,60,140);
  doc.text("PATIENT & CLINICAL INFORMATION", m+4, y+7);

  const rows = [
    ["Patient:",   report.patient,    "Age:",       `${report.age} years`,  "Condition:",  report.condition],
    ["Doctor:",    "Dr. Ananya Rao",  "Specialty:", "Cardiology",           "Hospital:",   "AIIMS Hyderabad"],
    ["Report ID:", `PG-DOC-${report.id}-2026`, "Date:", report.date,        "Pages:",      `${report.pages}`],
    ["Status:",    report.status==="ready"?"Finalised":"Draft", "Risk Level:", report.risk+" Risk", "Type:", report.type],
  ];
  const cx = [m+4, m+24, m+88, m+108, m+152, m+172];
  rows.forEach((row, ri) => {
    const ry = y + 14 + ri*6;
    for (let ci=0; ci<6; ci+=2) {
      doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(100,90,160);
      doc.text(row[ci], cx[ci], ry);
      doc.setFont("helvetica","normal"); doc.setTextColor(30,20,70);
      doc.text(row[ci+1], cx[ci+1], ry);
    }
  });
  y += 46;

  // Vitals
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(30,20,80);
  doc.text("PPG Vitals at Time of Report", m, y);
  doc.setDrawColor(99,102,241); doc.setLineWidth(0.6);
  doc.line(m, y+2, m+72, y+2); y += 9;

  const vItems = [
    { label:"Heart Rate",   value:`${report.bpm} bpm`,        ok: report.bpm<100,    status: report.bpm<100?"Normal":"High" },
    { label:"SpO2",         value:`${report.spo2}%`,           ok: report.spo2>=95,   status: report.spo2>=95?"Normal":"Low" },
    { label:"Systolic BP",  value:`${report.systolic} mmHg`,  ok: report.systolic<130,status: report.systolic<130?"Normal":"Elevated" },
    { label:"Diastolic BP", value:`${report.diastolic} mmHg`, ok: report.diastolic<85,status: report.diastolic<85?"Normal":"Elevated" },
    { label:"HRV",          value:`${report.hrv} ms`,          ok: report.hrv>30,     status: report.hrv>30?"Normal":"Low" },
    { label:"CVD Risk",     value:`${report.riskScore}%`,      ok: report.riskScore<20,status: report.risk+" Risk" },
  ];

  const bw = (W - m*2 - 10) / 3;
  let bx = m; let by = y;
  vItems.forEach((v,i) => {
    if (i>0 && i%3===0) { bx=m; by+=24; }
    doc.setFillColor(247,246,255);
    doc.roundedRect(bx, by, bw, 20, 2, 2, "F");
    doc.setDrawColor(210,206,255); doc.roundedRect(bx, by, bw, 20, 2, 2, "S");
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(100,90,160);
    doc.text(v.label, bx+4, by+7);
    doc.setFont("helvetica","bold"); doc.setFontSize(12); doc.setTextColor(20,10,60);
    doc.text(v.value, bx+4, by+15);
    const sc = v.ok ? [16,185,129] : [239,68,68];
    doc.setFillColor(sc[0],sc[1],sc[2]);
    doc.roundedRect(bx+bw-28, by+13, 24, 5, 1.5, 1.5, "F");
    doc.setFont("helvetica","bold"); doc.setFontSize(6); doc.setTextColor(255,255,255);
    doc.text(v.status, bx+bw-16, by+16.2, { align:"center" });
    bx += bw+5;
  });
  y = by+30;

  // Risk bar
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(30,20,80);
  doc.text("Cardiovascular Risk Score", m, y);
  doc.setDrawColor(99,102,241); doc.line(m, y+2, m+72, y+2); y+=9;
  const bLen = W - m*2;
  doc.setFillColor(215,213,245); doc.roundedRect(m, y, bLen, 8, 2, 2, "F");
  const filled = (report.riskScore/100)*bLen;
  const rc = report.riskScore<20?[16,185,129]:report.riskScore<50?[245,158,11]:[239,68,68];
  doc.setFillColor(rc[0],rc[1],rc[2]); doc.roundedRect(m, y, filled, 8, 2, 2, "F");
  doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(30,20,80);
  doc.text(`${report.riskScore}% — ${report.risk} Risk`, m, y+16);
  doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(100,90,150);
  doc.text("Derived from PPG signals: BPM, SpO2, HRV, blood pressure", m, y+22);
  y += 30;

  // Clinical notes
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(30,20,80);
  doc.text("Clinical Notes", m, y);
  doc.setDrawColor(99,102,241); doc.line(m, y+2, m+46, y+2); y+=9;
  doc.setFillColor(247,246,255);
  doc.roundedRect(m, y, W-m*2, 24, 3, 3, "F");
  doc.setDrawColor(210,206,255); doc.roundedRect(m, y, W-m*2, 24, 3, 3, "S");
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(40,30,80);
  doc.text(doc.splitTextToSize(report.notes, W-m*2-10), m+5, y+8);
  y += 32;

  // Recommendations
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(30,20,80);
  doc.text("Clinical Recommendations", m, y);
  doc.setDrawColor(99,102,241); doc.line(m, y+2, m+75, y+2); y+=9;
  const recs = report.riskScore<20
    ? ["Continue routine PPG monitoring. No immediate intervention required.","Schedule next review in 6 months.","Maintain current medication and lifestyle regimen."]
    : report.riskScore<50
    ? ["Schedule follow-up within 30 days.","Adjust medications if BP remains elevated.","Recommend daily PPG home monitoring.","Counsel patient on diet and exercise."]
    : ["Urgent cardiology review required.","Consider hospital admission for observation.","Daily vital signs monitoring mandatory.","Review and optimise all current medications immediately."];
  recs.forEach(r2 => {
    doc.setFillColor(99,102,241); doc.circle(m+2.5, y-0.8, 1.2, "F");
    doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(30,20,70);
    doc.text(r2, m+7, y); y+=7;
  });

  // Footer
  const pH = 297;
  doc.setFillColor(18,14,45); doc.rect(0, pH-16, W, 16, "F");
  doc.setTextColor(160,158,210); doc.setFont("helvetica","normal"); doc.setFontSize(6.5);
  doc.text("Confidential Clinical Document — PulseGuard AI · For authorised healthcare professionals only.", m, pH-9);
  doc.text(`Report ID: PG-DOC-${report.id}-2026  |  Page 1 of ${report.pages}`, W-m, pH-9, { align:"right" });
  doc.setTextColor(99,102,241);
  doc.text("PulseGuard — Cardiac Intelligence", m, pH-4);

  const fname = `PulseGuard_Clinical_${report.patient.replace(" ","_")}_${report.type.replace(/\s+/g,"_")}.pdf`;
  if (download) { doc.save(fname); }
  else { window.open(URL.createObjectURL(doc.output("blob")), "_blank"); }
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar() {
  const router = useRouter(); const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-20 flex flex-col py-6 px-4"
      style={{ background:"rgba(255,255,255,0.03)", borderRight:"1px solid rgba(255,255,255,0.06)", backdropFilter:"blur(20px)" }}>
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:"linear-gradient(135deg,#6366f1,#a855f7)" }}>
          <Stethoscope className="w-4 h-4 text-white"/>
        </div>
        <span className="text-white font-bold" style={{ fontFamily:"'DM Sans',sans-serif" }}>PulseGuard</span>
      </div>
      <div className="px-3 py-4 rounded-2xl mb-6" style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background:"linear-gradient(135deg,#a855f7,#6366f1)" }}>
            <Stethoscope className="w-5 h-5 text-white"/>
          </div>
          <div>
            <div className="text-white text-sm font-semibold" style={{ fontFamily:"'DM Sans',sans-serif" }}>Dr. Ananya Rao</div>
            <div className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>Cardiologist</div>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
            <button key={item.label} onClick={() => router.push(item.href)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left"
              style={{ background:active?"rgba(99,102,241,0.2)":"transparent", color:active?"#a5b4fc":"rgba(255,255,255,0.5)", border:active?"1px solid rgba(99,102,241,0.3)":"1px solid transparent" }}>
              <item.icon className="w-4 h-4"/>{item.label}
            </button>
          );
        })}
      </nav>
      <button onClick={() => router.push("/")} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm" style={{ color:"rgba(255,255,255,0.35)" }}>
        <LogOut className="w-4 h-4"/> Sign Out
      </button>
    </aside>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function DoctorReportsPage() {
  const [loading, setLoading] = useState<{id:number;action:"download"|"view"}|null>(null);

  const handlePDF = async (report: Report, action:"download"|"view") => {
    setLoading({ id:report.id, action });
    try { await generateDoctorPDF(report, action==="download"); }
    finally { setLoading(null); }
  };

  return (
    <main className="min-h-screen" style={{ background:"linear-gradient(135deg,#0a0a1a 0%,#0d0d2b 40%,#1a0a2e 100%)" }}>
      <Sidebar/>
      <div className="ml-64 p-8">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily:"'DM Sans',sans-serif" }}>Reports</h1>
            <p className="text-sm mt-1" style={{ color:"rgba(255,255,255,0.4)" }}>{reports.length} clinical reports generated</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ background:"linear-gradient(135deg,#6366f1,#a855f7)", color:"white" }}>
              <Plus className="w-4 h-4"/> Generate Report
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center relative"
              style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
              <Bell className="w-4 h-4 text-white"/>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"/>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label:"Reports This Month", value:"8",  icon:FileText, color:"from-violet-500 to-indigo-500" },
            { label:"Pending Review",     value:"2",  icon:Eye,      color:"from-amber-500 to-orange-500" },
            { label:"Downloaded",         value:"14", icon:Download, color:"from-emerald-500 to-teal-500" },
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

        {/* Report cards 2-col grid */}
        <div className="grid grid-cols-2 gap-5">
          {reports.map((r,i) => {
            const rs = riskStyle(r.risk);
            const isDl  = loading?.id===r.id && loading.action==="download";
            const isVw  = loading?.id===r.id && loading.action==="view";
            return (
              <motion.div key={r.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                className="p-5 rounded-2xl flex flex-col gap-4"
                style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(20px)" }}>

                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background:"rgba(99,102,241,0.2)" }}>
                      <User className="w-4 h-4" style={{ color:"#a5b4fc" }}/>
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold" style={{ fontFamily:"'DM Sans',sans-serif" }}>{r.patient}</div>
                      <div className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>{r.type}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ background:r.status==="ready"?"rgba(16,185,129,0.15)":"rgba(245,158,11,0.15)", border:r.status==="ready"?"1px solid rgba(16,185,129,0.3)":"1px solid rgba(245,158,11,0.3)", color:r.status==="ready"?"#6ee7b7":"#fde047" }}>
                    {r.status==="ready"?"Ready":"Draft"}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color:"rgba(255,255,255,0.4)" }}>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{r.date}</span>
                  <span>·</span><span>{r.pages} pages</span>
                  <span>·</span>
                  <span className="px-2 py-0.5 rounded-full"
                    style={{ background:rs.bg, border:`1px solid ${rs.border}`, color:rs.color }}>
                    {r.risk} Risk
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-1" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                    onClick={() => handlePDF(r,"download")} disabled={!!loading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold"
                    style={{ background:"linear-gradient(135deg,#6366f1,#a855f7)", color:"white", opacity:loading&&!isDl?0.55:1 }}>
                    {isDl ? <><Loader2 className="w-3.5 h-3.5 animate-spin"/> Saving...</>
                          : <><Download className="w-3.5 h-3.5"/> Download PDF</>}
                  </motion.button>
                  <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                    onClick={() => handlePDF(r,"view")} disabled={!!loading}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium"
                    style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.7)", opacity:loading&&!isVw?0.55:1 }}>
                    {isVw ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <><Eye className="w-3.5 h-3.5"/> Preview</>}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="text-center text-xs mt-8" style={{ color:"rgba(255,255,255,0.15)" }}>
          Clinical PDFs generated client-side · Confidential — authorised personnel only
        </p>
      </div>
    </main>
  );
}