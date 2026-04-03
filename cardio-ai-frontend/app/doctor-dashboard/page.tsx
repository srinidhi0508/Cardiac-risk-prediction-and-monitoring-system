"use client";

import { motion } from "framer-motion";
import { Stethoscope, Users, AlertTriangle, Activity, FileText, Bell, LogOut, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useRouter, usePathname } from "next/navigation";

const admissionData = [
  { day: "Mon", count: 4 }, { day: "Tue", count: 7 }, { day: "Wed", count: 5 },
  { day: "Thu", count: 9 }, { day: "Fri", count: 6 }, { day: "Sat", count: 3 }, { day: "Sun", count: 2 },
];
const riskDist = [
  { range: "Low", count: 12 }, { range: "Moderate", count: 8 }, { range: "High", count: 5 },
];

export const navItems = [
  { label: "Overview",  icon: Activity,      href: "/doctor-dashboard" },
  { label: "Patients",  icon: Users,         href: "/doctor-dashboard/patients" },
  { label: "Alerts",    icon: AlertTriangle, href: "/doctor-dashboard/alerts" },
  { label: "Reports",   icon: FileText,      href: "/doctor-dashboard/reports" },
];

export function DoctorSidebar() {
  const router   = useRouter();
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-20 flex flex-col py-6 px-4"
      style={{ background:"rgba(255,255,255,0.03)", borderRight:"1px solid rgba(255,255,255,0.06)", backdropFilter:"blur(20px)" }}>

      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background:"linear-gradient(135deg,#6366f1,#a855f7)" }}>
          <Stethoscope className="w-4 h-4 text-white"/>
        </div>
        <span className="text-white font-bold" style={{ fontFamily:"'DM Sans',sans-serif" }}>PulseGuard</span>
      </div>

      <div className="px-3 py-4 rounded-2xl mb-6"
        style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background:"linear-gradient(135deg,#a855f7,#6366f1)" }}>
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all"
              style={{
                background: active ? "rgba(99,102,241,0.2)" : "transparent",
                color:      active ? "#a5b4fc" : "rgba(255,255,255,0.5)",
                border:     active ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
              }}>
              <item.icon className="w-4 h-4"/>{item.label}
            </button>
          );
        })}
      </nav>

      <button onClick={() => router.push("/")} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
        style={{ color:"rgba(255,255,255,0.35)" }}>
        <LogOut className="w-4 h-4"/> Sign Out
      </button>
    </aside>
  );
}

export default function DoctorOverview() {
  const router = useRouter();
  return (
    <main className="min-h-screen" style={{ background:"linear-gradient(135deg,#0a0a1a 0%,#0d0d2b 40%,#1a0a2e 100%)" }}>
      <DoctorSidebar/>
      <div className="ml-64 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily:"'DM Sans',sans-serif" }}>Clinical Dashboard</h1>
            <p className="text-sm mt-1" style={{ color:"rgba(255,255,255,0.4)" }}>Dr. Ananya Rao · Cardiology · AIIMS Hyderabad</p>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center relative"
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
            <Bell className="w-4 h-4 text-white"/>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"/>
          </button>
        </div>

        {/* Stat cards — clickable */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label:"Total Patients",  value:"25", icon:Users,         color:"from-violet-500 to-indigo-500", href:"/doctor-dashboard/patients" },
            { label:"High Risk",       value:"2",  icon:AlertTriangle, color:"from-rose-500 to-red-600",     href:"/doctor-dashboard/alerts" },
            { label:"Analyzed Today",  value:"11", icon:Activity,      color:"from-emerald-500 to-teal-500", href:"/doctor-dashboard/patients" },
            { label:"Reports Issued",  value:"8",  icon:FileText,      color:"from-amber-500 to-orange-500", href:"/doctor-dashboard/reports" },
          ].map((s,i) => (
            <motion.div key={s.label}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
              whileHover={{ scale:1.03, y:-2 }} whileTap={{ scale:0.98 }}
              onClick={() => router.push(s.href)}
              className="p-5 rounded-2xl cursor-pointer"
              style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(20px)" }}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${s.color}`}>
                <s.icon className="w-4 h-4 text-white"/>
              </div>
              <div className="text-2xl font-black text-white" style={{ fontFamily:"'DM Sans',sans-serif" }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color:"rgba(255,255,255,0.4)" }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            className="p-6 rounded-2xl"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(20px)" }}>
            <h3 className="text-white font-semibold mb-1" style={{ fontFamily:"'DM Sans',sans-serif" }}>Weekly Admissions</h3>
            <p className="text-xs mb-4" style={{ color:"rgba(255,255,255,0.4)" }}>New patient intakes this week</p>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={admissionData}>
                <defs>
                  <linearGradient id="aFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35}/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#aFill)" dot={false}/>
                <XAxis dataKey="day" tick={{ fill:"rgba(255,255,255,0.3)", fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis hide/>
                <Tooltip contentStyle={{ background:"rgba(15,15,40,0.9)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:8, color:"white" }}/>
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
            className="p-6 rounded-2xl"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(20px)" }}>
            <h3 className="text-white font-semibold mb-1" style={{ fontFamily:"'DM Sans',sans-serif" }}>Risk Distribution</h3>
            <p className="text-xs mb-4" style={{ color:"rgba(255,255,255,0.4)" }}>Patient risk level breakdown</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={riskDist} barSize={40}>
                <defs>
                  <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7"/>
                    <stop offset="100%" stopColor="#6366f1"/>
                  </linearGradient>
                </defs>
                <Bar dataKey="count" radius={[6,6,0,0]} fill="url(#bGrad)"/>
                <XAxis dataKey="range" tick={{ fill:"rgba(255,255,255,0.4)", fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis hide/>
                <Tooltip contentStyle={{ background:"rgba(15,15,40,0.9)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:8, color:"white" }}/>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Quick nav cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"View All Patients", desc:"Monitor & search patient list",  icon:Users,         href:"/doctor-dashboard/patients", color:"from-violet-500 to-indigo-500" },
            { label:"Active Alerts",     desc:"2 patients need attention",       icon:AlertTriangle, href:"/doctor-dashboard/alerts",   color:"from-rose-500 to-red-600" },
            { label:"Reports",           desc:"Generate & download PDFs",        icon:TrendingUp,    href:"/doctor-dashboard/reports",  color:"from-emerald-500 to-teal-500" },
          ].map((q,i) => (
            <motion.div key={q.label}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5+i*0.08 }}
              whileHover={{ scale:1.02, x:4 }}
              onClick={() => router.push(q.href)}
              className="p-5 rounded-2xl cursor-pointer flex items-center gap-4"
              style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(20px)" }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${q.color}`}>
                <q.icon className="w-5 h-5 text-white"/>
              </div>
              <div>
                <div className="text-white text-sm font-semibold" style={{ fontFamily:"'DM Sans',sans-serif" }}>{q.label}</div>
                <div className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.4)" }}>{q.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}