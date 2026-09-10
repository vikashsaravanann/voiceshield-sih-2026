"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Github, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type AuthMode = "in" | "up" | "reset";
type Message = { type: "error" | "success"; text: string } | null;

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="auth-provider-icon">
      <path fill="#4285F4" d="M21.35 12.23c0-.7-.06-1.38-.18-2.03H12v3.84h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.2Z" />
      <path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.75 9.75 0 0 0 12 21.75Z" />
      <path fill="#FBBC05" d="M6.53 13.84a5.86 5.86 0 0 1 0-3.68V7.63H3.28a9.75 9.75 0 0 0 0 8.74l3.25-2.53Z" />
      <path fill="#EA4335" d="M12 6.13c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.84 3.17 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.72 5.38l3.25 2.53C7.3 7.85 9.46 6.13 12 6.13Z" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<AuthMode>("in");
  const [message, setMessage] = useState<Message>(null);
  const [busy, setBusy] = useState<"email" | "google" | "github" | null>(null);
  const [callbackError, setCallbackError] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const isReset = mode === "reset";
  const isSignUp = mode === "up";

  useEffect(() => {
    setCallbackError(new URLSearchParams(window.location.search).get("error") === "auth-callback-failed");
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("email");
    setMessage(null);

    const result = isReset
      ? await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        })
      : isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
          })
        : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setMessage({ type: "error", text: result.error.message });
    } else if (isReset) {
      setMessage({ type: "success", text: "Password reset instructions are on their way. Check your inbox." });
    } else if (isSignUp && !("session" in result.data && result.data.session)) {
      setMessage({ type: "success", text: "Account created. Check your email to confirm access." });
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setBusy(null);
  }

  async function signInWithProvider(provider: "google" | "github") {
    setBusy(provider);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) {
      setMessage({ type: "error", text: error.message });
      setBusy(null);
    }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage(null);
    setPassword("");
  }

  return (
    <main className="auth-page">
      <div className="auth-orb auth-orb-one" aria-hidden="true" />
      <div className="auth-orb auth-orb-two" aria-hidden="true" />

      <div className="auth-layout">
        <section className="auth-story" aria-label="VoiceShield security">
          <Link href="/" className="auth-brand">
            <span className="auth-brand-mark"><ShieldCheck size={20} strokeWidth={2.2} /></span>
            <span>VoiceShield</span>
          </Link>
          <div className="auth-story-content">
            <span className="auth-kicker"><span className="auth-status-dot" /> Secure voice intelligence</span>
            <h1>Protect every conversation from what sounds real.</h1>
            <p>Sign in to monitor live calls, investigate suspicious audio, and keep your team one step ahead of voice impersonation.</p>
            <div className="auth-trust-list">
              <span><CheckCircle2 size={16} /> Real-time detection</span>
              <span><CheckCircle2 size={16} /> Private by design</span>
              <span><CheckCircle2 size={16} /> Built for response teams</span>
            </div>
          </div>
          <div className="auth-story-footer">
            <span>SIH26104</span>
            <span className="auth-footer-line" />
            <span>Secure access portal</span>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-panel-inner">
            <div className="auth-mobile-brand">
              <span className="auth-brand-mark"><ShieldCheck size={19} strokeWidth={2.2} /></span>
              <span>VoiceShield</span>
            </div>
            <div className="auth-heading">
              <p className="auth-eyebrow">{isReset ? "Account recovery" : isSignUp ? "Create your account" : "Welcome back"}</p>
              <h2>{isReset ? "Reset your password" : isSignUp ? "Start protecting your calls" : "Sign in to your workspace"}</h2>
              <p>{isReset ? "Enter your email and we’ll send you a secure reset link." : "Access your secure detection workspace."}</p>
            </div>

            {callbackError && !message && (
              <div className="auth-message auth-message-error" role="alert">
                <AlertCircle size={17} /> We couldn’t complete that sign-in. Please try again.
              </div>
            )}

            {!isReset && (
              <div className="auth-provider-grid">
                <button className="auth-provider-button" type="button" onClick={() => signInWithProvider("google")} disabled={busy !== null}>
                  {busy === "google" ? <Loader2 className="auth-spinner" size={18} /> : <GoogleIcon />}
                  <span>Continue with Google</span>
                </button>
                <button className="auth-provider-button" type="button" onClick={() => signInWithProvider("github")} disabled={busy !== null}>
                  {busy === "github" ? <Loader2 className="auth-spinner" size={18} /> : <Github size={19} />}
                  <span>Continue with GitHub</span>
                </button>
              </div>
            )}

            {!isReset && <div className="auth-divider"><span>or continue with email</span></div>}

            <form onSubmit={onSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="email">Work email</label>
                <div className="auth-input-wrap">
                  <Mail size={18} aria-hidden="true" />
                  <input id="email" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
                </div>
              </div>

              {!isReset && (
                <div className="auth-field">
                  <div className="auth-label-row">
                    <label htmlFor="password">Password</label>
                    {!isSignUp && <button type="button" className="auth-link" onClick={() => switchMode("reset")}>Forgot password?</button>}
                  </div>
                  <div className="auth-input-wrap">
                    <LockKeyhole size={18} aria-hidden="true" />
                    <input id="password" required minLength={8} type={showPassword ? "text" : "password"} autoComplete={isSignUp ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" />
                    <button type="button" className="auth-input-action" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {isSignUp && <span className="auth-helper">Use at least 8 characters for a stronger account.</span>}
                </div>
              )}

              {message && (
                <div className={`auth-message auth-message-${message.type}`} role={message.type === "error" ? "alert" : "status"}>
                  {message.type === "error" ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}
                  <span>{message.text}</span>
                </div>
              )}

              <button className="auth-submit" type="submit" disabled={busy !== null}>
                {busy === "email" && <Loader2 className="auth-spinner" size={18} />}
                {busy === "email" ? isReset ? "Sending reset link..." : isSignUp ? "Creating account..." : "Signing you in..." : isReset ? "Send reset link" : isSignUp ? "Create account" : "Sign in"}
              </button>
            </form>

            <div className="auth-switch">
              {isReset ? (
                <button type="button" className="auth-link auth-back-link" onClick={() => switchMode("in")}><ArrowLeft size={15} /> Back to sign in</button>
              ) : (
                <p>{isSignUp ? "Already have an account?" : "New to VoiceShield?"} <button type="button" className="auth-link" onClick={() => switchMode(isSignUp ? "in" : "up")}>{isSignUp ? "Sign in" : "Create an account"}</button></p>
              )}
            </div>

            <p className="auth-legal">By continuing, you agree to our <Link href="/about">Terms of Service</Link> and <Link href="/about">Privacy Policy</Link>.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
