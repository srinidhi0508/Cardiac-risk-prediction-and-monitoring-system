"use client";

import { motion } from "framer-motion";
import { Stethoscope, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DoctorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Temporary simulated login
    if (email && password) {
      router.push("/doctor-dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center px-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Doctor Login
        </h2>

        {/* Email */}
        <div className="mb-6 relative">
          <Stethoscope className="absolute left-3 top-3 text-blue-500 w-5 h-5" />
          <input
            type="email"
            placeholder="Doctor Email"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <Lock className="absolute left-3 top-3 text-blue-500 w-5 h-5" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md"
        >
          Login
        </motion.button>

        {/* Back */}
        <p
          onClick={() => router.push("/select-login")}
          className="text-center text-gray-500 mt-6 cursor-pointer hover:underline"
        >
          ← Back
        </p>
      </motion.div>

    </main>
  );
}