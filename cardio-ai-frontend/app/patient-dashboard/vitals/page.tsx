"use client";

import { motion } from "framer-motion";
import { HeartPulse, Activity, TrendingUp, Zap } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { usePatient } from "../PatientContext";
import { useEffect } from "react";

function VitalCard({ label, value, unit, sub, icon: Icon, color, glow }: any) {
  return (
    <div
      className="p-5 rounded-2xl flex items-center gap-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color}`}
        style={{ boxShadow: `0 4px 16px ${glow}` }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="text-2xl font-black text-white">
          {value}
          <span className="text-sm ml-1">{unit}</span>
        </div>
        <div className="text-xs text-white">{label}</div>
        <div className="text-xs text-gray-400">{sub}</div>
      </div>
    </div>
  );
}

export default function VitalsPage() {
  const { patient, setPatient } = usePatient();

  // ✅ REAL-TIME FETCH
  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:8000/patient/P001")
        .then((res) => res.json())
        .then((data) => setPatient(data))
        .catch((err) => console.error(err));
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [setPatient]);

  const analysis = patient?.analysis;

  // ✅ GRAPH DATA (LIVE)
  const chartData =
    patient?.heart_data?.map((d: any, i: number) => ({
      time: i,
      bpm: d.value,
    })) || [];

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-6">My Vitals</h1>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-8">

        <VitalCard
          label="Heart Rate"
          value={analysis?.avg_bpm ?? "--"}
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
          value={analysis?.variability ? analysis.variability.toFixed(2) : "--"}
          unit="ms"
          sub="Derived"
          icon={Zap}
          color="from-amber-500 to-orange-500"
          glow="rgba(245,158,11,0.3)"
        />

      </div>

      {/* HEART RATE GRAPH */}
      <motion.div
        key={chartData.length} // 🔥 forces smooth re-render
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h3 className="text-white font-semibold mb-4">
          Heart Rate Trend (Live)
        </h3>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.3)"
            />

            <YAxis
              stroke="rgba(255,255,255,0.3)"
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="bpm"
              stroke="#6366f1"
              fill="url(#colorHR)"
              strokeWidth={2}
              isAnimationActive={true} // 🔥 smooth updates
            />
          </AreaChart>
        </ResponsiveContainer>

      </motion.div>
    </>
  );
}