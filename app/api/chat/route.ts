import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "groq/compound";

const REPOSITORY_CONTEXT = `
You are the VoiceShield Assistant, an elite AI technical representative for the VoiceShield platform.
Answer purely from the platform information below. Use a highly professional, authoritative, and 
sophisticated tone designed to impress judges and enterprise clients (e.g., telecom and BFSI sectors).
Format responses beautifully with Markdown (tables, bullet points, bold text).

---

# VoiceShield – AI Anti-Spoofing for Telephony
(Production Site: https://voiceshield-live.vercel.app)

### Project Overview
VoiceShield is a real-time, AI-driven console that detects synthetic-voice (voice-cloning) attacks on telephone networks, especially for Indian telecom and BFSI (bank-finance-insurance) sectors. It is built for the Smart India Hackathon 2026 problem SIH26104 (AICTE Cyber-Security Cell).

### Core Capabilities
- **Sub-250 ms latency**: Detection happens almost instantly, keeping conversations fluid.
- **Zero raw-audio persistence**: Audio never touches disk (STORE_RAW_AUDIO = false), meeting DPDP-2023 compliance.
- **Streaming WebSocket inference**: Audio is sent in tiny PCM-16 windows over a secure WebSocket (/ws/audio) and evaluated on-the-fly.
- **Explainable AI spectrograms**: Heat-maps surface plain-English markers (e.g., "high-frequency energy", "phase variance") so analysts can see *why* a sample is flagged.
- **Multilingual challenge-response**: Random phonemic phrases in Hindi, Tamil, and English are generated (GET /api/challenges) - clones can't answer them in real time.
- **Resilient jittered fallback**: A 4-second circular buffer absorbs packet loss; playback resumes seamlessly.
- **Append-only RLS audit trail**: Every event (detection, connection drop, auth challenge) is logged in Supabase PostgreSQL with strict Row-Level Security.
- **Hybrid DSP + deep-attention model**: Combines LFCC, mel-spectrogram, phase-inconsistency, high-frequency anomaly, and prosody markers with the TorchScript-compiled AASIST model (CPU-only by default).

### Application Architecture
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS.
- **Backend**: FastAPI (Python) -> TorchScript-compiled AASIST model, NumPy/SciPy, librosa.
- **Data / Auth**: Supabase (PostgreSQL) with Row-Level Security.
- **Streaming**: Web Audio API + WebSocket (WSS).
- **Deployment**: Vercel (frontend) + Railway (FastAPI API).

### Operational Compliance
- **DPDP Act 2023**: No raw audio is stored; all processing stays in RAM.
- **Human-in-the-loop**: The system is a decision-support tool, not a replacement for manual review.
- **Auditability**: Every detection event is immutable-logged for forensic and regulatory purposes.

Conclude your answers by offering deeper technical details (e.g., API usage, demo walkthrough, or forensic report generation) if the user wishes to explore further.
`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The AI assistant is not configured. Set GROQ_API_KEY on the server." },
      { status: 503 }
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = body.messages;
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > 12 ||
    messages.some(
      (message) =>
        !message ||
        (message.role !== "user" && message.role !== "assistant") ||
        typeof message.content !== "string" ||
        message.content.trim().length === 0 ||
        message.content.length > 4000
    )
  ) {
    return NextResponse.json({ error: "Provide 1–12 valid chat messages." }, { status: 400 });
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_CHAT_MODEL || DEFAULT_MODEL,
      temperature: 0.2,
      max_tokens: 700,
      messages: [
        { role: "system", content: REPOSITORY_CONTEXT },
        ...messages.map(({ role, content }) => ({ role, content: content.trim() })),
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Groq chatbot request failed:", response.status, detail.slice(0, 500));
    return NextResponse.json(
      { error: "The assistant could not complete that response. Please try again." },
      { status: 502 }
    );
  }

  const result = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const answer = result.choices?.[0]?.message?.content?.trim();
  if (!answer) {
    return NextResponse.json({ error: "The assistant returned an empty response." }, { status: 502 });
  }

  return NextResponse.json({ answer });
}
