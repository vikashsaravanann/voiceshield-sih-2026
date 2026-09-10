"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Activity,
  Radio,
  LayoutDashboard,
  Cpu,
  BookOpen,
  FileCheck2,
  Lock,
  Menu,
  X,
  ChevronRight,
  Zap,
} from "lucide-react";

const NAV = [
  { href: "/", label: "OVERVIEW", icon: Activity },
  { href: "/demo", label: "LIVE DEMO", icon: Radio },
  { href: "/dashboard", label: "SOC DASHBOARD", icon: LayoutDashboard },
  { href: "/architecture", label: "ARCHITECTURE", icon: Cpu },
  { href: "/docs", label: "DOCS", icon: BookOpen },
  { href: "/brief", label: "JUDGE BRIEF", icon: FileCheck2 },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  if (pathname === "/login") return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* ── Primary Enterprise Cyber Header (Single Clean Line) ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#030712]/90 border-b border-slate-800/80 shadow-2xl transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo & Identification in 1 single horizontal line */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 whitespace-nowrap">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/10 group-hover:border-emerald-400 transition-all duration-300 group-hover:scale-105">
                <Shield className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>

            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-base font-black tracking-[0.12em] text-white uppercase group-hover:text-emerald-300 transition-colors whitespace-nowrap">
                VOICESHIELD
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 uppercase whitespace-nowrap">
                SIH26104
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — Strictly 1 Line (whitespace-nowrap) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80 backdrop-blur-md whitespace-nowrap flex-nowrap shrink-0">
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold tracking-[0.08em] xl:tracking-[0.12em] uppercase transition-all duration-200 whitespace-nowrap shrink-0
                    ${active
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent"
                    }
                  `}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-emerald-400" : "text-slate-500"}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Live Ping & Sign In in 1 Line */}
          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            {/* Live Telemetry Ping */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-emerald-400 font-bold uppercase whitespace-nowrap">LIVE</span>
            </div>

            {/* Operator Sign In Button — Single Line */}
            <Link
              href="/login"
              className="
                inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl
                bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400
                text-slate-950 font-mono font-bold text-xs tracking-wider uppercase
                transition-all duration-200 shadow-md shadow-emerald-500/20 active:scale-95 whitespace-nowrap shrink-0
              "
            >
              <Lock className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
              <span className="whitespace-nowrap">SIGN IN</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 shrink-0" /> : <Menu className="w-5 h-5 shrink-0" />}
            </button>
          </div>
        </div>

        {/* Subtle glowing accent underline */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      </header>

      {/* ── Mobile Full-Featured Cyber Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-[#030712]/98 backdrop-blur-2xl border-b border-slate-800 p-4 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2 max-w-md mx-auto pt-2">
            <div className="px-3 py-2 text-[10px] font-mono font-semibold tracking-widest text-slate-500 uppercase">
              NAVIGATION MODULES
            </div>

            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center justify-between p-3.5 rounded-xl border text-xs font-mono font-bold tracking-widest uppercase transition-all
                    ${active
                      ? "bg-emerald-950/50 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                      : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${active ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : "bg-slate-800 border-slate-700 text-slate-400"}`}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${active ? "text-emerald-400" : "text-slate-600"}`} />
                </Link>
              );
            })}

            {/* Mobile Footer Identity */}
            <div className="pt-6 mt-4 border-t border-slate-800/80 space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase">CORE ENGINE:</span>
                <span className="text-emerald-400 font-bold uppercase whitespace-nowrap">SUB-300MS REAL-TIME</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase">TELEPHONY CODEC:</span>
                <span className="text-cyan-400 font-bold uppercase whitespace-nowrap">G.711 / AMR RESILIENT</span>
              </div>
              {/* Mobile Legal Links */}
              <div className="flex items-center justify-center gap-3 pt-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <Link
                  href="/privacy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-emerald-400 transition-colors"
                >
                  PRIVACY POLICY
                </Link>
                <span>·</span>
                <Link
                  href="/terms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-emerald-400 transition-colors"
                >
                  TERMS OF SERVICE
                </Link>
              </div>

              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-mono font-bold text-xs tracking-widest uppercase shadow-lg shadow-emerald-500/20 whitespace-nowrap"
              >
                <Lock className="w-4 h-4 shrink-0" />
                <span>OPERATOR SIGN IN</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>

      {/* ── High-Tech Cyber Enterprise Footer ── */}
      <footer className="border-t border-slate-800/80 bg-[#02050e] pt-16 pb-12 px-4 sm:px-6 lg:px-12 text-slate-400 font-sans text-xs relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Top Grid: Brand & Link Columns with Generous Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
            
            {/* Col 1 & 2: Platform Identity */}
            <div className="lg:col-span-2 space-y-5">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md group-hover:border-emerald-400 transition-all">
                  <Shield className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-wider text-white uppercase group-hover:text-emerald-300 transition-colors">
                    VOICESHIELD
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest bg-emerald-950 text-emerald-400 border border-emerald-500/40 uppercase">
                    SIH26104
                  </span>
                </div>
              </Link>

              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Real-time telephony middleware mitigating AI synthetic voice clones and conversational deepfake fraud within 269ms.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px] text-emerald-400 uppercase tracking-wider">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SUB-300MS RTT
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                  DPDP ACT 2023
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-cyan-300">
                  G.711 / AMR
                </span>
              </div>
            </div>

            {/* Col 3: Core Modules */}
            <div className="space-y-4">
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                CORE MODULES
              </div>
              <ul className="space-y-2.5 font-mono text-xs text-slate-400">
                <li>
                  <Link href="/" className="hover:text-emerald-400 uppercase transition-colors">
                    OVERVIEW
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-emerald-400 uppercase transition-colors flex items-center gap-1.5">
                    <span>LIVE DEMO</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">MIC</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-emerald-400 uppercase transition-colors">
                    SOC DASHBOARD
                  </Link>
                </li>
                <li>
                  <Link href="/architecture" className="hover:text-emerald-400 uppercase transition-colors">
                    ARCHITECTURE
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Intelligence & Docs */}
            <div className="space-y-4">
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                DOCUMENTATION
              </div>
              <ul className="space-y-2.5 font-mono text-xs text-slate-400">
                <li>
                  <Link href="/docs" className="hover:text-emerald-400 uppercase transition-colors">
                    DEVELOPER API
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-emerald-400 uppercase transition-colors">
                    JUDGE BRIEF
                  </Link>
                </li>
                <li>
                  <Link href="/docs#websocket" className="hover:text-emerald-400 uppercase transition-colors">
                    WEBSOCKET WSS
                  </Link>
                </li>
                <li>
                  <Link href="/docs#forensics" className="hover:text-emerald-400 uppercase transition-colors">
                    FORENSIC FIR PDF
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 5: Legal & Statutory */}
            <div className="space-y-4">
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                COMPLIANCE &amp; LEGAL
              </div>
              <ul className="space-y-2.5 font-mono text-xs text-slate-400">
                <li>
                  <Link href="/privacy" className="hover:text-emerald-400 uppercase transition-colors font-semibold text-slate-300">
                    PRIVACY POLICY
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-emerald-400 uppercase transition-colors font-semibold text-slate-300">
                    TERMS OF SERVICE
                  </Link>
                </li>
                <li>
                  <span className="text-[11px] text-slate-500 uppercase block">
                    DPDP ACT (INDIA) 2023
                  </span>
                </li>
                <li>
                  <span className="text-[11px] text-slate-500 uppercase block">
                    CERT-IN DIRECTIVES
                  </span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright & AICTE Recognition */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left font-mono text-[11px] text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300 font-bold">VOICESHIELD</span>
              <span>·</span>
              <span>SMART INDIA HACKATHON 2026</span>
            </div>
            <div>
              AICTE CYBER SECURITY CELL · PROBLEM STATEMENT SIH26104
            </div>
            <div className="text-emerald-400/90 font-semibold">
              ZERO RAW AUDIO DISK STORAGE · EPHEMERAL RAM ONLY
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
