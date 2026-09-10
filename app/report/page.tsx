"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { ShieldAlert, Send, FileDown, ArrowLeft, Building2, AlertTriangle, User, Phone, Mail, CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";
import { jsPDF } from "jspdf";

function ReportForm() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") || "UNKNOWN";
  const riskScore = searchParams.get("riskScore") || "98";
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    account: "",
    description: `I received a fraudulent call originating from a cloned/AI-generated voice attempting financial fraud. \n\nThe VoiceShield security system automatically detected severe vocoder anomalies and blocked the session.\n\nSession ID: ${sessionId}\nMax Risk Probability: ${riskScore}%`
  });

  const handleDownloadDraft = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("I4C CYBERCRIME FIR DRAFT", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Complainant Name: ${formData.name}`, 20, 50);
    doc.text(`Phone: ${formData.phone}`, 20, 60);
    doc.text(`Email: ${formData.email}`, 20, 70);
    doc.text(`Affected Account: ${formData.account || 'N/A'}`, 20, 80);
    
    doc.setFont("helvetica", "bold");
    doc.text("Incident Details:", 20, 100);
    
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(formData.description, 170);
    doc.text(splitDesc, 20, 110);
    
    doc.save(`FIR-Draft-${sessionId}.pdf`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      window.open(`https://cybercrime.gov.in/Webform/Index.aspx?subject=VoiceCloningFraud&session=${sessionId}`, '_blank');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">I4C Cybercrime Reporting</h1>
          </div>
          <p className="text-slate-400">Automated integration with Indian Cyber Crime Coordination Centre portal</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Complainant Details</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                      placeholder="Enter legal name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Phone Number
                    </label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                      placeholder="+91..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Email Address
                    </label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <CreditCard className="w-3 h-3" /> Bank Account (Optional)
                    </label>
                    <input 
                      type="text" 
                      value={formData.account}
                      onChange={e => setFormData({...formData, account: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                      placeholder="If financial loss occurred"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Incident Description</label>
                  <textarea 
                    rows={6}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex justify-center items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl p-3 font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit to I4C Portal <ExternalLink className="w-3 h-3" />
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={handleDownloadDraft}
                  className="flex-1 flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl p-3 font-semibold transition-all duration-200 active:scale-95 border border-slate-700"
                >
                  <FileDown className="w-5 h-5" />
                  Download FIR Draft
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" /> Evidence Bundle
              </h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Incident Type</p>
                  <p className="text-sm font-medium text-amber-400">AI Voice Cloning / Deepfake Fraud</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Session ID</p>
                  <p className="text-sm font-mono text-slate-300 break-all">{sessionId}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Date & Time</p>
                  <p className="text-sm font-mono text-slate-300">{new Date().toLocaleString()}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Risk Score</p>
                  <p className="text-xl font-bold font-mono text-rose-500">{riskScore}%</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  This report will be forwarded to the Cyber Crime Coordination Centre. False reporting is punishable under Section 182 of the Indian Penal Code.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030712] p-10 flex justify-center text-slate-400">Loading...</div>}>
      <ReportForm />
    </Suspense>
  );
}
