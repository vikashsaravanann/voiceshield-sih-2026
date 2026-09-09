"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);

    const supabase = createClient();
    const result =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (result.error) {
      setMsg(result.error.message);
    } else if (mode === "up" && !result.data.session) {
      setMsg("Account created. Check your email to confirm access, then sign in.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Shield size={20} color="var(--accent)" />
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>VoiceShield operator access</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>SIH26104 · sessions and audit vault</div>
          </div>
        </div>
        <form onSubmit={onSubmit}>
          <label>
            Email
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {msg ? <p className="hint" style={{ marginTop: 12 }}>{msg}</p> : null}
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 16 }} type="submit" disabled={busy}>
            {busy ? "Connecting..." : mode === "in" ? "Sign in" : "Create account"}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => setMode(mode === "in" ? "up" : "in")}
          >
            {mode === "in" ? "Need an operator account? Create one" : "Already enrolled? Sign in"}
          </button>
        </form>
        <Link href="/" style={{ display: "block", textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 16 }}>
          Back to overview
        </Link>
      </div>
    </div>
  );
}
