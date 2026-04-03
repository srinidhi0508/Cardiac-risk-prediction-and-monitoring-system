"use client";

import { useRouter } from "next/navigation";

export default function PatientProfile() {
  const router = useRouter();

  const patient = {
    name: "Rahul Verma",
    age: 45,
    bloodGroup: "O+",
    condition: "Hypertension",
    address: "Hyderabad, India",
    phone: "+91 9876543210",
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 p-10">

      <h1 className="text-3xl font-bold mb-8">Patient Profile</h1>

      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl">
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
        <p><strong>Condition:</strong> {patient.condition}</p>
        <p><strong>Address:</strong> {patient.address}</p>
        <p><strong>Phone:</strong> {patient.phone}</p>
      </div>

      <button
        onClick={() => router.push("/patient-dashboard")}
        className="mt-8 bg-red-500 text-white px-6 py-3 rounded-lg"
      >
        ← Back to Dashboard
      </button>

    </main>
  );
}