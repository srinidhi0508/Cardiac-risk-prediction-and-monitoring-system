"use client";

import { motion } from "framer-motion";
import {
  HeartPulse, Activity, FileText, User,
  LogOut, TrendingUp, Zap
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from "recharts";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label:"Overview", icon:Activity,   href:"/patient-dashboard" },
  { label:"Vitals",   icon:HeartPulse, href:"/patient-dashboard/vitals" },
  { label:"Risk",     icon:TrendingUp, href:"/patient-dashboard/risk" },
  { label:"Reports",  icon:FileText,   href:"/patient-dashboard/reports" },
];

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
                color:active?"#a5b4fc":"rgba(255,255,255,0.5)"
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

function VitalCard({ label, value, unit, sub, icon: Icon, color, glow }: any) {
  return (
    <div className="p-5 rounded-2xl flex items-center gap-4"
      style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color}`}
        style={{ boxShadow:`0 4px 16px ${glow}` }}>
        <Icon className="w-6 h-6 text-white"/>
      </div>
      <div>
        <div className="text-2xl font-black text-white">
          {value}<span className="text-sm ml-1">{unit}</span>
        </div>
        <div className="text-xs text-white">{label}</div>
        <div className="text-xs text-gray-400">{sub}</div>
      </div>
    </div>
  );
}

export default function VitalsPage() {

  const [patientData, setPatientData] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/patient/P001")
      .then(res => res.json())
      .then(data => setPatientData(data))
      .catch(err => console.error(err));
  }, []);

  // ✅ Extract analysis
  const analysis = patientData?.analysis;

  // ✅ Convert heart_data → graph format
  const chartData =
    patientData?.heart_data?.map((d: any, i: number) => ({
      time: i,
      bpm: d.value
    })) || [];

  return (
    <main className="min-h-screen"
      style={{ background:"linear-gradient(135deg,#0a0a1a 0%,#0d0d2b 40%,#1a0a2e 100%)" }}>

      <Sidebar patientData={patientData}/>

      <div className="ml-64 p-8">

        <h1 className="text-2xl font-bold text-white mb-6">
          My Vitals
        </h1>

        {/* ✅ CARDS */}
        <div className="grid grid-cols-4 gap-4 mb-8">

          <VitalCard
            label="Heart Rate"
            value={patientData?.analysis?.avg_bpm || "--"}
            unit="bpm"
            sub="Live average"
            icon={HeartPulse}
            color="from-rose-500 to-pink-500"
            glow="rgba(244,63,94,0.3)"
          />

          <VitalCard
            label="SpO₂"
            value="98"
            unit="%"
            sub="Normal"
            icon={Activity}
            color="from-emerald-500 to-teal-500"
            glow="rgba(16,185,129,0.3)"
          />

          <VitalCard
            label="Systolic BP"
            value="120"
            unit="mmHg"
            sub="Normal"
            icon={TrendingUp}
            color="from-violet-500 to-purple-500"
            glow="rgba(139,92,246,0.3)"
          />

          <VitalCard
            label="HRV"
            value={patientData?.analysis?.variability?.toFixed(2) || "--"}
            unit="ms"
            sub="Derived"
            icon={Zap}
            color="from-amber-500 to-orange-500"
            glow="rgba(245,158,11,0.3)"
          />
        </div>

        {/* ✅ HEART RATE GRAPH */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          className="p-6 rounded-2xl"
          style={{
            background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.08)"
          }}
        >
          <h3 className="text-white font-semibold mb-4">
            Heart Rate Trend
          </h3>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" />
              <YAxis stroke="rgba(255,255,255,0.3)" />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="bpm"
                stroke="#6366f1"
                fill="url(#colorHR)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>

        </motion.div>

      </div>
    </main>
  );
}