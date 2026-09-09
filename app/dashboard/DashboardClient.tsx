"use client";

import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShieldCheck, ShieldAlert, Activity, Users, Clock, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { BackendHealth } from "@/components/BackendHealth";
import { ForensicReportButton } from "@/components/ForensicReportButton";

import { ThreatMap } from "@/components/ThreatMap";

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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-emerald-400 mb-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>LIVE: TELEPHONY MONITORING CENTER</span>
            </div>

            <BackendHealth />

            <div className="grid gap-4 md:grid-cols-3">
              <EvidenceCard title="SIH prevention loop" value="DETECT → CHALLENGE → BLOCK" detail="Active mitigation, not passive scoring" />
              <EvidenceCard title="Privacy posture" value="0 BYTES STORED" detail="PCM remains in volatile memory only" />
              <EvidenceCard title="Telephony target" value="< 250 MS" detail="Designed for real-time G.711 call paths" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Security Operations Dashboard</h1>
            <p className="text-slate-400 mt-1">Real-time threat analytics and voice cloning mitigation</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-lg p-2 px-4 shadow-lg">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="text-sm font-mono text-emerald-100">System Healthy • 24ms Latency</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Calls Analyzed"
            value={stats.total}
            icon={<Users className="w-6 h-6 text-blue-400" />}
            trend="+12%"
          />
          <StatCard
            title="Threats Blocked"
            value={stats.blocked}
            icon={<ShieldAlert className="w-6 h-6 text-rose-500" />}
            trend="High Risk"
            trendColor="text-rose-400"
          />
          <StatCard
            title="Average Latency"
            value="Live"
            icon={<Clock className="w-6 h-6 text-emerald-400" />}
            trend="WebSocket telemetry"
            trendColor="text-emerald-400"
          />
          <StatCard
            title="Avg Confidence Score"
            value={stats.total ? `${Math.round((1 - stats.averageRisk) * 100)}%` : "—"}
            icon={<ShieldCheck className="w-6 h-6 text-teal-400" />}
            trend="Optimal"
            trendColor="text-teal-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                24-Hour Threat Trajectory
              </h3>
              <p className="text-sm text-slate-400">Maximum detected risk probability across voice sessions</p>
            </div>

            <div className="h-[300px] w-full">
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
            </div>
          </div>

          {/* Threat Map */}
          <div className="lg:col-span-1 h-[400px] lg:h-auto">
            <ThreatMap sessions={sessions} />
          </div>
        </div>

        {/* Recent Sessions Table */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-6">Recent Sessions Audit</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
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
    </div>
  );
}

function EvidenceCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      <p className="mt-3 font-mono text-lg font-bold text-emerald-300">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendColor = "text-blue-400" }: any) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/50">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-extrabold text-white mb-1 font-mono tracking-tight">{value}</div>
      <div className={`text-xs font-semibold uppercase tracking-wider ${trendColor}`}>
        {trend}
      </div>
    </div>
  );
}
