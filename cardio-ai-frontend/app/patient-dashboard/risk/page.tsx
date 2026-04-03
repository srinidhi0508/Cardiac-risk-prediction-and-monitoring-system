"use client";

import { motion } from "framer-motion";
import {
  HeartPulse, Activity, FileText, User, LogOut,
  TrendingUp
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer, Tooltip
} from "recharts";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label:"Overview", icon:Activity,   href:"/patient-dashboard" },
  { label:"Vitals",   icon:HeartPulse, href:"/patient-dashboard/vitals" },
  { label:"Risk",     icon:TrendingUp, href:"/patient-dashboard/risk" },
  { label:"Reports",  icon:FileText,   href:"/patient-dashboard/reports" },
];

// ✅ Sidebar (unchanged UI)
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

export default function RiskPage() {

  const [patientData, setPatientData] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/patient/P001")
      .then(res => res.json())
      .then(data => setPatientData(data))
      .catch(err => console.error(err));
  }, []);

  // ✅ USE ANALYSIS (IMPORTANT FIX)
  const analysis = patientData?.analysis;

  const riskScore =
    analysis?.risk_level === "High" ? 70 :
    analysis?.risk_level === "Medium" ? 40 : 20;

  // ✅ Build radar dynamically
  const radarData = [
    { factor:"BPM", value: analysis?.avg_bpm || 0, fullMark:120 },
    { factor:"HRV", value: analysis?.variability || 0, fullMark:50 },
    { factor:"Min BPM", value: analysis?.min_bpm || 0, fullMark:120 },
    { factor:"Max BPM", value: analysis?.max_bpm || 0, fullMark:120 },
    { factor:"SpO₂", value: 98, fullMark:100 },
  ];

  // ✅ Dynamic factors panel
  const factors = [
    {
      label:"Average Heart Rate",
      value:`${analysis?.avg_bpm || "--"} bpm`,
    },
    {
      label:"Min Heart Rate",
      value:`${analysis?.min_bpm || "--"} bpm`,
    },
    {
      label:"Max Heart Rate",
      value:`${analysis?.max_bpm || "--"} bpm`,
    },
    {
      label:"HRV (Variability)",
      value:`${analysis?.variability || "--"}`,
    },
    {
      label:"Risk Level",
      value:analysis?.risk_level || "Loading",
    },
  ];

  return (
    <main className="min-h-screen"
      style={{ background:"linear-gradient(135deg,#0a0a1a 0%,#0d0d2b 40%,#1a0a2e 100%)" }}>

      <Sidebar patientData={patientData}/>

      <div className="ml-64 p-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Risk Analysis</h1>
          <p className="text-sm mt-1" style={{ color:"rgba(255,255,255,0.4)" }}>
            AI-powered cardiovascular risk · Based on heart data
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">

          {/* Risk Box */}
          <div className="p-8 rounded-2xl flex flex-col items-center text-center"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>

            <h3 className="text-white font-semibold mb-4">
              10-Year CVD Risk
            </h3>

            <div className="text-4xl text-white font-black mb-2">
              {riskScore}%
            </div>

            <div className="text-sm text-yellow-400">
              {analysis?.risk_level || "Loading"}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="p-6 rounded-2xl"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>

            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)"/>
                <PolarAngleAxis dataKey="factor"
                  tick={{ fill:"white", fontSize:11 }}/>
                <Radar dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.25}/>
                <Tooltip/>
              </RadarChart>
            </ResponsiveContainer>

          </div>

          {/* Factors */}
          <div className="p-6 rounded-2xl"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>

            {factors.map(f => (
              <div key={f.label} className="mb-3 text-white">
                {f.label} — {f.value}
              </div>
            ))}

          </div>

        </div>

      </div>
    </main>
  );
}