"use client";

import { LiveConsole } from "@/components/demo/LiveConsole";

/**
 * VoiceShield live operator console.
 * Full interactive UI lives in components/demo/LiveConsole.tsx
 * (mic stream, risk, challenge, reconnect). A Logic Intelligence Technologies product.
 */
export default function DemoPage() {
  return <LiveConsole />;
}
