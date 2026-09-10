"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
  Layers,
} from "lucide-react";

const NAV = [
  { href: "/", label: "OVERVIEW", icon: Activity },
  { href: "/demo", label: "LIVE DEMO", icon: Radio },
  { href: "/sandbox", label: "FORENSIC LAB", icon: Layers },
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
    <div className="min-h-screen w-full flex flex-col bg-[#030712] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans overflow-x-hidden">
      {/* ── Primary Enterprise Cyber Header (Single Clean Line) ── */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#030712]/90 border-b border-slate-800/80 shadow-2xl transition-all duration-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Brand Logo & Identification in 1 single horizontal line */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group shrink-0 whitespace-nowrap">
            <div className="relative shrink-0">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-emerald-500/60 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:border-emerald-400 group-hover:shadow-emerald-400/30 transition-all duration-300 group-hover:scale-105 overflow-hidden bg-slate-950 ring-1 ring-emerald-500/20 ring-offset-1 ring-offset-slate-950">
                <img src="/logo.png" alt="VoiceShield Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500" />
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
              <span className="text-xs sm:text-base font-black tracking-[0.12em] text-white uppercase group-hover:text-emerald-300 transition-colors whitespace-nowrap">
                VOICESHIELD
              </span>
              <span className="px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold tracking-widest bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 uppercase whitespace-nowrap hidden min-[360px]:inline-block">
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
                    inline-flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold tracking-[0.05em] xl:tracking-[0.1em] uppercase transition-all duration-200 whitespace-nowrap shrink-0
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
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap">
            {/* Live Telemetry Ping */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-emerald-400 font-bold uppercase whitespace-nowrap">LIVE</span>
            </div>

            {/* Operator Sign In Button — Single Line */}
            <Link
              href="/login"
              className="
                inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl
                bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400
                text-slate-950 font-mono font-bold text-[10px] sm:text-xs tracking-wider uppercase
                transition-all duration-200 shadow-md shadow-emerald-500/20 active:scale-95 whitespace-nowrap shrink-0
              "
            >
              <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5] shrink-0" />
              <span className="whitespace-nowrap">SIGN IN</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
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
                  className="block py-2 md:py-0 hover:text-emerald-400 transition-colors"
                >
                  PRIVACY POLICY
                </Link>
                <span>·</span>
                <Link
                  href="/terms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 md:py-0 hover:text-emerald-400 transition-colors"
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
      {/* ── High-Tech Cyber Enterprise Footer ── */}
      <footer className="relative w-full border-t border-slate-800/60 bg-gradient-to-b from-[#02050e] to-slate-950 pt-12 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-12 text-slate-400 font-sans text-xs overflow-hidden">
        {/* Abstract background accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          {/* Top Section: Brand & Mission */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 md:gap-12">
            <div className="space-y-5 max-w-lg">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-emerald-500/60 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:border-emerald-400 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all overflow-hidden bg-slate-950 shrink-0 ring-1 ring-emerald-500/20 ring-offset-2 ring-offset-[#02050e]">
                  <img src="/logo.png" alt="VoiceShield Logo" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xl sm:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 group-hover:from-emerald-300 group-hover:to-cyan-300 transition-all uppercase">
                    VOICESHIELD
                  </span>
                </div>
              </Link>
              
              <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed font-medium">
                Real-time telephony middleware mitigating AI synthetic voice clones and conversational deepfake fraud within 269ms.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-[10px] sm:text-xs text-emerald-400 font-bold uppercase tracking-widest">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                  SUB-300MS RTT
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-300 backdrop-blur-sm">
                  DPDP ACT 2023
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-700/50 text-cyan-300 backdrop-blur-sm">
                  G.711 / AMR
                </span>
              </div>
            </div>
          </div>

          {/* Middle Section: Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 pt-8 border-t border-slate-800/40">
            {/* Col 1: Core Modules */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3">
                CORE MODULES
              </h3>
              <ul className="space-y-3 font-mono text-[11px] sm:text-xs text-slate-400 pl-3.5">
                <li>
                  <Link href="https://voiceshield-live.vercel.app/" className="hover:text-emerald-400 transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 mr-2 group-hover:bg-emerald-400 transition-colors" />
                    OVERVIEW
                  </Link>
                </li>
                <li>
                  <Link href="https://voiceshield-live.vercel.app/demo" className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 mr-0.5 group-hover:bg-emerald-400 transition-colors" />
                    LIVE DEMO
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold leading-none tracking-wider">MIC</span>
                  </Link>
                </li>
                <li>
                  <Link href="https://voiceshield-live.vercel.app/dashboard" className="hover:text-emerald-400 transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 mr-2 group-hover:bg-emerald-400 transition-colors" />
                    SOC DASHBOARD
                  </Link>
                </li>
                <li>
                  <Link href="https://voiceshield-live.vercel.app/architecture" className="hover:text-emerald-400 transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 mr-2 group-hover:bg-emerald-400 transition-colors" />
                    ARCHITECTURE
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2: Documentation */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3">
                DOCUMENTATION
              </h3>
              <ul className="space-y-3 font-mono text-[11px] sm:text-xs text-slate-400 pl-3.5">
                <li>
                  <Link href="https://voiceshield-live.vercel.app/docs" className="hover:text-emerald-400 transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 mr-2 group-hover:bg-emerald-400 transition-colors" />
                    DEVELOPER API
                  </Link>
                </li>
                <li>
                  <Link href="https://voiceshield-live.vercel.app/about" className="hover:text-emerald-400 transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 mr-2 group-hover:bg-emerald-400 transition-colors" />
                    JUDGE BRIEF
                  </Link>
                </li>
                <li>
                  <Link href="https://voiceshield-live.vercel.app/docs#websocket" className="hover:text-emerald-400 transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 mr-2 group-hover:bg-emerald-400 transition-colors" />
                    WEBSOCKET WSS
                  </Link>
                </li>
                <li>
                  <Link href="https://voiceshield-live.vercel.app/docs#forensics" className="hover:text-emerald-400 transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 mr-2 group-hover:bg-emerald-400 transition-colors" />
                    FORENSIC FIR PDF
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Legal */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3">
                COMPLIANCE &amp; LEGAL
              </h3>
              <ul className="space-y-3 font-mono text-[11px] sm:text-xs text-slate-400 pl-3.5">
                <li>
                  <Link href="https://voiceshield-live.vercel.app/privacy" className="hover:text-emerald-400 transition-colors flex items-center font-semibold text-slate-300 group">
                    <span className="w-1 h-1 rounded-full bg-slate-500 mr-2 group-hover:bg-emerald-400 transition-colors" />
                    PRIVACY POLICY
                  </Link>
                </li>
                <li>
                  <Link href="https://voiceshield-live.vercel.app/terms" className="hover:text-emerald-400 transition-colors flex items-center font-semibold text-slate-300 group">
                    <span className="w-1 h-1 rounded-full bg-slate-500 mr-2 group-hover:bg-emerald-400 transition-colors" />
                    TERMS OF SERVICE
                  </Link>
                </li>
                <li>
                  <span className="flex items-center text-slate-500 uppercase">
                    <span className="w-1 h-1 rounded-full bg-slate-700 mr-2" />
                    DPDP ACT (INDIA) 2023
                  </span>
                </li>
                <li>
                  <span className="flex items-center text-slate-500 uppercase">
                    <span className="w-1 h-1 rounded-full bg-slate-700 mr-2" />
                    CERT-IN DIRECTIVES
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Badges */}
          <div className="pt-8 sm:pt-10 border-t border-slate-800/60 flex flex-col items-center gap-4 text-center font-mono text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-slate-900/30 px-6 py-3 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white font-bold tracking-[0.2em]">VOICESHIELD</span>
                <span className="text-slate-600 hidden sm:inline">·</span>
              </div>
              <span className="text-emerald-200/80 font-medium">SMART INDIA HACKATHON 2026</span>
            </div>
            
            <div className="space-y-1.5 flex flex-col items-center">
              <p className="text-slate-500">
                AICTE CYBER SECURITY CELL <span className="text-slate-700 mx-1">·</span> PROBLEM STATEMENT SIH26104
              </p>
              <div className="inline-flex items-center gap-2 text-emerald-400/90 font-bold bg-emerald-950/20 px-4 py-1.5 rounded-full border border-emerald-900/30">
                <Lock className="w-3.5 h-3.5" />
                ZERO RAW AUDIO DISK STORAGE · EPHEMERAL RAM ONLY
              </div>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
