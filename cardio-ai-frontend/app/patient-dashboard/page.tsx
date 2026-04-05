"use client";

import { motion } from "framer-motion";
import { HeartPulse, Activity, TrendingUp, Zap, Bell } from "lucide-react";
import { usePatient } from "./PatientContext";

export default function PatientDashboard() {
  const { patient } = usePatient();

  const avgBpm = patient?.analysis?.avg_bpm;
  const risk = patient?.analysis?.risk_level;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good morning, {patient?.name?.split(" ")[0] || "User"} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Here&apos;s your cardiac overview for today
          </p>
        </div>

        <button
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Bell className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Heart Rate",
            value: avgBpm ?? "--",
            unit: "bpm",
            icon: HeartPulse,
            color: "from-rose-500 to-pink-500",
          },
          {
            label: "SpO₂",
            value: "98",
            unit: "%",
            icon: Activity,
            color: "from-emerald-500 to-teal-500",
          },
          {
            label: "Risk",
            value: risk ?? "--",
            unit: "",
            icon: TrendingUp,
            color: "from-violet-500 to-purple-500",
          },
          {
            label: "HRV",
            value: patient?.analysis?.variability ?? "--",
            unit: "ms",
            icon: Zap,
            color: "from-amber-500 to-orange-500",
          },
        ].map((v, i) => (
          <motion.div
            key={v.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${v.color}`}
            >
              <v.icon className="w-4 h-4 text-white" />
            </div>

            <div className="text-2xl font-black text-white">
              {v.value}
              {v.unit && <span className="text-sm ml-1">{v.unit}</span>}
            </div>

            <div
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {v.label}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}