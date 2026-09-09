"use client";

import React, { useState } from "react";

interface ChallengeResponseProps {
  onChallengeComplete?: (passed: boolean, newRisk: number) => void;
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

export function ChallengeResponse({ onChallengeComplete }: ChallengeResponseProps) {
  const [lang, setLang] = useState<"en" | "hi" | "ta">("hi");
  const [status, setStatus] = useState<"pending" | "recording" | "analyzing" | "passed" | "failed">("pending");
  const [resultScore, setResultScore] = useState<number | null>(null);

  const currentPhrase = PHRASES[lang][0];

  const handleStartRecording = () => {
    setStatus("recording");
    // Simulate active challenge analysis after 3 seconds of caller response
    setTimeout(() => {
      setStatus("analyzing");
      setTimeout(() => {
        // Evaluate: Genuine caller passes with low risk
        const passed = true;
        const newRisk = 0.08;
        setStatus(passed ? "passed" : "failed");
        setResultScore(newRisk);
        onChallengeComplete?.(passed, newRisk);
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
        Caller exhibits high probability of voice cloning. Request the caller read the dynamic phonetic phrase below:
      </p>

      {/* Challenge Phrase Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-4 text-center">
        <span className="text-lg md:text-xl font-medium text-amber-200 tracking-wide font-sans">
          "{currentPhrase}"
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
