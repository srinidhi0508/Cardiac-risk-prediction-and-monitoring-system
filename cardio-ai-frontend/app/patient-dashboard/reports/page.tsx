"use client";

import { useState, useEffect } from "react";
import { usePatient } from "../PatientContext";

type Report = {
  id: number;
  title: string;
  date: string;
  type: string;
  risk: string;
  pages: number;
  status: string;
  notes: string;
};

const reports: Report[] = [
  {
    id: 1,
    title: "Monthly Cardiac Summary",
    date: "28 Mar 2026",
    type: "PPG Risk Report",
    risk: "Moderate",
    pages: 5,
    status: "ready",
    notes: "Patient shows stable BPM patterns...",
  },
];

export default function PatientReportsPage() {
  const [loading, setLoading] = useState<any>(null);
  const { patient, setPatient } = usePatient(); // 👈 IMPORTANT

  // ✅ REAL-TIME FETCH
  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:8000/patient/P001")
        .then((res) => res.json())
        .then((data) => setPatient(data))
        .catch((err) => console.error(err));
    };

    fetchData(); // first load
    const interval = setInterval(fetchData, 3000); // every 3 sec

    return () => clearInterval(interval);
  }, [setPatient]);

  // ✅ USE BACKEND ANALYSIS
  const vitals = {
    bpm: patient?.analysis?.avg_bpm ?? "--",
    spo2: 98,
    systolic: 120,
    diastolic: 80,
    hrv: patient?.analysis?.variability?.toFixed(2) ?? "--",

    riskScore:
      patient?.analysis?.risk_level === "High"
        ? 70
        : patient?.analysis?.risk_level === "Medium"
        ? 40
        : 20,

    riskLabel: patient?.analysis?.risk_level || "Loading",
  };

  const patientInfo = {
    name: patient?.name || "Loading",
    age: patient?.age || "--",
    bloodGroup: "O+",
    condition: "Hypertension",
    doctor: "Dr. Ananya Rao",
    phone: "+91 9876543210",
    address: "Hyderabad, India",
  };

  // ✅ PDF now uses REAL data
  async function generatePDF(report: Report, download: boolean) {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    doc.text(`Patient: ${patientInfo.name}`, 10, 10);
    doc.text(`Age: ${patientInfo.age}`, 10, 20);
    doc.text(`Average Heart Rate: ${vitals.bpm} bpm`, 10, 30);
    doc.text(`HRV: ${vitals.hrv}`, 10, 40);
    doc.text(`Risk Level: ${vitals.riskLabel}`, 10, 50);

    if (download) doc.save("report.pdf");
    else window.open(doc.output("bloburl"));
  }

  const handlePDF = async (report: Report, action: "download" | "view") => {
    setLoading({ id: report.id, action });
    try {
      await generatePDF(report, action === "download");
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-6">My Reports</h1>

      {/* 🔥 LIVE SUMMARY (NEW BUT UI SAFE) */}
      <div className="mb-6 text-white text-sm opacity-80">
        Avg BPM: {vitals.bpm} | HRV: {vitals.hrv} | Risk: {vitals.riskLabel}
      </div>

      <div className="flex flex-col gap-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="p-5 rounded-2xl flex justify-between items-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="text-white">{r.title}</div>

            <div className="flex gap-2">
              <button
                onClick={() => handlePDF(r, "download")}
                className="px-3 py-2 bg-purple-500 text-white rounded"
              >
                Download
              </button>

              <button
                onClick={() => handlePDF(r, "view")}
                className="px-3 py-2 bg-gray-600 text-white rounded"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}