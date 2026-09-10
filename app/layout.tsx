import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { VoiceShieldAssistant } from "@/components/VoiceShieldAssistant";

export const metadata: Metadata = {
  metadataBase: new URL("https://voiceshield-live.vercel.app"),
  title: "VoiceShield | Anti-Spoofing",
  description:
    "Detect the clone. Protect the conversation. SIH 2026 SIH26104 — real-time detection of voice-cloning impersonation attacks.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: "VoiceShield",
    title: "VoiceShield | Anti-Spoofing",
    description:
      "Detect the clone. Protect the conversation. Real-time voice-cloning detection for SIH26104.",
    images: [{ url: "/banner.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceShield | Anti-Spoofing",
    description:
      "Detect the clone. Protect the conversation. Real-time voice-cloning detection for SIH26104.",
    images: ["/banner.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 
          TODO: Move to next/font/google instead of loading from CDN.
          I kept having layout shift issues with next/font, so for the hackathon
          I'm just loading these directly via standard tags.
        */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Shell>{children}</Shell>
        <VoiceShieldAssistant />
      </body>
    </html>
  );
}
