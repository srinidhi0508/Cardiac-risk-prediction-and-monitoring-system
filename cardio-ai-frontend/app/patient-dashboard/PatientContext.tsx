"use client";

import { createContext, useContext, useEffect, useState } from "react";

const PatientContext = createContext<any>(null);

export function PatientProvider({ children }: any) {
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/patient/P001");
        const data = await res.json();
        setPatient(data);
      } catch (err) {
        console.error("Error fetching patient:", err);
      }
    };

    // Initial fetch
    fetchData();

    // 🔥 AUTO REFRESH EVERY 1 SECOND
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PatientContext.Provider value={{ patient }}>
      {children}
    </PatientContext.Provider>
  );
}

export const usePatient = () => useContext(PatientContext);