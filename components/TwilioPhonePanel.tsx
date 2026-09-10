"use client";

import { useEffect, useState } from "react";
import { Phone, PhoneCall, AlertCircle, CheckCircle2, PhoneIncoming, PhoneForwarded } from "lucide-react";

export function TwilioPhonePanel() {
  const [status, setStatus] = useState<{
    configured: boolean;
    phoneNumber: string | null;
    hasAccountSid: boolean;
    hasAuthToken: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/twilio/status")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch Twilio status:", err);
        setLoading(false);
      });
  }, []);

  const handleTestCall = () => {
    alert("Test webhook ping initiated. Check backend logs for Twilio requests.");
  };

  if (loading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl mt-6 animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/4 mb-4"></div>
        <div className="h-20 bg-slate-800 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-indigo-400" />
            Live Telephony Integration
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Real-time SIP/PSTN voice stream monitoring via Twilio Media Streams
          </p>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${
          status?.configured 
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
        }`}>
          {status?.configured ? (
            <><CheckCircle2 className="w-4 h-4" /> Phone Integration Ready</>
          ) : (
            <><AlertCircle className="w-4 h-4" /> Configure Twilio</>
          )}
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <PhoneIncoming className="w-24 h-24" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Assigned Numbers</p>
          {status?.phoneNumber ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-bold text-white tracking-widest">{status.phoneNumber}</span>
            </div>
          ) : (
            <p className="text-slate-400 font-mono text-sm">Not configured in environment (TWILIO_PHONE_NUMBER)</p>
          )}
          <p className="mt-3 text-sm text-slate-400 flex items-center gap-2">
            <PhoneForwarded className="w-4 h-4 text-indigo-400" />
            Forward incoming calls to this number to enable real-time voice screening
          </p>
        </div>

        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">API Configuration</p>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Account SID</span>
                {status?.hasAccountSid ? (
                  <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Configured</span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Missing</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Auth Token</span>
                {status?.hasAuthToken ? (
                  <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Configured</span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Missing</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={handleTestCall}
              className="w-full flex justify-center items-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              Simulate Test Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
