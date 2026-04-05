"use client";

import {
  Stethoscope, Users, AlertTriangle, Activity,
  FileText, LogOut,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label: "Overview",  icon: Activity,      href: "/doctor-dashboard" },
  { label: "Patients",  icon: Users,         href: "/doctor-dashboard/patients" },
  { label: "Alerts",    icon: AlertTriangle, href: "/doctor-dashboard/alerts" },
  { label: "Reports",   icon: FileText,      href: "/doctor-dashboard/reports" },
];

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 z-20 flex flex-col py-6 px-4"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-3 px-2 mb-10">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
        >
          <Stethoscope className="w-4 h-4 text-white" />
        </div>
        <span
          className="text-white font-bold"
          style={{ fontFamily: "'DM Sans',sans-serif" }}
        >
          PulseGuard
        </span>
      </div>

      {/* Doctor info card */}
      <div
        className="px-3 py-4 rounded-2xl mb-6"
        style={{
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.2)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)" }}
          >
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <div
              className="text-white text-sm font-semibold"
              style={{ fontFamily: "'DM Sans',sans-serif" }}
            >
              Dr. Ananya Rao
            </div>
            <div
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Cardiologist
            </div>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all"
              style={{
                background: active ? "rgba(99,102,241,0.2)" : "transparent",
                color: active ? "#a5b4fc" : "rgba(255,255,255,0.5)",
                border: active
                  ? "1px solid rgba(99,102,241,0.3)"
                  : "1px solid transparent",
              }}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </aside>
  );
}

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg,#0a0a1a 0%,#0d0d2b 40%,#1a0a2e 100%)",
      }}
    >
      <Sidebar />
      <div className="ml-64 p-8">{children}</div>
    </main>
  );
}
