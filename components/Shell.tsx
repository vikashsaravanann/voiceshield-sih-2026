"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, FileText, LayoutDashboard, Radio, Shield } from "lucide-react";

const NAV = [
  { href: "/", label: "OVERVIEW", icon: Activity },
  { href: "/demo", label: "LIVE DEMO", icon: Radio },
  { href: "/dashboard", label: "VAULT", icon: LayoutDashboard },
  { href: "/brief", label: "BRIEF", icon: FileText },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login") return <>{children}</>;
  return (
    <div className="shell">
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <Shield size={16} strokeWidth={1.75} />
            </span>
            VoiceShield
            <span className="eyebrow" style={{ color: "var(--muted)", marginLeft: 4 }}>
              SIH26104
            </span>
          </Link>
          <nav className="nav">
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
                  <item.icon size={13} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link href="/login" className="btn btn-primary" style={{ minHeight: 36, padding: "0.4rem 0.9rem", letterSpacing: "0.14em", fontSize: 11, fontWeight: 700 }}>
            SIGN IN
          </Link>
        </div>
        <div className="mnav">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
                <item.icon size={13} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">VoiceShield · SIH 2026 · AICTE Cyber Security Cell · detect · challenge · persist nothing</footer>
    </div>
  );
}
