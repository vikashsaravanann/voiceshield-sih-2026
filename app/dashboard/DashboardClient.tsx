"use client";

import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShieldCheck, ShieldAlert, Activity, Users, Clock, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { BackendHealth } from "@/components/BackendHealth";
import { ForensicReportButton } from "@/components/ForensicReportButton";
import { I4CReportButton } from "@/components/I4CReportButton";
import { TwilioPhonePanel } from "@/components/TwilioPhonePanel";
import { ThreatMap } from "@/components/ThreatMap";
import { LiveAlertToast } from "@/components/LiveAlertToast";
import { LiveStatsBar } from "@/components/LiveStatsBar";
import { RealtimeSessionFeed } from "@/components/RealtimeSessionFeed";

export default function DashboardClient({ sessions, stats }: { sessions: any[]; stats: any }) {
  // Process sessions for the chart (grouping by hour or just mapping them over time)
  const chartData = useMemo(() => {
    // Reverse sessions so they are chronological
    const sorted = [...sessions].sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime());
    return sorted.map((s, i) => {
      const date = new Date(s.started_at);
      return {
        name: `${date.getHours()}:00`,
        risk: s.risk_summary?.max_risk ? Math.round(s.risk_summary.max_risk * 100) : 0,
        status: s.status,
      };
    });
  }, [sessions]);

  return (
    <>
      <LiveAlertToast />
      <div className="min-h-screen bg-[#030712] px-3 pb-8 pt-20 text-slate-100 font-sans sm:px-5 sm:pb-10 sm:pt-24 lg:px-8 lg:pt-28">
        <div className="mx-auto grid w-full max-w-none grid-cols-1 items-stretch gap-5 lg:gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
          
          <div className="min-w-0 space-y-5 sm:space-y-6 lg:space-y-7">
            {/* Header */}
            <div className="grid gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/35 p-4 shadow-xl backdrop-blur-xl sm:p-5 lg:grid-cols-[1fr_auto] lg:items-start lg:p-6">
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-mono font-medium uppercase tracking-[0.16em] text-emerald-400 sm:text-xs">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span>LIVE: TELEPHONY MONITORING CENTER</span>
                </div>

                <h1 className="mt-1 max-w-3xl text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">Security Operations Dashboard</h1>
                <p className="mt-2 max-w-2xl text-[11px] uppercase tracking-[0.12em] text-slate-400 sm:text-xs">Real-time threat analytics and voice-cloning mitigation</p>
              </div>
              <div className="flex w-fit items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-950/20 px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-100 sm:justify-self-end sm:px-4 sm:text-xs">
                <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                <BackendHealth compact />
              </div>
            </div>

            <BackendHealth />

            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              <EvidenceCard title="SIH prevention loop" value="Detect → Challenge → Block" detail="Active mitigation, not passive scoring" />
              <EvidenceCard title="Privacy posture" value="0 bytes stored" detail="PCM remains in volatile memory only" />
              <EvidenceCard title="Telephony target" value="< 250 ms" detail="Designed for real-time G.711 call paths" />
            </div>

            <LiveStatsBar />

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <StatCard
                title="TOTAL CALLS ANALYZED"
                value={stats.total}
                icon={<Users className="w-6 h-6 text-blue-400" />}
                trend="Today"
              />
              <StatCard
                title="THREATS BLOCKED"
                value={stats.blocked}
                icon={<ShieldAlert className="w-6 h-6 text-rose-500" />}
                trend="High Risk"
                trendColor="text-rose-400"
              />
              <StatCard
                title="AVERAGE LATENCY"
                value={stats.averageLatency ? `${Math.round(stats.averageLatency)}ms` : "—"}
                icon={<Clock className="w-6 h-6 text-emerald-400" />}
                trend="Recorded inference latency"
                trendColor="text-emerald-400"
              />
              <StatCard
                title="AVG CONFIDENCE SCORE"
                value={stats.total ? `${Math.round((1 - stats.averageRisk) * 100)}%` : "—"}
                icon={<ShieldCheck className="w-6 h-6 text-teal-400" />}
                trend="Optimal"
                trendColor="text-teal-400"
              />
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
              {/* Main Chart */}
              <div className="min-w-0 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:col-span-2">
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-white sm:text-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    24-HOUR THREAT TRAJECTORY
                  </h3>
                  <p className="text-[10px] font-mono uppercase tracking-wide text-slate-400 sm:text-xs">Maximum detected risk probability across voice sessions</p>
                </div>

                <div className="h-[240px] w-full sm:h-[300px]">
                  {chartData.length === 0 ? (
                    <div className="grid h-full place-items-center rounded-xl border border-dashed border-slate-800 bg-slate-950/30 px-6 text-center">
                      <div>
                        <p className="font-mono text-sm text-slate-400">No voice sessions recorded yet</p>
                        <p className="mt-2 text-xs text-slate-600">Start the live demo to populate real threat telemetry.</p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px' }}
                        itemStyle={{ color: '#ef4444' }}
                      />
                      <Area type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Threat Map */}
              <div className="h-[340px] min-w-0 sm:h-[400px] lg:col-span-1 lg:h-auto">
                <ThreatMap sessions={sessions} />
              </div>
            </div>

            {/* Twilio Phone Status */}
            <TwilioPhonePanel />

            {/* Recent Sessions Table */}
            <div className="min-w-0 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-xl sm:mt-1 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white sm:text-lg">Recent Sessions Audit</h3>
                  <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">Latest detection records</p>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-[10px] font-mono text-slate-400">{sessions.length} records</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                      <th className="pb-3 px-4 font-semibold">Session ID</th>
                      <th className="pb-3 px-4 font-semibold">Time</th>
                      <th className="pb-3 px-4 font-semibold">Max Risk</th>
                      <th className="pb-3 px-4 font-semibold">Status</th>
                      <th className="pb-3 px-4 font-semibold">Client</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {sessions.map((session) => {
                      const maxRisk = session.risk_summary?.max_risk ? Math.round(session.risk_summary.max_risk * 100) : 0;
                      const isBlocked = session.status === 'flagged' || session.risk_summary?.decision === 'blocked';

                      return (
                        <tr key={session.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                          <td className="py-4 px-4 font-mono text-slate-300">{session.id.split('-')[0]}</td>
                          <td className="py-4 px-4 text-slate-400">
                            {formatDistanceToNow(new Date(session.started_at), { addSuffix: true })}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                  className={`h-full ${isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${Math.max(maxRisk, 5)}%` }}
                                />
                              </div>
                              <span className={`font-mono ${isBlocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {maxRisk}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                              isBlocked ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {isBlocked ? 'Blocked' : 'Clean'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-500 font-mono text-xs">
                            <div className="flex items-center gap-2">
                              <span>{session.client_info?.browser || 'Unknown'} / {session.client_info?.os || 'Unknown'}</span>
                              <ForensicReportButton session={session} />
                              <I4CReportButton session={session} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {sessions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No sessions recorded yet. Run the live demo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Realtime Session Feed */}
          <div className="min-w-0 xl:h-full">
            <RealtimeSessionFeed />
          </div>

        </div>
      </div>
    </>
  );
}

function EvidenceCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="flex min-h-[124px] flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</p>
      <p className="mt-3 break-words font-mono text-sm font-bold uppercase leading-relaxed text-emerald-300 sm:text-base">{value}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{detail}</p>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendColor = "text-blue-400" }: any) {
  return (
    <div className="min-h-[142px] rounded-xl border border-slate-800 bg-slate-900/60 p-3 shadow-lg backdrop-blur-md sm:p-5">
      <div className="flex items-start justify-between mb-2">
        <span className="max-w-[9rem] text-[10px] font-semibold uppercase leading-tight tracking-wider text-slate-400 sm:text-xs">{title}</span>
        <div className="hidden rounded-lg border border-slate-800/50 bg-slate-950 p-2 sm:block">
          {icon}
        </div>
      </div>
      <div className="mb-1 text-2xl font-extrabold tracking-tight text-white font-mono sm:text-3xl">{value}</div>
      <div className={`text-[10px] font-semibold uppercase tracking-wider ${trendColor}`}>
        {trend}
      </div>
    </div>
  );
}
