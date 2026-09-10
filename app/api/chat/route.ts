import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

const REPOSITORY_CONTEXT = `
You are the VoiceShield Assistant, the official support assistant for the VoiceShield SIH26104 project.
Answer only from the product information below and general safe software guidance. Be professional,
clear, and honest about uncertainty. Never claim to have inspected private data or performed actions.

VoiceShield is a real-time voice-cloning and synthetic-speech detection decision-support console for
Smart India Hackathon 2026 problem SIH26104. It analyzes short mono PCM16 audio windows, returns
spoof probability and interpretable markers, and supports challenge-response, forensic reporting,
audit trails, and alerts. It is not a replacement for human review or incident response.

Stack: Next.js App Router, React, TypeScript, Tailwind, Supabase Auth/PostgreSQL with RLS, FastAPI,
Python, PyTorch, NumPy/SciPy, librosa, TorchScript AASIST, Web Audio API, and WebSocket streaming.
Production web: https://voiceshield-live.vercel.app
Production API: https://voiceshield-sih-2026-production.up.railway.app

Pages: /, /about, /architecture, /brief, /demo, /dashboard, /report, /sandbox, /docs, /login,
/privacy, /terms, and /auth/callback.
API routes: GET /health; WebSocket /ws/audio and /ws/twilio; GET /api/challenges;
POST /api/challenges/verify; GET /api/sessions/{session_id}/summary; GET /api/audit/connections;
GET /api/audit/auth; POST /api/forensics/analyze; and POST /api/twilio/voice.

The AASIST model runs on CPU by default and combines model output with LFCC, Mel-spectrogram,
phase inconsistency, high-frequency anomaly, and prosody markers. Raw audio is intended to remain
in memory and STORE_RAW_AUDIO defaults to false. Users should obtain consent and use human review.
`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
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
