import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Filter, ArrowDownUp, Loader2, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTournaments } from "@/hooks/useTournaments";
import type { Tournament } from "@/hooks/useTournaments";

export const Route = createFileRoute("/app/tournaments")({
  head: () => ({ meta: [{ title: "Tournaments — TournamentX" }] }),
  component: AppTournaments,
});

function AppTournaments() {
  const { user, loading: authLoading } = useAuth();
  const { tournaments, loading } = useTournaments();
  const nav = useNavigate();
  const [game, setGame] = useState<"all" | "Free Fire MAX" | "BGMI">("all");
  const [mode, setMode] = useState<"all" | "Solo" | "Duo" | "Squad">("all");
  const [status, setStatus] = useState<"all" | "Upcoming" | "Live" | "Completed">("all");
  const [sort, setSort] = useState<"soon" | "prize" | "newest">("soon");

  useEffect(() => { if (!authLoading && !user) nav({ to: "/login" }); }, [user, authLoading]);

  let list = tournaments.filter((t) =>
    (game === "all" || t.game === game) &&
    (mode === "all" || t.mode === mode) &&
    (status === "all" || t.status === status)
  );
  list = [...list].sort((a, b) =>
    sort === "prize" ? b.prize_pool - a.prize_pool :
    sort === "soon" ? new Date(a.start_time).getTime() - new Date(b.start_time).getTime() : 0
  );

  return (
    <AppShell title="Tournaments">
      <div className="glass-card flex flex-wrap items-center gap-3 p-4">
        <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Chips value={game} onChange={(v) => setGame(v as any)} options={["all", "Free Fire MAX", "BGMI"]} />
        <Chips value={mode} onChange={(v) => setMode(v as any)} options={["all", "Solo", "Duo", "Squad"]} />
        <Chips value={status} onChange={(v) => setStatus(v as any)} options={["all", "Upcoming", "Live", "Completed"]} />
        <div className="ml-auto flex items-center gap-2">
          <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded-lg border border-border bg-black/30 px-2 py-1.5 text-xs text-foreground">
            <option value="soon">Starting Soon</option>
            <option value="prize">Highest Prize</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : list.length === 0 ? (
        <div className="mt-10 py-20 text-center glass-card">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 font-display text-2xl">No Tournaments Found</h3>
          <p className="mt-2 text-sm text-muted-foreground">Try adjusting the filters above.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => <TournamentCard key={t.id} t={t} />)}
        </div>
      )}
    </AppShell>
  );
}

function TournamentCard({ t }: { t: Tournament }) {
  const pct = t.total_slots > 0 ? Math.round((t.filled_slots / t.total_slots) * 100) : 0;
  const startDate = new Date(t.start_time).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  const statusStyles: Record<string, string> = {
    Live: "border-success/40 bg-success/10 text-success",
    Upcoming: "border-warning/40 bg-warning/10 text-warning",
    Completed: "border-border text-muted-foreground",
    Cancelled: "border-red-500/40 bg-red-500/10 text-red-400",
  };

  return (
    <Link
      to="/app/tournament/$id"
      params={{ id: t.id }}
      className="glass-card group block p-5 hover:border-primary/40 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{t.game} · {t.mode}</p>
          <h3 className="mt-1 font-display text-lg leading-tight line-clamp-2">{t.title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t.map} · {startDate}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyles[t.status] ?? "border-border text-muted-foreground"}`}>
          {t.status}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-bold text-success">₹{t.prize_pool.toLocaleString("en-IN")}</span>
        <span className="text-xs text-muted-foreground">{t.entry_fee === 0 ? "Free Entry" : `₹${t.entry_fee} entry`}</span>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>{t.filled_slots}/{t.total_slots} slots</span>
          <span>{pct}% full</span>
        </div>
        <div className="h-1.5 rounded-full bg-border">
          <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </Link>
  );
}

function Chips({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex gap-1 overflow-x-auto">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${value === o ? "gradient-primary shadow-glow text-white" : "border border-border text-muted-foreground hover:border-primary hover:text-foreground"}`}
        >
          {o === "all" ? "All" : o}
        </button>
      ))}
    </div>
  );
}
