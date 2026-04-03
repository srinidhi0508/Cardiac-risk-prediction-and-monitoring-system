"use client";

import { motion } from "framer-motion";
import { Shield, HeartPulse, Activity, FileText, Stethoscope, ArrowRight, Zap, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

const ECGBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="flex w-[200%] absolute top-1/2 -translate-y-1/2"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
    >
      {[0, 1].map((i) => (
        <svg key={i} viewBox="0 0 2000 200" className="w-1/2 h-40 opacity-20">
          <defs>
            <filter id={`glow${i}`}>
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <polyline
            fill="none" stroke="url(#ecgGrad)" strokeWidth="3"
            filter={`url(#glow${i})`} strokeLinecap="round" strokeLinejoin="round"
            points="0,100 150,100 200,100 230,95 250,100 270,30 290,170 310,100 450,100 500,95 520,100 540,30 560,170 580,100 720,100 770,95 790,100 810,30 830,170 850,100 990,100 1040,95 1060,100 1080,30 1100,170 1120,100 1260,100 1310,95 1330,100 1350,30 1370,170 1390,100 1530,100 1580,95 1600,100 1620,30 1640,170 1660,100 1800,100 1850,95 1870,100 1890,30 1910,170 1930,100 2000,100"
          />
          <defs>
            <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      ))}
    </motion.div>
  </div>
);

const features = [
  { icon: HeartPulse, title: "Live ECG Monitoring", desc: "Real-time waveform analysis with instant anomaly detection and alerts.", color: "from-pink-500 to-rose-500" },
  { icon: Activity, title: "AI Risk Prediction", desc: "ML-powered cardiovascular risk forecasting from ECG & PPG signals.", color: "from-violet-500 to-purple-500" },
  { icon: Stethoscope, title: "Clinical Decision Support", desc: "Smart diagnostic suggestions tailored to patient vitals and history.", color: "from-blue-500 to-cyan-500" },
  { icon: FileText, title: "PDF Health Reports", desc: "Generate and share comprehensive cardiac reports instantly.", color: "from-emerald-500 to-teal-500" },
];

const stats = [
  { value: "99.2%", label: "Prediction Accuracy" },
  { value: "< 2s", label: "Analysis Time" },
  { value: "10k+", label: "Patients Monitored" },
  { value: "HIPAA", label: "Compliant" },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden" style={{
      background: "linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 30%, #1a0a2e 60%, #0a1628 100%)"
    }}>
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />

      <ECGBackground />

      {/* NAVBAR */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", background: "rgba(10,10,26,0.6)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>PulseGuard</span>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/select-login")}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
          >
            Get Started →
          </motion.button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center pt-28 pb-20 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
            <Zap className="w-3 h-3" />
            AI-Powered Cardiac Intelligence
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="text-6xl md:text-7xl font-black text-white leading-tight max-w-4xl"
          style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" }}
        >
          Predict Heart Risk
          <br />
          <span style={{ background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Before It Happens
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg mt-6 max-w-xl leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Real-time ECG & PPG analysis, AI-driven cardiovascular risk prediction,
          and clinical-grade reports — for patients and doctors.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="flex gap-4 mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(99,102,241,0.6)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/select-login")}
            className="px-8 py-4 rounded-2xl text-white font-semibold flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", boxShadow: "0 0 20px rgba(99,102,241,0.35)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Start Monitoring <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-2xl font-semibold text-white"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: "'DM Sans', sans-serif" }}
          >
            View Demo
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
          className="flex gap-10 mt-16 flex-wrap justify-center"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 px-8 pb-28 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-3xl font-bold text-white mb-12"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Everything you need for cardiac care
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-6 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${f.color}`}>
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-8 pb-24 flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="w-full max-w-3xl p-12 rounded-3xl text-center"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))",
            border: "1px solid rgba(99,102,241,0.3)",
            backdropFilter: "blur(30px)",
          }}
        >
          <Lock className="w-10 h-10 mx-auto mb-4" style={{ color: "#a5b4fc" }} />
          <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Ready to get started?</h3>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>Join thousands of clinicians using PulseGuard for smarter cardiac care.</p>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(99,102,241,0.5)" }}
            onClick={() => router.push("/select-login")}
            className="px-8 py-4 rounded-2xl text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Choose Your Portal →
          </motion.button>
        </motion.div>
      </section>

      <footer className="relative z-10 text-center py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>
        © 2026 PulseGuard • Cardiac Monitoring Platform
      </footer>
    </main>
  );
}