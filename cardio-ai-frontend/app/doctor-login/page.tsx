"use client";

import { Stethoscope, Lock, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DoctorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setMounted(true);
      });
    });
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    router.push("/doctor-dashboard");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 40%, #1a0a2e 100%)",
      }}
    >
      {/* Background orbs */}
      <div
        className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #a855f7, transparent)" }}
      />

      <div
        className="w-full max-w-md p-10 rounded-3xl relative z-10"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(30px)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
            }}
          >
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Doctor Login
          </h2>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 px-4 py-2.5 rounded-xl text-sm text-center"
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#fca5a5",
            }}
          >
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-5 relative">
          <Stethoscope
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "rgba(255,255,255,0.3)" }}
          />
          <input
            type="email"
            placeholder="Doctor Email"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${
                email
                  ? "rgba(99,102,241,0.5)"
                  : "rgba(255,255,255,0.1)"
              }`,
              fontFamily: "'DM Sans', sans-serif",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <Lock
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "rgba(255,255,255,0.3)" }}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${
                password
                  ? "rgba(99,102,241,0.5)"
                  : "rgba(255,255,255,0.1)"
              }`,
              fontFamily: "'DM Sans', sans-serif",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
          }}
        >
          Login
        </button>

        {/* Back */}
        <button
          onClick={() => router.push("/select-login")}
          className="flex items-center justify-center gap-2 w-full mt-5 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{
            color: "rgba(255,255,255,0.45)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Portal Selection
        </button>
      </div>
    </main>
  );
}