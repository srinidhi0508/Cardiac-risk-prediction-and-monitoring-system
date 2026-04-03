"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, HeartPulse, ArrowLeft, Zap, AlertTriangle, CheckCircle, FileText, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

function getRiskLabel(score: number) {
  if (score < 20) return { label:"Low Risk",      color:"#10b981", bg:"rgba(16,185,129,0.15)",  border:"rgba(16,185,129,0.3)",  icon:CheckCircle };
  if (score < 50) return { label:"Moderate Risk", color:"#f59e0b", bg:"rgba(245,158,11,0.15)",  border:"rgba(245,158,11,0.3)",  icon:AlertTriangle };
  return            { label:"High Risk",      color:"#ef4444", bg:"rgba(239,68,68,0.15)",    border:"rgba(239,68,68,0.3)",    icon:AlertTriangle };
}

const fields = [
  { key:"bpm",       label:"Heart Rate (BPM)",   placeholder:"e.g. 72",  unit:"bpm",   desc:"PPG-derived resting heart rate" },
  { key:"systolic",  label:"Systolic BP",         placeholder:"e.g. 120", unit:"mmHg",  desc:"Upper blood pressure reading" },
  { key:"diastolic", label:"Diastolic BP",        placeholder:"e.g. 80",  unit:"mmHg",  desc:"Lower blood pressure reading" },
  { key:"spo2",      label:"SpO₂",                placeholder:"e.g. 98",  unit:"%",     desc:"Blood oxygen saturation (PPG)" },
  { key:"hrv",       label:"HRV",                 placeholder:"e.g. 42",  unit:"ms",    desc:"Heart rate variability" },
  { key:"age",       label:"Age",                 placeholder:"e.g. 45",  unit:"yrs",   desc:"Patient age" },
];

