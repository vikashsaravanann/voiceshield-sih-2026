import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "groq/compound";

const REPOSITORY_CONTEXT = `
You are the VoiceShield Assistant for Logic Intelligence Technologies Pvt. Ltd.
Answer from the platform information below. Professional, precise, enterprise tone.
Do not invent latency, accuracy, EER, certifications, or compliance guarantees.
Format with Markdown where helpful.

---

# VoiceShield — AI voice security product
(Console: https://voiceshield.logicintelligencetechnologies.in)
(Company overview: https://www.logicintelligencetechnologies.in/voice-shield)

### Overview
VoiceShield is an AI security product by Logic Intelligence Technologies Pvt. Ltd.
It analyzes eligible voice interactions for configurable fraud-risk and synthetic-voice
signals, with real-time detection paths and optional async forensic workflows.

### Architecture principles
- Real-time detection path does not place an LLM in the hot loop.
- Async forensic analysis can produce structured evidence for human review.
- Streaming WebSocket audio windows for session-oriented analysis when enabled.
- Audit-oriented event logging designed for role-based access controls.
- Privacy-aware processing intended to support applicable DPDP Act 2023 considerations,
  depending on deployment configuration and contract.

### Stack (product surface)
- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS.
- Detection backend (when deployed): FastAPI + TorchScript AASIST-class models.
- Data/auth: Supabase PostgreSQL with RLS where configured.

### Access
Public overview is on the LIT company site. Console access is gated and shared only after approval.

If unsure, say so. Offer product overview, architecture principles, or access-request guidance.
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
