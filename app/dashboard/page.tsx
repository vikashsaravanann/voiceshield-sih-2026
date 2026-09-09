import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="console">
      <p className="eyebrow">Analyst vault</p>
      <h1 style={{ margin: "0.4rem 0 0", fontSize: "1.85rem" }}>Sessions and audit</h1>
      <p className="lede" style={{ fontSize: "0.9rem" }}>
        Row scope is server-side via Supabase RLS: analysts see their own rows. Apply{" "}
        <code>infra/migrations</code> in the Supabase SQL editor, then sign in.
      </p>
      <div className="card" style={{ marginTop: "2rem", padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--muted)", margin: 0 }}>
          No sessions yet. Run the live console, then connect Supabase Auth to persist hops.
        </p>
        <div style={{ marginTop: "1rem", display: "flex", gap: 8, justifyContent: "center" }}>
          <Link href="/demo" className="btn btn-primary">
            Open live console
          </Link>
          <Link href="/login" className="btn btn-ghost">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
