import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { FileBarChart, Download, TrendingUp, Users, Trophy, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — TX Admin" }] }),
  component: AdminReports,
});

function AdminReports() {
  const [data, setData] = useState({
    totalRevenue: 0, totalPlayers: 0, tournamentCount: 0,
    gameBreakdown: [] as { game: string; count: number }[],
    statusBreakdown: [] as { status: string; count: number }[],
  });

  useEffect(() => {
    const load = async () => {
      const [{ data: tournaments }, { count: players }, { data: payments }] = await Promise.all([
        supabase.from("tournaments").select("game, status, entry_fee, filled_slots"),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("payment_submissions").select("amount").eq("payment_status", "approved"),
      ]);

      const totalRevenue = (payments ?? []).reduce((a, p) => a + (p.amount ?? 0), 0);

      const gameMap: Record<string, number> = {};
      const statusMap: Record<string, number> = {};
      (tournaments ?? []).forEach((t) => {
        gameMap[t.game] = (gameMap[t.game] ?? 0) + 1;
        statusMap[t.status] = (statusMap[t.status] ?? 0) + 1;
      });

      setData({
        totalRevenue,
        totalPlayers: players ?? 0,
        tournamentCount: (tournaments ?? []).length,
        gameBreakdown: Object.entries(gameMap).map(([game, count]) => ({ game, count })),
        statusBreakdown: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
      });
    };
    load();
  }, []);

  const downloadCSV = async () => {
    const { data: tournaments } = await supabase.from("tournaments").select("title, game, mode, status, prize_pool, entry_fee, total_slots, filled_slots, start_time");
    if (!tournaments) return;
    const rows = [
      ["Title", "Game", "Mode", "Status", "Prize Pool", "Entry Fee", "Total Slots", "Filled Slots", "Start Time"],
      ...tournaments.map((t) => [t.title, t.game, t.mode, t.status, t.prize_pool, t.entry_fee, t.total_slots, t.filled_slots, t.start_time]),
    ].map((r) => r.join(",")).join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "tournamentx-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const summaries = [
    { icon: Wallet, label: "Total Revenue", value: `₹${data.totalRevenue.toLocaleString("en-IN")}`, color: "text-success" },
    { icon: Users, label: "Registered Players", value: data.totalPlayers.toLocaleString("en-IN"), color: "text-primary" },
    { icon: Trophy, label: "Total Tournaments", value: String(data.tournamentCount), color: "text-warning" },
  ];

  return (
    <AdminShell title="Reports">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">Platform analytics and data export.</p>
        <button onClick={downloadCSV} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:border-primary transition">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {summaries.map((s) => (
          <div key={s.label} className="glass-card p-5 flex items-center gap-4">
            <span className={`grid h-11 w-11 place-items-center rounded-xl bg-white/5 ${s.color}`}><s.icon className="h-5 w-5" /></span>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className={`font-display text-2xl mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="glass-card p-5">
          <h3 className="font-display text-lg mb-4">Tournaments by Game</h3>
          {data.gameBreakdown.length === 0
            ? <p className="text-sm text-muted-foreground">No data yet</p>
            : data.gameBreakdown.map(({ game, count }) => {
                const pct = data.tournamentCount > 0 ? Math.round((count / data.tournamentCount) * 100) : 0;
                return (
                  <div key={game} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{game}</span>
                      <span className="text-muted-foreground">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-border">
                      <div className="h-full rounded-full gradient-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
          }
        </div>

        <div className="glass-card p-5">
          <h3 className="font-display text-lg mb-4">Tournaments by Status</h3>
          {data.statusBreakdown.length === 0
            ? <p className="text-sm text-muted-foreground">No data yet</p>
            : data.statusBreakdown.map(({ status, count }) => {
                const pct = data.tournamentCount > 0 ? Math.round((count / data.tournamentCount) * 100) : 0;
                const color: Record<string, string> = { Upcoming: "bg-warning", Live: "bg-success", Completed: "bg-primary", Cancelled: "bg-red-500" };
                return (
                  <div key={status} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{status}</span>
                      <span className="text-muted-foreground">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-border">
                      <div className={`h-full rounded-full ${color[status] ?? "bg-primary"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
          }
        </div>
      </div>

      {data.tournamentCount === 0 && (
        <div className="mt-6 py-16 text-center glass-card">
          <FileBarChart className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">No data available yet. Create some tournaments to see reports.</p>
        </div>
      )}
    </AdminShell>
  );
}
