"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function UserMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [judgeDemo, setJudgeDemo] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? (user.user_metadata?.email || "operator@voiceshield.internal"));
      } else if (document.cookie.includes("voiceshield_judge_demo=1")) {
        setEmail("judge.demo@voiceshield.local");
        setJudgeDemo(true);
      }
      setLoading(false);
    };
    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
  await supabase.auth.signOut();
    document.cookie = "voiceshield_judge_demo=; path=/; max-age=0; SameSite=Lax";
  router.push("/login");
    router.refresh();
  };

  if (loading) return <div className="h-10 w-10 animate-pulse bg-slate-800 rounded-full" />;
  if (!email) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-colors"
      >
        <span className="text-sm font-medium text-slate-300">
          {email.charAt(0).toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800/80 bg-slate-900/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-800/80">
            <p className="text-xs text-slate-400 font-mono tracking-wider mb-1">SIGNED IN AS</p>
            <p className="text-sm font-medium text-slate-200 truncate" title={email}>{email}</p>
            {judgeDemo && <p className="mt-1 text-[10px] uppercase tracking-wider text-amber-300">Read-only judge demo</p>}
          </div>
          <div className="p-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
