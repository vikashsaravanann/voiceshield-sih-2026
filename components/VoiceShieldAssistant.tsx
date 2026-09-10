"use client";

import { FormEvent, useState } from "react";
import { Bot, Loader2, MessageSquareText, Send, X, Network, Scale, Activity } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const welcome: Message = {
  role: "assistant",
  content:
    "System initialized. I am the VoiceShield Multi-Agent Copilot, powered by NVIDIA Llama-3.1.\n\nMy sub-agents (Forensics, Legal, Network) are online. How can we assist you with SIH26104?",
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
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <section className="mb-4 flex h-[min(650px,calc(100vh-120px))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-indigo-500/30 bg-[#0A0F1C]/95 backdrop-blur-xl shadow-2xl shadow-indigo-900/50">
          <header className="flex items-center justify-between border-b border-indigo-500/20 bg-indigo-950/40 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Bot className="text-white" size={20} />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#0A0F1C] bg-emerald-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-wide text-white">VOICESHIELD COPILOT</h2>
                <div className="flex items-center gap-2 mt-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-300">
                  <Activity size={10} /> Forensic
                  <Scale size={10} /> Legal
                  <Network size={10} /> SecOps
                </div>
              </div>
            </div>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="rounded-md p-1.5 text-indigo-400 hover:bg-indigo-500/10 hover:text-white transition">
              <X size={18} />
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 custom-scrollbar">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user" 
                    ? "rounded-br-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20" 
                    : "rounded-bl-sm border border-slate-700/50 bg-slate-800/80 text-slate-200"
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-xs font-mono text-indigo-400">
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

          <form onSubmit={sendMessage} className="border-t border-indigo-500/20 bg-slate-900/50 p-4">
            <div className="flex items-end gap-2 rounded-xl border border-slate-700 bg-slate-950 p-2 focus-within:border-indigo-400/60 focus-within:ring-1 focus-within:ring-indigo-400/30 transition-all">
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
                className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 p-2.5 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 shadow-lg shadow-indigo-500/20"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between px-1">
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Powered by NVIDIA Llama-3.1</p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Secure Comm Link</p>
            </div>
          </form>
        </section>
      )}
      {!open && (
        <button 
          type="button" 
          onClick={() => setOpen(true)} 
          className="group relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-10" />
          <MessageSquareText size={24} className="text-white" />
          <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-950 bg-rose-500">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          </div>
        </button>
      )}
    </div>
  );
}
