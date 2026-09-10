import { NextResponse } from "next/server";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const DEFAULT_MODEL = "meta/llama-3.1-70b-instruct";

const REPOSITORY_CONTEXT = `
You are the VoiceShield Multi-Agent Copilot, the official enterprise assistant for the VoiceShield SIH26104 project.
You are powered by a swarm of specialized sub-agents:
1. Forensic Audio Agent: Analyzes DSP telemetry, LFCC extraction, and phase discontinuities.
2. Legal Compliance Agent: Ensures adherence to the DPDP Act and Bharatiya Sakshya Adhiniyam (Section 65B).
3. Network SecOps Agent: Manages Twilio SIP integration, WebSocket streaming, and I4C reporting.

Answer only from the product information below and general safe software guidance. Synthesize the knowledge of your sub-agents to provide a comprehensive, ultra-professional response.

PRODUCT:
VoiceShield is a real-time voice-cloning and synthetic-speech detection decision-support console for Smart India Hackathon 2026 problem SIH26104. It analyzes short mono PCM16 audio windows, returns spoof probability and interpretable markers, and supports operator workflows such as challenge-response, forensic reporting, audit trails, Twilio WhatsApp intercepts, and I4C government reporting.

STACK AND DEPLOYMENT:
- Web: Next.js App Router 15, React 19, TypeScript, Tailwind CSS, Lucide, Recharts, Framer Motion.
- Authentication and database: Supabase Auth and PostgreSQL with Row Level Security.
- Inference API: FastAPI, Python, PyTorch, NumPy, librosa, TorchScript AASIST model.
- Streaming: Web Audio API sends 16 kHz mono PCM16 over WebSocket in 333 ms windows.
- AI Engine: NVIDIA NIM (Nemotron-4-340B for XAI, Llama-3.1-70B for active verification challenges and this copilot).
- Integrations: Twilio (SIP / WhatsApp Alerts), Bhashini (Indic ASR), I4C (Mock Portal).
- Production web: https://voiceshield-live.vercel.app
- Production API: https://voiceshield-sih-2026-production.up.railway.app

WEB PAGES:
- /: landing page
- /about: project overview
- /architecture: technical architecture
- /brief: project brief
- /demo: live microphone detection
- /dashboard: authenticated session vault
- /report: forensic report workflow
- /sandbox: forensic audio analysis sandbox with I4C integration
- /docs: technical integration documentation
- /login: auth system

BACKEND ROUTES:
- GET /health: readiness
- WebSocket /ws/audio: live audio pipeline
- WebSocket /ws/twilio: telephony media streaming
- GET /api/challenges & POST /api/challenges/verify
- POST /api/forensics/report-i4c
- POST /api/twilio/voice

DETECTION AND PRIVACY:
Runs purely in memory to respect DPDP Act. Explains telemetry (High-Frequency Anomaly, Phase Discontinuity) via XAI.
`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  // Use user's NVIDIA Llama API key
  const apiKey = process.env.NVIDIA_API_KEY_LLAMA || "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";
  
  if (!apiKey) {
    return NextResponse.json(
      { error: "NVIDIA NIM API key is missing." },
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
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12) {
    return NextResponse.json({ error: "Provide 1–12 valid chat messages." }, { status: 400 });
  }

  const response = await fetch(NVIDIA_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0.3,
      max_tokens: 800,
      messages: [
        { role: "system", content: REPOSITORY_CONTEXT },
        ...messages.map(({ role, content }) => ({ role, content: content.trim() })),
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("NVIDIA chatbot request failed:", response.status, detail.slice(0, 500));
    return NextResponse.json(
      { error: "The Copilot could not complete that response. Please try again." },
      { status: 502 }
    );
  }

  const result = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const answer = result.choices?.[0]?.message?.content?.trim();
  if (!answer) {
    return NextResponse.json({ error: "The Copilot returned an empty response." }, { status: 502 });
  }

  return NextResponse.json({ answer });
}