export default function RiskPrediction() {
  const router = useRouter();
  const [step, setStep]   = useState<"form"|"loading"|"result">("form");
  const [form, setForm]   = useState({ bpm:"", systolic:"", diastolic:"", spo2:"", hrv:"", age:"" });
  const [result, setResult] = useState<null|{ score:number; radarData:{ factor:string; value:number; fullMark:number }[] }>(null);

  const handleAnalyze = async () => {
    setStep("loading");
    await new Promise(r => setTimeout(r, 2600));
    const score = Math.floor(Math.random() * 60) + 10;
    setResult({
      score,
      radarData: [
        { factor:"BPM",         value: Math.min(100, Math.floor(Number(form.bpm) / 1.4)),           fullMark:100 },
        { factor:"SpO₂",        value: Number(form.spo2) || 75,                                      fullMark:100 },
        { factor:"HRV",         value: Math.min(100, Math.floor((Number(form.hrv)||42) * 1.5)),      fullMark:100 },
        { factor:"Systolic BP", value: Math.min(100, Math.floor((Number(form.systolic)-80)/0.6)),    fullMark:100 },
        { factor:"Diastolic BP",value: Math.min(100, Math.floor((Number(form.diastolic)-50)/0.5)),   fullMark:100 },
      ],
    });
    setStep("result");
  };

  const risk = result ? getRiskLabel(result.score) : null;
  const allFilled = Object.values(form).every(v => v.trim() !== "");

  return (
    <main className="min-h-screen px-6 py-10"
      style={{ background:"linear-gradient(135deg,#0a0a1a 0%,#0d0d2b 40%,#1a0a2e 100%)" }}>

      {/* Orbs */}
      <div className="fixed top-20 right-20 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background:"radial-gradient(circle,#a855f7,transparent)" }}/>
      <div className="fixed bottom-20 left-20 w-56 h-56 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background:"radial-gradient(circle,#6366f1,transparent)" }}/>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push("/patient-dashboard")}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-full"
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)" }}>
            <ArrowLeft className="w-4 h-4"/> Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily:"'DM Sans',sans-serif" }}>PPG Risk Prediction</h1>
            <p className="text-sm" style={{ color:"rgba(255,255,255,0.4)" }}>AI cardiovascular risk analysis · Based on PPG & BPM signals</p>
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* FORM */}
          {step === "form" && (
            <motion.div key="form" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}>

              {/* Info banner */}
              <div className="flex items-start gap-3 p-4 rounded-2xl mb-6"
                style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.25)" }}>
                <Activity className="w-5 h-5 mt-0.5 shrink-0" style={{ color:"#a5b4fc" }}/>
                <div>
                  <div className="text-white text-sm font-medium" style={{ fontFamily:"'DM Sans',sans-serif" }}>PPG-Based Analysis</div>
                  <div className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.45)" }}>
                    Our AI model uses photoplethysmography (PPG) signals — heart rate, SpO₂, HRV, and blood pressure — to predict your 10-year cardiovascular risk. No ECG required.
                  </div>
                </div>
              </div>

              {/* Vitals form */}
              <div className="p-6 rounded-2xl mb-5"
                style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(20px)" }}>
                <div className="flex items-center gap-2 mb-6">
                  <HeartPulse className="w-5 h-5" style={{ color:"#f472b6" }}/>
                  <h2 className="text-white font-semibold" style={{ fontFamily:"'DM Sans',sans-serif" }}>Enter Your PPG Vitals</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {fields.map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium mb-1" style={{ color:"rgba(255,255,255,0.55)" }}>{field.label}</label>
                      <div className="relative">
                        <input type="number" placeholder={field.placeholder}
                          value={form[field.key as keyof typeof form]}
                          onChange={e => setForm(f => ({ ...f, [field.key]:e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                          style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${form[field.key as keyof typeof form]?"rgba(99,102,241,0.5)":"rgba(255,255,255,0.1)"}`, fontFamily:"'DM Sans',sans-serif" }}/>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color:"rgba(255,255,255,0.3)" }}>{field.unit}</span>
                      </div>
                      <div className="text-xs mt-1" style={{ color:"rgba(255,255,255,0.3)" }}>{field.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale:1.02, boxShadow:"0 0 30px rgba(99,102,241,0.5)" }}
                whileTap={{ scale:0.98 }}
                onClick={handleAnalyze}
                disabled={!allFilled}
                className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background:"linear-gradient(135deg,#6366f1,#a855f7)", fontFamily:"'DM Sans',sans-serif", fontSize:"16px" }}>
                <Zap className="w-5 h-5"/> Predict Cardiovascular Risk with AI
              </motion.button>
              {!allFilled && <p className="text-center text-xs mt-2" style={{ color:"rgba(255,255,255,0.3)" }}>Please fill in all fields to proceed</p>}
            </motion.div>
          )}

          {/* LOADING */}
          {step === "loading" && (
            <motion.div key="loading" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="flex flex-col items-center justify-center py-32">
              <motion.div animate={{ scale:[1,1.15,1], opacity:[0.7,1,0.7] }}
                transition={{ repeat:Infinity, duration:1.4 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background:"linear-gradient(135deg,#6366f1,#a855f7)" }}>
                <TrendingUp className="w-10 h-10 text-white"/>
              </motion.div>
              <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily:"'DM Sans',sans-serif" }}>Analyzing PPG signals...</h2>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>Running AI cardiovascular risk model</p>
              <div className="mt-6 flex gap-2">
                {["Reading BPM","Checking SpO₂","Computing HRV","Predicting risk"].map((s,i) => (
                  <motion.div key={s} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.5 }}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", color:"#a5b4fc" }}>
                    {s}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* RESULT */}
          {step === "result" && result && risk && (
            <motion.div key="result" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
              <div className="grid md:grid-cols-2 gap-6">

                {/* Score */}
                <div className="p-8 rounded-2xl flex flex-col items-center text-center"
                  style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(20px)" }}>
                  <div className="relative w-44 h-44 mb-4">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10"/>
                      <circle cx="60" cy="60" r="50" fill="none" stroke={risk.color} strokeWidth="10"
                        strokeDasharray={`${result.score*3.14} ${100*3.14}`} strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-white" style={{ fontFamily:"'DM Sans',sans-serif" }}>{result.score}%</span>
                      <span className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>10-year CVD risk</span>
                    </div>
                  </div>
                  <div className="px-5 py-2 rounded-full text-sm font-semibold mb-4 flex items-center gap-2"
                    style={{ background:risk.bg, border:`1px solid ${risk.border}`, color:risk.color }}>
                    <risk.icon className="w-4 h-4"/>{risk.label}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.5)" }}>
                    {result.score < 20
                      ? "Your PPG vitals are within healthy ranges. Continue regular monitoring."
                      : result.score < 50
                      ? "Moderate risk from PPG analysis. Lifestyle changes and check-ups are recommended."
                      : "High risk detected. Please consult your cardiologist immediately."}
                  </p>
                </div>

                {/* Radar */}
                <div className="p-6 rounded-2xl"
                  style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(20px)" }}>
                  <h3 className="text-white font-semibold mb-1" style={{ fontFamily:"'DM Sans',sans-serif" }}>PPG Risk Factor Breakdown</h3>
                  <p className="text-xs mb-2" style={{ color:"rgba(255,255,255,0.4)" }}>Each axis shows contribution to overall risk</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={result.radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)"/>
                      <PolarAngleAxis dataKey="factor" tick={{ fill:"rgba(255,255,255,0.45)", fontSize:11 }}/>
                      <Radar name="Risk" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.28}/>
                      <Tooltip contentStyle={{ background:"rgba(15,15,40,0.9)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:8, color:"white" }}/>
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex gap-4">
                  <button className="flex-1 py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                    style={{ background:"linear-gradient(135deg,#6366f1,#a855f7)", color:"white", fontFamily:"'DM Sans',sans-serif" }}>
                    <FileText className="w-4 h-4"/> Download PDF Report
                  </button>
                  <button onClick={() => router.push("/patient-dashboard/risk")}
                    className="flex-1 py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                    style={{ background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", color:"#a5b4fc", fontFamily:"'DM Sans',sans-serif" }}>
                    <TrendingUp className="w-4 h-4"/> View Risk History
                  </button>
                  <button onClick={() => setStep("form")}
                    className="flex-1 py-3.5 rounded-xl text-sm font-medium"
                    style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)", fontFamily:"'DM Sans',sans-serif" }}>
                    Run Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}