import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { VoiceShieldAssistant } from "@/components/VoiceShieldAssistant";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.logicintelligencetechnologies.in/voice-shield"),
  title: "VoiceShield | Anti-Spoofing",
  description:
    "Detect the clone. Protect the conversation. VoiceShield by Logic Intelligence Technologies — real-time voice-cloning detection.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: "VoiceShield",
    title: "VoiceShield | Anti-Spoofing",
    description:
      "Detect the clone. Protect the conversation. A Logic Intelligence Technologies product.",
    images: [{ url: "/banner.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceShield | Anti-Spoofing",
    description:
      "Detect the clone. Protect the conversation. A Logic Intelligence Technologies product.",
    images: ["/banner.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-[#030712] text-slate-100 antialiased">
        <Shell>{children}</Shell>
        <VoiceShieldAssistant />
      </body>
    </html>
  );
}
