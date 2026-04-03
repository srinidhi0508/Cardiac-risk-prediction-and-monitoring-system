"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HeartPulse, Activity, FileText, User, LogOut,
  TrendingUp, Bell, Download, Eye, Calendar, Loader2
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label:"Overview", icon:Activity,   href:"/patient-dashboard" },
  { label:"Vitals",   icon:HeartPulse, href:"/patient-dashboard/vitals" },
  { label:"Risk",     icon:TrendingUp, href:"/patient-dashboard/risk" },
  { label:"Reports",  icon:FileText,   href:"/patient-dashboard/reports" },
];

// ❌ removed static patient & vitals

type Report = {
  id:number; title:string; date:string; type:string;
  risk:string; pages:number; status:string; notes:string;
};

const reports: Report[] = [
  { id:1, title:"Monthly Cardiac Summary", date:"28 Mar 2026", type:"PPG Risk Report", risk:"Moderate", pages:5, status:"ready",
    notes:"Patient shows stable BPM patterns..." },
];

// 🔥 Sidebar
function Sidebar({ patientData }: any) {
  const router = useRouter(); const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-20 flex flex-col py-6 px-4"
      style={{ background:"rgba(255,255,255,0.03)", borderRight:"1px solid rgba(255,255,255,0.06)", backdropFilter:"blur(20px)" }}>

      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background:"linear-gradient(135deg,#6366f1,#a855f7)" }}>
          <HeartPulse className="w-4 h-4 text-white"/>
        </div>
        <span className="text-white font-bold">PulseGuard</span>
      </div>

      <div className="px-3 py-4 rounded-2xl mb-6"
        style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background:"linear-gradient(135deg,#6366f1,#a855f7)" }}>
            <User className="w-5 h-5 text-white"/>
          </div>
          <div>
            <div className="text-white text-sm font-semibold">
              {patientData?.name || "Loading..."}
            </div>
            <div className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>
              Age {patientData?.age || "--"} · O+
            </div>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
            <button key={item.label} onClick={() => router.push(item.href)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left"
              style={{
                background:active?"rgba(99,102,241,0.2)":"transparent",
                color:active?"#a5b4fc":"rgba(255,255,255,0.5)",
              }}>
              <item.icon className="w-4 h-4"/>{item.label}
            </button>
          );
        })}
      </nav>

      <button onClick={() => router.push("/")}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
        style={{ color:"rgba(255,255,255,0.35)" }}>
        <LogOut className="w-4 h-4"/> Sign Out
      </button>
    </aside>
  );
}

// 🔥 MAIN PAGE
export default function PatientReportsPage() {

  const [loading, setLoading] = useState<any>(null);
  const [patientData, setPatientData] = useState<any>(null);

  // 🔥 Fetch from FastAPI
  useEffect(() => {
    fetch("http://127.0.0.1:8000/patient/P001")
      .then(res => res.json())
      .then(data => setPatientData(data))
      .catch(err => console.error(err));
  }, []);

  // 🔥 Dynamic vitals for PDF
  const vitals = {
    bpm: patientData?.heart_rate || "--",
    spo2:98,
    systolic:120,
    diastolic:80,
    hrv:42,
    riskScore:
      patientData?.risk_level === "High" ? 70 :
      patientData?.risk_level === "Medium" ? 40 : 20,
    riskLabel: patientData?.risk_level || "Loading",
  };

  // 🔥 Dynamic patient for PDF
  const patient = {
    name: patientData?.name || "Loading",
    age: patientData?.age || "--",
    bloodGroup:"O+",
    condition:"Hypertension",
    doctor:"Dr. Ananya Rao",
    phone:"+91 9876543210",
    address:"Hyderabad, India",
  };

  // ⚡ PDF function (UNCHANGED except using dynamic data)
  async function generatePDF(report: Report, download: boolean) {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    doc.text(`Patient: ${patient.name}`, 10, 10);
    doc.text(`Age: ${patient.age}`, 10, 20);
    doc.text(`Heart Rate: ${vitals.bpm}`, 10, 30);
    doc.text(`Risk: ${vitals.riskLabel}`, 10, 40);

    if (download) doc.save("report.pdf");
    else window.open(doc.output("bloburl"));
  }

  const handlePDF = async (report: Report, action: "download"|"view") => {
    setLoading({ id:report.id, action });
    try { await generatePDF(report, action==="download"); }
    finally { setLoading(null); }
  };

  return (
    <main className="min-h-screen" style={{ background:"linear-gradient(135deg,#0a0a1a 0%,#0d0d2b 40%,#1a0a2e 100%)" }}>
      <Sidebar patientData={patientData}/>
      <div className="ml-64 p-8">

        <h1 className="text-2xl font-bold text-white mb-6">My Reports</h1>

        <div className="flex flex-col gap-4">
          {reports.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl flex justify-between items-center"
              style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>

              <div className="text-white">{r.title}</div>

              <div className="flex gap-2">
                <button onClick={() => handlePDF(r,"download")}
                  className="px-3 py-2 bg-purple-500 text-white rounded">
                  Download
                </button>

                <button onClick={() => handlePDF(r,"view")}
                  className="px-3 py-2 bg-gray-600 text-white rounded">
                  View
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}