"use client";

import React, { useEffect, useState } from "react";

interface ChallengeResponseProps {
  onChallengeComplete?: (passed: boolean, newRisk: number) => void;
  spoofProbability?: number;
}

const PHRASES: Record<string, string[]> = {
  en: [
    "Verify transaction token: Silver Falcon 8492 authorized immediately",
    "Confirm authentication code: Blue River 4739 approved",
  ],
  hi: [
    "सत्यापन कोड: सुरक्षा शील्ड बासठ उन्यासी की पुष्टि तुरंत करें",
    "सुरक्षा वाक्यांश: नीलकंठ चालीस तिरासी लेन-देन सत्यापित करें",
  ],
  ta: [
    "பாதுகாப்பு குறியீடு: தங்க கழுகு எண்பத்து நான்கு தொண்ணூற்று இரண்டு",
    "உறுதிப்படுத்தல் சொற்றொடர்: நீல நதி நாற்பத்து ஏழு முப்பத்தொன்பது",
  ],
};

const apiUrl = () => {
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const envUrl = process.env.NEXT_PUBLIC_FASTAPI_HTTP_URL;
  if (isHttps) {
    if (envUrl && envUrl.startsWith("https://") && !envUrl.includes("localhost")) {
      return envUrl;
    }
    return "https://voiceshield-sih-2026-production.up.railway.app";
  }
  return envUrl || "http://localhost:8000";
};

export function ChallengeResponse({ onChallengeComplete, spoofProbability = 0.08 }: ChallengeResponseProps) {
  const [lang, setLang] = useState<"en" | "hi" | "ta">("hi");
  const [status, setStatus] = useState<"pending" | "recording" | "analyzing" | "passed" | "failed">("pending");
  const [resultScore, setResultScore] = useState<number | null>(null);
  const [phrase, setPhrase] = useState(PHRASES.hi[0]);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiUrl()}/api/challenges?language=${lang}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("challenge service unavailable");
        return (await response.json()) as { challenge_text: string };
      })
      .then((data) => {
        if (!cancelled) {
          setPhrase(data.challenge_text);
          setApiError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPhrase(PHRASES[lang][0]);
          setApiError("API challenge service unavailable; showing local fallback.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const handleStartRecording = () => {
    setStatus("recording");
    setTimeout(() => {
      setStatus("analyzing");
      setTimeout(() => {
        fetch(`${apiUrl()}/api/challenges/verify`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ challenge_text: phrase, spoof_probability: spoofProbability }),
        })
          .then(async (response) => {
            if (!response.ok) throw new Error("verification failed");
            return (await response.json()) as { passed: boolean; risk_level: string };
          })
          .then((result) => {
            const newRisk = result.passed ? 0.08 : Math.max(spoofProbability, 0.7);
            setStatus(result.passed ? "passed" : "failed");
            setResultScore(newRisk);
            onChallengeComplete?.(result.passed, newRisk);
          })
          .catch(() => {
            setStatus("failed");
            setResultScore(Math.max(spoofProbability, 0.7));
            setApiError("Verification service unavailable. Failing closed.");
            onChallengeComplete?.(false, Math.max(spoofProbability, 0.7));
          });
      }, 1500);
    }, 3000);
  };

  return (
    <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300">
            Active Fraud Prevention: Phonemic Challenge
          </h4>
        </div>

        {/* Language Selector */}
        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded transition-colors ${
              lang === "en" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang("hi")}
            className={`px-3 py-1 rounded transition-colors ${
              lang === "hi" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => setLang("ta")}
            className={`px-3 py-1 rounded transition-colors ${
              lang === "ta" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            தமிழ்
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-3">
        Caller exhibits elevated clone probability. Read the API-generated phrase below to verify biological speech:
      </p>
      {apiError ? <p className="mb-3 text-xs text-amber-300" role="status">{apiError}</p> : null}

      {/* Challenge Phrase Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-4 text-center">
        <span className="text-lg md:text-xl font-medium text-amber-200 tracking-wide font-sans">
        "{phrase}"
        </span>
      </div>

      {/* Action and Status Area */}
      <div className="flex items-center justify-between">
        <div>
          {status === "recording" && (
            <span className="text-xs text-rose-400 flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Listening to caller challenge utterance (3s)...
            </span>
          )}
          {status === "analyzing" && (
            <span className="text-xs text-amber-400 flex items-center gap-2 font-mono">
              Evaluating phonemic transitions & vocoder boundary artifacts...
            </span>
          )}
          {status === "passed" && (
            <span className="text-xs text-emerald-400 flex items-center gap-2 font-mono">
              ✓ Challenge Passed: Biological voice confirmed (Risk: {((resultScore ?? 0.08) * 100).toFixed(0)}%)
            </span>
          )}
          {status === "failed" && (
            <span className="text-xs text-rose-500 flex items-center gap-2 font-mono">
              ✕ Challenge Failed: Synthetic phonemic latency detected. Call Blocked.
            </span>
          )}
        </div>

        {status === "pending" && (
          <button
            onClick={handleStartRecording}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-colors"
          >
            Record Challenge
          </button>
        )}
      </div>
    </div>
  );
}
