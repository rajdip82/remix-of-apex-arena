import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { motion } from "framer-motion";
import { tournaments, pendingPayments, platformStats, inr, shortInr } from "@/lib/mock-data";
import { TrendingUp, Wallet, Users, Activity, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard — TournamentX" }] }),
  component: Dashboard,
});

function Dashboard() {
  const kpis = [
    { icon: Wallet, label: "Gross Revenue", value: shortInr(847500), trend: "+12.4%" },
    { icon: Users, label: "Active Users", value: platformStats.dailyActive.toLocaleString('en-IN'), trend: "+5.2%" },
    { icon: Activity, label: "Registrations", value: "3,184", trend: "+18.6%" },
    { icon: Clock, label: "Pending Approvals", value: String(pendingPayments.length), trend: "live" },
  ];

  // Tiny inline sparkline
  const points = [22, 38, 30, 55, 42, 70, 62, 88, 75, 95, 84, 100];
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * 100} ${100 - p}`).join(" ");

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
            <div className="flex items-center justify-between">
              <k.icon className="h-5 w-5 text-accent" />
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">{k.trend}</span>
            </div>
            <p className="mt-3 font-display text-3xl">{k.value}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl">Revenue (Last 30 days)</h3>
              <p className="text-xs text-muted-foreground">Tournament entries + platform fees</p>
            </div>
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div className="mt-6 h-48">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF2E2E" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#FF2E2E" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${path} L 100 100 L 0 100 Z`} fill="url(#g)" />
              <path d={path} stroke="#FF2E2E" strokeWidth="0.8" fill="none" />
            </svg>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-display text-xl">Top Tournaments</h3>
          <div className="mt-4 space-y-3">
            {tournaments.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-black/30 p-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.filled}/{t.slots} · {t.game}</p>
                </div>
                <span className="text-gradient-primary font-display">{inr(t.prizePool)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 glass-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl">Pending Payment Approvals</h3>
          <CheckCircle2 className="h-5 w-5 text-warning" />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-[10px] uppercase tracking-widest text-muted-foreground"><th className="p-3">ID</th><th className="p-3">Tournament</th><th className="p-3">Captain</th><th className="p-3">Fee</th><th className="p-3 text-right">Actions</th></tr></thead>
            <tbody>
              {pendingPayments.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="p-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                  <td className="p-3 font-semibold">{p.tournament}</td>
                  <td className="p-3 text-muted-foreground">{p.captain}</td>
                  <td className="p-3 text-gradient-primary font-display">{inr(p.fee)}</td>
                  <td className="p-3 text-right space-x-2">
                    <button className="rounded-lg border border-success/40 bg-success/10 px-3 py-1 text-xs text-success">Approve</button>
                    <button className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-1 text-xs text-danger">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
