"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export function UserMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const [demoAccess, setDemoAccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setEmail(data.user.email);
        return;
      }
      // Cookie-based demo access (set on login page)
      if (typeof document !== "undefined" && document.cookie.includes("voiceshield_demo_access=1")) {
        setEmail("demo@voiceshield.local");
        setDemoAccess(true);
      }
    });
  }, []);

  if (!email) {
    return (
      <Link
        href="/login"
        className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 hover:text-emerald-300"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="text-right">
      <p className="text-xs font-mono text-slate-300 truncate max-w-[160px]">{email}</p>
      {demoAccess && (
        <p className="mt-1 text-[10px] uppercase tracking-wider text-amber-300">Read-only demo access</p>
      )}
    </div>
  );
}
