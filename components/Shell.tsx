"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/demo", label: "Live demo" },
  { href: "/dashboard", label: "Vault" },
  { href: "/architecture", label: "Architecture" },
  { href: "/docs", label: "SIH pack" },
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
                <Link key={item.href} href={item.href} className={active ? "active" : ""}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link href="/login" className="btn btn-primary" style={{ minHeight: 36, padding: "0.4rem 0.9rem" }}>
            Sign in
          </Link>
        </div>
        <div className="mnav">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={active ? "active" : ""}>
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
