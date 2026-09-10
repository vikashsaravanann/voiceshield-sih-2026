"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send, X, Network, Scale, Activity } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const welcome: Message = {
  role: "assistant",
  content:
    "System initialized. I am the VoiceShield Multi-Agent Copilot, powered by NVIDIA Nemotron Nano.\n\nMy sub-agents (Forensics, Legal, SecOps) are online. How can we assist you with SIH26104?",
};

export function VoiceShieldAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const content = input.trim();
    if (!content || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-10) }),
      });
      const result = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok || !result.answer) {
        throw new Error(result.error || "The Copilot network is temporarily offline.");
      }
      setMessages((current) => [...current, { role: "assistant", content: result.answer! }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Connection failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <section className="relative mb-4 flex h-[min(650px,calc(100vh-120px))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[2rem] border border-emerald-500/30 bg-[#071019]/95 shadow-2xl shadow-emerald-950/60 backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border border-emerald-400/10" />
          <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full border border-cyan-400/10" />
          <header className="relative flex items-center justify-between border-b border-emerald-500/20 bg-emerald-950/35 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/70 bg-[#06111a] p-1 shadow-[0_0_22px_rgba(16,185,129,0.25)]">
                <span className="absolute inset-1 rounded-full border border-cyan-300/30" />
                <img src="/logo.png" alt="VoiceShield Logo" className="w-full h-full object-cover" />
                <div className="absolute -right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-[#071019] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-wide text-white">VOICESHIELD COPILOT</h2>
                <div className="flex items-center gap-2 mt-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                  <Activity size={10} /> Forensic
                  <Scale size={10} /> Legal
                  <Network size={10} /> SecOps
                </div>
              </div>
            </div>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="rounded-md p-1.5 text-emerald-400 hover:bg-emerald-500/10 hover:text-white transition">
              <X size={18} />
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 custom-scrollbar">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user" 
                    ? "rounded-br-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20" 
                    : "rounded-bl-sm border border-slate-700/50 bg-slate-800/80 text-slate-200"
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs font-mono text-emerald-400">
                  <Loader2 size={14} className="animate-spin" /> Sub-agents processing...
                </div>
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
                <X size={14} className="text-rose-400" /> {error}
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-emerald-500/20 bg-slate-900/50 p-4">
            <div className="flex items-end gap-2 rounded-xl border border-slate-700 bg-slate-950 p-2 focus-within:border-emerald-400/60 focus-within:ring-1 focus-within:ring-emerald-400/30 transition-all">
              <textarea 
                value={input} 
                onChange={(event) => setInput(event.target.value)} 
                disabled={loading} 
                rows={2} 
                maxLength={4000} 
                placeholder="Query the VoiceShield Multi-Agent Network..." 
                className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-white outline-none placeholder:text-slate-500 font-sans" 
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()} 
                aria-label="Send" 
                className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-2.5 text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 shadow-lg shadow-emerald-500/20"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between px-1">
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Powered by NVIDIA Nemotron</p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Secure Comm Link</p>
            </div>
          </form>
        </section>
      )}
      {!open && (
        <button
          type="button" 
          onClick={() => setOpen(true)} 
          aria-label="Open VoiceShield AI assistant"
          className="group relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-emerald-400/80 bg-[#06111a] p-1.5 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-200 hover:scale-105 hover:border-emerald-300 hover:shadow-[0_0_38px_rgba(16,185,129,0.48)] active:scale-95 overflow-hidden"
        >
          <span className="absolute inset-1 rounded-full border border-cyan-300/35 transition-transform duration-300 group-hover:scale-105" />
          <span className="absolute inset-2 rounded-full border border-emerald-400/20" />
          <span className="absolute inset-0 rounded-full bg-emerald-400/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <img src="/logo.png" alt="" className="relative z-10 h-full w-full rounded-full object-cover" />
          <div className="absolute right-0.5 top-0.5 z-20 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#06111a] bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
          </div>
        </button>
      )}
    </div>
  );
}
