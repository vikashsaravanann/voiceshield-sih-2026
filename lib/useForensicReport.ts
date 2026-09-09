"use client";

import { useCallback } from "react";
import jsPDF from "jspdf";

interface ForensicReportData {
  sessionId: string;
  timestamp: string;
  riskScore: number;
  riskLevel: string;
  transcript?: string;
  detectedLanguage?: string;
  originLocation?: string;
  decision: string;
  reason?: string;
  dspMarkers?: { feature: string; value: string | number; anomaly: boolean }[];
  latencyMs?: number;
}

export function useForensicReport() {
  const generateReport = useCallback((data: ForensicReportData) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();

    // ── BACKGROUND ──────────────────────────────────────────────────────────
    // Deep navy background (like the MLSA PDF)
    doc.setFillColor(5, 12, 30);
    doc.rect(0, 0, W, H, "F");

    // Subtle grid lines for tech aesthetic
    doc.setDrawColor(20, 40, 80);
    doc.setLineWidth(0.1);
    for (let x = 0; x < W; x += 10) doc.line(x, 0, x, H);
    for (let y = 0; y < H; y += 10) doc.line(0, y, W, y);

    // ── LEFT ACCENT BAR ──────────────────────────────────────────────────────
    doc.setFillColor(0, 200, 150); // Emerald/Cyan accent
    doc.rect(0, 0, 6, H, "F");

    // ── TOP HEADER BAND ──────────────────────────────────────────────────────
    doc.setFillColor(8, 20, 50);
    doc.rect(6, 0, W - 6, 55, "F");

    // Header top accent line
    doc.setFillColor(0, 200, 150);
    doc.rect(6, 0, W - 6, 1.5, "F");

    // ── LOGO AREA ────────────────────────────────────────────────────────────
    // Shield icon placeholder (drawn as polygon)
    const shieldX = 18;
    const shieldY = 8;
    doc.setFillColor(0, 200, 150);
    doc.roundedRect(shieldX, shieldY, 16, 18, 2, 2, "F");
    doc.setFillColor(5, 12, 30);
    doc.roundedRect(shieldX + 3, shieldY + 3, 10, 12, 1, 1, "F");
    doc.setFillColor(0, 200, 150);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(5, 12, 30);
    doc.text("VS", shieldX + 5.2, shieldY + 11.5);

    // ── TITLE BLOCK ──────────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("VOICESHIELD", 40, 18);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 200, 150);
    doc.text("FORENSIC INCIDENT REPORT", 40, 25);

    doc.setFontSize(7);
    doc.setTextColor(130, 160, 200);
    doc.text("Smart India Hackathon 2026  |  Problem ID: SIH26104  |  AICTE Cyber Security Cell", 40, 31);
    doc.text("voiceshield-team/voiceshield-sih-2026  |  Powered by Groq LPU + FastAPI", 40, 36);

    // ── CLASSIFICATION BADGE ─────────────────────────────────────────────────
    const badgeColor = data.decision === "blocked" ? [200, 30, 30] : [0, 150, 100];
    doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
    doc.roundedRect(W - 55, 9, 46, 14, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    const badgeText = data.decision === "blocked" ? "⚠  THREAT BLOCKED" : "✓  CALL CLEARED";
    doc.text(badgeText, W - 50, 18, { align: "left" });

    // ── REPORT META ──────────────────────────────────────────────────────────
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(130, 160, 200);
    doc.text(`Report Generated: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`, W - 10, 30, { align: "right" });
    doc.text(`Case Reference: VS-${data.sessionId?.substring(0, 8)?.toUpperCase() ?? "N/A"}`, W - 10, 35, { align: "right" });

    // ── DIVIDER ───────────────────────────────────────────────────────────────
    doc.setDrawColor(0, 200, 150);
    doc.setLineWidth(0.5);
    doc.line(10, 57, W - 10, 57);

    // ── SECTION HELPER ────────────────────────────────────────────────────────
    let curY = 65;
    const sectionTitle = (title: string, icon: string) => {
      doc.setFillColor(10, 25, 60);
      doc.roundedRect(10, curY - 5, W - 20, 10, 2, 2, "F");
      doc.setFillColor(0, 200, 150);
      doc.rect(10, curY - 5, 3, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(0, 200, 150);
      doc.text(`${icon}  ${title}`, 16, curY + 1.5);
      curY += 14;
    };

    const infoRow = (label: string, value: string, highlight = false) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(130, 160, 200);
      doc.text(label, 14, curY);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      const textColor = highlight ? [255, 80, 80] : [220, 240, 255];
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(value || "N/A", 80, curY);
      curY += 7;
    };

    // ── SECTION 1: INCIDENT OVERVIEW ─────────────────────────────────────────
    sectionTitle("INCIDENT OVERVIEW", "◈");
    infoRow("Session ID:", data.sessionId ?? "N/A");
    infoRow("Timestamp (IST):", new Date(data.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
    infoRow("Detection Latency:", `${data.latencyMs?.toFixed(1) ?? "—"} ms`);
    infoRow("Origin Location (Est.):", data.originLocation ?? "Unknown");
    infoRow("Detected Language:", data.detectedLanguage ?? "English");
    curY += 4;

    // ── SECTION 2: RISK ASSESSMENT ───────────────────────────────────────────
    sectionTitle("AI RISK ASSESSMENT", "◈");

    // Risk Score Bar
    const riskPct = Math.round(data.riskScore * 100);
    const barX = 14;
    const barW = W - 28;
    const barH = 8;
    doc.setFillColor(20, 40, 80);
    doc.roundedRect(barX, curY, barW, barH, 2, 2, "F");
    const fillColor =
      riskPct >= 75 ? [200, 30, 30] : riskPct >= 40 ? [220, 140, 0] : [0, 180, 120];
    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    doc.roundedRect(barX, curY, Math.max((barW * riskPct) / 100, 4), barH, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(`${riskPct}% RISK`, barX + 3, curY + 5.5);
    doc.text(`Risk Level: ${data.riskLevel?.toUpperCase() ?? "UNKNOWN"}`, W - 14, curY + 5.5, { align: "right" });
    curY += 14;

    infoRow("Final Decision:", data.decision?.toUpperCase() ?? "—", data.decision === "blocked");
    infoRow("Decision Reason:", data.reason ?? "Acoustic anomaly detected");
    curY += 4;

    // ── SECTION 3: DSP ANOMALIES ──────────────────────────────────────────────
    sectionTitle("ACOUSTIC FINGERPRINT (DSP MARKERS)", "◈");
    if (data.dspMarkers && data.dspMarkers.length > 0) {
      data.dspMarkers.forEach((marker) => {
        const isAnomaly = marker.anomaly;
        doc.setFillColor(isAnomaly ? 60 : 15, isAnomaly ? 10 : 35, isAnomaly ? 10 : 65);
        doc.roundedRect(14, curY - 4, W - 28, 8, 1.5, 1.5, "F");
        if (isAnomaly) {
          doc.setFillColor(200, 30, 30);
          doc.roundedRect(14, curY - 4, 2, 8, 1, 1, "F");
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        const markerColor = isAnomaly ? [255, 140, 140] : [180, 210, 255];
        doc.setTextColor(markerColor[0], markerColor[1], markerColor[2]);
        doc.text(marker.feature, 19, curY + 1);
        doc.setFont("helvetica", "bold");
        const valueColor = isAnomaly ? [255, 80, 80] : [0, 220, 150];
        doc.setTextColor(valueColor[0], valueColor[1], valueColor[2]);
        const valStr = typeof marker.value === "number" ? marker.value.toFixed(2) : String(marker.value);
        doc.text(valStr, W - 40, curY + 1, { align: "right" });
        doc.setFontSize(6.5);
        const statusColor = isAnomaly ? [255, 60, 60] : [80, 180, 120];
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.text(isAnomaly ? "⚠ ANOMALY" : "✓ NORMAL", W - 14, curY + 1, { align: "right" });
        curY += 10;
      });
    }
    curY += 4;

    // ── SECTION 4: TRANSCRIPT ─────────────────────────────────────────────────
    sectionTitle("CALL TRANSCRIPT (GROQ WHISPER)", "◈");
    const transcriptText = data.transcript ?? "No transcript captured. Audio was processed in ephemeral memory and destroyed per DPDP Act compliance.";
    doc.setFillColor(10, 25, 60);
    doc.roundedRect(14, curY - 2, W - 28, 28, 2, 2, "F");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(200, 220, 255);
    const lines = doc.splitTextToSize(`"${transcriptText}"`, W - 36);
    doc.text(lines.slice(0, 4), 18, curY + 5);
    curY += 32;

    // ── FOOTER ────────────────────────────────────────────────────────────────
    doc.setFillColor(8, 20, 50);
    doc.rect(6, H - 22, W - 6, 22, "F");
    doc.setDrawColor(0, 200, 150);
    doc.setLineWidth(0.4);
    doc.line(10, H - 22, W - 10, H - 22);

    // Footer left
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(0, 200, 150);
    doc.text("VoiceShield", 14, H - 14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 140, 190);
    doc.text("Detect the clone. Protect the conversation.", 14, H - 9);

    // Footer right
    doc.setTextColor(80, 120, 170);
    doc.text("I4C / AICTE Cyber Security Cell", W - 14, H - 14, { align: "right" });
    doc.text("DPDP Compliant — No PCM audio retained", W - 14, H - 9, { align: "right" });

    // Page number
    doc.setFontSize(6.5);
    doc.setTextColor(60, 90, 140);
    doc.text("Page 1 of 1  |  Confidential Forensic Evidence", W / 2, H - 4, { align: "center" });

    // ── WATERMARK DIAGONAL ────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(52);
    doc.setTextColor(12, 28, 65);
    doc.text("VOICESHIELD", W / 2, H / 2 + 10, { align: "center", angle: 35 });

    // SAVE
    const filename = `VoiceShield_Forensic_Report_${data.sessionId?.substring(0, 8)?.toUpperCase() ?? "CASE"}_${Date.now()}.pdf`;
    doc.save(filename);
  }, []);

  return { generateReport };
}
