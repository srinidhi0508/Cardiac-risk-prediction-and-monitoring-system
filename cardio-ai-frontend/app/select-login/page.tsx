"use client";

import { motion } from "framer-motion";
import { User, Stethoscope, ArrowLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const portals = [
  {
    key: "patient",
    icon: User,
    title: "Patient Portal",
    desc: "Monitor your heart activity, view AI risk reports, and connect with your doctor.",
    href: "/patient-login",
    gradient: "from-rose-500 to-pink-600",
    glow: "rgba(244,63,94,0.3)",
    features: ["Real-time ECG monitoring", "Risk prediction results", "PDF health reports"],
  },
  {
    key: "doctor",
    icon: Stethoscope,
    title: "Doctor Portal",
    desc: "Access patient dashboards, review alerts, and manage your clinical workflow.",
    href: "/doctor-login",
    gradient: "from-violet-500 to-indigo-600",
    glow: "rgba(99,102,241,0.3)",
    features: ["Patient overview & alerts", "Clinical decision support", "Appointment management"],
  },
];

export default function SelectLogin() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 40%, #1a0a2e 100%)" }}>

      {/* Orbs */}
      <div className="absolute top-1/4 left-1/5 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
      <div className="absolute bottom-1/4 right-1/5 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
        style={{ color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        whileHover={{ scale: 1.05 }}
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4"
          style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
          Choose your experience
        </div>
        <h1 className="text-4xl font-black text-white" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
          Select Your Portal
        </h1>
        <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          Tailored experiences for patients and healthcare professionals
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
        {portals.map((p, i) => (
          <motion.div
            key={p.key}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => router.push(p.href)}
            className="cursor-pointer p-8 rounded-3xl group"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(30px)",
              transition: "box-shadow 0.3s ease",
            }}
            onHoverStart={e => (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px ${p.glow}`}
            onHoverEnd={e => (e.currentTarget as HTMLElement).style.boxShadow = "none"}
          >
            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${p.gradient}`}
              style={{ boxShadow: `0 8px 24px ${p.glow}` }}>
              <p.icon className="w-7 h-7 text-white" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{p.title}</h2>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{p.desc}</p>

            {/* Feature list */}
            <ul className="space-y-2 mb-8">
              {p.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${p.gradient}`} />
                  {f}
                </li>
              ))}
            </ul>

            <div className={`flex items-center justify-between px-5 py-3 rounded-xl bg-gradient-to-r ${p.gradient} group-hover:opacity-90 transition`}>
              <span className="text-white text-sm font-semibold">Enter Portal</span>
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}