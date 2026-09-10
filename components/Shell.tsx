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
      {/* ── Top Micro Banner (SIH Government Identity) ── */}
      <div className="w-full bg-gradient-to-r from-slate-950 via-[#061814] to-slate-950 border-b border-emerald-500/20 py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-wider">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold uppercase">SMART INDIA HACKATHON 2026</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">AICTE CYBER SECURITY CELL</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="font-mono text-emerald-300/80 uppercase font-semibold">PS: SIH26104</span>
            <span className="hidden md:inline px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[9px] uppercase font-bold">
              SUB-300MS DSP + ML
            </span>
          </div>
        </div>
      </div>

      {/* ── Primary Enterprise Cyber Header ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#030712]/90 border-b border-slate-800/80 shadow-2xl transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Identification */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 group-hover:border-emerald-400 transition-all duration-300 group-hover:scale-105">
                <Shield className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-[0.12em] text-white uppercase group-hover:text-emerald-300 transition-colors">
                  VOICESHIELD
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 uppercase">
                  SIH26104
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase hidden sm:block">
                AUDIO ANTI-SPOOFING ENGINE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80 backdrop-blur-md">
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold tracking-[0.12em] uppercase transition-all duration-200
                    ${active
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent"
                    }
                  `}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-emerald-400" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Medium Desktop Compact Navigation (for 1024px - 1280px screens) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {NAV.slice(0, 4).map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all
                    ${active
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }
                  `}
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Sign In & Mobile Menu Button */}
          <div className="flex items-center gap-2.5">
            {/* Live Telemetry Ping */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold uppercase">LIVE</span>
            </div>

            {/* Operator Sign In Button */}
            <Link
              href="/login"
              className="
                inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl
                bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400
                text-slate-950 font-mono font-bold text-xs tracking-widest uppercase
                transition-all duration-200 shadow-md shadow-emerald-500/20 active:scale-95
              "
            >
              <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>SIGN IN</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Subtle glowing accent underline */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      </header>

      {/* ── Mobile Full-Featured Cyber Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[105px] bottom-0 z-40 bg-[#030712]/98 backdrop-blur-2xl border-b border-slate-800 p-4 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
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
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${active ? "text-emerald-400" : "text-slate-600"}`} />
                </Link>
              );
            })}

            {/* Mobile Footer Identity */}
            <div className="pt-6 mt-4 border-t border-slate-800/80 space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase">CORE ENGINE:</span>
                <span className="text-emerald-400 font-bold uppercase">SUB-300MS REAL-TIME</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase">TELEPHONY CODEC:</span>
                <span className="text-cyan-400 font-bold uppercase">G.711 / AMR RESILIENT</span>
              </div>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-mono font-bold text-xs tracking-widest uppercase shadow-lg shadow-emerald-500/20"
              >
                <Lock className="w-4 h-4" />
                <span>OPERATOR SIGN IN</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>

      {/* ── High-Tech Cyber Footer ── */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-slate-400 font-mono text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white uppercase tracking-wider">VOICESHIELD</span>
            <span className="text-slate-600">·</span>
            <span className="uppercase tracking-widest">SMART INDIA HACKATHON 2026</span>
          </div>
          <div className="text-[11px] text-slate-500 tracking-wider uppercase">
            AICTE CYBER SECURITY CELL · PROBLEM STATEMENT SIH26104
          </div>
          <div className="text-[10px] text-emerald-400/80 tracking-widest uppercase">
            DPDP ACT 2023 COMPLIANT · ZERO DISK PERSISTENCE
          </div>
        </div>
      </footer>
    </div>
  );
}
