"use client";

import { useState } from "react";

export function AlertSettings() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/alert-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          whatsapp_enabled: whatsappEnabled,
          sms_enabled: smsEnabled,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }

      setMessage("Settings saved successfully.");
    } catch (error: any) {
      setMessage(error.message || "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6 text-slate-100">
      <h2 className="font-sans text-xl font-bold mb-6">Threat Alert Settings</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-sans tracking-widest text-slate-400 mb-2 uppercase">
            Alert Phone Number
          </label>
          <div className="flex relative items-center">
            <span className="absolute left-3 text-lg" aria-hidden="true">
              🇮🇳
            </span>
            <span className="absolute left-10 text-slate-400 font-mono">+91</span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="98765 43210"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-20 pr-4 font-mono text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/30 cursor-pointer">
            <div>
              <div className="font-sans font-medium text-slate-200">WhatsApp Alerts</div>
              <div className="text-sm font-sans text-slate-500">Receive rich threat alerts via WhatsApp</div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={whatsappEnabled}
                onChange={(e) => setWhatsappEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </div>
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/30 cursor-pointer">
            <div>
              <div className="font-sans font-medium text-slate-200">SMS Alerts</div>
              <div className="text-sm font-sans text-slate-500">Fallback text messages (carrier rates may apply)</div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={smsEnabled}
                onChange={(e) => setSmsEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </div>
          </label>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-sm font-mono text-emerald-400">
            {message}
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-medium rounded-xl active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}
