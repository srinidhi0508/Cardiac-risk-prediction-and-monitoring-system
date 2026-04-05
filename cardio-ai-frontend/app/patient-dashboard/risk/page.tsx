"use client";

import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer, Tooltip,
} from "recharts";
import { usePatient } from "../PatientContext";
import { useEffect } from "react";

export default function RiskPage() {
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

  // ✅ Risk Score mapping
  const riskScore =
    analysis?.risk_level === "High"
      ? 70
      : analysis?.risk_level === "Medium"
      ? 40
      : analysis?.risk_level === "Low"
      ? 20
      : 0;

  // ✅ Radar data (safe values)
  const radarData = [
    { factor: "BPM",     value: analysis?.avg_bpm ?? 0,    fullMark: 120 },
    { factor: "HRV",     value: analysis?.variability ?? 0, fullMark: 50 },
    { factor: "Min BPM", value: analysis?.min_bpm ?? 0,     fullMark: 120 },
    { factor: "Max BPM", value: analysis?.max_bpm ?? 0,     fullMark: 120 },
    { factor: "SpO₂",    value: 98,                         fullMark: 100 },
  ];

  // ✅ Factors list (clean formatting)
  const factors = [
    {
      label: "Average Heart Rate",
      value: analysis?.avg_bpm ? `${analysis.avg_bpm} bpm` : "--",
    },
    {
      label: "Min Heart Rate",
      value: analysis?.min_bpm ? `${analysis.min_bpm} bpm` : "--",
    },
    {
      label: "Max Heart Rate",
      value: analysis?.max_bpm ? `${analysis.max_bpm} bpm` : "--",
    },
    {
      label: "HRV (Variability)",
      value: analysis?.variability
        ? `${analysis.variability.toFixed(2)}`
        : "--",
    },
    {
      label: "Risk Level",
      value: analysis?.risk_level || "Loading",
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Risk Analysis</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          AI-powered cardiovascular risk · Based on heart data
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        
        {/* Risk Box */}
        <div
          className="p-8 rounded-2xl flex flex-col items-center text-center"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
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
        <div
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="factor"
                tick={{ fill: "white", fontSize: 11 }}
              />
              <Radar
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.25}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Factors */}
        <div
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {factors.map((f) => (
            <div key={f.label} className="mb-3 text-white">
              {f.label} — {f.value}
            </div>
          ))}
        </div>

      </div>
    </>
  );
}